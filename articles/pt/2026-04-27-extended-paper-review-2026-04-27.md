---
title: "Revisão ampliada de artigos — “Novos modelos e validação” que atravessam autonomia, descoberta de fármacos e impactos na sociedade"
slug: "extended-paper-review-2026-04-27"
summary: "Em 27/04/2026 (JST), a partir de artigos recém-publicados desde a última data de publicação, fazemos uma abordagem transversal de agentes autônomos, IA para descoberta de fármacos, economia/finança..."
date: "2026-04-27T18:30"
tags: ["arXiv","Agentes Autônomos","IA para Descoberta de Fármacos","Economia Comportamental","Ciências Sociais Computacionais"]
category: "extended-paper-review"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2604.07921","https://arxiv.org/abs/2604.18373","https://arxiv.org/abs/2602.09362","https://arxiv.org/abs/q-bio/0606012","https://arxiv.org/abs/2112.01871","https://arxiv.org/abs/2401.17435"]
sns_topics: [{"topic":"Consciência de sustentabilidade em robótica (cs.RO)","summary":"Em um grande levantamento, verificou-se que os artigos de robótica mencionam os ODS de forma extremamente rara, quantificando a lacuna entre intenções e implementação."},{"topic":"Economia comportamental de agentes com LLM (mercados experimentais)","summary":"A partir de negociações de mercado por agentes com LLM, observam-se padrões comportamentais como o efeito de disposição e crenças retrospectivas, além de demonstrar efeitos de intervenção."},{"topic":"Fundamentos de IA para descoberta de fármacos: previsão da estrutura de proteínas","summary":"Considerando abordagens clássicas, revisita-se o contexto de pesquisa de abordagens recentes de geração e predição."}]
thumbnail: "/images/extended-paper-review-2026-04-27.png"
---
### 1. Resumo executivo
Nesta revisão, o eixo não foi apenas “criar um novo modelo”, mas sim “o quanto ele consegue reproduzir e melhorar restrições do mundo real e o comportamento social”.

Em robótica, dá para ver um movimento em direção à quantificação da escassez de menções à sustentabilidade por meio da análise de um corpus gigante.

Em finanças e economia comportamental, o foco está em vieses comportamentais que agentes de LLM exibem no mercado e em como intervenções via prompt podem aumentá-los ou reduzi-los.

Por outro lado, depois de estabelecer a base fundamental da predição da estrutura de proteínas — que está no cerne da IA para descoberta de fármacos — também organizamos o que o conjunto de métodos contemporâneos herda.

### 2. Artigos em destaque (selecionados em cada área)

#### Artigo 1: A lacuna de sustentabilidade em robótica — um grande levantamento sobre artigos de pesquisa em escala de 50.000 (Robótica, Agentes Autônomos)

- **Autores e afiliações**: Antun Skuric, Leandro Von Werra, Thomas Wolf (as afiliações estão conforme descritas na página do artigo)
- **Contexto e pergunta da pesquisa**: À medida que robôs autônomos e automação são implementados na sociedade, tornam-se pontos de discussão a carga ambiental e os impactos éticos. Porém, o problema de saber “se a comunidade de pesquisa explicita a sustentabilidade como motivação” é algo difícil de visualizar de modo quantitativo. Assim, este estudo formula a pergunta sobre quanto a consciência de sustentabilidade (motivação; descrição de impactos; conexão com os SDGs) aparece em relação a um volume enorme de artigos da área cs.RO.
- **Método proposto**: Para um corpus em grande escala, somam-se ocorrências de termos ligados à sustentabilidade, a presença/ausência de menções a questões sociais/ecossistemas/sustentabilidade e, ainda, menções explícitas aos UN Sustainable Development Goals (SDGs) como indicadores baseados em regras/classificatórios. Em essência, trata-se de um desenho para medir “o quanto a perspectiva de sustentabilidade está ‘escrita’ nas alegações da pesquisa”.
- **Principais resultados**: Os resultados indicam um “gap” em que a proporção de menções a impactos relacionados à sustentabilidade é muito baixa e, em especial, referências explícitas aos SDGs aparecem ainda menos (há relatos de faixas em que a menção explícita aos SDGs é inferior a 0,1% e a motivação por sustentabilidade é inferior a 5%, com base em resumos de artigos). Mesmo sendo uma área em que a pesquisa em robótica pode ser aplicada a problemas sociais, a sustentabilidade não se torna padrão como enquadramento de pesquisa — ou seja, como narrativa de pesquisa.
- **Significado e limitações**: O significado está em visualizar em uma escala muito forte se a sustentabilidade é tratada como “meta de esforço” e se é posicionada como valor dos resultados da pesquisa. Como limitação, “poucas menções” não significa necessariamente que, de fato, a carga ambiental seja pequena ou que não haja falta de consideração. Trata-se apenas de “declaração explícita no texto”, sem acompanhar diretamente a realidade da implementação ou medições (como avaliação do ciclo de vida etc.).
- **Fonte**: [The Sustainability Gap in Robotics: A Large-Scale Survey of Sustainability Awareness in 50,000 Research Articles](https://arxiv.org/abs/2604.07921)

Este artigo oferece a iniciantes a perspectiva de que o valor de uma pesquisa não está apenas em escores de desempenho, mas também em para que finalidade ela é feita (motivação e impactos). Se compararmos, é como a diferença entre um carro que diz apenas “quão seguro é” e outro que explica que foi projetado considerando “consumo de combustível e emissões também”. Se a comunidade de pesquisa não migrar para esse tipo de narrativa, a sociedade terá dificuldade em julgar “por que essa tecnologia é necessária”. No setor industrial, se houver alinhamento com sustentabilidade desde a fase de pesquisa, discussões sobre compras, conformidade regulatória e avaliação ESG podem avançar com antecedência.

#### Artigo 2: “Desmontando” finanças comportamentais e bolhas de mercado — formação de expectativas e trading por agentes de LLM (Engenharia Financeira, Finanças Computacionais)

- **Autores e afiliações**: Shumiao Ouyang, Pengfei Sui (as afiliações estão conforme descritas na página do artigo)
- **Contexto e pergunta da pesquisa**: No mercado, observam-se fatores comportamentais que não conseguem ser explicados mesmo assumindo expectativas racionais (por exemplo: viés em informações do período mais recente, aversão a perdas e, ao mesmo tempo, tendência de “desembaraçar/descartar” — disposições semelhantes). Assim, a pergunta é: “Quando se faz com que um modelo linguístico de larga escala, como o LLM, participe do mercado como agente, surgem padrões comportamentais conhecidos em estudos com humanos? Além disso, como detectar o ‘mecanismo’ por trás disso e o quanto ele pode ser alterado por intervenções como prompts?”.
- **Método proposto**: Construir um mercado de leilão de chamada aberta (open-call auction) em simulação e colocar agentes de LLM (de modo geral, sujeitos autônomos que realizam geração de texto e inferência) para participar. Observa-se a formação de expectativas e a ação de cada agente ao emitir ordens, avaliando fenômenos conhecidos em economia comportamental (por exemplo: efeito de disposição, ponderação de informações retrospectivas/mais recentes) por meio de indicadores. Além disso, pontuam-se textos de raciocínio (reasoning text) dos agentes em uma estrutura como a de “20 mecanismos” para explorar quais mecanismos se relacionam com a formação de bolhas.
- **Principais resultados**: No resumo do artigo, relata-se que: (1) padrões comportamentais clássicos como efeito de disposição e “recency-weighted extrapolative beliefs (crenças extrapolativas ponderadas pelo período recente)” são observados; (2) isso se agrega como dinâmica de equilíbrio e reproduz relações conhecidas em mercados de ativos experimentais (por exemplo: excesso de demanda prever preços futuros; desacordo de opiniões se relacionar positivamente com volume de negociação etc.); (3) usando “pontuação por mecanismo” aplicada ao texto de raciocínio, intervenções específicas via prompt podem aumentar ou reduzir causalmente o tamanho das bolhas.
- **Significado e limitações**: O significado está em tentar conectar o fato de que LLMs podem se tornar agentes com “estilo de comportamento” para tomada de decisão econômica — e que intervenções podem ser compreendidas por meio de quais mecanismos de comportamento elas atuam — com vestígios baseados em texto. Como limitação, a causalidade obtida aqui pode depender fortemente do ambiente de mercado projetado, do espaço de prompts e das métricas de avaliação. Além disso, como não é possível reproduzir completamente as instituições do mercado real e as assimetrias de informação, é preciso cautela ao fazer extrapolações.
- **Fonte**: [Dissecting AI Trading: Behavioral Finance and Market Bubbles](https://arxiv.org/abs/2604.18373)

O núcleo desta pesquisa é a postura de “ler a ‘oscilação’ do mercado até o conteúdo do raciocínio”. Em outras palavras para iniciantes: não é apenas olhar para a alta e a queda do preço das ações (resultado), mas inferir a partir do texto “por que” o agente decidiu daquele jeito (candidatos de causa) e, em seguida, intervir nesses candidatos para verificar a reprodutibilidade. A ideia é semelhante à de verificar, em controle de robôs, não só se “a saída está boa”, mas se as leis de controle tendem a atuar de forma segura. Industrialmente, torna-se importante entender “em quais mecanismos de comportamento ele se apoia” ao projetar, regulamentar e auditar (audit) traders de IA. Por exemplo, se mudanças de prompt alterarem a tolerância a bolhas, então a gestão de mudanças durante a operação (governança de versões do modelo/prompt) se conecta diretamente ao risco econômico.

#### Artigo 3: Economia comportamental da IA — vieses de LLM e suas correções (Psicologia, Ciência Cognitiva)

- **Autores e afiliações**: Autores conforme descritos no resumo (de acordo com o que consta na página do artigo)
- **Contexto e pergunta da pesquisa**: Em pesquisas sobre tomada de decisão humana, sabe-se que vieses cognitivos distorcem o comportamento de forma sistemática. Em cenários em que IA — especialmente LLM — é usada para tomada de decisões, surge o problema de que o próprio sistema de IA também pode ter “manias/padrões de saída” e isso pode impactar os resultados comportamentais. Assim, este artigo busca descrever os vieses observados em LLMs dentro de uma estrutura da economia comportamental e investigar possibilidades de correção (correção/mitigação).
- **Método proposto**: Fornecer ao LLM entradas relacionadas à tomada de decisão e analisar o viés nas saídas. Além disso, introduzem-se intervenções para reduzir o viés (prompt ou restrições, e em alguns casos até desenhos comparativos) e avalia-se sob a ótica de verificar se o viés melhora “estatisticamente”.
- **Principais resultados**: A partir da visão geral na página do artigo, sugere-se que LLMs podem exibir padrões sistemáticos de erro vistos em pesquisas com humanos e que podem ser corrigidos com certas intervenções (indicadores detalhados e tamanho de efeito exigem verificação no texto do artigo). Pelo menos, a alegação central é que “os erros do LLM não são aleatórios e podem ser enviesados em função do design”.
- **Significado e limitações**: O significado é conectar conceitos de psicologia e ciência cognitiva à avaliação de IA, deslocando vieses de “fenômenos” para “objetos de melhoria”. Como limitação, quais vieses se reproduzem em tarefas práticas específicas depende do desenho da tarefa e da distribuição dos dados. Pesquisas sobre viés de IA tendem a sofrer com o gap entre o desenho de laboratório e o ambiente operacional real.
- **Fonte**: [Behavioral Economics of AI: LLM Biases and Corrections](https://arxiv.org/abs/2602.09362)

Ao resumir o ponto central deste artigo para iniciantes: “o ‘jeito’ do LLM de dar respostas pode, em alguns casos, ser entendido como análogo aos vieses tratados em economia comportamental”. Por exemplo, assim como pessoas podem ser puxadas em questionários para opções específicas, o LLM também pode ser puxado para formatos ou contextos específicos. Em termos de impacto social e industrial, como em suporte à tomada de decisão (seleção em contratação, concessão de crédito, seleção educacional etc.) não basta obter “respostas convincentes”, torna-se necessário auditar por tipo de viés e preparar meios de correção.

#### Artigo 4: Inferência ativa (Active Inference) aplicada à robótica e agentes artificiais — levantando e desafios (Robótica, Agentes Autônomos)

- **Autores e afiliações**: Principais autores e afiliações conforme listados na página do artigo (o resumo é baseado na página do artigo)
- **Contexto e pergunta da pesquisa**: Agentes autônomos precisam observar, inferir e agir sob incerteza. Como abordagem, “inferência ativa” é conhecida como uma forma de otimizar atualizando estados do mundo e políticas por meio de erros de predição (a divergência entre expectativa e observação). Este levantamento se apoia na pergunta de como esse enquadramento pode ser usado na robótica e onde estão os desafios.
- **Método proposto**: Mais do que uma proposta única, como uma survey, o artigo abrange exemplos de aplicação de Active Inference em robótica e em agentes artificiais (estimação de estado, controle, ações orientadas a objetivos etc.), resumindo o progresso de pesquisa e gargalos.
- **Principais resultados**: No resumo do artigo, afirma-se que a Active Inference pode servir de base para estimação de estados e controle sob incerteza, bem como para ações orientadas a objetivos.
- **Significado e limitações**: O significado é fornecer ao leitor um mapa geral da metodologia, permitindo que pesquisadores que vão entrar na área entendam “onde existem lacunas”. Como limitação, por ser um levantamento, pode não haver apresentação direta “do número de desempenho do novo resultado desta semana”.
- **Fonte**: [Active Inference in Robotics and Artificial Agents: Survey and Challenges](https://arxiv.org/abs/2112.01871)

Para iniciantes, este artigo reforça a ideia de que “autonomia não é apenas reforço (reinforcement learning)”. A Active Inference é como, por exemplo, “um robô que continua atualizando um mapa do mundo na própria cabeça”: observa, ajusta o mapa (crenças) e, com a próxima ação, atualiza novamente. No âmbito social e industrial, pode crescer o interesse por esse tipo de enquadramento como compatível com explicabilidade (por que escolheu aquela ação) e com validação de segurança.

#### Artigo 5: Predição de estruturas de proteínas — a próxima geração (Ciências da Vida, IA para descoberta de fármacos)

- **Autores e afiliações**: Michael C. Prentiss et al. (conforme listados na página do artigo)
- **Contexto e pergunta da pesquisa**: Em IA para descoberta de fármacos, a predição da estrutura de proteínas é uma etapa anterior para entender “a forma com que o fármaco se liga”. Porém, a predição de estrutura depende fortemente de suposições sobre escada de energia e dobramento (folding), exigindo refinamentos teóricos e de implementação para melhorar a precisão. Esta pesquisa apresenta uma visão geral da linha de predição da estrutura de proteínas e oferece ideias para melhorias.
- **Método proposto**: A partir de uma visão de mecânica estatística e landscape de energia, apresenta-se ideias que levam à melhoria da função de energia preditiva, como a ideia de usar ensembles (um conjunto de múltiplas estruturas candidatas).
- **Principais resultados**: Como um artigo de revisão no contexto, explicam-se como a estrutura de predição evoluiu e também conceitos como as propriedades do landscape de energia subjacente (por exemplo: “funnelled energy landscape”).
- **Significado e limitações**: O significado está em conseguir organizar o pano de fundo teórico como base para entender “o estado atual” da IA para descoberta de fármacos. Como limitação, este artigo em si inclui conteúdo clássico; portanto, a correspondência direta com modelos gerativos mais recentes e benchmarks mais recentes depende do texto.
- **Fonte**: [Protein Structure Prediction: The Next Generation](https://arxiv.org/abs/q-bio/0606012)

Para iniciantes, este artigo tem um papel de estruturar “a porta de entrada” para IA na descoberta de fármacos. IA para descoberta de fármacos muitas vezes parece terminar com “o modelo prevê e pronto”, mas conhecer como as “intuições baseadas em física” por trás disso refletem no design do modelo e nos alvos de treinamento é o que se liga à precisão e à reprodutibilidade em aplicações. No lado industrial, conforme a confiabilidade da predição de estruturas aumenta, a preparação do terreno para predição de ligação e exploração de leads se fortalece, o que pode reduzir custos de busca.

### 3. Considerações transversais entre os artigos
O tema comum que atravessa estes cinco artigos é: “como criar métricas que possam ser validadas, variáveis que possam ser alteradas via intervenção e uma explicação conectada às exigências da sociedade — não apenas desempenho (taxa de acerto)”.

Em robótica, a “explicitude” da sustentabilidade virou alvo de mensuração, e o modo como a pesquisa narra a questão virou um indicador. Essa direção se aproxima de uma “metaavaliação” para conectar engenharia à sociedade.

Em engenharia financeira e economia comportamental, observou-se que o comportamento de agentes de LLM reproduz relações de mercados clássicos de ativos experimentais e, além disso, pode ser alterado causalmente por intervenções. Aqui, torna-se importante não apenas observar comportamentos, mas também inferir mecanismos a partir de textos de raciocínio.

Nos artigos do lado de psicologia e ciência cognitiva, a pesquisa descreve vieses de IA na “linguagem de vieses” e valida a corrigibilidade, aproximando a avaliação de IA de “experimentos de ciência cognitiva”.

No lado de IA para descoberta de fármacos, a organização do pano de fundo teórico da predição de estruturas de proteínas funciona como base para sustentar a compreensão dos métodos atuais. Embora o avanço dos modelos gerativos seja rápido, a herança de intuições físicas pode afetar a robustez e a interpretabilidade dos modelos.

No conjunto, apesar da diferença entre dez áreas, os três pontos — “métricas verificáveis”, “variáveis passíveis de intervenção” e “explicação conectada às demandas sociais” — emergem como preocupações comuns no desenho de pesquisa.

### 4. Referências
| Título | Fonte de informação | URL |
|---------|--------|-----|
| The Sustainability Gap in Robotics: A Large-Scale Survey of Sustainability Awareness in 50,000 Research Articles | arXiv | https://arxiv.org/abs/2604.07921 |
| Dissecting AI Trading: Behavioral Finance and Market Bubbles | arXiv | https://arxiv.org/abs/2604.18373 |
| Behavioral Economics of AI: LLM Biases and Corrections | arXiv | https://arxiv.org/abs/2602.09362 |
| Active Inference in Robotics and Artificial Agents: Survey and Challenges | arXiv | https://arxiv.org/abs/2112.01871 |
| Protein Structure Prediction: The Next Generation | arXiv | https://arxiv.org/abs/q-bio/0606012 |

---

> Este artigo foi gerado automaticamente por LLM. Pode conter erros.
