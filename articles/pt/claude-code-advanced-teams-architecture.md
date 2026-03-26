---
title: "Arquitetura Prática do Claude Code — Padrões de Design para Acelerar o Desenvolvimento com Teams/Subagents"
slug: "claude-code-advanced-teams-architecture"
summary: "Exploração avançada de pads de design multiagentes no Claude Code, incluindo Star Topology, DAG, regras 80/20, otimizações CLAUDE.md e controle determinístico por Hooks, com exemplos oficiais da An..."
date: "2026-03-26T00:10"
tags: ["Claude Code","IA","Multiagentes","Anthropic","Times"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-advanced-teams-architecture.png"
draft: false
---
# Arquitetura Prática do Claude Code — Padrões de Design para Acelerar o Desenvolvimento com Teams/Subagents

Ao usar o Claude Code diariamente, inevitavelmente confrontamos a "barreira da sessão única". Durante refatorações complexas, o contexto se degrada e surgem propostas contraditórias. Quando tarefas paralelas de grande escala são lançadas, a conversa fica pesada e a precisão do raciocínio diminui. A solução para esses gargalos é o design multiagentes utilizando Subagents e Agent Teams.

Este artigo explica, para engenheiros que dominam o uso cotidiano do Claude Code, a "por que" de certas configurações serem eficazes e a "como" de implementar esses padrões na prática.

---

## 1. Por que é necessário um design multiagente — limites de uma sessão única

### Fundamentação científica da degradação de contexto

Addy Osmani afirmou em seu blog:

> "Os LLMs apresentam desempenho pior à medida que o contexto se expande"

Não se trata apenas de uma limitação de tokens. Quando informações irrelevantes se acumulam na janela de contexto, a "atenção" do modelo se dispersa, reduzindo a qualidade do raciocínio. A ocorrência de propostas contraditórias pelo Claude em sessões longas é consequência desse mecanismo.

Pesquisas da Anthropic sobre multiagentes confirmam que, em comparação com uma única sessão Opus 4, uma configuração onde Opus 4 lidera e Sonnet 4 serve como subagente registra uma melhora de **90,2%** na performance. A mudança para uma arquitetura multiagentes teve um impacto maior do que simplesmente atualizar para um modelo superior.

O estudo mostrou ainda que três fatores — uso de tokens, chamadas a ferramentas e seleção de modelos — explicam 95% das variações de performance. Ou seja, tentar colocar tudo em uma única sessão prejudica esses três aspectos.

### O que muda com um sistema multiagente

```markdown
【Sessão única】
 - Todo o contexto (exploração, implementação, teste, debug) acumula-se em uma única janela
 - A partir do meio da sessão, a qualidade do raciocínio diminui

【Design multiagente】
 - Cada agente foca em "sua área de responsabilidade"
 - Cada janela permanece otimizada
```

A funcionalidade Agent Teams, lançada em fevereiro de 2026, concretiza essa filosofia. Múltiplas instâncias do Claude Code operam independentemente com janelas de contexto separadas, colaborando através de uma lista de tarefas compartilhada e uma caixa de entrada.

---

## 2. Topologia em Estrela — Arquitetura de três camadas Leader/Advisor/Teammate

### Filosofia de design

A decisão-chave no Agent Teams é a "forma de fluxo de informação". Em vez de uma topologia mesh, onde todos comunicam entre si, adota-se a **Star Topology** — todos comunicam via líder — para evitar contradições e dispersão de informações.

```
Líder (Opus)
    ↕ Consulta de especificações e destilação de informações
Conselheiro (Sonnet) ── Leitura e destilação de documentos/código
    ↓
Companheiros (Sonnet × N) ── Focam na implementação
```

O líder atua como o "intercâmbio" de informações, não só como ponto de coleta. Sua responsabilidade é determinar o que manter e descartar, direcionando toda a equipe.

### O que o líder faz / não faz

| Faz | Não faz |
|---|---|
| Divide tarefas e gerencia dependências | Codifica diretamente |
| Verifica qualidade (testes, tipo) | Consulta diretamente especificações |
| Dá feedback ao jogador | Tem uma visão geral do código |
| Gerencia progresso e identifica gargalos | Permite ajustes diretos entre colegas |

Essa paradoxal força do Star Topology é que, ao não ler a especificação, o líder mantém seu foco exclusivo no gerenciamento e na garantia de qualidade.

### Fase do Conselheiro — especialista em destilação

O conselheiro é o "especialista em destilação". Ele lê muitos documentos e código, extraindo informações estruturadas necessárias ao líder.

```
Líder: "Me diga as especificações necessárias para a implementação do T04, incluindo tipos e critérios de definição de pronto"
       ↓
Conselheiro: Analisa spec/ e devolve uma versão destilada para o líder
       ↓
Líder: Transmite ao colega na equipe via mensagem
```

**Restrição do conselheiro**: leitura apenas. Ele não escreve nem edita arquivos, preservando a consistência do fluxo de informações.

### Princípios do funcionamento do colega

A regra mais importante é "não ler a especificação" diretamente. Isso evita interpretações divergentes.

Implementação:

1. Implementar somente seguindo instruções do líder (sem funcionalidades adicionais)
2. Confirmar dúvidas com o líder, sem adivinhações
3. Relatar progresso incluindo mudanças, testes e problemas pendentes
4. Não ler arquivos em `spec/` — o líder transmite a informação necessária

### Restrição de fluxo de informação

```plaintext
【Permissões】
Líder ↔ Conselheiro: consulta e destilação
Líder → Colega: instruções de implementação / feedback
Colega → Líder: relatórios e perguntas

【Proibido】
Colega → Colega | Conselheiro → Colega | Líder → spec/ (leitura direta)
```

### Por que essa configuração funciona?

Dados da Anthropic mostram que "escolha do modelo" é o fator mais impactante na performance. Agrupar Opus como líder e usar múltiplos Sonnet como colegas paralelos gera ganhos de eficiência e qualidade.

Essa arquitetura também minimiza contradições de informação, centralizando a comunicação em um único hub.

---

## 3. Planejamento de tarefas baseado em DAG — A ciência da paralelização

### Gerenciamento de tarefas com DAG

O sistema de tarefas é um **Directed Acyclic Graph (DAG)** — um grafo direcionado acíclico — permitindo modelar dependências explícitas.

```json
{
  "tarefas": [
    { "id": "T01", "nome": "Design de esquema de autenticação", "dependências": [] },
    { "id": "T02", "nome": "Implementar endpoints API", "dependências": ["T01"] },
    { "id": "T03", "nome": "Implementar front-end", "dependências": ["T01"] },
    { "id": "T04", "nome": "Testes de integração", "dependências": ["T02", "T03"] }
  ]
}
```

Tarefas T02 e T03 podem rodar em paralelo, T04 aguarda ambas.

### Padrão de execução por ondas

Agrupar tarefas por dependência em "ondas" maximiza a paralelização respeitando as dependências.

```plaintext
Onda 1: Pesquisa e planejamento (todas paralelas)
 ├─ Equipe A: Avaliação do front-end
 ├─ Equipe B: Avaliação da API
 └─ Equipe C: Planejamento de testes

Onda 2: Implementação (arquivos separados)
 ├─ Equipe A: Front-end (src/components/)
 └─ Equipe B: API (src/api/)

Onda 3: Testes de integração (sequencial)
 └─ Equipe C: Execução e validação
```

A ideia é garantir que tarefas dentro da mesma onda não dependam umas das outras.

### Princípios de sizing das tarefas

| Tamanho | Problemas |
|---|---|
| Pequenas demais (menos que um arquivo) | Sobrecarga de coordenação supera o ganho |
| Grandes demais (mais de uma semana) | Risco de atrasos e alterações frequentes |
| Adequadas | Entregas autossuficientes e claras |

Geralmente, 5-6 tarefas por colega é um bom padrão para evitar perda de contexto.

### Prevenção de conflitos de arquivo

No projeto do compilador da Anthropic, um sistema de lock em `.lock` files e o controle via Git evitam concorrência.

```bash
# Reivindicar tarefa
echo "$AGENT_ID" > current_tasks/task-$TASK_ID.lock
git add current_tasks/task-$TASK_ID.lock
git commit -m "claim: task-$TASK_ID"
```

Permite que vários agentes trabalhem sem conflitos.

### Automatização da garantia de qualidade

Hooks como `TaskCompleted` e `TeammateIdle` garantem execução de verificações automáticas.

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "./.claude/hooks/quality-gate.sh"
      }]
    }],
    "TeammateIdle": [{
      "hooks": [{
        "type": "command",
        "command": "./.claude/hooks/verify-output.sh"
      }]
    }]
  }
}
```

Exemplo de script para garantir testes, lint e build:

```bash
#!/bin/bash
set -e
npm test || { echo "Falha nos testes" >&2; exit 2; }
npm run lint || { echo "Falha no lint" >&2; exit 2; }
npm run build || { echo "Falha na build" >&2; exit 2; }
exit 0
```

Assim, garante-se automação na qualidade.

---

## 4. Técnica de gerenciamento de contexto — Regras 80/20 e além

### Regra 80/20

Priorizar o que realmente importa:

> Não usar os últimos 20% do contexto em tarefas complexas

Em janelas de 200K tokens, ao atingir 83.5%, a qualidade começa a cair. Monitorar o uso de tokens e reagir ao alcançar 70-80% é crucial.

### Estratégias de compactação

Quando fazer:
- Após funcionalidades principais
- Mudanças de exploração para implementação
- Quando o Claude repete questões ou entra em conflito
- Limite natural de tarefas (borda de ondas)

Quando evitar:
- Debugging ativo
- Refatoração complexa

### Isolamento por Subagents

Delegar tarefas de exploração a Subagents garante o isolamento do contexto.

```plaintext
Contexto Principal
 └─ "Investigue o módulo de autenticação"
           ↓ Confie ao Subagent
Contexto do Subagent
 ├─ Ler diretório src/auth/
 ├─ Analisar arquivos de teste
 └─ Traçar dependências

Resumir e enviar ao pai
```

### Estratégia de Sprint de 30 minutos

Dividir tarefas em ciclos de 30 minutos, fazendo compactação ou `/clear` após cada ciclo. Essa abordagem mantém o contexto atualizado e reduz erros.

### Planejamento de contexto do líder

| Estado | Informação mantida pelo líder | O que descartar |
|---|---|---|
| CONCLUÍDO | Id da tarefa, resultado, arquivo | Detalhes de implementação e mensagens inteiras |
| EM ANDAMENTO | Instruções e progresso | Texto completo do requisito (requer nova consulta ao advisor) |
| PENDENTE | Dependências, vaga de onda | Definições de tarefas (consultar ao advisor) |

O ideal é que o líder retenha apenas um resumo do estado, consultando o advisor para detalhes.

---

## 5. Otimização do CLAUDE.md — Como usar seu orçamento de 300 linhas

### Princípio "Less is More"

Pesquisas indicam que a quantidade ideal de instruções para o Claude é 150-200 itens. Como o prompt de sistema do Claude Code já tem cerca de 50, o espaço restante para CLAUDE.md é de aproximadamente 100-150 tópicos.

**Recomendação**: limitar o arquivo a 300 linhas, preferencialmente abaixo de 60.

Longas versões de CLAUDE.md conflitam com a prioridade do modelo em seguir regras importantes, que se perdem em meio ao ruído.

### O que Claude já sabe

Não é eficiente repetir regras que Claude já entende. Evite instruções genéricas como "escreva código limpo" ou "trate erros"; o modelo já faz isso.

**Critérios para incluir uma regra**:
- Se, sem ela, o Claude falhar ou gerar erro, manter.
- Se for informação específica do projeto ou conhecimento geral do modelo, remover.
- Se for algo que muda frequentemente, considere atualizar ao invés de repetir.

### Delegue formatação e verificação

"Nunca envie ao LLM tarefas de formatação ou lint"

Deixe ferramentas como biome, ESLint, TSC cuidarem disso. Use hooks para automatizar e economizar tokens.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "npm run lint --fix && npm run format"
      }]
    }]
  }
}
```

### Padrão de Divulgação Progressiva

Para evitar o crescimento descontrolado do CLAUDE.md, utilize links para detalhes em momentos específicos, mantendo o conteúdo principal enxuto.

```markdown
# CLAUDE.md (Raiz — até 60 linhas)

## Stack tecnológica
- Astro 5.18.0 + Tailwind CSS 4.2.0 + Cloudflare Pages
- TypeScript 5.9.x (modo estrito)

## Comandos
- build: `npm run build`
- verificação de tipos: `npx tsc --noEmit`
- lint: `npm run lint`

## Documentação incremental
- API: @.claude/rules/api-conventions.md
- Git: @.claude/rules/branching.md
- Deployment: @.claude/rules/deployment.md
```

Use `@caminho/arquivo` para importar apenas quando necessário.

### Arquitetura hierárquica do CLAUDE.md

```
~/.claude/CLAUDE.md          # Padrão pessoal global
  ./CLAUDE.md               # Projeto do time
    ./.claude/rules/api.md  # Regras específicas de API
    ./.claude/rules/test.md # Regras para testes
    src/components/CLAUDE.md # Componentes específicos
```

Arquivos em subdiretórios são carregados sob demanda, mantendo o padrão do arquivo principal limpo.

---

## 6. Padrões de Skills — Injeção sob demanda de conhecimento

### Como separar Skills de CLAUDE.md

Skills ficam em `.claude/skills/{skill-name}/SKILL.md`, permitindo carregamento sob demanda.

```
CLAUDE.md → informações essenciais contínuas
  - Stack, regras gerais
Skills → informações específicas de tarefa ou domínio
  - Regras de API, ARN, fluxo de implantação, conhecimento técnico
```

A carga sob demanda evita inflar o CLAUDE.md.

### Convertendo especificações em Skills — Arquitetura em camadas SDD

Projetos grandes dividem o documento em camadas (L0 a L5), cada uma definida como Skill. Assim, as informações são carregadas apenas quando necessárias.

```
.claude/skills/
  spec-l0-core/           # Carregado permanentemente
  spec-l1-1-vision/       # L1: Visão e problema
  spec-l1-6-content-types/ # Classificação de tipos de conteúdo
  spec-l4-1-content-schema/ # Schemas de frontmatter
  spec-l4-3-article/      # Templates e elementos embutidos
  generate-thumbnail/     # Workflow de thumbnails
  common-doc-writer/      # Gerador de documentos
```

Subagentes referenciam skills de modo explícito, sem herança automática, exigindo a declaração na frente do prompt.

### Uso de `context: fork` para execução isolada

Configurar `context: fork` na frontmatter do skill isola a execução, ideal para tarefas como auditoria de código ou análise de segurança em grandes volumes de arquivos.

```yaml
---
name: security-audit
description: Executa auditoria de segurança após alterações no código
context: fork
allowed-tools: Read, Grep, Glob
disable-model-invocation: false
---
```

Esses skills não consomem o contexto do pai e podem manejar vastos volumes de dados.

---

## 7. Hooks para controle determinístico — Garantia automática de qualidade

### De CLAUDE.md a Hooks

Hooks garantem execução definitiva de verificações, ao contrário do guidance mais flexível do CLAUDE.md.

| | CLAUDE.md | Hooks |
|---|---|---|
| Probabilidade de adesão | ~80% | 100% |
| Melhor uso | Orientações gerais | Checks formais, lint, segurança |
| Momento de execução | Início da sessão | Eventos de ciclo de vida |

Coloque regras críticas em Hooks, como "executar lint" empatando o uso de tokens e fortalecendo a garantia.

### Gate de qualidade em Agent Teams

`TeammateIdle` e `TaskCompleted`-hooks automáticos atuam como barreiras de qualidade.

```bash
#!/bin/bash
# verify-output.sh
if ! npm test; then
  echo "Falha nos testes" >&2
  exit 2
fi
if ! npx tsc --noEmit; then
  echo "Erro de tipo" >&2
  exit 2
fi
echo "Qualidade OK" >&2
exit 0
```

O uso de `exit 2` bloqueia o progresso até que o problema seja resolvido, ativando um ciclo de feedback automático.

### Controle de segurança — Bloqueio de comandos perigosos

```bash
#!/bin/bash
# block-dangerous.sh
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS_PATTERNS=("rm -rf /" "DROP TABLE" "git push --force.*main" "chmod 777")

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "Comando perigoso bloqueado: $pattern" >&2
    exit 2
  fi
done
exit 0
```

Permite bloquear comandos destrutivos com feedback imediato ao Claude.

### Códigos de saída

- `exit 0`: aceita
- `exit 2`: bloqueia e envia feedback ao Claude
- Outros: erros sem bloqueio

O uso do `exit 2` é poderoso por passar a razão do bloqueio ao modelo, possibilitando autoajuste.

---

## 8. Casos práticos — Na vanguarda da Anthropic e da indústria

### Projeto de compilador C na Anthropic: 16 agentes, 10 mil linhas de Rust

A Anthropic usou sua arquitetura para desenvolver um compilador C completo, com 16 agentes paralelos, processando 200 milhões de tokens, gerando código Rust e compilando no Linux.

- Cada agente em containers Docker isolados
- Controle de concorrência por arquivos `.lock`
- Especialização em tarefas específicas, como eliminação de redundâncias e otimizações

Lição chave: "Sem verificadores de testes quase perfeitos, Claude resolve problemas errados". A qualidade do teste define o sucesso.

### Pesquisa com multiagentes — Crescimento de 15x na eficiência

Dados da pesquisa da Anthropic demonstram que o sistema multimo agente usando Opus + Sonnet alcançou uma melhora de **90,2% na performance** com um uso de tokens 15 vezes maior do que uma única instância.

Importante: O impacto do design robusto supera o de atualizar os modelos sozinho.

### Exemplos de prompts

```plaintext
Revise o PR #142 por Agent Team, gerando revisores para:
- Segurança: autenticação, níveis de acesso, exposição de segredos
- Performance: consultas ao banco, problemas N+1, cache
- Testes: cobertura, casos extremos, mocks
Os revisores atuam de forma independente e enviam feedback ao líder para uma visão consolidada.
```
```plaintext
Investigue o erro de tela branca após login com 5 agentes:
- Auth: validade de JWT
- State: gerenciamento de estado
- Route: redirecionamentos infinitos
- Error: erros não visíveis
- Network: respostas assíncronas
Cada agente busca evidências e contradiz hipóteses concorrentes, convergindo para a causa principal.
```

### Doctolib: Aceleração de 40% na entrega de features

O Doctolib substituiu seu sistema legado por Claude Code, automatizando testes e deploys, atingindo uma velocidade de liberação 40% maior, e garante maior confiabilidade.

Atualmente, 86% das organizações usam agentes para código em produção, confiando em testes, revisões e hooks automáticos para garantir qualidade.

---

## 9. Anti-padrões e aprendizados com falhas

### Sessões de cozinha — Contaminação do contexto

**Problema**: executar tarefas desconexas na mesma sessão degrada a qualidade.

**Causa**: informações irrelevantes acumuladas, resultados poluídos.

**Solução**: usar `/clear` frequentemente; iniciar novas sessões para tarefas distintas.

### Repetição de erros — Acúmulo de contexto errado

**Problema**: Claude repete erros, não melhora apesar de correções.

**Causa**: tentativas fracassadas permanecem no contexto.

**Solução**: após duas tentativas falhas, `/clear` e recomeçar do zero, explicando claramente o objetivo.

### uso de Agent Teams — Custo/benefício

Para tarefas simples, usar muitos agentes aumenta o consumo de tokens, chegando a um fator 15. Evite aplicar Agent Teams indiscriminadamente.

### Perda de contexto na transferência

Ao passar entre agentes, pode-se perder informações cruciais, dificultando ajustes finos na coordenação.

**Recomendação**: incluir na passagem de tarefas o "por que" e "para que" de cada decisão.

### Problemas de convergência — Bugs em massa

Na compilação do Linux com 16 agentes, todos entraram em um ciclo de correção mútua de um mesmo bug, travando o progresso.

**Solução**: dividir tarefas em unidades menores, definir claramente limites de responsabilidade.

### Falta de testes — Qualidade sem garantia

Agentes otimizam para sucesso mensurável. Sem testes de qualidade robustos, podem gerar implementações incorretas.

### Mito de eficiência — Mais agentes sempre melhor?

Mais agentes implicam maior complexidade, custos e riscos de deadlocks ou perda de contexto. O sucesso vem do projeto bem planejado, não de simplesmente aumentar o número de agentes.

---

## 10. Roteiro de implementação — Do fase 1 à fase 4

### Fase 1: Preparo básico

- Gerar automaticamente CLAUDE.md com até 300 linhas focadas
- Remover regras redundantes e configurá-lo com hooks automáticos
- Garantir que o sistema já funciona com essas otimizações

### Fase 2: Uso de Subagents

- Definir agentes de leitura especializada para tarefas específicas
- Delegar tarefas de investigação e análise complexa
- Utilizar `context: fork` para execução isolada

```yaml
---
name: code-reviewer
description: Analisa código sob aspectos de segurança, legibilidade, performance e testes
tools: Read, Grep, Glob
model: sonnet
---

Realiza revisão em detalhes, retorna prioridades e recomendações.
```

- Objetivo: investigar sem consumir o contexto principal.

### Fase 3: Escalar com Agent Teams

- Iniciar com tarefas de leitura a partir de 3-5 parceiros
- Ativar hooks de qualidade automática
- Monitorar e ajustar o tamanho das tarefas

Objetivo: revisões automáticas e escaláveis, com feedback contínuo.

### Fase 4: Orquestração avançada

- Definir orchestrator com planos de ação, dependências e ondas
- Criar agentes especializados para leitura, implementação e validação
- Usar DAGs e ondas para gerenciar projetos complexos

Exemplo de plano:

```markdown
# FeatureX Orchestrator

## Estrutura de time
- Líder: Opus (gestão e validação)
- Conselheiro: Sonnet (especificações)
- Membros: Sonnet × 3 (implementação)

## Planejamento de ondas
Onda 1: T01 — desenho do banco de dados
Onda 2: T02 + T03 — implementação paralela
Onda 3: T04 — testes e validação
```

Finalidade: maximizar autonomia, garantir qualidade e manter o controle.

---

## Conclusão — A essência do design

O uso avançado do Claude Code se resume a um princípio central: o "design de contexto". Cada decisão — quem sabe o quê, o que manter ou descartar, como paralelizar — impacta toda a eficiência, custo e clareza do sistema.

Topologia em Estrela garante a integridade das informações; DAG otimiza dependências e execução paralela; regras 80/20 mantêm o contexto fresco — todos componentes que consolidam essa estratégia.

A experiência da Anthropic na construção do compilador e na pesquisa demonstra: um bom design de contexto, aliado a verificadores de testes e ambientes isolados, é a chave para conquistas em escala.

Comece com a fase 1, ajustando ao seu ritmo, e avance até o estágio 4. O potencial do design multiagentes é maior do que você imagina, e pode transformar a sua rotina com Claude Code.

---

> Este artigo foi gerado automaticamente por LLM. Pode conter erros.
