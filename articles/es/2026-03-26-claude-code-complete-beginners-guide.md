---
title: "Guía Completa de Claude Code — Comprende Sistemáticamente Todas las Funciones del Agente de Codificación AI"
slug: "claude-code-complete-beginners-guide"
summary: "Guía para principiantes sobre todas las funciones de Claude Code, desde instalación, CLAUDE.md, Skills, Subagents, Agent Teams, Hooks, MCP y gestión de contexto, con información actualizada hasta m..."
date: "2026-03-26T00:10"
tags: ["Claude Code","IA","Herramientas de desarrollo","Anthropic","Agentes"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-complete-beginners-guide.png"
draft: false
---
## Introducción — ¿Qué es Claude Code?

En febrero de 2025, Anthropic lanzó **Claude Code**, que revolucionó el concepto de herramientas de codificación IA. No solo predice y propone código, sino que realiza tareas de desarrollo de forma autónoma, incluyendo lectura y escritura de archivos, ejecución de comandos, operaciones git y creación de PR.

### Diferencias respecto a simples autocompletados

Hasta ahora, la principal función de las herramientas IA era el "autocompletado" de código, prediciendo la siguiente línea y permitiendo al desarrollador decidir si lo acepta. Aunque eficiente, solo se trata de una "sugerencia".

Claude Code supera este modelo. Cuando el desarrollador indica "Escribe tests para este sistema de autenticación, ejecútalos, y si fallan, corrige", Claude Code lee los archivos, genera y ejecuta tests, analiza errores, corrige el código y repite el ciclo de forma autónoma.

```bash
# Generación y corrección automática de tests
guide 'write tests for the auth module, run them, and fix any failures'

# Monitoreo en tiempo real de logs
tail -200 app.log | claude -p 'Slack me if you see any anomalies'

# Revisión de seguridad
git diff main --name-only | claude -p 'review these changed files for security issues'
```

### Entorno de trabajo

Claude Code funciona en diversos entornos:

| Entorno | Método |
|----------|---------|
| Terminal | comando `claude` (CLI) |
| VS Code / Cursor | extensión |
| IDE JetBrains | plugin |
| Aplicación de escritorio | Claude Desktop |
| Navegador | claude.ai |

En la mayoría de casos, los desarrolladores utilizan `claude` en el terminal, iniciando desde la raíz del proyecto para acceder a todo el código.

### Cronología de funciones

Desde su lanzamiento, Claude Code ha añadido funciones rápidamente.

| Función | Fecha |
|----------|--------|
| Lanzamiento público | Febrero 2025 |
| Integración MCP | Noviembre 2024 |
| Subagents (Subagentes) | Julio 2025 |
| Hooks | Septiembre 2025 |
| Skills (Habilidades) | Octubre 2025 |
| Agent Teams | Febrero 2026 |

A marzo de 2026, Claude Code se ha convertido en una plataforma que puede llamarse "Sistemas Operativos de Codificación IA". A continuación, se explican estas funciones sistemáticamente.

---

## Instalación y configuración inicial

### Método de instalación

#### macOS / Linux / WSL (recomendado)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Esta instalación es nativa y se actualizará automáticamente en segundo plano.

#### PowerShell de Windows

```powershell
irm https://claude.ai/install.ps1 | iex
```

En Windows, se requiere Git for Windows.

#### Homebrew (macOS)

```bash
brew install --cask claude-code
```

La instalación con Homebrew no se actualiza automáticamente, por lo que se recomienda ejecutar `brew upgrade claude-code` periódicamente.

### Primer uso y autenticación

Tras instalar, navega al directorio del proyecto y ejecuta:

```bash
cd tu-proyecto
claude
```

Durante el primer uso, se solicitará autenticación. Al completarla, aparecerá una interfaz de chat interactiva en la que puedes dar instrucciones.

### Comandos básicos

| Comando | Función |
|-----------|---------|
| `claude` | Iniciar sesión interactiva |
| `claude -p "prompt"` | Ejecución no interactiva (CI/CD) |
| `claude --continue` | Reanudar la sesión anterior |
| `claude --resume` | Elegir y reanudar sesiones pasadas |
| `/init` | Generar automáticamente CLAUDE.md |
| `/clear` | Resetear contexto |
| `/compact` | Comprimir contexto |
| `/memory` | Ver/editar CLAUDE.md y memoria |
| `/agents` | Gestionar Subagents |
| `/hooks` | Configuración de hooks |
| `/permissions` | Gestionar permisos |
| `/skills` | Ver habilidades |

---

## CLAUDE.md — Diseña la "memoria" del proyecto

### ¿Qué es CLAUDE.md?

Es el archivo Markdown que Claude Code lee siempre al inicio de una sesión. Contiene las normas del proyecto, flujos de trabajo y decisiones arquitectónicas, funcionando como "contexto persistente".

Es comparable a entregar un documento con reglas del equipo a un nuevo ingeniero, que será leído antes de empezar.

### Ubicaciones

| Ámbito | Ubicación | Para quién | Compartido |
|-------------|---------------------|--------------|--------------|
| Organización | `/etc/claude-code/CLAUDE.md` | Todos los usuarios | Administradores |
| Proyecto | `./CLAUDE.md` o `./.claude/CLAUDE.md` | Participantes del proyecto | Control de versiones |
| Usuario | `~/.claude/CLAUDE.md` | Todos los proyectos | Uso personal |

En caso de múltiples CLAUDE.md, antepondrán los más específicos. Se recomienda poner reglas globales en la raíz del proyecto, y preferencias personales en el directorio home.

### ¿Qué escribir y qué no?

Guía para crear CLAUDE.md efectivo.

| Escribir | No escribir |
|------------------|------------------------------|
| Comandos Bash que Claude no pueda inferir | Lo que se entiende a simple vista en código |
| Estilo de código desalineado | Reglas de estilo ya conocidas |
| Políticas de testing y runners | Documentación API (en enlaces) |
| Nombres de ramas y PR | Información que cambia frecuentemente |
| Arquitectura específica del proyecto | Instrucciones obvias como "escribe código limpio" |
| Variables ambientales necesarias | Lista de archivos del código base |

Ejemplo de contenido:

```markdown
# Ejemplo de CLAUDE.md del proyecto

## Estilo de código
- Usar módulos ES (import/export). Prohibido require
- Importar solo con destructuración cuando sea posible

## Flujos de trabajo
- Ejecutar tipo-check después de cambios: `npx tsc --noEmit`
- Ejecutar tests en archivos individuales, no en todo el suite

## Comandos
- Build: `npm run build`
- Tests: `npm test`
- Linter: `npm run lint`

## Aviso
- Guardar secretos en `.env.local`. No hacer commit.
- La rama base para PR es develop (evitar push directo a main).
```

### /init para generación automática

El comando `/init` ayuda en proyectos existentes, analizando el código para detectar comandos de build, test y reglas del proyecto, generando un borrador de CLAUDE.md. Luego, ajustar y editar según sea necesario.

### Gestión dividida en archivos

Para proyectos grandes, se pueden dividir reglas en la carpeta `.claude/rules/`, con archivos específicos como `code-style.md`, `testing.md`, etc.

También es posible definir reglas específicas para patrones de archivos, mediante cabeceras YAML.

### Auto Memory

Desde la versión v2.1.59, se agregó **Auto Memory**, que automáticamente guarda en `~/.claude/projects/<proyecto>/memory/MEMORY.md` lo aprendido: errores, decisiones, comandos frecuentes. Esto facilita retomar tareas en sesiones futuras.

---

## Skills — Empaquetando flujos de trabajo reutilizables

### ¿Qué son las Skills?

Son paquetes de procedimientos o conocimientos que se almacenan en archivos `SKILL.md`. Se invocan mediante comandos `/nombre-del-skill`. Permiten automatizar operaciones complejas, como revisión de código, despliegues o gestión de issues.

Ejemplo: definir una skill para arreglar issues en GitHub y usar `/fix-issue 123` para ejecutar todo el procedimiento.

La diferencia clave con CLAUDE.md es que Skills se usan "solo cuando se necesitan" y no son instrucciones permanentes.

### Estructura de SKILL.md

Incluye Front Matter en YAML y el cuerpo en Markdown.

```yaml
---
name: fix-issue
description: >
  Corrige un issue en GitHub. Útil con el número de issue.
disable-model-invocation: true
user-invocable: true
allowed-tools: Read, Grep, Bash, Write, Edit
---

Investigar detalles del issue $ARGUMENTS, modificar archivos relacionados, escribir tests, hacer commit y crear PR.
```

`$ARGUMENTS` será reemplazado por los argumentos del comando. Se puede usar `$ARGUMENTS[0]`, `$ARGUMENTS[1]`, etc.

### Campos importantes del front matter

| Campo | Función |
|--------------|---------|
| `name` | Comando slash (máximo 64 caracteres) |
| `description` | Criterio para que Claude use la skill automáticamente |
| `disable-model-invocation` | `true` para solo usuarios, en operaciones peligrosas |
| `user-invocable` | `false` para ocultar en el menú principal |
| `allowed-tools` | Herramientas permitidas al ejecutar |
| `context` | Ejecutar en subagente independiente (`fork`) |
| `model` | Modelo a usar |
| `effort` | Nivel de esfuerzo (`low`, `medium`, `high`, `max`) |

### Tipos de skills: Referencia vs Tarea

**Skills de referencia**: Se inyectan para referenciar documentación, especificaciones o APIs, sin crear reglas específicas.

Ejemplo:

```yaml
---
name: api-spec
description: >
  Referencia la especificación REST API.
user-invocable: false
---
# Especificaciones
- Nombres en plural
- Respuestas de error en RFC 7807
...
```

**Skills de tarea**: Son procedimientos que realizan acciones concretas, como revisión de código, despliegues, respuesta a issues.

### Control de invocaciones

En el front matter, se puede definir quién y cuándo puede activar la skill:

| Parámetro | Uso |
|--------------|-----|
| `disable-model-invocation` | Solo usuarios; evita acciones automáticas |
| `user-invocable` | Permite activación mediante slash |

Para operaciones críticas, usar `disable-model-invocation: true`.

### Skills integradas

Claude Code viene con skills predeterminadas:

| Skill | Uso |
|----------|-----|
| `/batch` | Cambios masivos en código |
| `/claude-api` | Referencia API de Claude |
| `/debug` | Análisis de logs |
| `/loop` | Repetir prompts periódicamente |
| `/simplify` | Mejorar calidad del código reciente |

### Diferencias CLAUDE.md vs Skills

| Aspecto | CLAUDE.md | Skills |
|------------------------|--------------|--------------|
| Momento de carga | Siempre al inicio | Cuando se llama o automáticamente |
| Propósito | Reglas y reglas globales | Procedimientos y conocimientos específicos |
| Uso de contexto | Permanente | Solo cuando se invoca |

---

## Subagentes — Delegando tareas especializadas

### ¿Qué son los Subagentes?

Son agentes independientes especializados en tareas específicas. Cada uno tiene su propia ventana de contexto, prompts y permisos.

Utilidad: explorar grandes bases de código, solo lectura, reducir costos con modelos ligeros, tener agentes especializados (seguridad, rendimiento, etc.).

### Beneficios principales

1. **Protección del contexto**: exploraciones internas sin contaminar la conversación principal.
2. **Restricción de herramientas**: limitar acciones, evitar cambios accidentales.
3. **Especialización**: agentes con conocimientos específicos.
4. **Ahorro en costos**: usar modelos ligeros para tareas repetitivas.

### Subagentes integrados

Claude Code incluye tres:

| Agente | Modelo | Uso |
|--------------|----------|------------------------|
| **Explore** | Haiku | Búsqueda de solo lectura |
| **Plan** | Heredado | Investigaciones en modo plan |
| **general-purpose** | Heredado | Tareas complejas multietapa |

### Cómo definir un Subagente

Archivo Markdown con front matter YAML en `.claude/agents/`:

```markdown
---
name: code-reviewer
description: Agente especializado en revisión de código, usar después de cambios
tools: Read, Grep, Glob, Bash
model: sonnet
---

Eres un revisor senior, evalúa:
- Legibilidad, nombres, duplicados
- Manejo de errores
- Seguridad (secretos, validación)
- Cobertura de tests
- Rendimiento

Da retroalimentación en prioridad y ejemplos.
```

Ubicación: `.claude/agents/` o `~/.claude/agents/`.

### Campos importantes

| Campo | Función |
|--------------|---------|
| `name` | Identificador |
| `description` | Criterio para delegar |
| `tools` | Herramientas permitidas |
| `disallowedTools` | Herramientas prohibidas |
| `model` | Modelo a usar |
| `permissionMode` | Modo de permisos |
| `maxTurns` | Número máximo de turnos |
| `isolation` | Aislamiento con `worktree` |

### Cómo llamar

| Método | Descripción |
|--------------|--------------|
| Natural language | Claude decide y delega |
| Mención (@) | Para asegurar |
| Modo agente (`claude --agent`) | En modo dedicado |

---

## Agent Teams — Colaboración entre múltiples agentes

### Diferencias con Subagentes

**Agent Teams** (lanzado en febrero de 2026) extiende a los Subagentes, permitiendo a varios agentes cooperar, comunicarse y dividir tareas en paralelo.

| | Subagentes | Agent Teams |
|--------------|------------------|------------------------|
| Dirección | Solo el principal manda | Intercambio bidireccional |
| Casos apropiados | Tareas individuales | Proyectos grandes, pipelines |
| Sesión | Subsesiones | Equipos coordinados |

### Componentes

- **Lead**: gestor general que divide y supervisa
- **Teammates**: agentes especialistas que implementan |
- **Task List**: gestión de tareas y dependencias |
- **Mailbox**: mensajería asíncrona |

### ¿Cuándo usar Teams?

Si la tarea es complejo, se ajusta a:

- ¿Compleja? → sí → ¿Cabe en contexto? → no → ¿Tareas independientes? → sí → usar Teams |

Casos típicos: refactorizaciones grandes, pipelines, revisión cruzada en múltiples repos.

---

## Hooks — Automatización garantizada

### ¿Qué son los Hooks?

Son scripts que se ejecutan en eventos específicos del ciclo de vida. Garantizan acciones como linting, bloqueo de comandos peligrosos, análisis de logs.

### Eventos principales

| Evento | Cuándo pasa | Uso principal |
|--------------|------------------|--------------|
| `SessionStart` | Inicio de sesión | Configuración |
| `UserPromptSubmit` | En envío de prompt |
| `PreToolUse` | Antes de usar tool |
| `PostToolUse` | Después de tool |
| `PostToolUseFailure` | En fallo |
| `Stop` | Al terminar |
| `SubagentStart` | Al iniciar subagente |
| `SubagentStop` | Al terminar |
| `SessionEnd` | Fin de sesión |

### Cómo configurarlos

Archivo: `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{"type": "command", "command": "npm run lint --fix"}]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{"type": "command", "command": "./.claude/hooks/check-dangerous-command.sh"}]
      }
    ]
  }
}
```

Este ejemplo ejecuta `npm run lint --fix` tras editar o escribir, y antes de ejecutar comandos Bash peligrosos.

### Script ejemplo para bloquear comandos peligrosos

```bash
#!/bin/bash
# .claude/hooks/block-dangerous.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$COMMAND" | grep -q 'rm -rf'; then
  echo "Comando peligroso bloqueado: $COMMAND" >&2
  exit 2
fi

exit 0
```

Código de salida: `0` (permitido), `2` (bloqueado, notificado a Claude), otro (error).

### Tipos de hooks

Soporta:
- `command` (comando shell)
- `http` (POST a endpoint)
- `prompt` (pregunta a modelos)
- `agent` (subagente)

### Ubicación del archivo

| Lugar | Alcance |
|--------------|---------|
| `~/.claude/settings.json` | global |
| `.claude/settings.json` | proyecto |
| `.claude/settings.local.json` | local (no en control de versiones) |

---

## MCP — Integración con servicios externos

### ¿Qué es MCP?

**Model Context Protocol (MCP)**, estándar abierto de noviembre de 2024, permite conectar Claude con servicios externos (GitHub, Jira, Slack, bases de datos, etc.). Es compatible con Apple, OpenAI y otros.

### Ejemplos de servicios

- **Desarrollo**: GitHub, GitLab, Jira, Figma, AWS, GCP, Azure
- **Comunicación**: Slack, LINE
- **Documentación**: Google Drive, Notion
- **Bases de datos**: PostgreSQL, SQLite

### Cómo agregar MCP

Ejecuta interactivo:

```bash
claude mcp add
```

O configura directamente en `.mcp.json`:

```json
{
  "github": {"type": "stdio", "command": "uvx", "args": ["mcp-server-github"]},
  "playwright": {"type": "stdio", "command": "npx", "args": ["-y", "@playwright/mcp@latest"]}
}
```

### MCP en Subagentes

Puedes asignar MCPs específicos a Subagents, limitando su alcance. Ejemplo:

```yaml
---
name: browser-tester
description: Pruebas con Playwright
mcpServers:
  - playwright: {type: stdio, command: npx, args: ["-y", "@playwright/mcp@latest"]}
  - github
---
```

Esto evita mostrar todos los MCPs en la conversación principal.

### MCP recomendados para empezar

Por su utilidad y facilidad:

| MCP | Uso | Recomendación |
|-----|-----|--------------|
| **GitHub** | Issue y PR | ★★★ |
| **Context7** | Documentación actualizada | ★★★ |
| **Playwright** | Pruebas UI | ★★★ |
| **Sentry** | Monitoreo de errores | ★★☆ |

Solo estos tres: facilitarán mucho el inicio.

---

## Gestión de contexto — Clave para rendimiento

### ¿Por qué es importante?

El rendimiento de Claude Code depende de cuánto contenido en el contexto. Tiene un máximo de 200,000 tokens (~150,000 palabras). Con sesiones prolongadas, el contexto se llena, y Claude "olvida" instrucciones anteriores, fallando más.

Una gestión eficiente del contexto mejora significativamente el rendimiento.

### Uso de comandos `/clear`, `/compact`, `/btw`

| Comando | Función | Uso adecuado |
|--------------|---------|----------------|
| `/clear` | Reset total | Cuando cambias de tarea |
| `/compact` | Comprimir sin perder info | Continuar en la misma tarea |
| `/compact Focus on the API changes` | Compresión específica | Mantener solo info relevante |
| `/btw` | Q&A rápido, sin guardar en historial | Preguntas menores |
| `Esc+Esc` o `/rewind` | Deshacer | Cancelar acción |

Cuando el contexto supera 95%, se activa la compresión automática, configurable via `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`.

### Modo Plan

Permite explorar sin modificar archivos. Se ingresa con `Shift+Tab` dos veces o en configuración.

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

Permite dividir tareas en fases:
- **Exploración (Plan)**: analizar archivos sin modificar.
- **Planificación**: crear plan de cambios.
- **Implementación**: realizar cambios en modo normal.
- **Publicación**: hacer commit y PR.

Reduce costos y evita errores.

### Errores comunes y soluciones

| Patrón | Problema | Solución |
|--------------|----------|-----------|
| Sesión mezclada | Información irrelevante | `/clear` entre tareas |
| Bucle de cambios | Repetir errores | `/clear` si hay errores repetidos |
| CLAUDE.md inflado | Reglas perdidas | Revisar y limpiar |
| Implementación sin pruebas | Código no verificado | Añadir tests y validarlos |
| Exploración infinita | Sobre carga | Limitar alcance, usar subagentes |

### Mejores prácticas

- Mantener CLAUDE.md bajo 200 líneas.
- Separar especificaciones en Skills.
- Limitar MCP a lo imprescindible.
- Seguir estrategia de sprints de 30 minutos con compresión periódica.
- Usar subagentes para exploraciones masivas.

---

## Resumen y comparación de funciones

| Función | Propósito | Momento de ejecución | Decide de forma determinista |
|--------------|--------------|---------------------|-------------------------|
| **CLAUDE.md** | Reglas permanentes | Diseño inicial | No, 80% confiabilidad |
| **Skills** | Procedimientos reutilizables | Cuando se invocan | No |
| **Hooks** | Automatización segura y definitiva | Eventos de ciclo de vida | Sí (100%) |
| **Subagentes** | Tareas especializadas | Evaluación automática o manual | No |
| **Agent Teams** | Colaboración en tareas grandes | Inicio | No |
| **MCP** | Integración con servicios | Cuando se usan | No |

### Consejos para usar funciones

1. Empezar con **CLAUDE.md** para reglas y flujo.
2. Crear Skills para tareas repetitivas.
3. Automatizar acciones con Hooks.
4. Usar Subagentes para tareas complejas.
5. Añadir MCP para integración externa.
6. Considerar Agent Teams para tareas en paralelo.

---

## Conclusión — Potencial de Claude Code

Claude Code puede transformar todo el flujo de desarrollo. Comienza creando un CLAUDE.md con `/init`, y ajusta según avances. La clave está en configuración adecuada y gestión eficiente del contexto para desbloquear su máximo potencial.


---

> Este artículo fue generado automáticamente por LLM. Puede contener errores.
