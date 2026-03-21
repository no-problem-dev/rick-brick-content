---
title: "Redéfinir les LLM en agents autonomes : quatre axes – systématisation du cadre de raisonnement basé sur les agents"
slug: "agentic-reasoning-framework-llm"
summary: "Partant de l'article de synthèse \"Large Language Model Agent\" (arXiv:2503.21460), ce texte systématise le raisonnement basé sur les agents selon quatre axes : planification, utilisation d'outils, m..."
date: "2026-03-18"
tags: ["Agents IA","Raisonnement","LLM","Multi-agents","MCP"]
category: "tech-article"
automated: false
thumbnail: "/images/agentic-reasoning-framework.png"
draft: false
---
En mars 2025, "Large Language Model Agent: A Survey on Methodology, Applications and Challenges" (arXiv:2503.21460) a été publié sur arXiv. Il s'agit d'une synthèse complète qui organise la méthodologie, les applications et les défis des agents LLM à travers 329 articles. Cet article, auquel ont participé 26 chercheurs dirigés par Junyu Luo, positionne ce domaine comme un champ de recherche important vers l'AGI (Intelligence Artificielle Générale) et donne de nouvelles orientations pour la systématisation du raisonnement basé sur les agents.

Dans cet article, en nous basant sur cette synthèse, nous organiserons le raisonnement basé sur les agents selon quatre axes : planification, utilisation d'outils, mémoire et auto-amélioration, tout en décrivant l'état de l'art de la recherche sur les agents LLM tels que Silo-Bench et MC-Search.

## Pourquoi le « raisonnement basé sur les agents » suscite-t-il l'attention ?

### Des lois d'échelle à l'agentivité

De la fin des années 2010 au début des années 2020, l'amélioration des performances des LLM a été le résultat de lois d'échelle – augmentation de la taille du modèle, de la quantité de données et de la puissance de calcul. Cependant, le coût de la mise à l'échelle augmente de manière exponentielle, et il devient difficile d'obtenir des améliorations de performance équivalentes avec les mêmes méthodes.

En 2026, le centre de gravité de la recherche s'est clairement déplacé de « quelle est la taille du modèle ? » à « comment utiliser le modèle ? ». Un article de synthèse qui organise le paysage de l'apprentissage par renforcement basé sur les agents (arXiv:2509.02547) décrit cette transition comme le passage des « LLM de générateurs de séquences passifs à des agents de prise de décision autonomes intégrés dans des environnements dynamiques complexes ».

### Changement de paradigme de la « génération » à l'« action »

Les LLM traditionnels ont été conçus comme des « systèmes de génération fermés » qui reçoivent un prompt et renvoient du texte. Les LLM basés sur les agents bouleversent radicalement cette conception.

- Recevoir un objectif et élaborer de manière autonome un plan d'action
- Appeler des outils externes (moteurs de recherche, interpréteurs de code, API, etc.)
- Intégrer les résultats d'exécution comme retour d'information et réviser le plan
- Maintenir une mémoire à long terme et s'adapter sur plusieurs sessions

Il s'agit d'un passage de « répondre à une question » à « accomplir une tâche », ce qui peut être considéré comme un changement de paradigme fondamental des systèmes d'IA.

## Les 4 axes centraux du raisonnement basé sur les agents

Les quatre axes définis en convergence par plusieurs synthèses, dont "LLM-based Agentic Reasoning Frameworks: A Survey from Methods to Scenarios" (arXiv:2508.17692) et arXiv:2509.02547, constituent le cadre commun actuel dans la communauté de recherche.

```
┌────────────────────────────────────────┐
│         LLM Agent                │
│                                        │
│  ┌──────────┐    ┌──────────┐          │
│  │  Planification     │    │ Utilisation d'outils │          │
│  │ Planning │    │ Tool Use │          │
│  └────┬─────┘    └────┬─────┘          │
│       │               │                │
│  ┌────▼─────┐    ┌────▼─────┐          │
│  │  Mémoire     │    │ Auto-amélioration  │          │
│  │ Memory   │    │  Self-   │          │
│  │          │    │ Improve  │          │
│  └──────────┘    └──────────┘          │
└────────────────────────────────────────┘
```

### Axe 1 : Planification (Planning)

La planification est le point de départ du raisonnement basé sur les agents. Elle désigne la capacité à décomposer un objectif donné et à l'organiser en une séquence de sous-tâches exécutables.

Il y a une évolution progressive dans les **méthodes de décomposition de tâches**. Chain-of-Thought (CoT) s'est largement répandu comme une représentation de planification simple, mais des méthodes plus sophistiquées sont apparues récemment.

- **Tree-of-Thoughts (ToT)** : Représente la planification sous forme d'arbre, explorant et évaluant plusieurs chemins candidats.
- **Graph-of-Thoughts (GoT)** : Introduit une structure de graphe, permettant la réutilisation et la bifurcation des plans.
- **Architecture hiérarchique** : Un agent de niveau supérieur élabore des plans stratégiques et délègue des sous-tâches spécifiques à des agents de niveau inférieur.

La précision de la planification est l'élément le plus crucial qui affecte les performances globales de l'agent. Sans une décomposition appropriée des sous-tâches, l'utilisation ultérieure des outils et l'exploitation de la mémoire ne peuvent pas être efficaces.

### Axe 2 : Utilisation d'outils (Tool Use)

L'utilisation d'outils est une fonction qui permet à l'agent d'interagir avec des systèmes externes. Le LLM sélectionne et appelle de manière autonome divers outils, tels que l'envoi de requêtes à un moteur de recherche, l'exécution de code, la consultation de bases de données ou l'appel d'API externes.

**L'émergence du Model Context Protocol (MCP)** a une importance historique dans la standardisation de cette utilisation des outils. Ce protocole, proposé par Anthropic en novembre 2024, est une norme ouverte qui permet une connexion « plug-and-play » entre les LLM et les ensembles d'outils, et peut être qualifié de « USB-C des applications d'IA ».

L'adoption du MCP s'est rapidement étendue, dépassant 97 millions de téléchargements mensuels de SDK fin 2025, et OpenAI, Google et Microsoft ont également annoncé leur adoption. En décembre 2025, Anthropic a fait don du MCP à l'Agentic AI Foundation (AAIF), une organisation sous l'égide de la Linux Foundation, l'établissant comme une véritable norme industrielle.

Les méthodologies de sélection d'outils peuvent être classées en trois types :

| Mode de sélection | Description | Scénarios d'application |
|:-----------------|:----------------|:------------------------|
| Sélection autonome | Le LLM sélectionne des outils en fonction de la situation | Agents polyvalents |
| Basé sur des règles | Sélection via des règles prédéfinies | Tâches avec des contraintes claires |
| Basé sur l'apprentissage | Optimisation de la sélection d'outils par apprentissage par renforcement | Tâches répétitives |

### Axe 3 : Mémoire (Memory)

La mémoire est le fondement qui soutient l'autonomie de l'agent. Comme la fenêtre contextuelle des LLM est limitée, des mécanismes de mémoire externes sont nécessaires pour la rétention d'informations à long terme.

"Memory for Autonomous LLM Agents: Mechanisms, Evaluation, and Emerging Frontiers" (arXiv:2603.07670) passe en revue de manière exhaustive la recherche sur la mémoire de 2022 au début de 2026 et définit une architecture de mémoire à quatre couches.

| Type de mémoire | Description | Exemples d'implémentation |
|:-----------------|:----------------|:--------------------------|
| Mémoire de travail | Contexte de la tâche actuelle (fenêtre contextuelle) | Tampon d'entrée du LLM |
| Mémoire épisodique | Événements passés, expériences (avec horodatage) | Bases de données vectorielles |
| Mémoire sémantique | Concepts, connaissances, faits abstraits | Graphes de connaissances, RAG |
| Mémoire procédurale | Compétences exécutables, modèles de planification | Fine-tuning, code |

Une découverte importante de la recherche est la réalité selon laquelle « les exemples intégrant idéalement la structure à quatre couches sont rares ». La plupart des systèmes actuels implémentent efficacement deux couches, et les transitions entre les couches sont traitées de manière heuristique. Des recherches comme A-Mem (arXiv:2502.12110) explorent des architectures de mémoire avancées combinant la recherche vectorielle et les structures de graphes, mais l'intégration complète des quatre couches reste un problème de recherche ouvert.

### Axe 4 : Auto-amélioration (Self-Improvement)

La capacité de l'agent à apprendre de ses expériences et à s'améliorer lui-même constitue le quatrième axe. Les trois paradigmes d'auto-amélioration organisés par arXiv:2508.17692 sont les suivants :

**Réflexion (Reflection)** : Un mécanisme par lequel l'agent examine ses actions passées et leurs résultats pour en tirer des leçons. Reflexion et Self-Refine sont des cadres représentatifs qui implémentent cette idée. Reflexion conserve l'historique des actions comme mémoire épisodique et insère un processus de réflexion avant le prochain essai. Self-Refine génère des retours d'information sur les résultats de la génération et utilise ces retours pour améliorer itérativement la sortie.

**Optimisation itérative (Iterative Optimization)** : Une approche qui affine itérativement le prompt et la stratégie de sélection d'outils, plutôt que de mettre à jour les poids de l'ensemble du modèle.

**Apprentissage interactif (Interactive Learning)** : Ajuste dynamiquement les objectifs par l'interaction continue avec l'environnement. Il est hautement compatible avec l'apprentissage par renforcement et progresse dans la fusion avec l'apprentissage par renforcement basé sur les agents.

## La boucle fondamentale de l'agent vue sous l'angle de l'implémentation

En exprimant l'interaction des quatre axes du point de vue de l'implémentation, la boucle fondamentale de l'agent peut être décrite comme suit :

```python
# Boucle fondamentale de raisonnement basé sur les agents (pseudo-code)
def agent_loop(goal, tools, memory):
    while not goal_achieved(goal):
        # 1. Observation (perception) de l'environnement
        observation = perceive(environment)

        # 2. Récupération d'informations pertinentes de la mémoire (mémoire)
        relevant_context = memory.retrieve(observation, top_k=5)

        # 3. Génération du plan (planification)
        plan = llm.plan(goal, observation, relevant_context)

        # 4. Sélection et exécution de l'outil (utilisation d'outils)
        action = plan.next_action()
        result = tools.execute(action)

        # 5. Mise à jour de la mémoire (mémoire → matériau pour l'auto-amélioration)
        memory.store(episode={
            "action": action,
            "result": result,
            "timestamp": now()
        })

        # 6. Réflexion/auto-correction (auto-amélioration)
        if result.is_failure():
            reflection = llm.reflect(action, result)
            plan.revise(reflection)
```

Dans cette boucle, les quatre axes ne sont pas des modules indépendants, mais forment un système dynamique qui s'alimente mutuellement.

## Multi-agents : la 5ème dimension

Les systèmes multi-agents traitent des problèmes qui dépassent les capacités d'un seul agent. La synthèse d'arXiv:2503.21460 positionne les mécanismes de coopération entre agents comme un pilier important de l'architecture.

### MultiAgentBench : mise en place d'un cadre d'évaluation

MultiAgentBench (arXiv:2503.01935, accepté à ACL 2025) contribue à accélérer la recherche sur les systèmes multi-agents. Ce cadre, qui évalue quantitativement la coopération et la compétition des agents LLM, présente les caractéristiques suivantes :

- Mesure non seulement le taux d'achèvement des tâches, mais aussi la qualité de la coopération à l'aide d'indicateurs clés basés sur des jalons.
- Évalue quatre topologies de coopération : Star, Chain, Tree et Graph.
- Valide des stratégies innovantes telles que la discussion de groupe et la planification cognitive.
- **Principale découverte** : La structure Graph obtient les meilleures performances dans les scénarios de recherche, et la planification cognitive améliore le taux d'atteinte des jalons de 3 %.

### Conception de topologies de coopération

La structure organisationnelle des systèmes multi-agents peut être classée en trois types.

```
Centralisé          Distribué             Hiérarchique
     A                A  B             Leader
   / | \              |\/|            /   |   \
  B  C  D             C  D          Sub1 Sub2 Sub3
                                    / \       / \
                                   E   F     G   H
```

Les résultats de MultiAgentBench montrent que la topologie optimale dépend de la nature de la tâche. Pour les tâches de recherche complexes, Graph est supérieur, tandis que pour les tâches d'exécution simples, Star ou Chain est efficace.

## MC-Search : à la pointe de la recherche d'agents multimodaux

MC-Search (arXiv:2603.00873, soumis à ICLR 2026), apparu en mars 2026, est un cadre pour évaluer et améliorer les capacités des agents dans des tâches complexes de recherche d'informations traversant le texte et les images.

**Taille et caractéristiques du jeu de données** :
- Contient 3 333 exemples de haute qualité.
- Chaînes de raisonnement annotées par étapes d'une moyenne de 3,7 sauts.
- Assurance qualité par HAVE (Hop-wise Attribution and Verification of Evidence).

**Métriques d'évaluation innovantes** (trois évaluations au niveau du processus dépassant la précision de réponse traditionnelle) :

1. **LLM-as-a-Judge** : Évaluation de la qualité du raisonnement ouvert.
2. **Structure-Aware per Step Hit Rate** : Mesure de la précision de la recherche par étape.
3. **Rollout Deviation** : Quantification de la dérive d'exécution (écart par rapport au plan).

**Search-Align** : Un cadre qui améliore la planification et la précision de la recherche des MLLM open source en utilisant des chaînes de raisonnement vérifiées pour le fine-tuning de la surveillance des processus.

Les huit types de modèles d'erreurs systématiques révélés par MC-Search (sur-recherche, sous-recherche, planification incohérente entre modalités, etc.) montrent spécifiquement les échecs typiques que les implémenteurs doivent éviter.

## Défis et limites du raisonnement basé sur les agents

### Amplification de la fiabilité et des hallucinations

Lorsque les agents agissent de manière autonome sur plusieurs étapes, il existe un risque que les erreurs dans les étapes intermédiaires se propagent aux étapes suivantes, amplifiant l'erreur finale.

CARE-RFT (arXiv:2602.00085) aborde directement ce compromis. Le fine-tuning d'amélioration (RFT) qui améliore les performances de raisonnement a tendance à amplifier les hallucinations en même temps, mais ce problème peut être atténué par une conception de pénalité basée sur la confiance utilisant la divergence inverse de KL.

### Coût et latence

Chaque fois que l'agent répète la boucle de planification, d'exécution et de réflexion, un coût d'inférence LLM est généré. Les tâches complexes peuvent nécessiter des dizaines d'appels LLM, ce qui constitue une contrainte pratique.

### Sécurité et injection de prompt

Les agents qui font référence à des données externes sont vulnérables aux attaques par « injection de prompt » qui induisent des comportements involontaires par un contenu malveillant. La conception de bac à sable et le principe du moindre privilège sont importants.

### Difficulté d'évaluation

Comme le montre MC-Search, l'évaluation des performances des agents est nettement plus difficile que la réponse aux questions en un seul tour. La conception de métriques appropriées au niveau du processus est en soi un problème de recherche important.

## Domaines d'application : comment les agents transforment les domaines

### Génie logiciel

C'est l'un des domaines d'application les plus actifs du raisonnement basé sur les agents. Des agents capables d'exécuter de manière autonome la génération de code, le débogage et le refactoring sur plusieurs étapes sont apparus, et des améliorations rapides des performances ont été enregistrées sur des benchmarks tels que SWE-Bench. Le rôle des ingénieurs est en train de passer de « personnes qui écrivent du code » à « personnes qui donnent des objectifs aux agents et vérifient les livrables ».

### Découverte scientifique

Des agents qui répètent de manière autonome la conception d'expériences, la recherche documentaire, la génération d'hypothèses et l'analyse des résultats transforment la vitesse de la recherche scientifique. Les cas d'application dans les domaines de la découverte de médicaments et de la science des matériaux augmentent, et une accélération des découvertes en collaboration avec des chercheurs humains est attendue.

### Économie d'interaction entre agents IA

L'acquisition de la plateforme dédiée aux agents IA « Moltbook » par Meta indique l'aube d'une « économie d'agents » où les agents communiquent et collaborent entre eux. Le développement d'infrastructures permettant l'identification des agents et leur lien avec les propriétaires humains émerge comme le prochain défi.

## Résumé : les quatre axes comme lignes directrices de conception

L'état actuel de la recherche sur les agents LLM, organisé par arXiv:2503.21460, montre que les quatre axes – planification, utilisation d'outils, mémoire et auto-amélioration – forment un système qui se complète mutuellement, plutôt que des modules indépendants.

```
Planification  ──────→ Utilisation d'outils
  ↑               │
  │               ↓
Auto-amélioration ←──── Mémoire
```

Les connaissances acquises par l'utilisation d'outils (basée sur la planification, opération externe) sont stockées sous forme de mémoire, cette mémoire stockée devient le matériau de l'auto-amélioration, et les capacités améliorées affinent le prochain plan. C'est ce cycle qui est au cœur de l'IA basée sur les agents.

Alors que les benchmarks tels que MultiAgentBench et MC-Search progressent, l'intégration à quatre couches de la mémoire, les mesures contre l'injection de prompt et les méthodes d'évaluation au niveau du processus restent des défis ouverts.

À l'ère post-scalabilité, les agents LLM ne sont pas seulement une avancée technologique, mais redéfinissent la manière dont les humains et l'IA collaborent. Une compréhension systématique des quatre axes est une base de connaissances indispensable pour quiconque conçoit et utilise des agents.

## Références

| Titre | Source | Date | URL |
|:---------|:-------|:-----|:----|
| Large Language Model Agent: A Survey on Methodology, Applications and Challenges | arXiv | 2025/03/27 | https://arxiv.org/abs/2503.21460 |
| LLM-based Agentic Reasoning Frameworks: A Survey from Methods to Scenarios | arXiv | 2025/08 | https://arxiv.org/html/2508.17692v1 |
| The Landscape of Agentic Reinforcement Learning for LLMs: A Survey | arXiv | 2025/09 | https://arxiv.org/abs/2509.02547 |
| Memory for Autonomous LLM Agents: Mechanisms, Evaluation, and Emerging Frontiers | arXiv | 2026/03 | https://arxiv.org/html/2603.07670 |
| MC-Search: Evaluating and Enhancing Multimodal Agentic Search with Structured Long Reasoning Chains | arXiv | 2026/03/01 | https://arxiv.org/abs/2603.00873 |
| MultiAgentBench: Evaluating the Collaboration and Competition of LLM agents | arXiv / ACL 2025 | 2025/03/03 | https://arxiv.org/abs/2503.01935 |
| A-Mem: Agentic Memory for LLM Agents | arXiv | 2025/02 | https://arxiv.org/pdf/2502.12110 |
| Model Context Protocol — Wikipedia | Wikipedia | 2025 | https://en.wikipedia.org/wiki/Model_Context_Protocol |
| A Year of MCP: From Internal Experiment to Industry Standard | Pento Blog | 2025 | https://www.pento.ai/blog/a-year-of-mcp-2025-review |
| Agentic LLMs in 2025: How AI Is Becoming Self-Directed, Tool-Using & Autonomous | Data Science Dojo | 2025 | https://datasciencedojo.com/blog/agentic-llm-in-2025/ |

---

> Cet article a été généré automatiquement par LLM. Il peut contenir des erreurs.
