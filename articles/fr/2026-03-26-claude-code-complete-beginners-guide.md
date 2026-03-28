---
title: "Guide complet pour Claude Code — Comprendre toutes les fonctionnalités des agents de codage AI de manière systématique"
slug: "claude-code-complete-beginners-guide"
summary: "Guide complet pour débutants couvrant l'installation, CLAUDE.md, Skills, Subagents, Agent Teams, Hooks, MCP et gestion du contexte en 2026."
date: "2026-03-26T00:10"
tags: ["Claude Code","IA","Outils de développement","Anthropic","Agents"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-complete-beginners-guide.png"
draft: false
---
## Introduction — Qu'est-ce que Claude Code

En février 2025, Anthropic a lancé **Claude Code**, révolutionnant le concept d'outil de codage IA. Ce n'est pas seulement une suggestion de code, mais un agent autonome capable de lire/écrire des fichiers, exécuter des commandes, gérer git, et créer des PR.

### Différences avec la simple complétion de code

Jusqu'à présent, la majorité des outils de codage IA se limitaient à la "complétion de code" — prédire le code suivant et attendre que le développeur décide. Bon outil, mais purement suggestif.

Claude Code dépasse ce modèle. Si le développeur dit "écris un test pour ce système d'authentification et exécute-le, puis corrige si échec", Claude Code lit le fichier, génère le test, l'exécute, analyse les erreurs, modifie le code, et relance le test — de façon autonome.

```bash
# Génère et corrige rapidement les tests
claude "write tests for the auth module, run them, and fix any failures"

# Surveille en temps réel les anomalies dans le log
tail -200 app.log | claude -p "Slack me if you see any anomalies"

# Revue de sécurité
git diff main --name-only | claude -p "review these changed files for security issues"
```

### Environnement de fonctionnement

Claude Code fonctionne dans divers environnements.

| Environnement | Méthode |
|---|---|
| Terminal | commande `claude` (CLI) |
| VS Code / Cursor | extension |
| IDE JetBrains | plugin |
| Application desktop | Claude Desktop |
| Navigateur | claude.ai |

Généralement, l'utilisateur exécute la commande `claude` dans un terminal. En lançant dans le répertoire racine, la session a accès à toute la base de code.

### Développement des fonctionnalités

Depuis février 2025, Claude Code a connu une croissance rapide.

| Fonction | Date de sortie |
|---|---|
| Première version | Février 2025 |
| Intégration MCP | Novembre 2024 |
| Subagents | Juillet 2025 |
| Hooks | Septembre 2025 |
| Skills | Octobre 2025 |
| Agent Teams | Février 2026 |

En mars 2026, Claude Code s'est développé en une plateforme que l'on pourrait appeler "OS de codage IA". Nous allons explorer ces fonctionnalités systématiquement.

---

## Installation et configuration initiale

### Méthodes d'installation

#### macOS / Linux / WSL (recommandé)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Installation native avec mises à jour automatiques en tâche de fond.

#### PowerShell Windows

```powershell
irm https://claude.ai/install.ps1 | iex
```

Nécessite Git for Windows.

#### Homebrew (macOS)

```bash
brew install --cask claude-code
```

Mise à jour automatique non intégrée ; prévoir `brew upgrade claude-code` périodiquement.

### Démarrage initial et authentification

Après installation, naviguer dans le dossier du projet et exécuter :

```bash
cd your-project
claude
```

À la première utilisation, une authentification sera requise. Une fois connectée, une interface de chat interactif s’ouvre pour donner des instructions.

### Commandes de base

Voici les commandes utiles à connaître :

| Commande | Description |
|---|---|
| `claude` | démarrage d'une session interactif |
| `claude -p "prompt"` | exécution non interactive (CI/CD) |
| `claude --continue` | reprise de la dernière session |
| `claude --resume` | reprise d'une ancienne session |
| `/init` | auto-génération du CLAUDE.md |
| `/clear` | réinitialiser le contexte |
| `/compact` | compresser le contexte |
| `/memory` | consulter/éditer CLAUDE.md et mémoire |
| `/agents` | gestion des subagents |
| `/hooks` | configuration des hooks |
| `/permissions` | gestion des permissions |
| `/skills` | visualiser les Skills |

---

## CLAUDE.md — Concevoir la "mémoire" du projet

### Qu'est-ce que CLAUDE.md?

C’est le fichier Markdown que Claude Code lit à chaque démarrage de session. Il contient les règles du projet, la procédure de travail, les décisions d’architecture, servant de "contexte permanent" pour éviter de tout expliquer à chaque fois.

C’est comme remettre à un nouvel ingénieur une documentation pré-rédigée. Claude la lit avant de commencer.

### Organisation en trois niveaux

| Niveau | Emplacement | Cible | Partage en équipe |
|---|---|---|---|
| Politique de l'organisation | `/etc/claude-code/CLAUDE.md` (Linux) | Tous | Direction IT |
| Projet | `./CLAUDE.md` ou `./.claude/CLAUDE.md` | Membres du projet | Gestion git |
| Utilisateur | `~/.claude/CLAUDE.md` | Tous projets | Personnelle |

Les fichiers plus précis ont priorité. Par exemple, la règle d’équipe dans le projet prévaudra sur la politique organisationnelle.

### Que doit contenir un CLAUDE.md?

Guide pour rédiger efficacement.

| À inclure | À éviter |
|---|---|
| Commandes Bash imprévisibles | Ce que la lecture doit couvrir |
| Style de code hors normes | Règles linguistiques connues |
| Politique de tests | Documentation API avec liens |
| Conventions de branches et PR | Informations changeantes |
| Architecture spécifique au projet | Directives évidentes telles que "écrire du code propre" |
| Variables d’environnement obligatoires | Liste de fichiers |

Exemple :

```markdown
# Exemple CLAUDE.md

## Style
- Modules ES (import/export), CommonJS interdit
- Importations avec déstructuration quand possible

## Workflow
- Toujours vérifier les types après modification : `npx tsc --noEmit`
- Tests ciblent un seul fichier

## Scripts
- Build : `npm run build`
- Tests : `npm test`
- Lint : `npm run lint`

## Notes
- Secrets en `.env.local`, ne pas committer
- PR basés sur develop (pas de push sur main)
```

### Auto-génération avec `/init`

Pour un projet existant, la commande `/init` permet à Claude d’analyser le code, détecter la façon de construire, tester, et créer une première version du CLAUDE.md à ajuster ensuite.

### Séparer les règles en fichiers multiples

Quand CLAUDE.md devient trop gros, la subdivision en fichiers dans `.claude/rules/` est recommandée.

```
.claude/
  CLAUDE.md
  rules/
    code-style.md
    testing.md
    security.md
    branching.md
```

Des règles spécifiques à certains chemins ou fichiers peuvent être aussi définies.

### Auto Memory (Mémoire automatique)

Depuis v2.1.59, Claude peut apprendre automatiquement des leçons, stockées dans `~/.claude/projects/<projet>/memory/MEMORY.md`. Ces notes incluent des bugs découverts, des arbitrages d’architecture, des commandes réutilisées. Elles sont consultables avec `/memory`.

---

## Skills — Packager les flux de travail réutilisables

### Qu’est-ce qu’un Skill?

Un Skill est une collection de procédures ou connaissances requalifiées dans un fichier `SKILL.md`. Il peut être invoqué par `/nom-du-skill` ou automatiquement reconnu par Claude.

Par exemple, la procédure "Réparer une Issue GitHub" comprenant l’inspection, la modification de code, les tests et la PR, peut se définir et s’appeler avec `/fix-issue 123`.

Un CLAUDE.md global contient les lignes directrices et les règles, tandis que Skills sont des modules spécifiques.

### Structure d’un SKILL.md

YAML en tête + contenu.

```yaml
---
name: fix-issue
description: >
  Répare une issue GitHub. Utilisé quand un numéro est spécifié.
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Grep, Bash, Write, Edit
---
Github issue $ARGUMENTS...

1. `gh issue view $ARGUMENTS`
2. Modifier fichiers
3. Écrire/tester commit
4. Pousser PR
```

`$ARGUMENTS` remplacé lors de l’appel. Plusieurs arguments disponibles.

### Champs importants dans la Frontmatter

| Champ | Description |
|---|---|
| `name` | Nom de la commande `/` (max 64 caractères, minuscules et tirets) |
| `description` | Critère d’activation automatique par Claude |
| `disable-model-invocation` | `true` pour activer uniquement via utilisateur |
| `user-invocable` | `false` pour masquer dans menu |
| `allowed-tools` | outils autorisés |
| `context` | `fork` pour exécution indépendante |
| `model` | modèle utilisé |
| `effort` | intensité de réflexion (`low`, `medium`, `high`, `max`) |

### Deux types de skills

**Reference**: injection à la volée de documentation ou spécifications.

**Task**: procédure opérationnelle comme revue de code ou déploiement.

### Contrôle d’appel

En frontmatter, on peut définir qui peut lancer un Skill.

| Options | Usage |
|---|---|
| `disable-model-invocation: true` | Utilisable uniquement par l’utilisateur |
| `user-invocable: false` | Masqué dans menu, pour skills de connaissance |

### Skills intégrés

| Skill | Usage |
|---|---|
| `/batch` | Exécuter des modifications massives en parallèle |
| `/claude-api` | Charger la référence API de Claude |
| `/debug` | Analyser les logs |
| `/loop` | Répéter une commande |
| `/simplify` | Améliorer le code récent |

### Différence CLAUDE.md / Skills

| | CLAUDE.md | Skills |
|---|---|---|
| Chargement | Au début de chaque session | À la demande ou automatique |
| Usage | Règles globales, règles de projet | Procédures réutilisables |
| Consommation | Toujours dans le contexte | Juste quand nécessaire |

---

## Subagents — Délégation à des experts

### Qu’est-ce qu’un Subagent?

Un Subagent est un agent IA spécialisé, autonome, pouvant lire, analyser, mais pas modifier. Il possède son contexte, ses outils et sa mission.

Exemples d’usage: investigation, surveillance, sécurité, optimisation.

### Quatre avantages majeurs

1. **Protection du contexte** : exploration approfondie sans polluer le chat principal.
2. **Limitation d’outils** : lecture seule, évitant erreurs fatales.
3. **Spécialisation** : agents parfaitement ajustés à leur tâche.
4. **Réduction de coût** : délégation à des modèles plus légers.

### Agents intégrés

- **Explore** (Haiku) : exploration limitée à la lecture.
- **Plan** : recherche orientée.
- **Général** : opérations complexes multi-étapes.

### Définir un Subagent

Créer un fichier Markdown avec YAML. Exemple :

```markdown
---
name: code-reviewer
description: Relecteur de code spécialisé. Utilisé après modifications.
tools: Read, Grep, Glob, Bash
model: sonnet
---
Vous êtes un relecteur senior. Vérifiez :
- lisibilité
- gestion des erreurs
- sécurité
- couverture de tests
- performance

Fournissez un feedback priorisé.
```

Fichier dans `.claude/agents/` ou `~/.claude/agents/`.

| Champs | Description |
|---|---|
| `name` | Nom court |
| `description` | Indicateur d’activation |
| `tools` | Outils habilités |
| `disallowedTools` | Outils interdits |
| `model` | Modèle (`sonnet`, `opus`, etc.) |
| `permissionMode` | Mode de permission |
| `maxTurns` | Max tours |
| `isolation` | Isolation via git worktree |

### Invocation

- Par langage naturel (Claude décide)
- Via mention (`@agent`) pour un agent précis
- Via `claude --agent` pour mode agent complet

---

## Agent Teams — Collaboration multi-agent

### Différence avec Subagents

Les Agent Teams, lancés en février 2026, sont une évolution. Au lieu de déléguer à un seul agent, plusieurs agents communiquent, exécutant des tâches parallèles ou longues.

| Aspect | Subagents | Agent Teams |
|---|---|---|
| Communication | Unidirectionnelle | Bidirectionnelle |
| Cas d’usage | Délégation simple | Grandes projets, pipelines |
| Session | Subsession | Séance collaboratif indépendante |

### Composition

- **Lead** : chef de projet, décompose et supervise.
- **Teammates** : agents spécialisés, avec leur contexte.
- **Task List** : organisation des tâches et dépendances.
- **Mailbox** : messagerie asynchrone.

### Quand utiliser

- Problème simple ? Utiliser Claude standard.
- Tâche complexe ou volumineuse ? Préférer Agent Teams.

Ce modèle est idéal pour refactoring massif, pipelines, vérification croisée.

---

## Hooks — Automatisation garantie

### Définition

Les Hooks sont des scripts exécutés à des moments précis du cycle de vie. Claude ne garantit pas une exécution complète, mais les Hooks, si configurés, sont toujours respectés.

### Types d’événements

| Événement | Moment | Usage principal |
|---|---|---|
| `SessionStart` | début | Configuration environnement |
| `UserPromptSubmit` | soumission utilisateur | Filtrage |
| `PreToolUse` | avant outil | Sécurité |
| `PostToolUse` | après outil | Formatage, log |
| `PostToolUseFailure` | échec | Gestion erreur |
| `Stop` | fin réponse Claude | Contrôle |
| `SubagentStart` | démarrage | Préparations |
| `SubagentStop` | arrêt | Nettoyage |
| `SessionEnd` | fin session | Statistiques |

### Configuration

Fichier `.claude/settings.json` :

```json
{
  "hooks": {
    "PostToolUse": [
      {"matcher": "Edit|Write",
       "hooks": [{"type": "command", "command": "npm run lint --fix"}]}],
    "PreToolUse": [
      {"matcher": "Bash",
       "hooks": [{"type": "command", "command": "./.claude/hooks/check-dangerous-command.sh"}]}]
  }
}
```

Exemple : après édition, exécuter le linter automatiquement.

### Script d’exemple

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$COMMAND" | grep -q 'rm -rf'; then
  echo "Commande dangereuse bloquée: $COMMAND" >&2
  exit 2
fi

exit 0
```

Code retour :
| Code | Signification |
|---|---|
| 0 | Permis |
| 2 | Bloqué |
| autre | Erreur (non bloquant) |

### Types de scripts

- `command` : shell
- `http` : requête
- `prompt` : modèle Claude
- `agent` : agent spécifique

### Emplacements

- `~/.claude/settings.json` | global |
- `.claude/settings.json` | projet |
- `.claude/settings.local.json` | local andindividuel |

---

## MCP — Intégration avec des services externes

### Qu’est-ce que MCP?

Le Model Context Protocol, publié par Anthropic en novembre 2024, est un standard ouvert permettant de connecter Claude à des services tels que GitHub, Slack, Google Drive, PostgreSQL, etc.

### Fonctionnalités

- Connecter des outils dev : GitHub Issues, PR, Jira
- Intégrer des outils de communication : Slack, Teams
- Accéder à des bases de données : PostgreSQL, SQLite
- Accéder à des archives : Google Drive, Notion
- Contrôler cloud : AWS, GCP

### Configuration

Via interface interactive ou édition directe du `.mcp.json`.

```json
{
  "github": {"type": "stdio", "command": "uvx", "args": ["mcp-server-github"]},
  "playwright": {"type": "stdio", "command": "npx", "args": ["-y", "@playwright/mcp@latest"]}
}
```

### Sur certains agents

MCP peut être sciemment limité à certains agents précis. Exemple :

```yaml
---
name: browser-tester
description: Tests avec Playwright
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
---
```

### Serveurs MCP recommandés

Selon la fiabilité et facilité de déploiement.

| Usage | Serveur recommandé | Note |
|---|---|---|
| Gestion code | GitHub | ★★★ |
| Code review | GitLab | ★★★ |
| Tests UI | Playwright | ★★★ |
| Surveillance | Sentry | ★★☆ |
| Documentation | Context7 | ★★★ |
| Base de données | PostgreSQL | ★★★ |
| Cloud | AWS | ★★☆ |
| Communication | Slack | ★★☆ |

### Trois premiers à connaître

- **GitHub MCP** : gestion intégrée Issue/PR
- **Context7** : API documentation en temps réel
- **Playwright** : automatisation UI

```bash
# Ajouter MCP GitHub
claude mcp add github -- uvx mcp-server-github

# Ajouter Context7
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

---

## Gestion du contexte — Clé de performance

### Importance

La performance de Claude dépend fortement de la gestion du contexte. Plus celui-ci est chargé, plus les précédents instructions s’accumulent. La limite est de 200 000 tokens (~150,000 mots). Au-delà, Claude peut oublier des instructions précédentes, ce qui augmente les erreurs.

### Commandes clés

| Commande | Rôle |
|---|---|
| `/clear` | réinitialise tout |
| `/compact` | conserve l'essentiel et réduit |
| `/compact Focus on the API changes` | privilégie certains éléments |
| `/btw` | question passagère (hors historique) |
| `Esc+Esc` ou `/rewind` | annuler et revenir en arrière |

Quand le seuil de 95% est atteint, la compactation automatique se déclenche. Peut être réglée avec `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`.

### Mode Plan — exploration vs action

En mode plan, Claude lit mais ne modifie pas. Utile pour réfléchir avant d’agir.

Basculer avec `Shift+Tab` ou dans `settings.json` :

```json
{"permissions": {"defaultMode": "plan"}}
```

Processus en 4 étapes :

1. **Exploration** : lecture et compréhension
2. **Planification** : création de plan détaillé
3. **Implémentation** : action réelle
4. **Validation** : vérification et PR

Les avantages : réduction des coûts, meilleure planification.

### Conseils pour éviter les pièges

- Éviter le "kitchen sink" (tout mettre dans une session)
- Ne pas faire de boucle de correction sans faire `/clear` après deux essais
- Mettre à jour régulièrement CLAUDE.md
- Toujours valider par des tests ou captures d'écran
- Segmenter les tâches longues en petites sessions

### Astuces pour la gestion efficace du contexte

- Limiter CLAUDE.md à 200 lignes
- Externaliser documentation en Skills
- Scoping précis via MCP
- Approche itérative de 30 minutes avec `/compact` périodique
- Utiliser Subagents pour explorer séparément

---

## Synthèse — Tableau comparatif et recommandations

### Tableau des fonctionnalités

| Fonction | But | Moment d'exécution | Déterministe |
|---|---|---|---|
| CLAUDE.md | Instructions permanentes | Démarrage | Non (80% adherence) |
| Skills | Flux de travail réutilisables | À l’appel ou auto | — |
| Hooks | Automatisations strictes | Événement | Oui (100%) |
| Subagents | Délégation spécialisée | Décision ou appel | — |
| Agent Teams | Coopération avancée | Démarrage du projet | — |
| MCP | Services externes | Lors du besoin | — |

### Guide d’utilisation

1. Compléter CLAUDE.md (règles, consignes)
2. Créer des Skills pour processus récurrents
3. Automatiser les actions répétitives avec Hooks
4. Exploiter Subagents pour investigations
5. Définir MCP pour intégration externe
6. Utiliser Agent Teams pour grandes tâches parallèles

### Perspectives

Le futur de Claude Code inclut amélioration continue, intégration avec plus de services MCP, optimisation du contexte et diversification des Agents. Commencez par `/init` pour générer le CLAUDE.md et expérimenter.

---

> Cet article a été généré automatiquement par LLM. Il peut contenir des erreurs.
