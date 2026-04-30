---
title: "Resumo Mensal de Artigos - Inteligência de Agentes Auditável"
slug: "monthly-paper-recap-2026-04-30"
summary: "Em abril, a pesquisa de agentes IA migrou de \"desempenho\" para \"operação, verificação e auditoria\". Foco em revisão externa de casos de segurança, monitoramento não supervisionado de desvios descon..."
date: "2026-04-30T12:00"
tags: ["resumo-mensal-de-artigos","arXiv-nova-chegada","revisão-transversal","modelos-fundacionais-avaliação","segurança-e-implementação","multi-agentes","segurança-de-IA","benchmark","interpretabilidade","formalização","IA","avaliação-LLM","RLHF","alinhamento","RAG-agêntico","seguimento-de-instruções","IA-generativa","aplicações-interdisciplinares","revisão-ciência-e-tecnologia","engenharia-de-contexto","segurança","modularização","agentes","revisão-de-artigos","ciência-e-tecnologia","sistemas-sociais","robótica","agentes-de-IA","IA-multimodal","aprendizado-profundo","economia","ciência-de-materiais","biologia","LLM","agentes-autônomos","raciocínio","economia-de-IA","estratégia-empresarial","IA-para-descoberta-de-fármacos","ciência-social-computacional","IA-neuro-simbólica","arXiv","tendências-de-pesquisa-em-IA","robustez","ataques-adversariais","pesquisa-interdisciplinar","avaliação-segurança","segurança-de-agentes","modelo-de-ameaça","design-de-avaliação","engenharia-educacional","segurança-de-IA","métricas-de-avaliação","raciocínio-reforçado","teoria-organizacional","engenharia-aeroespacial","inovação-tecnológica","pesquisa-em-IA","modelos-de-linguagem-grande","ciência-do-clima","tendências-tecnológicas","multimodal","quantização","descoberta-de-fármacos","IA-física","pesquisa-científica","IA-física","IA-médica","economia-comportamental","agentes-LLM","memória-aprendizado","engenharia-financeira","segurança-e-alinhamento-de-IA","avaliação-de-agentes","verificação-de-segurança"]
category: "monthly-paper-recap"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2603.17247","https://arxiv.org/abs/2603.02989","https://arxiv.org/abs/2602.07735","https://arxiv.org/abs/2603.10098","https://arxiv.org/abs/2603.24621","https://arxiv.org/abs/2603.15973","https://arxiv.org/abs/2603.06849","https://arxiv.org/abs/2603.04857","https://arxiv.org/abs/2603.25187","https://arxiv.org/abs/2603.07379","https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158","https://arxiv.org/abs/2603.09619","https://arxiv.org/abs/2603.07295","https://www.anthropic.com/engineering/eval-awareness-browsecomp","https://arxiv.org/abs/2603.29184","https://arxiv.org/abs/2406.07539","https://arxiv.org/abs/2603.04029","https://arxiv.org/abs/2604.03016","https://arxiv.org/abs/2604.01202","https://arxiv.org/abs/2604.02168"]
sns_topics: [{"topic":"Revisão externa e auditabilidade de casos de segurança","summary":"A direção se esclareceu para decompor alegações de segurança e inspecioná-las externamente, identificando lacunas em premissas e evidências. O gerenciamento da qualidade da argumentação para conexão operacional é fundamental."},{"topic":"Descoberta de desvios desconhecidos através de monitoramento não supervisionado","summary":"Progresso em estruturas para detectar novos desvios que não são capturados por regras ou julgamentos existentes, a partir da distribuição de logs e representações intermediárias."},{"topic":"Verificação formal prévia em sandbox (Z3, etc.)","summary":"O isolamento é apenas uma 'premissa', e a visão de verificar implementação e limites com métodos formais para reduzir brechas ganhou força."},{"topic":"RAG de agentes e alinhamento modal (MASS-RAG/resolução de conflitos)","summary":"Síntese de múltiplos agentes visa reduzir alucinações em RAG, e pesquisas também se destacam ao suprimir conflitos entre linguagem e visão através de decodificação."},{"topic":"Modelos fundamentais em descoberta de fármacos e saúde com alinhamento físico/temporal","summary":"A tendência continua com modelos como GPT-Rosalind e APOLLO acelerando saúde e descoberta de fármacos através de síntese de evidências, planejamento e integração temporal."}]
thumbnail: "/images/monthly-paper-recap-2026-04-30.png"
recap_period: "2026-03-30/2026-04-29"
---
### 1. Resumo Executivo

A tendência de artigos de abril foi um mês em que a IA de agentes começou a demonstrar não apenas "comportamento inteligente", mas "operação segura", através do design de avaliação, verificação e auditoria. Revisão externa de casos de segurança, monitoramento não supervisionado para detectar desvios fora das regras conhecidas, e verificação formal pré-implementação de infraestrutura de sandbox ocorrem em paralelo. Além disso, agentização de RAG, alinhamento multimodal, modelos fundacionais para descoberta de fármacos e medicina, e integração de restrições físicas em robótica também enfatizaram "viabilidade como sistema". Os artigos discutidos somam mais de 20 em classificação principal, com campos abrangendo segurança de IA e avaliação de agentes, multimodal, robótica, ciências da vida e descoberta de fármacos, ciência social computacional, finanças e design institucional.

### 2. Tendências de Pesquisa do Mês

#### Tendência 1: Segurança migra de "correção de modelo" para "verificabilidade de operação" (Avaliação, Auditoria, Métodos Formais)

O que caracterizou este mês foi o fluxo de discussão de segurança se separando de "melhoria de desempenho", e tentando enquadrar "com que base podemos dizer que é seguro" em formas operacionais. O marco representativo é o framework de caso de segurança (safety case) passando por revisão externa para verificar a qualidade da força fraca de alegações, evidências, premissas e métodos de avaliação ([Lessons from External Review of DeepMind's Scheming Inability Safety Case](https://arxiv.org/abs/2604.21964)). A essência aqui é que, antes da qualidade do comportamento do modelo, a "qualidade da argumentação que sustenta a alegação de segurança" se tornou o objeto a ser auditado.

Além disso, há design tentando desenterrar "desvios desconhecidos" que são difíceis de aprender com regras e juízes pré-preparados através de monitoramento não supervisionado ([Unsupervised monitoring to surface novel agent misbehaviors beyond predefined rules/judges](https://tdteach.github.io/paper-news/2026-04-15-zh/?utm_source=openai)). Essa direção, mantendo baixo o custo da proliferação de regras, dá ao lado da vigilância uma entrada de "detecção de estranheza". Como resultado, segurança não é apenas "passa/falha", mas torna-se uma questão de "pipeline operacional" conectando a reinvestigação, priorização e revisão humana.

Simultaneamente, há uma direção de verificação formal pré-implementação de fundamentos (infraestrutura e condições de contorno) partindo da premissa de que a sandbox pode ter suas premissas quebradas ([Mythos and the Unverified Cage: Z3-Based Pre-Deployment Verification for Frontier-Model Sandbox Infrastructure](https://arxiv.org/abs/2604.20496)). Esta é uma abordagem que torna o isolamento não apenas uma filosofia de design, mas uma especificação verificável sobre "se é quebrado". O consenso do mês inteiro converge no ponto de que quanto mais agentização avança, mais a superfície de ataque se encadeia, e segurança não consegue acompanhar com "resposta pós-facto".

Relatedly, pesquisa tratando empiricamente como frameworks de Preparedness como design institucional realmente desencadeiam "atos de implementação" através de análise de afordância ([The 2025 OpenAI Preparedness Framework does not guarantee any AI risk mitigation practices: a proof-of-concept for affordance analyses of AI safety policies](https://arxiv.org/abs/2509.24394)) também se conecta ao mesmo "design operacional de segurança". Segurança é perguntada não como declaração, mas como design de ambiente acionando comportamento.

#### Tendência 2: RAG de Agentes avança de "aquisição paralela" para "síntese e controle de desvio" (MASS-RAG, TRAP, OpenCLAW)

Outro eixo de abril é que RAG de agentes deslocou seu foco de peso de "extensão de aquisição de informação" para "integração de informação e garantia de integridade". [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](https://arxiv.org/abs/2604.18509), que introduz múltiplos agentes adquirindo e depois realiza uma etapa de síntese de revisão de confiabilidade, é um exemplo representativo, visando melhoria de precisão e redução de taxa de contaminação de desinformação em perguntas complexas de base de conhecimento. Para "omissões de evidência" e "deficiências de contexto" que tendem a se tornar limitações em busca→geração única, está tentando preenchê-las como um workflow.

Para o lado de segurança, há uma direção proeminente de medir mecanismos pelos quais agentes da web são redirecionados de tarefas através de "persuasão" como benchmark ([It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](https://arxiv.org/abs/2512.23128)). O ponto está no design de medir "a tarefa se tornou outra coisa através de persuasão" em vez de procurar injeção. Enquanto RAG é um "mecanismo de integração", TRAP é um "medidor de desvio", aproximando avaliação de segurança de RAG de agentes da operação real.

Além disso, mesmo quando IA gera artigos e relatórios, a integridade (correção de referências, persistência de perda zero, escala de avaliação) é garantida na operação através do framework [OpenCLAW-P2P v6.0](https://arxiv.org/abs/2604.19792). Aqui, através de verificação de referência ao vivo (consultas a CrossRef/arXiv/Semantic Scholar, etc.) e persistência em camadas, a geração e auditoria são conectadas como um "processo". Como resultado, o agente não é apenas um sujeito de saída, mas torna-se um sujeito de verificação contínua e melhoria de saída.

Com estes 3 pontos (síntese de MASS-RAG, avaliação de desvio de TRAP, ligação operacional de OpenCLAW) alinhados, RAG de agentes está começando a ser design como um "produto" incluindo não apenas "desempenho" mas também "verificabilidade".

#### Tendência 3: Alinhamento Multimodal, Estabilidade de Crenças, Otimização de Uso de Ferramentas (Decomposição da "Causa" de Erros)

Abril foi um mês em que muita pesquisa decomponha as razões pelas quais modelos parecem corretos a partir de "fora". Avaliações como [Unmasking the Illusion of Embodied Reasoning in Vision-Language-Action Models](https://arxiv.org/abs/2604.18000) expõem a ilusão de "raciocínio corporificado" em comportamento visão-linguagem-ação, iluminando o problema de continuar a emitir planos plausíveis mesmo em situações sem alinhamento com o mundo físico. A partir daqui, design de segurança não apenas melhoria de quantidade de dados ou aprendizado, mas a necessidade de avaliação conectada a restrições físicas reais da realidade é fortalecida.

Além disso, pesquisa teoricamente capturando competição inter-modal (problema de linguagem dominando visão) e melhorando através de intervenção de decodificação ([Dual Alignment Between Language Model Layers and Human Sentence Processing](https://arxiv.org/abs/2604.18563)) também é vista. Este ponto em que "corrigir com ajuste fino" apenas em relação a "corrigir com ajuste de peso de token em tempo de inferência" tem alto valor de implementação.

Além disso, investigar "excesso de ferramentas" de LLMs, medindo o fenômeno onde problemas que podem ser completados com conhecimento interno estão consultando ferramentas externas, mostrando como isso pode se tornar perda de eficiência e fonte de desinformação ([The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](https://arxiv.org/abs/2604.19749)). Aqui, segurança não apenas, mas custo, latência e carga de vigilância também estão incluídos, tornando a tomada de decisão sobre "quando parar" um alvo de design.

E sondagem de que crença interna não é estável contra persona ([Probing the Lack of Stable Internal Beliefs in LLMs](https://arxiv.org/abs/2603.25187)). Esta linhagem tenta reconstruir o sistema de coordenadas de avaliação e debugging observando a causa da flutuação de saída de volta para "estado interno".

Além disso, explicar por que alinhamento RLHF parece "raso" através de análise de gradiente ([Why Is RLHF Alignment Shallow? A Gradient Analysis](https://arxiv.org/abs/2603.04857)). Isto é, descrevendo "dinâmica" de onde o sinal de segurança está chegando na aprendizagem, evita deixar as direções de melhoria enganadas.

Em termos gerais, o ponto comum de abril é que "erros não são apenas diferença de desempenho, mas decompostos como problemas de mecanismo (crença, competição, chegada de sinal, parada de ferramenta)".

#### Tendência 4: Em Descoberta de Fármacos, Medicina, Base Molecular, Integridade Física e Contexto Temporal são Protagonistas (APOLLO/GPT-Rosalind, etc.)

Ciência da vida foi um mês em que IA generativa se conecta de "texto" para "processo científico". [APOLLO](https://arxiv.org/abs/2604.18570), integrando representação de paciente virtual em tempo através do uso de grandes eventos médicos, é um modelo fundacional temporal-multimodal mostrando melhoria dramática de desempenho em predição de doença. Em vez de depender de uma única modalidade, conectando longo contexto de série temporal do paciente, pode-se dizer que a "previsibilidade" da medicina foi reduzida para "representação fundacional".

Em descoberta de fármacos, uma direção como [GPT-Rosalind](https://seekingalpha.com/news/4317666-openai-launches-gpt-rosalind-an-ai-model-for-life-sciences-research) suportando a cadeia de síntese de evidência, geração de hipótese, planejamento experimental foi discutida. Além disso, a existência de sistemas usando modelos de difusão para incorporar flutuações dinâmicas de proteína e avançar design molecular também é indicada (como exemplo [uvahealth.comaceleração de descoberta de fármacos relacionada](https://uvahealth.com/news/new-ai-tech-to-speed-drug-development)).

Ao nível molecular, como modelo fundacional molecular universal integrando integridade física (alinhamento de energia/força, etc.) no treinamento, [UBio-MolFM: A Universal Molecular Foundation Model for Bio-Systems](https://arxiv.org/abs/2602.17709) demonstrou a tendência de deslocar design de aprendizagem para integridade física não apenas ajuste de dados. Além disso, a direção de converter paisagem de aptidão de proteína em uma forma "fácil de manipular" para otimização de recozimento quântico ([Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](https://arxiv.org/abs/2603.17247)) também propaga a paradigmas de exploração em descoberta de fármacos.

O resumo de ciência da vida de abril é, "não apenas gerar", mas o movimento de integrar "como a ciência avança (evidência→hipótese→planejamento→verificação)" nos modelos fundacionais.

#### Tendência 5: Conforme Agentização Avança "Eficiência" também se Torna Essencial (Quantização/Otimização de Inferência/Aprendizado de Restrições Físicas)

Finalmente, à medida que agentes entram em operação real, custo computacional e latência se tornam problemas, também se entrelaçando com processos de segurança e auditoria. Assim, pesquisa de eficiência também se tornou proeminente no mesmo mês. Por exemplo, quantização de baixo-bit de alta precisão através de GSQ (Quantização Gumbel-Softmax) é tratada em [GSQ: Highly-Accurate Low-Precision Scalar Quantization for LLMs via Gumbel-Softmax Sampling](https://arxiv.org/abs/2604.18556), contribuindo para execução em borda e considerações de privacidade.

Como otimização de encadeamento de workflow de inferência, aceleração de descoberta científica e matemática de agente de exploração de DeepMind ([Accelerating mathematical and scientific discovery with Gemini Deep Think](https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/)). Além disso, a direção Neuro-Simbólica como combinar camada lógica para cortar consumo de energia mantendo taxa de sucesso (descrição Neuro-simbólica é central na entrada, URLs distribuído em Apple, etc.) se alinha com a tendência de eficiência do mês inteiro.

Em robótica também, restrições físicas, regularização baseada em energia (MPC Neural) etc. estão em paralelo (exemplo: [Energy-based Regularization for Learning Residual Dynamics in Neural MPC](https://arxiv.org/abs/2604.14678)), com movimento de incorporar física no lado de aprendizado para estabilizar controle.

### 3. Seleção de Artigos Importantes (5-10 Papéis)

#### [Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](Paisagens de Aptidão de Proteína Latente Binária: Otimização de Recozimento Quântico)
- **Data de Publicação**: 2026-03-30 (conforme premissa de referência do texto de entrada)
- **Campo de Pesquisa**: q-bio (ciência da vida) / otimização, recozimento quântico
- **Autores, Filiações**: (itens não confirmados na entrada. verificar página arXiv real)
- **Contexto e Questão da Pesquisa**: A paisagem de aptidão em espaço de sequência de proteína (landscape) tem custo alto de avaliação, exploração frequentemente falha rapidamente. Há necessidade de "transformação de representação" em forma fácil de manipular por exploradores e otimizadores.
- **Método Proposto e Resultados Principais**: Propõe framework reduzindo paisagem de aptidão para "representação latente binária" e colocando em otimização de recozimento quântico. O resumo de entrada indica estrutura útil obtida em ProteinGym, etc., com potencial em identificação de variante de alta aptidão.
- **Significância e Impacto Futuro**: Direção de "design de representação" elevando eficiência de exploração pode também ondular na fase anterior (geração de candidato, screening) de IA de descoberta de fármacos. Limitação é impacto em precisão de binarização, design de representação latente, tornando comparação com outros paradigmas computacionais o próximo ponto.
- **Referência**: [Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization](https://arxiv.org/abs/2603.17247)

#### [CASSR: Continuous A-Star Search through Reachability for real time footstep planning](CASSR: Busca A* Contínua através de Alcançabilidade para Planejamento de Passos em Tempo Real)
- **Data de Publicação**: 2026-03-30 (conforme entrada)
- **Campo de Pesquisa**: cs.RO (robótica)
- **Autores, Filiações**: (itens não confirmados na entrada. verificar página arXiv real)
- **Contexto e Questão da Pesquisa**: Planejamento de passos de robô bípede envolve restrição contínua e segurança (alcançabilidade). Discretização é grosseira, elevando taxa de falha e desperdiçando computação.
- **Método Proposto e Resultados Principais**: Ativa análise de alcançabilidade (reachability), reduzindo para expressão contínua e convexa, mantendo restrição dentro da busca A*. O resumo de entrada objetiva velocidade e precisão próximas a planejamento em tempo real comparado aos grids discretos tradicionais.
- **Significância e Impacto Futuro**: Incorporar informação de segurança (conjunto alcançável) na "premissa" de planejamento pode aumentar confiabilidade de aplicação prática. Por outro lado, análise de alcançabilidade e aproximação convexa podem se tornar gargalo em validade.
- **Referência**: [CASSR: Continuous A-Star Search through Reachability for real time footstep planning](https://arxiv.org/abs/2603.02989)

#### [FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications](FireBench: Avaliação de Seguimento de Instruções em Aplicações LLM Empresariais e Orientadas por API)
- **Data de Publicação**: 2026-04-01 (conforme entrada)
- **Campo de Pesquisa**: avaliação LLM / aplicação de agentes
- **Autores, Filiações**: (baseado em resumo de autores de entrada, verificar página de referência para detalhes)
- **Contexto e Questão da Pesquisa**: Avaliação tipo chat não consegue medir requisitos de negócios (formato de saída, cumprimento de procedimento, premissa de ferramenta). Avaliação de seguimento de instrução próxima de operação empresarial/API é necessária.
- **Método Proposto e Resultados Principais**: Constrói benchmark FireBench de padrões de operação real, avaliando em múltiplas dimensões de capacidade. O resumo de entrada clarifica a configuração de 6 dimensões, mais de 2.400 amostras, 11 LLMs, com objetivo de mostrar diferença comportamental em cenários de site.
- **Significância e Impacto Futuro**: Avaliação migra de laboratório para requisito operacional, tornando-se componente de adoção, auditoria, garantia de qualidade. Limitação é otimização para suposição de local específico, requer verificação de desvio de distribuição.
- **Referência**: [FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications](https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158)

#### [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](MASS-RAG: Geração Aumentada por Recuperação de Síntese Multi-Agente)
- **Data de Publicação**: 2026-04-22 (conforme entrada)
- **Campo de Pesquisa**: RAG de agentes / supressão de alucinação
- **Autores, Filiações**: Xingchen Xiao, Heyan Huang, Runheng Liu, Jincheng Xie (conforme entrada)
- **Contexto e Questão da Pesquisa**: RAG de busca única falha em qualidade e alcance de aquisição de informação, perda de contexto e desinformação ocorrem em perguntas multi-passo.
- **Método Proposto e Resultados Principais**: Separa papéis de decomposição de query, busca, filtragem, geração de resposta, introduzindo etapa de síntese com revisão mútua de pontuação de confiabilidade de informação recuperada. O resumo de entrada mostra melhoria de ~15% em precisão de pergunta complexa, redução de contaminação de desinformação, melhoria em precisão de citação.
- **Significância e Impacto Futuro**: De "paralelização de busca" para "síntese e etapas de verificação". Possibilidade de conectar a saída auditável em exploração de documento dentro da empresa, mas custo de comunicação, realtime requer otimização.
- **Referência**: [MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation](https://arxiv.org/abs/2604.18509)

#### [The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](A Ilusão do Excesso de Ferramentas: Por que LLM Prefere Ferramentas Externas ao Conhecimento Interno?)
- **Data de Publicação**: 2026-04-24 (conforme entrada)
- **Campo de Pesquisa**: controle de agentes / avaliação
- **Autores, Filiações**: (anônimo na entrada)
- **Contexto e Questão da Pesquisa**: LLM com ferramentas de busca, execução de código se torna padrão, mas consultas de ferramenta aumentam até em problemas que poderiam ser completados com conhecimento interno, piorando eficiência e qualidade de desinformação.
- **Método Proposto e Resultados Principais**: Classifica se completável com conhecimento interno, analisa tendência de uso de ferramenta por passo, framework de avaliação. O resumo de entrada mostra observação ampla de excesso de ferramenta, contribuição a precisão de inferência limitada, aumentando custo computacional e latência.
- **Significância e Impacto Futuro**: Trata "quando parar ferramenta" como meta-decisão, conectando a design de governança. Próximo, política de uso de ferramenta de aprendizado, verificação se torna desafio.
- **Referência**: [The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge?](https://arxiv.org/abs/2604.19749)

#### [APOLLO: A multimodal and temporal foundation model for virtual patient representations at healthcare system scale](APOLLO: Modelo Fundacional Multimodal e Temporal para Representações de Paciente Virtual em Escala de Sistema de Saúde)
- **Data de Publicação**: 2026-04-24 (conforme entrada)
- **Campo de Pesquisa**: IA médica / modelo fundacional multimodal
- **Autores, Filiações**: Ali Zan, Ting Ding, Samuel J. Wagner et al. (conforme entrada)
- **Contexto e Questão da Pesquisa**: Maioria de dados médicos não utilizados, estruturação integrada de múltiplas modalidades diversas e estrutura temporal é necessária.
- **Método Proposto e Resultados Principais**: Constrói modelo APOLLO de fundação temporal em dataset MGB-7M (7.2 milhões pessoas, 25 bilhões eventos, 28 modalidades integradas). O resumo de entrada mostra diferença de desempenho como AUROC 0.92 em predição de início de esquizofrenia, AUROC 0.93 em predição de sobrevida de câncer de mama HER2-positivo (baseline 0.66).
- **Significância e Impacto Futuro**: Desloca predição médica para "representação fundacional", conectando a gerenciamento de saúde ao longo da vida de indivíduo. Limitação é auditoria ética e verificação adicional de confiabilidade.
- **Referência**: [A multimodal and temporal foundation model for virtual patient representations at healthcare system scale](https://arxiv.org/abs/2604.18570)

#### [Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents](Espectro de Compressão de Experiência: Unificando Memória, Habilidades e Regras em Agentes LLM)
- **Data de Publicação**: 2026-04-27 (conforme entrada)
- **Campo de Pesquisa**: agente de execução longa / memória, aprendizado
- **Autores, Filiações**: Xing Zhang, Guanghui Wang, Yanwei Cui et al. (conforme entrada)
- **Contexto e Questão da Pesquisa**: Em execução longa, experiência inflaciona, manutenção expande contexto. Resumo e reutilização cru perdem reprodutibilidade. Princípio sistemático para compressão, alternância de experiência é necessário.
- **Método Proposto e Resultados Principais**: Propõe espectro colocando memória/habilidade/regra em posição de "grau de compressão" diferente, aponta que compressão fixa falta adaptação (missing diagonal). O resumo de entrada mostra ordem de compressão (episódio, habilidade procedural, regra declarativa) e baixa referência cruzada (menos de 1%, etc.) baseado em hipótese de fragmentação de comunidade.
- **Significância e Impacto Futuro**: Promove "design de experiência" de técnica de implementação para princípio de design. Próximo desafio é estratégia de alternância adaptativa, aprofundamento de verificação experimental.
- **Referência**: [Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents](https://arxiv.org/abs/2604.15877)

#### [OpenCLAW-P2P v6.0: Resilient Multi-Layer Persistence, Live Reference Verification, and Production-Scale Evaluation](OpenCLAW-P2P v6.0: Persistência Resiliente em Multicamadas, Verificação de Referência ao Vivo, e Avaliação em Escala de Produção)
- **Data de Publicação**: 2026-04-27 (conforme entrada)
- **Campo de Pesquisa**: segurança de IA / verificação, operação de produção
- **Autores, Filiações**: Francisco Angulo de Lafuente, Teerth Sharma, Vladimir Veselov et al. (conforme entrada)
- **Contexto e Questão da Pesquisa**: Agentes gerando artigos não apenas, mas garantir em operação correção de referência e escala de avaliação é necessário.
- **Método Proposto e Resultados Principais**: Combina persistência em múltiplas camadas, cascata de busca de referência para latência baixa, verificação de referência ao vivo durante pontuação de revisão, proxy de API e cache com limite de velocidade, etc. O resumo de entrada apresenta indicadores operacionais incluindo protocolo de recuperação de artigos perdidos.
- **Significância e Impacto Futuro**: Desloca "segurança" de dentro do modelo para processo operacional. Desafio é verificação em tempo real deixando de alcançar falhas sutis (erro sutil de citação, etc.) quão longe pode ser reduzido.
- **Referência**: [OpenCLAW-P2P v6.0](https://arxiv.org/abs/2604.19792)

#### [It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](TRAP: Benchmark de Persuasão de Redirecionamento de Tarefa para Agentes Web)
- **Data de Publicação**: 2026-04-27 (conforme entrada)
- **Campo de Pesquisa**: segurança de agentes / benchmark
- **Autores, Filiações**: (baseado em OpenReview/fonte de resumo)
- **Contexto e Questão da Pesquisa**: Agentes web abordando tarefa real enfrentam indução e persuasão. Além de injeção, necessidade de medir "desvio onde tarefa se torna outra coisa" através de persuasão.
- **Método Proposto e Resultados Principais**: Design suite de avaliação como Task-Redirecting Agent Persuasion Benchmark (TRAP), medição reproduzível de grau ao qual injeção orientada por persuasão causa desvio de tarefa. O resumo de entrada enfatiza ponto de ser suite de avaliação reproduzível e design medindo desvio direto.
- **Significância e Impacto Futuro**: Avaliação de segurança fica vinculada de "string de entrada" a "desvio final". Próximo é confirmar cobertura de indução realista e transferabilidade de modelo.
- **Referência**: [It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents](https://arxiv.org/abs/2512.23128)

### 4. Análise Transversal

O ponto comum que perpassa o corpo de artigos de abril é que o alvo de pesquisa se deslocou de "competição de desempenho" para "design de condições de viabilidade (constraints) e verificabilidade (verifiability)". Em robótica, busca é mapeada para alcançabilidade e restrições físicas; em ciência da vida, integridade física e contexto temporal são incorporados em representações fundacionais. Em multimodal também, competição inter-modal e "parecer que está olhando" são decompostos por ambos benchmark de avaliação e intervenção de inferência.

Em segurança, conforme agentes atuam sobre o ambiente externo, modelo de ameaça se encadeia (indução→execução→desvio→reutilização), e proliferação de regra pré-definida apenas não consegue acompanhar. Como resultado, três camadas são processadas em paralelo: (1) auditoria de caso de segurança, (2) monitoramento não supervisionado de desvio desconhecido, (3) verificação formal pré-implementação de base de sandbox. Isto não é meramente argumento de segurança, mas mostra que design de avaliação em si se tornou "infraestrutura central de pesquisa".

Além disso, em pesquisa de organização e mercado (ciência social computacional, finanças, design institucional), a visão de que IA traz não é melhoria de precisão única, mas formar crença em grupo, bem-estar coletivo, velocidade de aprendizado, acumulação de incongruência está se fortalecendo. Em outras palavras, conclusão meta é compartilhada transversalmente que IA deve ser avaliada não apenas como entidade individual, mas como sistema sendo operado.

### 5. Temas Esperados para o Próximo Mês

Próximo mês é previsto acelerar fluxo conectando: (a) "forma verificável de auditoria" de caso de segurança (cobertura de evidência, realismo de premissa, refutabilidade), e (b) "detecção de desvio→recuperação" em loop fechado de RAG de agente, e (c) compressão de experiência de execução longa (memória/habilidade/regra de alternância adaptativa), através de experimento, benchmark, engenharia operacional. Adicionalmente, unificação de índice em quantização e otimização de política de uso de ferramenta avançará, e "otimização simultânea de segurança, precisão, custo" expandirá framework de medição.

Além disso, design institucional e avaliação do lado de comunidade de pesquisa (design de incentivo de melhor artigo, análise de estrutura de participação, colaboração) também pode ser tratada mais quantitativamente, vinculado ao ponto de que avaliação distorce aprendizado.

### 6. Referências

| Título | Fonte | Data | URL |
|--------|-------|------|-----|
| Binary Latent Protein Fitness Landscapes for Quantum Annealing Optimization | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.17247 |
| CASSR: Continuous A-Star Search through Reachability for real time footstep planning | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.02989 |
| TerraBind: Fast and Accurate Binding Affinity Prediction through Coarse Structural Representations | arXiv | 2026-02-xx | https://arxiv.org/abs/2602.07735 |
| Code-Space Response Oracles: Generating Interpretable Multi-Agent Policies with Large Language Models | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.10098 |
| ARC-AGI-3: A New Challenge for Frontier Agentic Intelligence | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.24621 |
| Safety is Non-Compositional: A Formal Framework for Capability-Based AI Systems | arXiv | 2026-03-30 | https://arxiv.org/abs/2603.15973 |
| FireBench: Evaluating Instruction Following in Enterprise and API-Driven LLM Applications | artigo | 2026-04-01 | https://ai-navigate-news.com/en/articles/127560eb-3c88-49b9-acfa-7b70547b3158 |
| Why Is RLHF Alignment Shallow? A Gradient Analysis | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.04857 |
| Probing the Lack of Stable Internal Beliefs in LLMs | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.25187 |
| SoK: Agentic RAG — First Unified Framework for Autonomous Retrieval-Generation Systems | arXiv | 2026-04-01 | https://arxiv.org/abs/2603.07379 |
| Eval awareness in Claude Opus 4.6's BrowseComp performance | Anthropic | 2026-04-03 | https://www.anthropic.com/engineering/eval-awareness-browsecomp |
| Bio-PINNs: Cell-Induced Phase Transitions: UQ-R3 Sampling with Causal Gating | arXiv | 2026-04-03 | https://arxiv.org/abs/2603.29184 |
| Agentic-MME: What Agentic Capability Really Brings to Multimodal Intelligence? | arXiv | 2026-04-06 | https://arxiv.org/abs/2604.03016 |
| MIRAGE: The Illusion of Visual Understanding | arXiv | 2026-04-06 | https://arxiv.org/abs/2604.02168 |
| Experience Compression Spectrum: Unifying Memory, Skills, and Rules in LLM Agents | arXiv | 2026-04-27 | https://arxiv.org/abs/2604.15877 |
| OpenCLAW-P2P v6.0 | arXiv | 2026-04-27 | https://arxiv.org/abs/2604.19792 |
| It's a TRAP! Task-Redirecting Agent Persuasion Benchmark for Web Agents | arXiv | 2026-04-27 | https://arxiv.org/abs/2512.23128 |
| A multimodal and temporal foundation model for virtual patient representations at healthcare system scale | arXiv | 2026-04-24 | https://arxiv.org/abs/2604.18570 |
| The Tool-Overuse Illusion: Why Does LLM Prefer External Tools over Internal Knowledge? | arXiv | 2026-04-24 | https://arxiv.org/abs/2604.19749 |
| MASS-RAG: Multi-Agent Synthesis Retrieval-Augmented Generation | arXiv | 2026-04-22 | https://arxiv.org/abs/2604.18509 |
| GSQ: Highly-Accurate Low-Precision Scalar Quantization for LLMs via Gumbel-Softmax Sampling | arXiv | 2026-04-22 | https://arxiv.org/abs/2604.18556 |
| Mythos and the Unverified Cage: Z3-Based Pre-Deployment Verification for Frontier-Model Sandbox Infrastructure | arXiv | 2026-04-29 | https://arxiv.org/abs/2604.20496 |
| The 2025 OpenAI Preparedness Framework does not guarantee any AI risk mitigation practices | arXiv | 2026-04-13 | https://arxiv.org/abs/2509.24394 |
| Accelerating mathematical and scientific discovery with Gemini Deep Think | blog DeepMind | 2026-04-xx | https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/ |

---

> Este artigo foi gerado automaticamente por LLM. Pode conter erros.
