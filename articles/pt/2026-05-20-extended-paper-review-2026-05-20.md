---
title: "Revisão de Artigos Expandida - Aceleração da Descoberta Científica por IA e Tecnologia de Controle de Robôs de Próxima Geração"
slug: "extended-paper-review-2026-05-20"
summary: "Com base em 5 pesquisas, este artigo explica as tendências acadêmicas notáveis em meados de maio de 2026, incluindo \"Co-Scientist\" e \"ERA\" que aceleram descobertas científicas, e avanços em modelos..."
date: "2026-05-20T18:30"
tags: ["IA","Robótica","Ciências da Vida","Ciência e Tecnologia","Ciência Computacional"]
category: "extended-paper-review"
automated: true
provider: "gemini"
sources: ["https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/","https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/","https://arxiv.org/abs/2605.13925","https://arxiv.org/abs/2605.14950","https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/"]
sns_topics: [{"topic":"A pesquisa científica acelerada pela IA","summary":"Com o Co-Scientist da DeepMind e o ERA do Google, uma nova era está chegando onde a IA analisa publicações acadêmicas de forma transversal para gerar e validar novas hipóteses nas áreas de medicina e biologia."},{"topic":"Evolução do controle de robôs","summary":"Novos artigos sobre a manipulação habilidosa de mãos robóticas e modelos de linguagem visual de ação (VLA) foram publicados, e o controle avançado usando tecnologias generativas como modelos de difusão está progredindo rapidamente."},{"topic":"Avanços na descoberta de medicamentos","summary":"Pesquisadores da Universidade Estadual da Flórida anunciaram um avanço na síntese de moléculas complexas usando bactérias derivadas de esponjas marinhas profundas, abrindo caminho para o desenvolvimento de novos medicamentos, como agentes anticâncer."}]
thumbnail: "/images/extended-paper-review-2026-05-20.png"
---
### 1. Resumo Executivo

Este artigo discute os últimos resultados acadêmicos publicados entre 19 e 20 de maio de 2026, com foco na democratização e automação da descoberta científica por IA, bem como na aplicação de modelos generativos na área da robótica. Notavelmente, vários casos foram publicados onde IAs resolvem desafios científicos através de raciocínio e codificação em nível de especialista, como "Co-Scientist" do Google DeepMind e "ERA" do Google Research. Estes têm o potencial de transformar radicalmente o processo tradicional de teste de hipóteses centrado no ser humano. Além disso, na robótica, a evolução contínua de modelos que integram visão, linguagem e ação está a melhorar a precisão da interação física.

### 2. Artigos em Destaque

#### Artigo 1: Aceleração da Pesquisa sobre Mecanismos de Doenças Hepáticas com Co-Scientist (IA para Ciências da Vida e Descoberta de Medicamentos)

- **Autores/Afiliação**: Equipe de Pesquisa do Google DeepMind
- **Contexto da Pesquisa e Questão**: É impossível para os humanos apreenderem todo o conhecimento gerado na pesquisa biomédica. Em particular, em doenças complexas como as hepáticas (MASH), a identificação de alvos que abranjam múltiplos processos biológicos relevantes é desafiadora.
- **Método Proposto**: Desenvolvimento de um sistema baseado em agentes chamado "Co-Scientist". Este sistema tem a capacidade de analisar extensivamente a literatura científica e gerar novas hipóteses que se encaixam na rede de conhecimento existente.
- **Resultados Principais**: Gerou a hipótese de que o inflamassoma NLRP3 é uma ponte molecular entre inflamação e metabolismo, explicando por que a taxa de sucesso do medicamento para doenças hepáticas "resmetirom" é limitada. Esta hipótese foi validada experimentalmente e acelerará o desenvolvimento de futuras terapias de dupla alvo.
- **Significado e Limitações**: Demonstrou o potencial de acelerar a pesquisa como se os cientistas estivessem "de mochila a jato". Uma limitação é que a validação experimental humana continua a ser essencial para avaliar a validade das hipóteses geradas pela IA.

[Co-Scientist: Enabling breakthroughs in liver disease research](https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/)

#### Artigo 2: "ERA", uma Ferramenta de Codificação por IA para Acelerar Descobertas Científicas (Ciências Sociais Computacionais e Outros)

- **Autores/Afiliação**: Google Research, Lizzie Dorfman, Michael Brenner e outros
- **Contexto da Pesquisa e Questão**: O desenvolvimento de modelos computacionais científicos requer altas habilidades de codificação, o que tem sido um gargalo para muitos pesquisadores.
- **Método Proposto**: Desenvolvimento da ferramenta de IA "Empirical Research Assistance (ERA)". A ERA usa uma abordagem de busca em árvore para gerar e modificar código otimizado para um objetivo científico dado.
- **Resultados Principais**: Alcançou desempenho em nível de especialista em benchmarks em várias áreas, incluindo genômica, saúde pública, análise de imagens de satélite e matemática. Em particular, mostrou precisão de ponta na previsão de internações por vírus respiratórios usando os indicadores do CDC.
- **Significado e Limitações**: Democratiza o acesso a ferramentas computacionais avançadas, permitindo que pesquisadores de todas as áreas usem IA como um "colaborador". A dependência do ambiente de execução do código e da confiabilidade dos dados são desafios operacionais futuros.

[Empirical Research Assistance (ERA): From Nature publication to catalyzing Computational Discovery](https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/)

#### Artigo 3: Investigação de Inteligência para Operações Habilidosas de Mãos Robóticas (Robótica)

- **Autores/Afiliação**: Weiguang Zhao, Xihao Guo, Tian Liang e outros
- **Contexto da Pesquisa e Questão**: "Dexterous Hand Manipulation", a capacidade de robôs realizarem operações complexas e delicadas com objetos como humanos, é um dos maiores desafios na robótica.
- **Método Proposto**: Realizou uma pesquisa e classificação sistemática das tendências mais recentes em abordagens de controle usando políticas generativas (como modelos de difusão e fluxos de correspondência). Em particular, esclareceu como métodos como "WarmPrior", que reflete o histórico de ações passadas, melhoram a taxa de sucesso.
- **Resultados Principais**: Apresentou insights que melhoram significativamente a taxa de sucesso da tarefa, indo além da simples imitação de comportamento (Behavior Cloning) e usando abordagens probabilísticas. Também sugeriu a possibilidade de respostas reflexas usando feedback tátil, alinhando representações visuais com o manifold tátil.
- **Significado e Limitações**: Demonstrou um caminho para robôs adquirirem comportamentos reflexos que se aproximam de "sentir" em vez de apenas "tocar". A superação da lacuna entre simulação e o mundo real (Sim-to-Real) continua a ser um desafio contínuo.

[Towards Robotic Dexterous Hand Intelligence: A Survey](https://arxiv.org/abs/2605.13925)

#### Artigo 4: "Evo-Depth", um Modelo Leve de Visão-Linguagem-Ação Profundo (Robótica)

- **Autores/Afiliação**: Tao Lin, Yuxin Du, Jiting Liu e outros
- **Contexto da Pesquisa e Questão**: Em aprendizado de robôs recentes, modelos que combinam visão e linguagem têm atraído atenção, mas o manuseio de informações de profundidade (distância) e o custo computacional têm sido barreiras para a prática.
- **Método Proposto**: Propôs "Evo-Depth", um modelo leve de Visão-Linguagem-Ação (VLA) aprimorado com informações de profundidade. Ele emprega uma rede de roteamento que suprime o ruído de informações de fundo desnecessárias e se concentra em áreas essenciais para a tarefa.
- **Resultados Principais**: Alcançou o SOTA (melhor desempenho) em 17 tarefas robóticas. Apesar de ter um número muito leve de parâmetros, conseguiu reduzir drasticamente os erros em áreas não relacionadas à tarefa.
- **Significado e Limitações**: Demonstrou que o controle avançado de IA é possível mesmo em dispositivos robóticos com consumo de energia e recursos computacionais limitados. A capacidade de generalização do modelo requer mais validação em sua capacidade de adaptação a ambientes desconhecidos.

[Evo-Depth: A Lightweight Depth-Enhanced Vision-Language-Action Model](https://arxiv.org/abs/2605.14950)

#### Artigo 5: Síntese de Novas Moléculas Usando Bactérias Derivadas de Esponjas Marinhas (Ciências da Vida)

- **Autores/Afiliação**: Florida State University, Zackary Firestone e outros
- **Contexto da Pesquisa e Questão**: Compostos de origem natural são extremamente importantes no desenvolvimento de novos medicamentos, mas a extração do ambiente natural enfrenta limitações quantitativas e problemas de custo.
- **Método Proposto**: Analisou bactérias derivadas de esponjas marinhas do Oceano Pacífico e, com base em sua estrutura molecular, desenvolveu um método para sintetizar moléculas complexas em laboratório a partir de materiais baratos e comercialmente disponíveis.
- **Resultados Principais**: Conseguiu sintetizar estruturas complexas que podem ser precursoras de medicamentos anticâncer clinicamente importantes de forma replicável e de baixo custo. Isso facilitou significativamente o acesso a testes biológicos.
- **Significado e Limitações**: Apresentou um modelo de método de pesquisa sustentável que acelera a descoberta de medicamentos, evitando a superexploração de recursos naturais. A maior eficiência do processo de síntese é o próximo passo.

[FSU chemists use sea sponge bacteria to create new molecules for drug discovery](https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/)

### 3. Discussão Transversal dos Artigos

Uma visão geral dos artigos selecionados revela um tema comum: a fusão do "fortalecimento da capacidade de raciocínio abstrato por IA" com a "adaptação ao mundo físico". Ferramentas como Co-Scientist e ERA são responsáveis pela geração de hipóteses científicas e automação de cálculos, enquanto os artigos relacionados à robótica exploram modelos de controle refinados para converter esses resultados em ações físicas (manipulação de mãos e modelos VLA).

Esses avanços interdisciplinares visam construir um "loop de automação da ciência" que encurta drasticamente o tempo entre a pesquisa e a implementação. Em particular, a sincronização da geração de hipóteses por IA, como demonstrado pelo DeepMind, com a "evolução do lado do hardware", como a síntese molecular em laboratório pela FSU, sugere fortemente que a pesquisa de descoberta de medicamentos, que antes levava anos, poderá agora ser iterada em questão de semanas.

### 4. Referências

| Título | Fonte | URL |
|---|---|---|
| Co-Scientist: Enabling breakthroughs in liver disease research | Google DeepMind | https://deepmind.google/discover/blog/co-scientist-enabling-breakthroughs-in-liver-disease-research/ |
| Empirical Research Assistance (ERA) | Google Research | https://research.google/blog/empirical-research-assistance-era-from-nature-publication-to-catalyzing-computational-discovery/ |
| Towards Robotic Dexterous Hand Intelligence: A Survey | arXiv | https://arxiv.org/abs/2605.13925 |
| Evo-Depth: A Lightweight Depth-Enhanced VLA Model | arXiv | https://arxiv.org/abs/2605.14950 |
| FSU chemists use sea sponge bacteria to create new molecules | Florida State University | https://www.fsu.edu/news/2026/05/19/fsu-chemists-use-sea-sponge-bacteria-to-create-new-molecules-for-drug-discovery/ |

---

> Este artigo foi gerado automaticamente por LLM. Pode conter erros.
