---
title: "Cerebras×OpenAI : la fin du monopole des GPU et la diversification des infrastructures IA"
slug: "cerebras-openai-inference-acceleration"
summary: "OpenAI adopte la puce WSE-3 de Cerebras pour une inférence ultra-rapide à plus de 1000 tokens/sec. Ce contrat de 10 milliards de dollars défie le règne de NVIDIA et redessine la carte de la compéti..."
date: "2026-03-18"
tags: ["Cerebras","OpenAI","AI推論","AIインフラ","NVIDIA","GPUアーキテクチャ","ウェーハスケール"]
category: "tech-article"
automated: false
thumbnail: "/images/cerebras-inference-acceleration.png"
draft: false
---
### Titre
Cerebras×OpenAI : la fin du monopole des GPU et la diversification des infrastructures IA

### Résumé
OpenAI adopte la puce WSE-3 de Cerebras pour une inférence ultra-rapide à plus de 1000 tokens/sec. Ce contrat de 10 milliards de dollars défie le règne de NVIDIA et redessine la carte de la compétition dans l'infrastructure IA.

### Corps
L'histoire de l'infrastructure IA retiendra le début de l'année 2026 comme un tournant. OpenAI a conclu un accord avec Cerebras de plus de 10 milliards de dollars, marquant la première adoption à grande échelle d'un accélérateur d'inférence autre que les GPU NVIDIA en environnement de production. L'élément phare est « GPT-5.3-Codex-Spark », un modèle spécialisé dans le codage, capable de fonctionner à plus de 1000 tokens par seconde.

Ce mouvement ne se limite pas à un changement de fournisseur. Il introduit une concurrence essentielle dans le bastion de NVIDIA, qui a dominé le marché du matériel IA pendant des années. Cet article détaillera les aspects techniques de l'architecture Cerebras WSE-3, le contexte de l'accord avec OpenAI, et l'impact de la diversification de l'infrastructure IA sur l'ensemble de l'industrie.

## Cerebras WSE-3 : L'innovation du moteur à l'échelle de la tranche

### Différences fondamentales avec l'architecture GPU traditionnelle
De nombreux GPU qui alimentent l'inférence IA moderne adoptent une architecture où des tranches de silicium sont découpées en puces individuelles (dicing), puis connectées en réseau pour un traitement parallèle. Les H100 et B200 de NVIDIA en sont des exemples typiques, cherchant à s'étendre par la connexion de plusieurs puces via des interconnexions rapides comme NVLink.

L'approche choisie par Cerebras bouleverse cette norme. Le WSE (Wafer Scale Engine) fonctionne avec l'intégralité de la tranche comme une seule puce massive. En l'absence de découpe physique, il n'y a intrinsèquement aucun surcoût de communication inter-puces.

### Spécifications clés du WSE-3
Fabriqué avec le procédé 5nm de TSMC, le WSE-3 affiche les spécifications suivantes :

| Point de spécification | WSE-3 | NVIDIA H100 | Facteur de comparaison |
|:-----------------------|:------|:------------|:----------------------|
| Nombre de transistors | 4 billions | environ 80 milliards | environ 50x |
| Nombre de cœurs IA | 900 000 cœurs | 17 408 cœurs | environ 52x |
| SRAM sur puce | 44 Go | 50 Mo | environ 880x |
| Bande passante mémoire | 21 PB/s | 3.35 TB/s | environ 7 000x |
| Superficie de la puce | 46 255 mm² | 814 mm² | environ 57x |
| Performance de calcul maximale | 125 PFLOPS | 3.958 PFLOPS | environ 32x |

La capacité de la SRAM sur puce est particulièrement remarquable. Les 44 Go du WSE-3 correspondent à 880 fois ceux du H100. Dans l'inférence IA, la bande passante mémoire est souvent un goulot d'étranglement, et l'intégration d'une grande quantité de mémoire sur puce permet de minimiser les accès à la mémoire externe. Ceci est la raison fondamentale de l'inférence rapide.

### La vitesse d'inférence rendue possible par l'échelle de la tranche
Les 900 000 cœurs du WSE-3 sont tous connectés uniformément dans une topologie de maillage 2D. Cette architecture accélère considérablement la phase de « décodage » lors de la génération de tokens.

Lorsqu'un cluster GPU traditionnel effectue une inférence IA, il est nécessaire de transférer les données des poids du modèle entre plusieurs GPU. Avec le WSE-3, tous les poids sont déployés sur la SRAM sur puce, éliminant ainsi la nécessité d'accéder à la mémoire externe et permettant un débit élevé de plusieurs milliers de tokens/seconde.

## Le contrat de 10 milliards de dollars entre OpenAI et Cerebras

### Aperçu du contrat
En janvier 2026, OpenAI et Cerebras ont conclu un contrat pluriannuel pour la fourniture de 750 mégawatts de ressources de calcul jusqu'en 2028. Le montant total du contrat dépasse les 10 milliards de dollars, une transaction transformatrice compte tenu de la taille de l'activité de Cerebras.

Selon Andrew Feldman, PDG de Cerebras, la négociation a débuté en août de l'année précédente, lorsque Cerebras a démontré la capacité de faire fonctionner les modèles open source d'OpenAI plus efficacement sur ses propres puces que sur des GPU. Cette démonstration technique a ouvert la voie à un contrat majeur.

Pour OpenAI, ce contrat est au cœur de sa stratégie de diversification des fournisseurs. Tout en maintenant ses commandes existantes auprès de NVIDIA, AMD et Broadcom, OpenAI a ajouté une acquisition de 10 milliards de dollars dédiée au calcul d'inférence avec Cerebras. Ceci reflète une décision stratégique de « répartition des risques dans l'infrastructure IA ».

### GPT-5.3-Codex-Spark : le premier produit de masse
En février 2026, OpenAI a dévoilé « GPT-5.3-Codex-Spark », le premier fruit de ce partenariat. Conçu comme une version allégée de GPT-5.3-Codex, ce modèle est optimisé pour le codage en temps réel et possède les caractéristiques suivantes :

*   **Vitesse d'inférence** : plus de 1000 tokens/sec (environ 15 fois plus rapide que GPT-5.3-Codex)
*   **Fenêtre de contexte** : 128k (texte uniquement)
*   **Environnements pris en charge** : ChatGPT Pro, Codex app, CLI, extension VS Code
*   **Forme de fourniture** : aperçu de recherche (déploiement progressif)

Le chiffre de 1000 tokens par seconde est difficile à appréhender intuitivement, mais comparé aux 65 à 70 tokens/sec de GPT-5.3-Codex, cela signifie que l'IA peut compléter et générer du code plus rapidement que ce que le développeur peut taper. C'est une vitesse qui transforme fondamentalement l'« interactivité » du codage.

### Pourquoi le codage est-il le premier cas d'utilisation ?
Il est stratégiquement judicieux qu'OpenAI ait appliqué les puces Cerebras en premier lieu au domaine du codage (codage de type agent).

La productivité d'un assistant de codage dépend fortement de la vitesse de réponse. Lorsqu'un développeur reçoit des complétions en temps réel tout en écrivant du code, même un délai de quelques centaines de millisecondes peut interrompre sa concentration. L'importance de cette vitesse est encore plus grande dans un flux de travail agentique où l'agent IA exécute des tests, corrige des bugs et refactorise le code.

L'inférence ultra-rapide fournie par les puces à l'échelle de tranche de Cerebras apporte la valeur la plus directe dans ce domaine, d'où son choix comme premier cas d'utilisation.

## Contexte structurel de l'effondrement du monopole de NVIDIA

### La domination de NVIDIA dans l'infrastructure IA
Au cours des cinq dernières années, NVIDIA a pratiquement monopolisé le marché de l'entraînement et de l'inférence IA. Les GPU, notamment les H100 et A100, sont devenus l'infrastructure standard de tous les principaux fournisseurs de cloud et des grands laboratoires d'IA, et le puissant verrouillage de l'écosystème CUDA a rendu difficile l'entrée des concurrents.

Cette position monopolistique a également été une contrainte pour OpenAI. La dépendance à un fournisseur unique comporte les risques suivants :

*   **Perte de pouvoir de négociation sur les prix** : NVIDIA détient un avantage significatif dans la fixation des prix.
*   **Goulots d'étranglement d'approvisionnement** : la pénurie de GPU limite l'expansion des services IA.
*   **Point de défaillance unique** : les problèmes de fabrication et d'approvisionnement de NVIDIA constituent un risque commercial direct.

### La stratégie de diversification d'OpenAI
OpenAI a commencé à diversifier ses fournisseurs de manière significative à partir de 2025. Tout en maintenant son contrat existant avec NVIDIA, elle a élargi ses commandes auprès d'AMD, de Broadcom et de Cerebras. Le contrat de 10 milliards de dollars avec Cerebras est un investissement stratégique particulièrement axé sur les charges de travail d'inférence.

Ce qu'il faut noter, c'est que les puces Cerebras sont adoptées non pas pour la « puissance de calcul générale », mais pour « l'accélération de l'inférence ». Selon les prévisions de Deloitte, l'inférence représentera environ les deux tiers du calcul IA total en 2026 (environ 50 % en 2025), et la demande d'accélérateurs d'inférence continuera de croître.

### La coopération AWS et Cerebras : propagation vers le cloud
Environ deux mois après le contrat avec OpenAI, le 13 mars 2026, AWS et Cerebras ont annoncé une importante alliance. Le déploiement d'une « architecture d'inférence désagrégée » introduisant les puces WSE-3 dans AWS Bedrock.

Techniquement, il s'agit d'une configuration hybride où le processeur Trainium d'AWS gère la phase de pré-remplissage (traitement du prompt), et le CS-3 de Cerebras gère la phase de décodage (génération de sortie). Cette division permettrait de réaliser une capacité de tokens 5 fois supérieure avec la même empreinte matérielle.

```mermaid
graph LR
    A[Entrée du prompt utilisateur] --> B[Phase de pré-remplissage]
    B --> C[Phase de décodage]
    C --> D[Sortie de réponse rapide]

    subgraph AWS Trainium
        B --> E[Génération de cache KV]
        E --> F[Transfert rapide EFA]
    end

    subgraph Cerebras WSE-3
        F --> C
        C --> G[1000+ tokens/s]
    end
```

Le concept d'architecture d'« inférence désagrégée » tire parti des différences de caractéristiques de calcul de chaque phase. En confiant le pré-remplissage aux systèmes de type GPU aptes au traitement parallèle et le décodage au WSE-3 doté d'une grande mémoire sur puce, le débit global est maximisé.

## Stratégie d'entreprise et introduction en bourse de Cerebras

### Croissance vers une valorisation de 2,2 milliards de dollars
Alors que Cerebras valait 8 milliards de dollars en 2024, des contrats comme celui avec OpenAI et plusieurs autres clients majeurs (IBM, Department of Energy américain, etc.) ont conduit à une valorisation rapportée de plus de 22 milliards de dollars au début de 2026. Les ventes estimées pour 2025 ont dépassé le milliard de dollars, marquant sa maturité d'une startup en phase de recherche à une entreprise d'infrastructure générant des revenus réels.

### Plans d'introduction en bourse et leur déroulement
Cerebras a déposé une demande d'introduction en bourse fin 2025, mais a été contraint de la retirer temporairement en raison de l'examen du CFIUS (Comité sur les investissements étrangers aux États-Unis) concernant la relation capitalistique avec G42 d'Abou Dabi. Par la suite, G42 a été retiré de la liste des investisseurs, permettant d'obtenir l'approbation du CFIUS, et une nouvelle demande est prévue pour le deuxième trimestre 2026.

Les contrats majeurs avec OpenAI et AWS constituent une toile de fond solide pour les résultats commerciaux précédant l'introduction en bourse.

## L'avenir indiqué par la multipolarisation de l'infrastructure IA

### Lancement de la compétition pour « l'inférence la plus rapide »
La sortie de GPT-5.3-Codex-Spark a introduit un nouvel axe de compétition dans l'industrie de l'IA. Non seulement la « sagacité » des modèles, mais aussi leur « rapidité » est devenue un facteur de différenciation.

Si l'avantage de vitesse de 20 fois revendiqué par Cerebras (par rapport aux GPU NVIDIA) est démontré, les opérateurs de services IA entreront dans une ère où le matériel sera choisi en fonction de l'usage.

*   **Tâches nécessitant une haute précision** : GPU traditionnels (NVIDIA H100/B200, etc.)
*   **Tâches nécessitant une latence ultra-faible** : Cerebras WSE-3
*   **Tâches prioritaires en termes de coût** : AMD MI300X, ASIC personnalisés, etc.

### Impact sur NVIDIA
Bien que la domination du marché de NVIDIA ne soit pas ébranlée, des changements importants se produisent. Sur le marché de l'inférence, NVIDIA fait face à sa première véritable compétition avec un concurrent puissant.

Ce qui est particulièrement remarquable, c'est le mouvement de « construction d'écosystème » illustré par la combinaison OpenAI・AWS・Cerebras. Tout comme CUDA a longtemps été la raison implicite du choix des GPU, un nouvel écosystème spécialisé dans l'inférence est en train de se former.

### Transformation de l'expérience développeur
Les changements apportés par l'inférence ultra-rapide ne se limitent pas à une amélioration des indicateurs de performance. Il est rapporté que chez Spotify, les ingénieurs de haut niveau « n'écrivent plus de code » depuis décembre 2025 grâce à la popularisation des outils de codage IA. Des outils de codage IA ultra-rapides comme Claude Code et GPT-5.3-Codex-Spark accéléreront encore cette transformation.

Une vitesse d'inférence de 1000 tokens par seconde pourrait être un seuil qui transforme fondamentalement le style de collaboration entre développeurs et IA. Si la complétion de pensée en temps réel, la révision de code instantanée et les suggestions de débogage immédiates sont fournies sans délai, la productivité du développement logiciel augmentera de manière exponentielle.

## Conclusion

Le partenariat entre Cerebras WSE-3 et OpenAI a apporté trois transitions importantes à l'infrastructure d'inférence IA.

Premièrement, en tant que transition technologique, l'architecture à l'échelle de la tranche a établi une nouvelle norme de performance : « 1000 tokens par seconde ». Deuxièmement, en tant que transition structurelle de l'industrie, le passage de la concentration sur NVIDIA à la multipolarisation a véritablement commencé. Troisièmement, en tant que transition des axes de compétition, la « vitesse » d'inférence, parallèlement à la « sagacité » des modèles, s'est établie comme un facteur de différenciation majeur.

L'« architecture d'inférence désagrégée », illustrée par la collaboration avec AWS, suggère une diffusion plus large. Si, dans le courant de 2026, les utilisateurs de cloud ordinaires pourront bénéficier du WSE-3 via Amazon Bedrock, l'inférence rapide passera du privilège de quelques grands laboratoires à un composant standard des services IA.

Les murs de l'écosystème construit par NVIDIA pendant des années sont élevés. Cependant, lorsque le contrat de 10 milliards de dollars, l'alliance stratégique avec AWS et l'avantage de vitesse réel de 15 fois que les développeurs peuvent expérimenter se combinent, la carte de la compétition de l'infrastructure IA est assurément en train d'être redessinée.

---

## Références

| Titre | Source | Date | URL |
|:--------------------------|:-----------|:-----|:----|
| OpenAI deploys Cerebras chips for 15x faster code generation | VentureBeat | 12 février 2026 | https://venturebeat.com/technology/openai-deploys-cerebras-chips-for-15x-faster-code-generation-in-first-major |
| Cerebras Inks Transformative \$10 Billion Inference Deal With OpenAI | NextPlatform | 15 janvier 2026 | https://www.nextplatform.com/2026/01/15/cerebras-inks-transformative-10-billion-inference-deal-with-openai/ |
| OpenAI signs deal, worth \$10B, for compute from Cerebras | TechCrunch | 14 janvier 2026 | https://techcrunch.com/2026/01/14/openai-signs-deal-reportedly-worth-10-billion-for-compute-from-cerebras/ |
| Introducing GPT-5.3-Codex-Spark | OpenAI Official | Février 2026 | https://openai.com/index/introducing-gpt-5-3-codex-spark/ |
| OpenAI GPT-5.3-Codex-Spark Now Running at 1K Tokens Per Second | ServeTheHome | Février 2026 | https://www.servethehome.com/openai-gpt-5-3-codex-spark-now-running-at-1k-tokens-per-second-on-big-cerebras-chips/ |
| Cerebras WSE-3 AI Chip Launched 56x Larger than NVIDIA H100 | ServeTheHome | Mars 2024 | https://www.servethehome.com/cerebras-wse-3-ai-chip-launched-56x-larger-than-nvidia-h100-vertiv-supermicro-hpe-qualcomm/ |
| AWS and Cerebras Collaboration Aims to Set a New Standard for AI Inference | BusinessWire | 13 mars 2026 | https://www.businesswire.com/news/home/20260313406341/en/AWS-and-Cerebras-Collaboration-Aims-to-Set-a-New-Standard-for-AI-Inference-Speed-and-Performance-in-the-Cloud |
| Cerebras scores OpenAI deal worth over \$10 billion ahead of IPO | CNBC | 14 janvier 2026 | https://www.cnbc.com/2026/01/14/cerebras-scores-openai-deal-worth-over-10-billion.html |
| OpenAI chip deal with Cerebras adds to roster of Nvidia, AMD, Broadcom | CNBC | 16 janvier 2026 | https://www.cnbc.com/2026/01/16/openai-chip-deal-with-cerebras-adds-to-roster-of-nvidia-amd-broadcom.html |
| OpenAI Partners with Cerebras to Bring High-Speed Inference to the Mainstream | Cerebras Blog | Février 2026 | https://www.cerebras.ai/blog/openai-partners-with-cerebras-to-bring-high-speed-inference-to-the-mainstream |
| A Comparison of the Cerebras Wafer-Scale Integration Technology with Nvidia GPU-based Systems | arXiv | Mars 2025 | https://arxiv.org/html/2503.11698v1 |
| Cerebras is coming to AWS | Cerebras Blog | Mars 2026 | https://www.cerebras.ai/blog/cerebras-is-coming-to-aws |
| 2026 IPO Alert: Nvidia Rival Cerebras Systems Targets Debut in Q2 | TipRanks | Janvier 2026 | https://www.tipranks.com/news/2026-ipo-alert-nvidia-rival-cerebras-targets-debut-in-q2 |

---

> Cet article a été généré automatiquement par LLM. Il peut contenir des erreurs.
