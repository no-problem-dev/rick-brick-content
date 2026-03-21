---
title: "Introdução ao Spec-Driven Development — Por que a documentação de especificações se tornou crucial no desenvolvimento impulsionado por IA"
slug: "spec-driven-development-ai-coding"
summary: "À medida que as limitações do 'Vibe Coding' se tornam aparentes, o Spec-Driven Development (SDD), que trata as especificações como 'contratos' para IA, está emergindo como o principal paradigma de ..."
date: "2026-03-18"
tags: ["AI開発","仕様書","SDD","コンテキストエンジニアリング","LLM","Claude Code"]
category: "tech-article"
automated: false
thumbnail: "/images/spec-driven-development.png"
draft: false
---
## Introdução — O fim do idílio do "Vibe Coding"

No início de 2025, Andrej Karpathy, cofundador da OpenAI, propôs o conceito de "Vibe Coding": um estilo de desenvolvimento que envolve lançar prompts sutis para a IA e aceitar o código gerado quase sem modificações. Embora inicialmente aclamado como uma revolução na produtividade, o otimismo não durou.

A realidade revelada pelos dados de pesquisa é dura. Uma pesquisa da Veracode em 2025 descobriu que **45% do código gerado por IA continha vulnerabilidades de segurança**. Uma análise de 470 Pull Requests de código aberto pelo CodeRabbit revelou que o código coescrito por IA tinha **1,7 vezes mais "problemas importantes"** do que o código escrito por humanos, além de 75% mais configurações incorretas e 2,74 vezes mais vulnerabilidades de segurança. Paradoxalmente, uma pesquisa descobriu que desenvolvedores experientes experimentaram uma **diminuição de 19% na produtividade** ao usar ferramentas de codificação de IA (apesar de preverem um aumento de 24%).

Quais são as causas fundamentais dessa situação, apelidada de "ressaca do Vibe Coding"? E qual é o paradigma emergente como solução: **Spec-Driven Development (SDD)**? Este artigo explicará detalhadamente, combinando artigos, estudos de caso corporativos e conhecimento prático.

---

## Razões Estruturais para o Fracasso do Vibe Coding

### O Problema da "IA que não lê mentes"

Um post de blog do GitHub expressa concisamente esse problema: "**LLMs são ótimos em completar padrões, mas não conseguem ler mentes**".

Se você pedir a um assistente de codificação de IA para "criar uma função de login", ele gerará alguma forma de função de login. Mas ela usará OAuth 2.0, como será o gerenciamento de sessão, ela se adequa ao esquema de banco de dados existente, quais são os requisitos de segurança — sem especificar isso, a IA apenas completará o "código que parece certo".

### Problemas de Shadow Bug e Loops de Alucinação

Os problemas gerados pelo Vibe Coding podem ser amplamente divididos em duas categorias:

Uma é o **Shadow Bug** (código que parece correto, mas contém vulnerabilidades graves). O código funciona e os testes passam. No entanto, em certas condições, injeções de SQL podem ocorrer ou a autenticação pode ser contornada. Nesses casos, o problema muitas vezes só se manifesta após entrar em produção.

Outro é o **loop de alucinação**. Em sistemas multiagentes onde vários agentes de IA colaboram, um ciclo vicioso pode surgir onde um agente considera a saída incorreta de outro agente como correta, reforçando os erros um do outro. Sem um "ponto de referência correto" como a documentação de especificações, essa cadeia não pode ser quebrada.

```mermaid
graph LR
    A[Agente A: Implementação incorreta] --> B[Agente B: Revisão]
    B --> C[Aprovado como sem problemas]
    C --> D[Implementação incorreta vai para produção]
    D --> E[É tarde demais quando o bug é encontrado]
```

### Perda de Contexto e Inconsistência Arquitetural

O contexto é redefinido a cada sessão na conversa com a IA. A IA na próxima sessão não saberá que na conversa anterior foi decidido "implementar a autenticação usando JWT". Ao lidar com várias conversas ou vários agentes de IA, o projeto arquitetural geral se fragmenta, resultando em um sistema inconsistente onde uma parte usa REST e outra usa GraphQL.

---

## O que é Spec-Driven Development?

### Definição e Princípios Fundamentais

Spec-Driven Development (SDD) é um paradigma de desenvolvimento que **define especificações claras (Specs) como "contratos" para a IA, e gera código com base nesses contratos**.

Thoughtworks descreve isso da seguinte forma: "SDD usa especificações de requisitos explícitas como prompts para que os agentes de IA gerem código executável. As especificações definem explicitamente comportamentos externos (mapeamento de entrada/saída, pré-condições/pós-condições, invariantes, restrições, tipos de interface)".

O princípio de "**Investir uma hora em planejamento pode economizar dez horas de refatoração depois**" (Thoughtworks) é mais aplicável do que nunca no desenvolvimento impulsionado por IA.

### Comparação: Vibe Coding vs SDD

| Aspecto | Vibe Coding | Spec-Driven Development |
|:-----|:------------|:------------------------|
| Principal portador de informação | Conversa/Prompt | Arquivo de especificação |
| Persistência de contexto | Apenas dentro da sessão | Persistente (salvo como arquivo) |
| Registro de decisões de design | Nenhum (implícito) | Explicitamente documentado |
| Instrução para a IA | Prompt a cada vez | Referenciar a especificação |
| Objeto de revisão | Código | Especificação (primeiro) -> Código (depois) |
| Escala | Individual/Pequena escala | Equipe/Sistema de produção |

### Processo de 4 Fases do SDD

O **Spec Kit** (Licença MIT), lançado pelo GitHub em setembro de 2025, é um kit de ferramentas de código aberto para praticar SDD. Seu design define 4 fases:

**Specify (Definição de Especificações)**: Define jornadas do usuário e critérios de sucesso. A IA gera um rascunho de `requirements.md`, mas os humanos revisam e confirmam.

**Plan (Planejamento Técnico)**: Declara arquitetura, pilha tecnológica e restrições. A IA propõe `design.md`, e os humanos tomam as decisões.

**Tasks (Desagregação de Tarefas)**: Divide em unidades de trabalho pequenas e revisáveis. A IA gera `tasks.md`.

**Implement (Implementação)**: Os agentes de IA implementam as tarefas enquanto os humanos verificam em cada ponto de controle.

O ponto crucial deste processo é que cada fase tem um **ponto de controle explícito**. É uma transição do fluxo de trabalho "Prompt and Pray" para "Specify and Verify".

---

## O que os Artigos Revelaram

### Estudo Empírico de "Beyond the Prompt: Cursor Rules" (arXiv:2512.18925)

Um estudo conduzido por Shaokang Jiang e Daye Nam, pesquisadores da Microsoft e GitHub, é o primeiro estudo empírico em larga escala a analisar arquivos `.cursorrules` em 401 repositórios de código aberto (apresentado no MSR 2026).

A taxonomia estabelecida por este estudo classifica a provisão de contexto para assistentes de codificação de IA em 5 temas:

| Tema | Conteúdo |
|:-------|-----|
| Convenções | Estilo de código, regras de nomenclatura, formatação |
| Diretrizes | Padrões arquiteturais, melhores práticas |
| Informações do Projeto | Pilha tecnológica, dependências, estrutura de diretórios |
| Diretivas de LLM | Instruções de ação diretas para a IA (o que fazer/não fazer) |
| Exemplos | Exemplos concretos de padrões de código esperados |

A descoberta importante é que "**não apenas os prompts, mas também as diretivas persistentes legíveis por máquina determinam a eficácia da IA**". Arquivos de contexto persistentes como `.cursorrules` ou `CLAUDE.md`, em vez de prompts temporários, são o que ditam a qualidade dos assistentes de codificação de IA.

### "Promptware Engineering": Gerenciamento do Ciclo de Vida das Especificações (arXiv:2503.02400)

O artigo "Promptware Engineering" aponta que o desenvolvimento de prompts atual está em uma "crise de promptware dependente de tentativa e erro" (aceito no ACM TOSEM).

A solução proposta é tratar prompts (especificações) como "artefatos de software" e gerenciá-los ao longo do seguinte ciclo de vida:

```
Definição de requisitos → Design → Implementação → Teste → Debug → Evolução → Implantação → Monitoramento
```

As especificações devem ser tratadas de forma semelhante ao código, sujeitas a "controle de versão, testes e melhoria contínua".

### 10 Diretrizes para Prompts de Geração de Código (arXiv:2601.13118)

Identificada por meio de uma pesquisa com 50 profissionais, a descoberta mais interessante deste estudo é que "**a utilidade percebida e a frequência de uso real não coincidem**".

Os profissionais sabem que "especificar entradas e saídas" e "definir pré/pós-condições" são úteis, mas na prática não os utilizam. O SDD tenta resolver essa lacuna de "saber, mas não fazer" incorporando-a como um fluxo de trabalho.

### Desagregação de Tarefas Multiagentes e Proteção de Consistência (arXiv:2511.01149)

O artigo "Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems" propõe um método para incorporar **análise de restrições e mecanismos de proteção de consistência** durante a agregação de tarefas.

Ele detecta conflitos entre subtarefas antecipadamente e evita "loops de alucinação" em ambientes multiagentes. Isso corresponde diretamente à abordagem defendida pelo SDD de "tornar as especificações a linguagem comum entre os agentes".

---

## Engenharia de Contexto: Além das Especificações

### De "Prompt Engineering" para "Context Engineering"

Em setembro de 2025, a Anthropic definiu a evolução desse conceito em um artigo chamado "Effective Context Engineering for AI Agents".

**Context Engineering** é "maximizar a probabilidade de um resultado desejado com um conjunto mínimo de tokens de alto sinal". Se o Prompt Engineering é a tecnologia para "otimizar interações pontuais entre humanos e LLMs", o Context Engineering é a tecnologia para "**projetar o fluxo de informações entre agentes e o ambiente como um todo**".

A Anthropic alerta para o fenômeno de "**corrupção de contexto**" à medida que as janelas de contexto se expandem. Quanto mais longo o contexto, maior o risco de o LLM não conseguir recordar com precisão as informações posteriores. Simplesmente passar "leia todas as especificações" para a IA não é suficiente; é necessário um projeto que **forneça as informações necessárias no momento necessário**.

### 4 Tecnologias Recomendadas

As 4 tecnologias de gerenciamento de contexto recomendadas pela Anthropic são:

**Recuperação Just-in-Time**: Em vez de passar todas as especificações de uma vez, injetar dinamicamente apenas as informações necessárias para a tarefa.

**Compactação do Histórico de Conversa**: Resumir e comprimir conversas longas para manter a qualidade do contexto.

**Tomada de Notas Estruturada**: Registrar decisões e descobertas importantes de forma estruturada para que possam ser referenciadas em chamadas posteriores de IA.

**Arquitetura de Subagentes**: Dividir em agentes especializados e minimizar o contexto de cada agente.

### Princípios de Design para AGENTS.md / CLAUDE.md

"How to Write a Great agents.md" do GitHub (baseado em mais de 2.500 análises de repositórios) define 6 áreas principais para arquivos de contexto eficazes:

```
1. Comandos — Comandos para executar build, teste, lint
2. Testes — Como executar testes e saídas esperadas
3. Estrutura do Projeto — Estrutura de diretórios e papéis de cada arquivo
4. Estilo de Código — Convenções de formatação, regras de nomenclatura
5. Fluxo de Trabalho Git — Estratégia de branch, convenções de mensagens de commit
6. Limites — Sempre executar / Pré-verificar / Proibir
```

No entanto, é importante notar que um estudo de 2026 da ETH Zurich apontou que "arquivos de contexto gerados por LLM têm um efeito marginalmente negativo na taxa de sucesso da tarefa". A melhor prática atual é considerar que os arquivos de contexto devem ser "limitados a informações que não podem ser inferidas por ferramentas ou código existente".

---

## Prática: 6 Elementos Essenciais nas Especificações do SDD

As especificações criadas no SDD devem incluir os seguintes 6 elementos:

**1. Histórias de Usuário e Stakeholders**
Descrever claramente "quem", "para que finalidade" e "o quê" é necessário.

**2. Critérios de Sucesso Mensuráveis**
Definir quantitativamente, em vez de "melhorar o desempenho", como "LCP abaixo de 2,5 segundos".

**3. Requisitos Funcionais e Não Funcionais**
Descrever "o que fazer" e também "o que não fazer" (restrições explícitas).

**4. Contexto Técnico e Pontos de Integração**
Especificar interfaces com sistemas existentes, APIs e bibliotecas a serem usadas.

**5. Pré-condições, Pós-condições e Invariantes**
Definir formalmente as restrições lógicas que funções, módulos e sistemas devem satisfazer.

```markdown
## API de Registro de Usuário (POST /api/users)

### Pré-condições
- O endereço de e-mail não está registrado
- A senha tem pelo menos 8 caracteres

### Pós-condições
- O usuário é salvo no banco de dados
- Um e-mail de confirmação é enviado
- O JWT está incluído na resposta

### Invariantes
- A senha deve ser salva com hash (não texto plano)
- O endereço de e-mail deve ser normalizado para minúsculas
```

**6. Testes de Aceitação**
Descrever "quando está completo" de forma verificável. A IA usará isso como ponto de referência para o código de teste.

### A Importância de Especificar "Proibições"

Como aponta antirez, autor do Redis, é importante incluir "dicas sobre soluções ruins que parecem boas" nas especificações.

```markdown
## Padrões Proibidos
- Uso de variáveis globais (usar injeção de dependência em vez disso)
- Controle assíncrono com setTimeout (usar Promises)
- Casting para o tipo any (usar inferência de tipo ou union)
- Acesso direto ao banco de dados (sempre passar pela camada de repositório)
```

### Mudança de Paradigma de Debugging

Em SDD, depurar significa **modificar as especificações**, em vez de corrigir o código. Bugs no código são sintomas de lacunas nas especificações; modificar as especificações propagará uma correção consistente para todo o código gerado.

---

## O Futuro Apontado pelo Relatório de Tendências de 2026 da Anthropic

O "2026 Agentic Coding Trends Report" da Anthropic, publicado em janeiro de 2026, relata que o desenvolvimento de software está passando pela "**maior transformação desde a GUI**".

O papel do engenheiro está mudando de "quem escreve código" para "coordenador de agentes de IA". No entanto, o relatório também apresenta um aviso importante: **tarefas totalmente delegáveis representam apenas cerca de 0 a 20% do total**, e o restante requer supervisão ativa, verificação e julgamento humano.

As prioridades estratégicas listadas para 2026 incluem:
- Domínio da coordenação multiagente
- Escalada da supervisão humano-agente
- Incorporação de arquitetura de segurança

O que este relatório demonstra é que SDD não é apenas "como escrever especificações", mas sim **a infraestrutura organizacional e técnica para a colaboração segura entre agentes de IA e humanos**.

---

## Conclusão: As Especificações São Mais Importantes Que o Código?

A proposição apresentada pelo SDD é provocadora: **as especificações são o artefato de engenharia mais importante**.

Tradicionalmente, "escrever código" era o principal trabalho do engenheiro. Em um mundo onde a IA pode escrever código, "definir o que deve ser escrito" se torna o valor central do engenheiro.

"A IA pode escrever código. No entanto, definir 'o que deve ser construído' ainda é trabalho humano" - essa mudança de percepção é o primeiro passo para o sucesso no desenvolvimento impulsionado por IA.

O princípio de "Investir uma hora em planejamento pode economizar dez horas de refatoração" é um dos investimentos com maior retorno em 2026. A diversão intuitiva do Vibe Coding pode ter desaparecido. No entanto, com SDD, podemos recuperar a **confiabilidade e a previsibilidade** do código gerado pela IA.

---

## Referências

| Título | Fonte | Data | URL |
|:---------|:-------|:-----|:----|
| Beyond the Prompt: An Empirical Study of Cursor Rules | MSR 2026 / arXiv | 2025-12-21 | https://arxiv.org/abs/2512.18925 |
| Promptware Engineering: Software Engineering for Prompt-Enabled Systems | ACM TOSEM / arXiv | 2025-03-04 | https://arxiv.org/abs/2503.02400 |
| Guidelines to Prompt LLMs for Code Generation | arXiv | 2026-01-19 | https://arxiv.org/abs/2601.13118 |
| Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems | arXiv | 2025-11-03 | https://arxiv.org/abs/2511.01149 |
| Context Engineering for AI Agents in Open-Source Software | arXiv | 2025-10-24 | https://arxiv.org/abs/2510.21413 |
| Effective Context Engineering for AI Agents | Anthropic Engineering | 2025-09-29 | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents |
| 2026 Agentic Coding Trends Report | Anthropic | 2026-01-21 | https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf |
| Spec-Driven Development with AI: Get Started with a New Open Source Toolkit | GitHub Blog | 2025-09-02 | https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/ |
| How to Write a Great agents.md: Lessons from Over 2,500 Repositories | GitHub Blog | 2025-11-19 | https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/ |
| Spec-Driven Development: Unpacking One of 2025's Key New AI-Assisted Engineering Practices | Thoughtworks | 2025-11 | https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices |
| My LLM Coding Workflow Going into 2026 | Addy Osmani | 2025-12 | https://addyosmani.com/blog/ai-coding-workflow/ |
| How to Write a Good Spec for AI Agents | Addy Osmani | 2025-10 | https://addyosmani.com/blog/good-spec/ |
| Coding with LLMs in the Summer of 2025 | antirez | 2025-07 | https://antirez.com/news/154 |
| Vibe Coding: Pros, Cons, and 2026 Forecasts | PVS-Studio | 2025-12 | https://pvs-studio.com/en/blog/posts/1338/ |
| The Evidence Against Vibe Coding: What Research Reveals About AI Code Quality | SoftwareSeni | 2026 | https://www.softwareseni.com/the-evidence-against-vibe-coding-what-research-reveals-about-ai-code-quality/ |
| Spec-Driven Development with AI Coding Agents: The Workflow Replacing "Prompt and Pray" | Java Code Geeks | 2026-03 | https://www.javacodegeeks.com/2026/03/spec-driven-developmentwith-ai-coding-agents-the-workflow-replacingprompt-and-pray.html |

---

> Este artigo foi gerado automaticamente por LLM. Pode conter erros.
