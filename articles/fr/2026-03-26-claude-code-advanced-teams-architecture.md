---
title: "Architecture pratique de Claude Code — Modèles de conception pour accélérer le développement avec Teams/Subagents"
slug: "claude-code-advanced-teams-architecture"
summary: "Présentation des modèles avancés de conception multi-agents sur Claude Code, comme la Star Topology, DAG, et stratégies d'optimisation, avec des cas d'étude d'Anthropic."
date: "2026-03-26T00:10"
tags: ["Claude Code","AI","Multi-agent","Anthropic","Teams"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-advanced-teams-architecture.png"
draft: false
---
# Architecture pratique de Claude Code — Modèles de conception pour accélérer le développement avec Teams/Subagents

En utilisant quotidiennement Claude Code, on finit par atteindre le "mur de la session unique". Pendant une refonte complexe, le contexte se détériore, et des propositions contradictoires apparaissent. Lorsqu'on envoie des tâches massives en parallèle, la conversation devient lourde et la précision de l'inférence diminue. La solution à ce goulot d'étranglement est la conception multi-agents exploitant Subagents et Agent Teams.

Cet article explique, pour les ingénieurs maîtrisant déjà Claude Code, à la fois pourquoi une telle conception est efficace et comment la mettre en pratique.

---

## 1. Pourquoi la conception multi-agents est-elle nécessaire — Limites d'une session unique

### Fondements scientifiques de la détérioration du contexte

Addy Osmani a écrit sur son blog :

> "Les LLMs fonctionnent moins bien à mesure que le contexte s'étend"

Ce phénomène ne se limite pas à la limite de tokens. Lorsqu'une quantité d'informations non pertinente s'accumule dans la fenêtre de contexte, l'"attention" du modèle est dispersée, réduisant la qualité de l'inférence. C'est pourquoi Claude peut proposer des idées en contradiction avec ses décisions antérieures lors de longues sessions.

Les recherches d'Anthropic sur les multi-agents confirment ce point : par rapport à une session Opus 4 seule, une configuration où Opus 4 guide et Sonnet 4 agit en sous-agent améliore la performance de **90.2%**. La différence la plus notable est que la transition vers une architecture multi-agents dépasse l'amélioration par simple mise à niveau du modèle.

De plus, il a été démontré que l'utilisation de tokens, le nombre d'appels aux outils et le choix du modèle expliquent 95 % de la variance de performance. Injecter tout dans une seule session aggrave ces trois facteurs.

### Ce que le multi-agents change

```
【Session unique】
  Contexte unique (exploration, implémentation, test, débogage)
  → La qualité se dégrade vers la fin

【Conception multi-agents】
  Chaque agent se concentre sur son domaine
  → Les fenêtres restent optimales
```

La fonctionnalité Agent Teams, sortie en février 2026, incarne cette philosophie. Plusieurs instances de Claude Code maintiennent des contextes séparés, coordonnées via une liste de tâches partagée et une boîte mail.

---

## 2. Star Topology — Architecture à 3 couches Leader/Advisor/Teammate

### Philosophie de conception

Le choix de la topologie est crucial. Le réseau plat Mesh Topology favorise la communication entre tous, mais le **Star Topology** — où toute communication passe par un Leader — évite incohérences et dispersions.

```
Chef d'équipe (Opus)
    ↕ Demande de spécifications / Collecte d'informations
Conseiller (Sonnet) ── Lecture et distillation de la documentation / code
    ↓
Coéquipiers (Sonnet × N) ── Focalisés sur l'implémentation
```

Le Leader n'est pas une simple station de collecte, mais un panneau de contrôle. Sa conception, ce qu'il retient ou rejette, détermine les performances globales.

### Rôles du Leader / Rôles non assumés

| Ce que le Leader fait | Ce que le Leader ne fait pas |
|---|---|
| Décomposition des tâches / gestion des dépendances | Implémentation du code directement |
| Validation de qualité (tests, vérification de types) | Consultation directe de spécifications |
| Feedback aux coéquipiers | Visualisation globale du code |
| Suivi de progression / détection des goulots d'étranglement | Ajustements directs entre coéquipiers |

Ce paradoxe offre la force du Star Topology : en évitant la lecture approfondie des spécifications, le Leader se concentre sur la gestion du processus et la validation.

### Rôle de l'Advisor — Expert en distillation

L'Advisor agit comme un "spécialiste en distillation". Il parcourt la documentation ou le code en masse, en extrait uniquement ce dont le Leader a besoin, et répond.

```
Leader : "Que faut-il pour implémenter T04 ? Y compris types et DoD"
  ↓
Advisor : Lecture de spec/ ; extraction structurée ; réponse au Leader
  ↓
Leader : Transmet la réponse au Coéquipier sous forme de message
```

**Limitation** : lecture uniquement, pas d'écriture. Modifier ou écrire des fichiers est réservé au Leader.

### Règles d’action du coéquipier

L’essentiel est qu’ils ne lisent pas directement la documentation. La communication se limite à ce qui est fourni par le Leader via Advisor.

- Implémente uniquement selon les instructions du Leader
- Ne pas deviner, demander confirmation
- Rendre compte avec fichiers modifiés, résultats de tests, vérifications
- Ne pas lire `spec/`, le Leader transmet

### Contraintes de flux

```
【Communication autorisée】
  Leader ↔ Advisor : demandes / réponses
  Leader → Coéquipiers : instructions / feedback
  Coéquipiers → Leader : rapport / questions

【Interdits】
  Coéquipiers → Coéquipiers : messagerie directe
  Coéquipiers → Advisor : messagerie directe
  Leader → spec/ : lecture directe
```

### Pourquoi cette conception fonctionne

Elle s’appuie sur une recherche d'Anthropic montrant que la sélection du modèle a le plus grand impact sur la performance. Concentrer Opus en leader, avec une multitude de Sonnet comme coéquipiers parallèles, optimise coût et qualité.

Elle limite également la circulation d'informations incohérentes en limitant la communication à une structure de type hub.

---

## 3. Conception DAG pour la gestion des tâches — science de la parallélisation

### Modèle DAG de gestion

Les tâches sont organisées en **Directed Acyclic Graph (DAG)**, graphique orienté sans boucle. Cela permet une gestion claire des dépendances.

```json
{
  "taches": [
    { "id": "T01", "nom": "Conception du schéma d’authentification", "bloquée_par": [] },
    { "id": "T02", "nom": "Implémentation de l’API", "bloquée_par": ["T01"] },
    { "id": "T03", "nom": "Implémentation Frontend", "bloquée_par": ["T01"] },
    { "id": "T04", "nom": "Test d’intégration", "bloquée_par": ["T02", "T03"] }
  ]
}
```

T02 et T03 peuvent s’exécuter en parallèle, T04 attend leur achèvement. La visualisation DAG montre immédiatement ce qui peut être parallélisé.

### Mode Wave

Les groupes de tâches dépendantes forment une "Wave". Exécuter par Wave optimise la parallélisation tout en respectant dépendances.

```
Wave 1 : Investigation et conception (tout en parallèle)
  ├─ Coéquipier A : investigation front-end
  ├─ Coéquipier B : investigation API
  └─ Coéquipier C : planification tests
  → À la fin de Wave 1

Wave 2 : Implémentation
  ├─ Coéquipier A : front-end (src/components)
  └─ Coéquipier B : API backend (src/api)
  → À la fin de Wave 2

Wave 3 : Test d’intégration
  └─ Coéquipier C : tests et validation
```

L’approche Wave garantit que des tâches dans la même vague ne dépendent pas entre elles et que leur contenu ne se chevauche pas, en vérifiant les fichiers à l’avance.

### Règles d’évaluation de la taille

| Dimension | Risques |
|---|---|
| Trop petit (moins d’un fichier) | Coûts de coordination supérieurs aux gains |
| Trop grand (> une semaine) | Longs délais, risques de remise en question |
| Juste | Résultats clairs et autosuffisants |

Type de batch recommandé : 5-6 tâches par coéquipier.

### Évitement de conflit de fichiers

Une expérience avec un compilateur C d’Anthropic a montré que le verrouillage fichier, basé sur un répertoire de tâches, évite la surcharge et la compétition, grâce à un verrou distribué.

### Automatisation de la qualité

Hooks `TaskCompleted` et `TeammateIdle` permettent un contrôle qualité automatique en lançant des scripts de vérification.

```json
{
  "hooks": {
    "TaskCompleted": [{"hooks": [{"type": "command", "command": "./.claude/hooks/quality-gate.sh"}]}],
    "TeammateIdle": [{"hooks": [{"type": "command", "command": "./.claude/hooks/verify-output.sh"}]}]
  }
}
```

Exemple de script `quality-gate.sh`:

```bash
#!/bin/bash
set -e
npm test || { echo "Échec des tests" >&2; exit 2; }
npm run lint || { echo "Erreur de lint" >&2; exit 2; }
npm run build || { echo "Échec du build" >&2; exit 2; }
exit 0
```

Un `exit 2` bloque la progression tout en transmettant un retour à Claude, qui pourra ajuster.

---

## 4. Maîtrise du contexte — règle 80/20 et beyond

### Règle 80/20

L’essentiel : ne pas utiliser 20% du contexte pour les tâches complexes.

Avec 200K tokens, le seuil est à 167K tokens (83,5%). Avant ce seuil, la qualité chute. Surveiller la consommation dans la barre d’état et optimiser dès que 70-80% est atteint.

### Stratégies de compression

Quand compacter ?
- Après la réalisation d’une fonctionnalité clé
- Avant la phase d’implémentation active
- Quand Claude répète une question ou contredit une décision précédente
- Lors des points de rupture naturels

Quand ne pas compresser ?
- En pleine phase de débogage
- Lors de refactorings compliqués

### Isolation par Subagents

Une tactique majeure pour préserver le contexte est de déléguer des tâches exploratoires à un Subagent, « en silos », pour limiter la pollution du contexte principal.

Exemple d’architecture :

```
Contexte principal
  └─ Demande : "Étudier l’état actuel du module d’authentification"
          ↓
Subagent isolé
  ├─ Charge tout src/auth/
  ├─ Analyse de fichiers de test
  └─ Retourne uniquement un résumé
  
Contexte principal
  └─ "Le module utilise JWT + Redis sessions, principales fonctions..."
```

Même avec des centaines de fichiers, le sous-contexte suffit. Seul un résumé revient au contexte principal.

### Stratégie sprint de 30 minutes

Les sessions courtes, par tranches de 30 min, évitent la dérive. Après chaque cycle, effectuer un `/clear` ou une optimisation pour repartir d’un état propre.

### Conception du contexte Leader

| État | Informations conservées | Ce qui est abandonné |
|---|---|---|
| TERMINÉ | id tache, résultat, chemins|
| EN COURS | instructions, avancement | détails techniques, specifications complète |
| EN ATTENTE | blocages, vague | définition entière, re-query chez Advisor |

Le Leader doit principalement conserver un résumé. Les détails doivent être extraits à la demande dans Advisor.

---

## 5. Optimisation de CLAUDE.md — budget de 300 lignes

### Règle de simplicité

Les directives majeures sur Claude sont au maximum 150-200 points. Le CLAUDE.md contient déjà 50 instructions, il ne reste que 100-150 pour l’ensemble du fichier.

**Recommandation** : 300 lignes max, idéalement moins de 60.

Longueur excessive dilue l’importance des règles et réduit leur efficacité.

### Ne pas écrire ce que Claude sait déjà

Les instructions comme "écrire du code propre" ou "ne pas oublier la gestion d’erreurs" sont inutiles si Claude fonctionne déjà bien. Ne pas rédiger ces règles.

**Critères de conservation** :
- La règle est essentielle pour faire fonctionner Claude ? Oui → garder
- La règle est spécifique au projet ou déjà connue par Claude ? Oui → supprimer
- La règle change souvent ? Oui → supprimer

### Externaliser le code et faire respecter le style via hooks

"Ne jamais demander à un LLM de faire un travail de lint ou formatage"

Utiliser des hooks comme :

```json
{
  "hooks": {
    "PostToolUse": [{"matcher": "Edit|Write", "hooks": [{"type": "command", "command": "npm run lint --fix && npm run format"}]}]
  }
}
```

Pour économiser des tokens, supprimer du CLAUDE.md ces consignes et utiliser ce système de hooks.

### Schéma de divulgation progressive

Pour limiter l’encombrement, écrire dans CLAUDE.md uniquement le besoin essentiel à chaque contexte, avec des liens vers des documents spécifiques pour les détails. Exemple de structure :

```markdown
# CLAUDE.md (600 lignes max)

## Stack technique
- Astro 5.18.0 + Tailwind 4.2.0 + Cloudflare Pages
- TypeScript 5.9.x

## Commandes
- Build : `npm run build`
- Vérification types : `npx tsc --noEmit`
- Linter : `npm run lint`

## Docs complémentaires
- Normes API : @.claude/rules/api-conventions.md
- Workflow Git : @.claude/rules/branching.md
- Déploiement : @.claude/rules/deployment.md
```

Les fichiers importés via `@path/to/file` seront chargés à la demande, quand Claude jugera nécessaire.

### Architecture hiérarchique de CLAUDE.md

```
~/.claude/CLAUDE.md          # global
  ./CLAUDE.md                 # racine du projet
    ./.claude/rules/api.md    # à charger selon contexte
    ./.claude/rules/test.md   # selon besoin
    src/components/CLAUDE.md  # lors du développement de composants
```

Les CLAUDE.md spécifiques à une zone sont chargés uniquement lors de leur contexte d’utilisation, permettant une gestion modulaire et ciblée.

---

## 6. Patterns Skills — injection à la demande

### Séparer CLAUDE.md et Skills

Les Skills sont placés dans `.claude/skills/{nom}/SKILL.md`. Ils représentent des connaissances spécialisées, distinctes de la configuration globale.

- CLAUDE.md : information nécessaire dans toutes les sessions
- Skills : connaissances spécifiques à une tâche ou un domaine

Ils sont chargés à la demande : cela évite de gonfler la taille du CLAUDE.md.

### Modulariser par spécification — architecture SDD

Pour des projets complexes, toute la spécification ne tient pas dans le CLAUDE.md. Il est conseillé de découper en plusieurs couches (L0-L5). Chaque couche devient une skill, comme dans l’exemple suivant :

```
.claude/skills/
  spec-l0-core/      # permanent, dépendances fondamentales
  spec-l1-vision/   # vision et définition de problème
  spec-l1-content/  # catégorisation de contenu
  spec-l4-schema/   # schéma de métadonnées
  spec-l4-article/  # modèles d’article
  generate-thumb/   # workflow d’image miniature
  doc-writer/       # automatisation de sortie
```

Lorsqu’un agent invoque `Skill("spec-l4-schema")`, il injecte la définition précise du schéma. Les conseillers n’chargent que ce qu’ils ont besoin, sans saturer le contexte général.

### Injection Skills dans Subagents

Les subagents ne partagent pas automatiquement les Skills du parent. Il faut explicitement inscrire dans leur frontmatter.

```yaml
---
name: api-developer
description: Agent spécialisé en implémentation d’API
tools: Read, Edit, Write, Bash
skills:
  - api-conventions
  - error-patterns
  - security-checklist
---

Suivez strictement les règles de l’équipe avec ces compétences.
```

### `context: fork` pour l’indépendance

En ajoutant `context: fork` au frontmatter, le skill s’exécute en mode indépendant, sans consommer le contexte parent.

```yaml
---
name: security-audit
description: Audit de sécurité post-modification
context: fork
allowed-tools: Read, Grep, Glob
---
```

Idéal pour des scans volumineux ou des vérifications massives.

---

## 7. Contrôle décisionnel avec Hooks — Qualité automatisée

### Différence CLAUDE.md vs Hooks

| | CLAUDE.md | Hooks |
|---|---|---|
| Probabilité d’application | 80% (conseil) | 100% (décision) |
| Usage approprié | Politique, contexte | Formatage, lint, sécurité |
| Moment d’exécution | Début de session | Événements de cycle de vie |

Certaines actions doivent absolument être automatisées via Hooks, comme la vérification de format ou l’application de règles de sécurité.

### Qualitäts gate dans Agent Teams

Deux hooks sont essentiels :

- `TeammateIdle` : juste avant arrêté, permet d’intervenir en `exit 2` pour feedback.
- `TaskCompleted` : avant validation de tâche, permet aussi d’intervenir.

Exemple de script `verify-output.sh`:

```bash
#!/bin/bash
set -e
if ! npm test; then
  echo "Tests échoués" >&2
  exit 2
fi
if ! npx tsc --noEmit; then
  echo "Erreurs de types" >&2
  exit 2
fi
echo "Qualité OK" >&2
exit 0
```

L’utilisation de `exit 2` bloque la progression tout en donnant un feedback immédiat à Claude, qui peut ajuster son travail.

### Contrôle de sécurité — blocage avec PreToolUse

Un script exemple interdit certains commandes dangereuses :

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS_PATTERNS=("rm -rf /" "DROP TABLE" "git push --force.*main" "chmod 777")

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "Commande dangereuse bloquée : $pattern" >&2
    exit 2
  fi
done
exit 0
```

Ici, un `exit 2` bloque et notifie.

### Codes de retour et leur signification

- `exit 0` : OK, autorisé
- `exit 2` : blocage, feedback à Claude
- autre : erreur silencieuse

Le plus puissant est `exit 2` : il bloque et transmet un raisonnement à Claude pour qu’il ajuste sa démarche.

---

## 8. Cas pratique — Anthropic et pointe de l’industrie

### Projet C Compiler d’Anthropic : 16 agents, 10 000 lignes Rust

Ce projet est une des plus grandes initiatives multi-agents d’Anthropic, avec :
- 16 agents parallèles
- 2000 sessions, 2 milliards de tokens
- Compilation de 100 000 lignes Rust, avec succès sous Linux 6.9

Ils ont isolé chaque agent dans un conteneur Docker, utilisé le verrouillage de fichiers pour éviter la surcharge, et réparti les tâches par spécialisation : élimination de duplication, optimisation de performance, documentation.

**Leçon clé** : un test réussi dépend d’un "correcteur" capable de vérifier si la correction est pertinente. L’expérience a montré que la qualité de cette étape est capitale.

### Étude d’Anthropic — Performance multipliée par 15

Les résultats montrent qu’un système multi-agents utilisant 15 fois plus de tokens peut atteindre 90% de performance supplémentaire :
- Opus 4 seul vs Opus 4 + Sonnet 4 > +90.2%
- La nouvelle architecture surpassant la simple mise à niveau modèle.

Malgré la consommation accrue, les bénéfices en qualité justifient l’effort.

### Exemple de prompt de revue de code

```
Agent Team, review PR #142 selon ces trois aspects :
- Security : sécurité, validation, secrets
- Performance : requêtes, cache
- Testing : couverture, mocks

Produisez un rapport indépendant, puis synthétisez dans le leader.
```

### Exemple de prompt pour hypothèse de conflit

```
L’utilisateur signale un écran blanc après login.
Générez 5 agents en parallèle pour investiguer différentes pistes :
- Auth : tokens, signature
- State : gestion des états
- Routing : boucle infinie
- Error : erreur masquée
- Network : réponses API

Collectez preuves, évitez la répétition d’hypothèses, concluez par la cause la plus probable.
```

### Doctolib : accélération de 40% d’un déploiement

Le site de réservation médicale Doctolib utilise Claude Code pour toute l’équipe de dev, remplaçant en quelques heures ses anciens outils, avec une amélioration de 40% des déploiements.

À l’horizon 2026, 86% des organisations exploitent des agents pour garantir qualité et rapidité dans leur code.

---

## 9. Anti-modèles et erreurs courantes

### Session "kitchen sink" — pollution du contexte

**Problème** : accumulation d’informations non pertinentes, perte de focus, baisse de qualité.

**Cause** : maintien d’informations obsolètes ou hors sujet, confusion entre bugs et nouvelles fonctionnalités.

**Solution** : utiliser `/clear` régulièrement, débuter chaque tâche dans un nouveau contexte.

### Répétition d’échecs — accumuler des contextes ratés

**Problème** : boucle d’échec constant.

**Cause** : anciens essais non nettoyés.

**Solution** : après deux échecs, `/clear` et re-commencer avec une instruction claire.

### Surutilisation d’Agent Teams — coût et inefficacité

Imposer Agent Teams partout peut faire exploser la consommation de tokens, jusqu’à 15x. Utiliser seulement pour des tâches très complexes ou volumineuses.

### Perte de contexte lors du handoff

Transfert de contexte mal conçu augmente la consommation et risque de perte d’informations. Inclure explicitement le pourquoi du design dans chaque instruction.

### Convergence vers une même erreur — paralysie collective

Dans un projet de compilation Linux, toutes les instances ont convergé vers le même bug, créant une boucle. Il faut segmenter le problème en sous-tâches.

### Négliger les tests — confiance aveugle

Les agents cherchent à maximiser passivement les succès mesurables. Si les tests sont faibles, ils peuvent produire des erreurs critiques.

### Mythe du "multi-agent toujours rapide"

Les systèmes multi-agents ne sont pas nécessairement plus rapides en pratique : coûts de communication, gestion de contexte, risques de conflits.
Mais ils renforcent la qualité par meilleure gestion du contexte.

---

## 10. Feuille de route — de la Phase 1 à la Phase 4

### Phase 1 : Mise en place (CLAUDE.md, Hooks)

Objectif : éliminer l’effet "non productif" en assurant une configuration claire.
- Générer et limiter CLAUDE.md à 300 lignes.
- Automatiser lint, tests via hooks.

### Phase 2 : Usage des Subagents

Déléguer des tâches lourdes pour préserver le contexte. S’appuyer sur la séparation des responsabilités.
- Créer des sous-agents en mode lecture seule pour la revue et l’audit.
- Exploiter `context: fork` pour des espaces de travail indépendants.

### Phase 3 : Agent Teams pour la revue parallèle

Commencer par des tâches de lecture seules. Automatiser l’évaluation de la qualité par hooks. Déployer à plus grande échelle.

### Phase 4 : Orchestration avancée

Mettre en œuvre la hiérarchie Leader/Advisor/Teammate pour des tâches complexes. Définir des planifications DAG et cycle de vie.
- Créer des orchestrations pour des projets structurés.

---

## Résumé — L’essence de la conception

L’utilisation avancée de Claude Code s’articule autour du "design du contexte" : qui sait quoi, quels outils, quelles dépendances. La topologie Star, DAG, règles 80/20 sont autant d’aspects du même principe.

Anthropic a construit un compilateur C avec 16 agents, 10 000 lignes de Rust et réussi à compiler le noyau Linux en exploitant une architecture de contexte bien pensée.

En commencant par améliorer CLAUDE.md et en utilisant hooks, vous pouvez progressivement atteindre la Phase 4 adaptée à votre cas. La conception multi-agents ouvre des perspectives bien plus vastes que ce que l’on imagine, même dans un usage quotidien de Claude Code.

---

> Cet article a été généré automatiquement par LLM. Il peut contenir des erreurs.
