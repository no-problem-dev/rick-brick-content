---
title: "Guia Completo do Claude Code — Compreendendo Sistematicamente todas as funções do Agente de Codificação AI"
slug: "claude-code-complete-beginners-guide"
summary: "Guia completo para iniciantes que explica instalação, CLAUDE.md, Skills, Subagents, Agent Teams, Hooks, MCP e gestão de contexto com informações atualizadas até março de 2026."
date: "2026-03-26T00:10"
tags: ["Claude Code","IA","Ferramentas de Desenvolvimento","Anthropic","Agentes"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-complete-beginners-guide.png"
draft: false
---
## Introdução — O que é o Claude Code

Em fevereiro de 2025, a Anthropic lançou o **Claude Code**, que revolucionou o conceito de ferramentas de codificação AI. Vai além de sugestões simples, realizando tarefas autônomas, como leitura e escrita de arquivos, execução de comandos, operações com git e criação de PRs.

### Diferenças em relação às simples sugestões de código

Antes, as principais ferramentas de codificação AI focavam em "sugestões de código": prever o próximo trecho de código com base na posição do cursor e o desenvolvedor decidia aceitar ou não. São ótimas para sugestões, mas apenas "propostas".

Claude Code supera esse modelo. Ao instruir "escreva testes para este sistema de autenticação, execute, corrija se falhar", Claude Code lê arquivos, gera testes, executa, analisa erros, ajusta o código e repete automaticamente esse ciclo.

```bash
# Geração e correção automática de testes
claude "escreva testes para o módulo de autenticação, execute e corrija quaisquer falhas"

# Monitoramento de logs em tempo real
tail -200 app.log | claude -p "Me avise no Slack se detectar anomalias"

# Revisão de segurança
git diff main --name-only | claude -p "Revise esses arquivos alterados para questões de segurança"
```

### Ambiente de funcionamento

Claude Code é compatível com diferentes ambientes:

| Ambiente | Método |
|---------|---------|
| Terminal | comando `claude` (CLI) |
| VS Code / Cursor | Extensão |
| IDE JetBrains | Plugin |
| Aplicativo desktop | Claude Desktop |
| Navegador | claude.ai |

Na maioria, os desenvolvedores usam o comando `claude` no terminal. Executando no diretório raiz do projeto, inicia uma sessão com acesso ao código completo.

### Evolução das funcionalidades

Desde o lançamento em fevereiro de 2025, Claude Code ganhou recursos rapidamente.

| Funcionalidade | Data de lançamento |
|----------------|---------------------|
| Lançamento do Claude Code | Fevereiro de 2025 |
| Integração MCP | Novembro de 2024 |
| Subagents (Subagentes) | Julho de 2025 |
| Hooks (Ganchos) | Setembro de 2025 |
| Skills (Habilidades) | Outubro de 2025 |
| Agent Teams (Equipes de Agentes) | Fevereiro de 2026 |

Até março de 2026, Claude Code evolui para uma plataforma que pode ser chamada de "Sistema Operacional de Codificação AI". Este artigo explica essas funções de forma estruturada.

---

## Instalação e Configuração Inicial

### Como instalar

#### macOS / Linux / WSL (recomendado)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Esse método instala nativamente e atualiza automaticamente em segundo plano.

#### PowerShell no Windows

```powershell
irm https://claude.ai/install.ps1 | iex
```

No Windows, é necessário Git for Windows.

#### Homebrew (macOS)

```bash
brew install --cask claude-code
```

Ao usar Homebrew, a atualização não ocorre automaticamente. Execute periodicamente `brew upgrade claude-code`.

### Primeira execução e autenticação

Após instalar, navegue até o diretório do projeto e execute:

```bash
cd seu-projeto
claude
```

Na primeira execução, será solicitada autenticação. Após login, aparecerá uma tela de chat interativo, pronto para dar comandos ao projeto.

### Comandos básicos

Memorize esses comandos comuns:

| Comando | Descrição |
|---------|--------------|
| `claude` | Início de sessão interativa |
| `claude -p "prompt"` | Execução não interativa (para CI/CD) |
| `claude --continue` | Retomar última sessão |
| `claude --resume` | Retomar sessão anterior escolhida |
| `/init` | Gerar CLAUDE.md automaticamente |
| `/clear` | Resetar o contexto |
| `/compact` | Compactar o contexto |
| `/memory` | Ver/editar CLAUDE.md e memórias |
| `/agents` | Gerenciar Subagents |
| `/hooks` | Ver configurações de hooks |
| `/permissions` | Gerenciar permissões |
| `/skills` | Ver skills |

---

## CLAUDE.md — Como projetar a "memória" do projeto

### O que é o CLAUDE.md?

Claude Code lê sempre o arquivo Markdown **CLAUDE.md** ao iniciar uma sessão. É um documento que descreve regras de codificação, fluxo de trabalho, arquitetura, decisões — funcionando como uma "memória persistente".

É como passar uma documentação de regras de equipe para um novo engenheiro — a ferramenta lê esse documento antes de trabalhar.

### Como organizar

O CLAUDE.md pode existir em 3 escopos diferentes:

| Escopo | Localização | Destino | Compartilhado com equipe |
|---------|--------------|---------|------------------------|
| Política da organização | `/etc/claude-code/CLAUDE.md` (Linux) | Todos usuários | TI/Segurança |
| Projeto | `./CLAUDE.md` ou `./.claude/CLAUDE.md` | Participantes do projeto | git |
| Usuário | `~/.claude/CLAUDE.md` | Todos projetos | pessoal |

Quando vários existem, a prioridade é pela maior especificidade. Políticas da equipe ficam na raiz do projeto; preferências pessoais no diretório do usuário.

### O que escrever?

Recomenda-se escrever apenas o que Claude não consegue inferir. Evite:

- Comandos Bash que Claude não entenda
- Estilos de código fora do padrão
- Detalhes de testes específicos (link para documentação está OK)
- Convenções de branch ou regras internas rápidas
- Decisões arquiteturais específicas não-padrão
- Variáveis de ambiente obrigatórias
- Listas de arquivos do projeto

Exemplo:

```markdown
# Exemplo de CLAUDE.md do projeto

## Estilo de código
- Usar ES modules (import/export); require não
- Preferir desestruturação em importações

## Workflow
- Executar verificação de tipos após mudanças: `npx tsc --noEmit`
- Testes: focar em arquivo específico

## Comandos
- build: `npm run build`
- test: `npm test`
- lint: `npm run lint`

## Avisos
- Guardar segredos em `.env.local`, nunca commitar
- Base de PRs na branch develop (main é proibido push direto)
```

### `/init` para auto geração

Este comando analisa o código e gera um rascunho de CLAUDE.md com regras e procedimentos detectados, que pode ser revisado.

### Dividir regras em múltiplos arquivos

Se o projeto crescer, crie uma pasta `.claude/rules/` com arquivos separados por tópicos:

```
.claude/
  CLAUDE.md
  rules/
    code-style.md
    testing.md
    security.md
    branching.md
```

É possível aplicar regras específicas para padrões de arquivo usando filtros:

```yaml
---
paths:
  - "src/api/**/*.ts"
---
# Regras específicas para APIs
- Validar entrada em endpoints
- Respostas de erro padrão
```

Esses arquivos só carregam ao editar esses padrões.

### Auto Memory

A partir da versão 2.1.59, a funcionalidade **Auto Memory** foi implementada. Claude aprende automaticamente pontos importantes enquanto trabalha, como armadilhas descobertas, decisões de projeto ou comandos usados frequentemente. Essas anotações ficam em `~/.claude/projects/<projeto>/memory/MEMORY.md`.

Visualize ou edite via `/memory`.

---

## Skills — Empacotando fluxos de trabalho reutilizáveis

### O que são Skills?

Skills são blocos de conhecimentos ou tarefas frequentemente usados, empacotados em arquivos `SKILL.md`. São chamadas por `/nome-da-skill` ou detectadas automaticamente.

Exemplo: uma skill que automatiza correções em Issues do GitHub: ela verifica a issue, faz alterações, testa, faz commit e PR automaticamente ao comando `/fix-issue 123`.

O arquivo `SKILL.md` costuma ter uma estrutura YAML inicial com detalhes:

```yaml
---
name: fix-issue
description: >
  Corrige uma issue no GitHub. Usada para issues passados.
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Grep, Bash, Write, Edit
---
GitHub issue $ARGUMENTS será corrigida.

1. Ver detalhes: `gh issue view $ARGUMENTS`
2. Modificar arquivos relacionados
3. Testar a correção
4. Comitar com mensagem descritiva
```

`$ARGUMENTS` é passado na chamada, por exemplo `/fix-issue 123`. Vários argumentos podem ser acessados como `$ARGUMENTS[0]`, `$ARGUMENTS[1]`.

### Campos importantes

| Campo | Significado |
|--------|--------------|
| `name` | nome do comando (máximo 64 caracteres, só minúsculas e hífens) |
| `description` | descrição que Claude usa para decidir uso |
| `disable-model-invocation` | restringe execução por Claude, só por usuário |
| `user-invocable` | se `false`, não aparece no menu |
| `allowed-tools` | ferramentas permitidas |
| `context` | execução com `fork`, isolado |
| `model` | modelo usado, como `sonnet` |
| `effort` | nível de esforço (`low` a `max`) |

### Tipos de skills

**Reference Skills**: conteúdo de documentação ou especificações, carregado sob demanda, para não inflar o CLAUDE.md principal.

**Task Skills**: tarefas específicas como revisão, deploy, etc.

### Controle de disparo

Controlar quem/quando pode invocar skills é feito via frontmatter:

| Configuração | Permite | Bloqueia Claude |
|----------------|-----------|----------------|
| padrão | usuário ou Claude | Claude | 
| `disable-model-invocation: true` | apenas usuário | Claude não |
| `user-invocable: false` | não na interface | Claude |

### Skills embutidas

Claude já vem com algumas skills padrões:

| Skill | Objetivo |
|--------|----------|
| `/batch` | Executar mudanças em lote |
| `/claude-api` | Carregar referência API |
| `/debug` | Analisar logs |
| `/loop` | Repetir prompts |
| `/simplify` | Melhorar código Recentemente modificado |

### Diferença entre CLAUDE.md e Skills

| | CLAUDE.md | Skills |
|---|--------------|---------|
| Carregamento | Sempre ao iniciar | Sob comando ou automático |
| Uso indicado | Regras gerais do projeto | Tarefas específicas reutilizáveis |
| Consumo de contexto | sempre | só quando utilizado |

---

## Subagents — Delegando tarefas a especialistas

### O que são Subagents?

Subagents são agentes independentes especializados, que Claude pode delegar tarefas específicas, cada um com seu próprio contexto, prompt e permissões.

São úteis para: leitura de muitos arquivos, limitar operações de escrita, usar modelos mais leves para economia.

### Quatro benefícios principais

1. Proteção do contexto: subagentes podem explorar arquivos, mas mantêm a memória resumida para o agente principal.
2. Limitar ferramentas: subagentes podem ter apenas leitura, evitando alterações indesejadas.
3. Especialização: criar agentes com conhecimento profundo em domínio (segurança, desempenho, etc.)
4. Economia de custos: distribuir tarefas entre modelos leves e pesados.

### Subagents embutidos

Claude oferece 3 subagentes padrão:

| Agente | Modelo | Uso |
|---------|---------|-----|
| Explorar | Haiku | Leitura de código |
| Planejar | Herança | Pesquisa com modo planejar |
| Geral | Herança | Tarefas múltiplas complexas |

### Como definir um novo Subagent

Criar arquivo com frontmatter YAML na pasta `.claude/agents/`:

```markdown
---
name: revisor-codigo
description: Especialista em revisão de código. Uso frequente pós-alterações.
tools: Read, Grep, Glob, Bash
model: sonnet
---
Você é um revisor sênior. Avalie:
- legibilidade, nomes, duplicações
- tratamento de erros
- segurança
- cobertura de testes
- desempenho

Forneça feedback em prioridade (Crítico/Alerta/Sugestão), com exemplos.
```

Esse agente fica em `.claude/agents/` e pode ser ativado por comandos ou com `claude --agent revisor-codigo`.

### Campos principais

| Campo | Significado |
|--------|--------------|
| `name` | identificador |
| `description` | descrição para Claude |
| `tools` | ferramentas permitidas |
| `disallowedTools` | ferramentas proibidas |
| `model` | modelo usado, ex.: `sonnet` |
| `permissionMode` | modo de permissão |
| `maxTurns` | número máximo de turnos |
| `isolation` | isolamento com `worktree` |

### Como invocar

Via linguagem natural:

"Use o agente revisor-codigo para revisar as mudanças recentes"

Por menção direta (@):

`@revisor-codigo revise as alterações`

Ou iniciando sessão com agente:

`claude --agent revisor-codigo`

---

## Agent Teams — Coordenação de múltiplos agentes

### Diferenças em relação aos Subagents

Agent Teams, lançado em fevereiro de 2026, evolui Subagents ao facilitar a colaboração entre vários agentes via comunicação bidirecional, para tarefas complexas, em equipe.

| | Subagents | Agent Teams |
|---|---|---|
| Comunicação | Daqui para Sub | Entre agentes |
| Casos de uso | Delegar tarefas | Trabalho paralelo abrangente |
| Sessões | Subseções | Sessões independentes de colaboração |

### Quatro componentes

- **Líder**: gerencia o projeto, divide tarefas, acompanha progresso.
- **Membros**: agentes especializados que trabalham segundo o líder.
- **Lista de tarefas**: gerencia tarefas e dependências.
- **Caixa de entrada**: troca de mensagens assíncrona.

### Quando usar

Se a tarefa é:

- Muito grande ou divergente? Use Agent Teams.
- Requer cooperação simultânea? Use Agent Teams.
- Longa duração e muita comunicação? Use Agent Teams.

Caso contrário, Subagents normais são suficientes.

Usuários típicos incluem: refatorações grandes, pipeline de dados, verificações multi-repositórios.

---

## Hooks — Automação garantida

### O que são hooks?

Hooks são scripts que executam automaticamente em eventos específicos do ciclo de vida do Claude, garantindo ações obrigatórias, ao contrário de instruções que podem ser ignoradas.

### Tipos de eventos

| Evento | Momento de disparo | Uso principal |
|----------|---------------------|--------------|
| `SessionStart` | Início da sessão | Configurar ambiente |
| `UserPromptSubmit` | Envio do prompt pelo usuário | Filtrar entradas |
| `PreToolUse` | Antes do uso de ferramenta | Bloqueios, permissões |
| `PostToolUse` | Após uso bem-sucedido | Automatizar formatação/comandos |
| `PostToolUseFailure` | Ao falhar | Manejo de erros |
| `Stop` | Encerramento do AI | Checagem de qualidade |
| `SubagentStart` | Início de subagente | Setup |
| `SubagentStop` | Fim de subagente | Limpeza |
| `SessionEnd` | Fim de sessão | Estatísticas |

### Como configurar

No arquivo `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {"type": "command", "command": "npm run lint --fix"}
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {"type": "command", "command": "./.claude/hooks/check-dangerous-command.sh"}
        ]
      }
    ]
  }
}
```

Este exemplo faz executar o lint após edição, e checa comandos perigosos antes de usar Bash.

### Exemplo de script de bloqueio

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh

INPUT=$(cat)
COMANDO=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$COMANDO" | grep -q 'rm -rf'; then
  echo "Comando perigoso bloqueado: $COMANDO" >&2
  exit 2
fi

exit 0
```

Código de saída:

| Código | Significado |
|---------|--------------|
| `0` | Permite execução |
| `2` | Bloqueia e relata ao Claude |
| outros | Erro, não bloqueia |

### Tipos de hooks

Pode usar scripts simples ou APIs mais complexas:

| Tipo | descrição |
|-------|------------|
| `command` | comando shell |
| `http` | POST em endpoint |
| `prompt` | prompt ao modelo AI |
| `agent` | criar subagente para validação complexa |

### Arquivos de configuração

- `~/.claude/settings.json` (global)
- `.claude/settings.json` (projeto)
- `.claude/settings.local.json` (local, não versionado)

---

## MCP — Integração com Serviços Externos

### O que é MCP?

O **Model Context Protocol (MCP)**, padrão aberto lançado pela Anthropic em novembro de 2024, permite conectar Claude a diversas fontes externas e APIs de forma padronizada, facilitando integrações.

### Exemplos de serviços compatíveis

- Ferramentas de desenvolvimento: GitHub, GitLab, Jira
- Comunicação: Slack
- Documentação: Google Drive, Notion
- Banco de dados: PostgreSQL, SQLite
- Design: Figma
- Cloud: AWS, GCP, Azure

### Como configurar

Adicione conectores via comando:

```bash
claude mcp add
```

Ou edite o arquivo `.mcp.json`:

```json
{
  "playwright": {"type": "stdio", "command": "npx", "args": ["-y", "@playwright/mcp@latest"]},
  "github": {"type": "stdio", "command": "uvx", "args": ["mcp-server-github"], "env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"}}
}
```

Sub-agentes podem usar MCP de forma limitada:

```yaml
---
name: navegador-teste
description: Testes com Playwright
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
---
```

### Recomendações de MCP populares

#### Para desenvolvimento

| Serviço | Uso | Recomendações |
|------------|--------------------------------------------------------------|------------------|
| GitHub | Gerenciamento de issues, PR, revisão de código | ★★★ |
| GitLab | Equivalente ao GitHub para usuários da plataforma | ★★★ |
| Playwright | Testes automatizados de interface, screenshots | ★★★ |
| Sentry | Monitoramento de erros e bugs | ★★☆ |

#### Para documentação e conhecimento

| Serviço | Uso | Recomendações |
|----------------|------------------------------|------------------|
| Context7 | Documentação API atualizada | ★★★ |
| Notion | Documentos de projeto | ★★☆ |
| Google Drive | Especificações e designs | ★★☆ |

#### Para dados e infraestrutura

| Serviço | Uso | Recomendações |
|----------------|-----------------------------|------------------|
| PostgreSQL | Consultas SQL, otimização | ★★★ |
| Supabase | Banco de dados em nuvem | ★★☆ |
| AWS | Logs, Lambda | ★★☆ |

#### Comunicação

| Serviço | Uso | Recomendações |
|--------------|-----------------------------|------------------|
| Slack | Notificações em canais | ★★☆ |
| Jira/Linear | Gestão de tarefas | ★★☆ |
| Google Calendar | Agendamento | ★☆☆ |

Para iniciantes, recomenda-se configurar:

1. MCP do GitHub
2. Context7
3. Playwright

```bash
# Exemplo de comando para adicionar MCP do GitHub
author: claude mcp add github -- uvx mcp-server-github

# Exemplo para Context7
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

---

## Gestão de Contexto — Otimizando desempenho

### Por que gerenciar o contexto?

A performance do Claude Code depende do uso inteligente do **tamanho do contexto**. O limite max é cerca de 200.000 tokens (~150.000 palavras). Quanto maior o uso, mais provável de atingir esse limite, o que faz o modelo "esquecer" parte do histórico, gerando erros.

Gerenciar bem o contexto é mais importante do que melhorar a arquitetura técnica.

### Comandos de gerenciamento

| Comando | Função | Quando usar |
|-----------|---------|--------------|
| `/clear` | Reset completo | Novo task ou confusão |
| `/compact` | Compacta informações essenciais | Continuação do trabalho |
| `/compact Focus on API` | Compacta com foco em API | Priorizar detalhes importantes |
| `/btw` | Pergunta rápida que não fica na memória | Dúvida rápida sem salvar |
| `Esc+Esc` ou `/rewind` | Reverter ações | Cancelar operação recente |

Quando o contexto atingir 95%, ocorre uma compactação automática. Pode alterar a porcentagem via variável de ambiente:

```bash
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50
```

### Modo Planejar (Plan)

Modo de planejamento é leitura sem escrita, ideal para explorar antes de implementar. Alterna-se com `Shift+Tab` duas vezes ou via configuração:

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

Fluxo típico:

- **Exploração:** lê arquivos, entende sistema
- **Planejamento:** gera plano detalhado, sem editar arquivos
- **Implementação:** realiza mudanças
- **Validação:** testa e corrige

Essa abordagem reduz custos e evita erros.

### Dicas para evitar erros

| Erro comum | Como evitar |
|--------------|--------------|
| Sessão confusa | Use `/clear` entre tarefas |
| Laços infindáveis | Reinicie se repetição não resolve |
| CLAUDE.md inchado | Faça revisões frequentes |
| Testes ausentes | Sempre teste antes de avançar |
| Explorando demais | Limite a busca com subagentes |

### Boas práticas

- Limite o arquivo CLAUDE.md a 200 linhas
- Use Skills para detalhes
- Use MCP para conectores externos
- Faça pequenas tarefas, uma de cada vez, por sprint de 30min

---

## Resumo — Tabela comparativa e próximos passos

### Tabela de funcionalidades

| Funcionalidade | Propósito | Momento de execução | Comportamento determinístico |
|----------------|-----------|---------------------|----------------------------|
| CLAUDE.md | Regras e contexto persistente | Cada início de sessão | Não (\~80% de chance) |
| Skills | Fluxos de trabalho reutilizáveis | Quando chamado ou por decisão automática | — |
| Hooks | Automatizações obrigatórias | Eventos no ciclo de vida | Sim (100%) |
| Subagents | Especialistas internos | Quando delegado ou chamado explicitamente | — |
| Agent Teams | Trabalho paralelo em equipe | Início de tarefas grandes | — |
| MCP | Serviços externos | Quando acionado por ferramenta | — |

### Como usar

1. Organize o CLAUDE.md com regras e instruções do projeto.
2. Agrupe tarefas repetitivas em Skills.
3. Automatize ações recorrentes com Hooks.
4. Para tarefas complexas ou com conhecimento profundo, use Subagents.
5. Conecte MCPs para integrar serviços externos.
6. Para tarefas paralelas ou em larga escala, considere Agent Teams.

### Próximos passos

Claude Code quer transformar seu fluxo de trabalho de desenvolvimento. Comece gerando o CLAUDE.md com `/init`. Quanto mais usar, mais o agente se adapta ao seu projeto, tornando-se uma ferramenta poderosa para a sua equipe.

---

> Este artigo foi gerado automaticamente por LLM. Pode conter erros.
