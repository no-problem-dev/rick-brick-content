---
title: "Arquitectura práctica de Claude Code — Patrones de diseño para acelerar el desarrollo con Teams/Subagents"
slug: "claude-code-advanced-teams-architecture"
summary: "Explicación de patrones avanzados de diseño multiagente en Claude Code, incluyendo Star Topology, DAG, reglas 80/20, optimización CLAUDE.md y control determinista con Hooks, con casos oficiales de ..."
date: "2026-03-26T00:10"
tags: ["Claude Code","AI","Multi-agent","Anthropic","Teams"]
category: "tech-article"
automated: false
thumbnail: "/images/claude-code-advanced-teams-architecture.png"
draft: true
---
# Arquitectura práctica de Claude Code — Patrones de diseño para acelerar el desarrollo con Teams/Subagents

Al usar Claude Code día a día, eventualmente te enfrentarás a la "pared de sesión única". Durante refactorizaciones complejas, el contexto se deteriora y empiezan a surgir propuestas contradictorias. Cuando se manejan tareas en paralelo a gran escala, la conversación se vuelve pesada y la precisión de inferencia disminuye. Romper este cuello de botella es posible mediante un diseño multiagente que utiliza Subagents y Agent Teams.

Este artículo explica de manera práctica por qué estos patrones son efectivos, dirigido a ingenieros que dominan las operaciones básicas de Claude Code, con datos de casos oficiales de Anthropic.

---

## 1. ¿Por qué es necesario un diseño multiagente? — Límites de una sesión única

### Fundamentos científicos de la deterioración del contexto

Addy Osmani expresó en su blog:

> "Los LLMs funcionan peor a medida que se expande el contexto"

Esto no solo se trata de límites en tokens. Cuando se acumula información irrelevante en la ventana de contexto, la "atención" del modelo se dispersa y la calidad de inferencia disminuye. Que Claude haga propuestas contradictorias en sesiones largas se explica por este mecanismo.

Incluso estudios de Anthropic en multiagentes muestran resultados similares. Comparando una sola sesión Opus 4 con una estructura donde Sonnet 4 actúa como subagente liderando, se observó una mejora del **90.2% en rendimiento**. Es importante notar que la mejora fue mayor al cambiar a una configuración multiagente que simplemente actualizar a un modelo superior.

Además, se identificó que el volumen de tokens, llamadas a herramientas y selección de modelos explican el 95% de la variación en rendimiento. Por ello, una arquitectura que intenta meter todo en una sola sesión empeora estos tres aspectos.

### ¿Qué cambia con un sistema multiagente?

```
【Sesión única】
  Todo el contexto (exploración, implementación, pruebas, debugging) se acumula en una sola ventana
  → La calidad de inferencia se deteriora en la segunda mitad

【Diseño multiagente】
  Cada agente se concentra en su "área responsable"
  → Cada ventana mantiene el nivel óptimo de información
```

La función de **Agent Teams**, lanzada en febrero de 2026, implementa esta lógica. Varias instancias de Claude Code trabajan de manera coordinada a través de contextos separados y listas compartidas.

---

## 2. Topología estrella — Arquitectura de 3 capas líder/asesor/compañero

### Filosofía del diseño

La decisión más importante en Agent Teams es la forma en que fluye la información. En lugar de una topología de red plana (mesh), se adopta una **Topología estrella** — donde toda comunicación pasa por un líder — para evitar contradicciones y dispersión de información.

```
Líder del Equipo (Opus)
    ↕ Consulta de especificaciones y recepción de información de distilación
Asesor (Sonnet) ── Comprensión y distilación de documentos y bases de código
    ↓
Compañeros (Sonnet × N) ── Concentrados en la implementación
```

El líder no es solo un receptor, sino un **punto de cruce de información**. La definición de qué aprender y qué olvidar determina el rendimiento del equipo.

### Rol del líder / ¿Qué hace y qué no?

| Lo que hace el líder | Lo que no hace el líder |
|---|---|
| Desglosar tareas y gestionar dependencias | Codificar directamente |
| Validar calidad (ejecución de pruebas y chequeo de tipos) | Referenciar directamente la especificación |
| Dar retroalimentación a los compañeros | Tener un entendimiento completo del código |
| Gestionar avances y detectar cuellos de botella | Permitir ajuste directo entre compañeros |

Este contraste otorga la "paradoja de fuerza" de la topología estrella: como el líder no lee la especificación, se puede enfocar únicamente en gestión y validación.

### Capas del Asesor — Expertos en distilación

El asesor actúa como un "experto en distilación" — lee muchas especificaciones y código, y solo devuelve la información estructurada que necesita el líder.

```
Líder: "¿Qué especificaciones son necesarias para implementar T04? Incluye definiciones y DoD"
          ↓
Asesor: lee /spec/ y devuelve solo la información estructurada a partir de esa lectura
          ↓
Líder: transfiere la respuesta del asesor como mensaje a los compañeros
```

**Restricción del asesor**: Solo lectura, sin modificación de archivos. Permitir al asesor leer, pero sin editar, mantiene la coherencia de la circulación de información.

### Principios de operación de los compañeros

Lo más importante en su diseño: "No leen la especificación". Esto es contraintuitivo, pero esencial.

Si los compañeros leen directamente la especificación, su interpretación puede divergir. Es mejor que el líder solo transmita la distilación del asesor en sus mensajes, asegurando que todos interpretan igual.

Principios operativos:

1. Implementa solo lo que indica el líder (sin funcionalidades adicionales no solicitadas)
2. Pregunta al líder en casos ambiguos
3. Incluye en los informes de finalización archivos modificados, resultados de tests, chequeos de tipos y pendientes
4. No leen /spec/ directamente, solo lo recibe del líder

### Resumen del flujo de información

```
【Comunicación permitida】
  Líder ↔ Asesor: consulta y recepción de distilación
  Líder → Compañeros: instrucciones y retroalimentación
  Compañero → Líder: informes y consultas

【Comunicación prohibida】
  Compañero → Compañero: mensajes directos (solo vía líder)
  Compañero → Asesor: mensajes directos (solo vía líder)
  Líder → /spec/: lectura directa (delegada al asesor)
```

### ¿Por qué es efectivo este diseño?

Investigaciones de Anthropic muestran que la selección de modelo en estos sistemas tiene mayor impacto en rendimiento. Concentrar a Opus en el líder y ejecutar varios Sonnet en paralelo con los compañeros, optimiza coste y calidad.

El topología estrella también evita contradicciones en la información: al centralizar las comunicaciones en un solo hub, se controlan mejor los caminos de interacción, incluso cuando el número de agentes crece exponencialmente.

---

## 3. Diseño de tareas impulsadas por DAG — La ciencia de la paralelización

### Gestionar tareas con DAG

La lista de tareas en Agent Teams se diseña como un **Directed Acyclic Graph (DAG)** — un grafo dirigido acíclico — que define dependencias de tareas explícitamente.

```json
{
  "tasks": [
    { "id": "T01", "name": "Diseño de esquema de autenticación", "blocked_by": [] },
    { "id": "T02", "name": "Implementación del endpoint API", "blocked_by": ["T01"] },
    { "id": "T03", "name": "Implementación frontend", "blocked_by": ["T01"] },
    { "id": "T04", "name": "Pruebas de integración", "blocked_by": ["T02", "T03"] }
  ]
}
```

Aquí, T02 y T03 pueden ejecutarse en paralelo, y T04 inicia solo después de su completación. El DAG deja claro qué tareas pueden realizarse simultáneamente.

### Patrón de olas (Wave)

Dividir las tareas dependientes en "olas" (waves) permite distribuir la carga en paralelo mientras se respeta las dependencias.

```plaintext
Wave 1: Investigación y diseño (todas en paralelo)
  ├─ Compañero A: Estado actual frontend
  ├─ Compañero B: Estado actual backend API
  └─ Compañero C: Planificación de pruebas
      ↓
Wave 2: Implementación (con separación de archivos)
  ├─ Compañero A: Frontend (src/components/...)
  └─ Compañero B: Backend API (src/api/...)
      ↓
Wave 3: Pruebas de integración
  └─ Compañero C: Ejecución y verificación
```

Es clave que tareas dentro de una misma ola sean no dependientes entre sí y que no haya duplicación de archivos.

### Principios de dimensionamiento

| Tamaño | Problemas potenciales |
|---|---|
| Muy pequeño (menos de 1 archivo) | Coste de coordinación mayor que el beneficio |
| Muy grande (más de 1 semana) | Riesgo de inacción o retrabajo prolongado |
| Adecuado | Unidad clara, logros definidos |

Se recomienda que un Teammate maneje 5-6 tareas para mantener foco y evitar sobrecarga.

### Prevención de conflictos y bloqueo

Infraestructura de control de archivos, como en el proyecto de compilador de C de Anthropic, usa archivos de bloqueo distribuidos para evitar que dos agentes reclamen la misma tarea simultáneamente.

```bash
# Reclamar tarea
echo "$AGENT_ID" > current_tasks/task-$TASK_ID.lock
git add current_tasks/task-$TASK_ID.lock
git commit -m "reclamar: task-$TASK_ID"
```

Este método descentralizado evita la dependencia de un planificador central y mantiene la integridad.

### Automoción de calidad con hooks

Los hooks como `TaskCompleted` y `TeammateIdle` automatizan verificaciones de calidad y control de estado.

```json
{
  "hooks": {
    "TaskCompleted": [{"hooks": [{"type": "command", "command": "./.claude/hooks/quality-gate.sh"}]}],
    "TeammateIdle": [{"hooks": [{"type": "command", "command": "./.claude/hooks/verify-output.sh"}]}]
  }
}
```

Ejemplo de script (`quality-gate.sh`):

```bash
#!/bin/bash
set -e
npm test || { echo "Fallo en pruebas" >&2; exit 2; }
npm run lint || { echo "Fallo en lint" >&2; exit 2; }
npm run build || { echo "Fallo en build" >&2; exit 2; }
exit 0
```

Con `exit 2`, Claude recibe retroalimentación automática y el proceso de control de calidad funciona sin intervención humana.

---

## 4. El arte de gestionar contexto — La regla 80/20 y más allá

### Regla 80/20

El principio fundamental: "No usar el 20% final del contexto en tareas complejas de múltiples archivos".

En una ventana de 200K tokens, cuando se alcanza el 83.5%, se realiza compresión automática. La pérdida de calidad aumenta significativamente. Vigilar el consumo de tokens en la barra de estado y proceder a compactar al alcanzar 70-80% es recomendable.

### Estrategias de compresión

**Cuándo comprimir:**
- Tras completar funciones clave
- Antes de cambiar de exploración a implementación
- Cuando Claude repite preguntas o contradice decisiones anteriores
- En puntos naturales de separación de tareas (límites de olas)

**Cuándo evitarlo:**
- Durante debugging activo
- Cuando se trabaja en refactorizaciones complejas con dependencias cruzadas

### Aislar exploraciones mediante Subagents

Delegar tareas de exploración a Subagents evita que información irrelevante de otras áreas contamine el contexto.

```plaintext
Contexto principal
  └─ "¿Cuál es el estado actual del módulo de autenticación?"
          ↓
Subagent
(Independiente)
  ├─ Carga /src/auth/
  ├─ Analiza archivos de tests
  └─ Rastrea dependencias
          ↓ Solo resumen
Contexto principal
  └─ "Módulo de autenticación usa JWT + Redis, funciones principales son ..."
```

Esto permite que un solo Subagent gestione miles de archivos sin sobrecargar el contexto principal.

### Estrategia de ciclos de 30 minutos

Dividir el trabajo en "sprints" de 30 minutos mantiene el contexto fresco. Al final de cada ciclo, se realiza compacción o se limpia (`/clear`). Las sesiones cortas producen mejores resultados.

### Diseño del contexto del líder

| Estado | Qué retiene el líder | Qué descarta el líder |
|---|---|---|
| COMPLETADO | IDs, resultados, archivos finales | Detalles internos, mensajes largos |
| EN PROGRESO | Instrucciones y avances | Texto completo de las tareas (se puede consultar a través del asesor) |
| PENDIENTE | Dependencias, olas en curso | Definiciones completas, siempre consultables en asesor |

Se recomienda que el líder solo mantenga resúmenes de estado, consultando la especificación solo cuando sea necesario. El asesor, por su parte, puede gestionar esos datos sin consumir el contexto del líder.

---

## 5. Técnicas de optimización de CLAUDE.md — Cómo aprovechar 300 líneas

### Principio "Less is More"

Investigaciones muestran que los mejores prompts para LLMs usan menos de 200 instrucciones. CLAUDE.md ya incluye unas 50, por lo que el límite práctico es de 100-150 instrucciones.

**Recomendación:** Mantener CLAUDE.md en menos de 60 líneas medianas para asegurar que Claude priorice esas reglas.

### Qué NO escribir en CLAUDE.md

No repitas que "Claude debe escribir código limpio" ni "manejar errores". Claude ya sabe eso.

**Criterios para decidir qué incluir:**
- ¿ Claude funciona bien sin eso? → Mejor eliminar
- ¿ Es información de proyecto que Claude ya sabe? → Mejor eliminar
- ¿ Cambia frecuentemente? → Mejor eliminar

### Delegar formateo y control de estilo a hooks

No envíes en el prompt instrucciones para formato o lint. Usa hooks que ejecuten** automáticamente**: 

```json
{
  "hooks": {
    "PostToolUse": [{"hooks": [{"type": "command", "command": "npm run lint --fix && npm run format"}]}]
  }
}
```

Al eliminar instrucciones del CLAUDE.md y usar hooks, se ahorra token y se asegura calidad consistente.

### Patrones de divulgación progresiva

Para evitar que CLAUDE.md crezca sin control, solo escribe en la raíz la info esencial, y usa enlaces para documentos detallados.

```markdown
# CLAUDE.md (raíz — 60 líneas)

## Stack técnico
- Astro 5.18.0 + Tailwind CSS 4.2.0 + Cloudflare Pages
- TypeScript 5.9.x

## Comandos
- Construir: `npm run build`
- Chequear tipos: `npx tsc --noEmit`
- Lint: `npm run lint`

## Documentos adicionales
- API: @.claude/rules/api-conventions.md
- Flujo Git: @.claude/rules/branching.md
- Deployment: @.claude/rules/deployment.md
```

Archivos importados con `@path/` solo se cargan cuando el contexto lo demanda.

### Diseño de CLAUDE.md jerárquico

```
~/.claude/CLAUDE.md          # Común a todos los proyectos
  ./CLAUDE.md                # Proyecto (equipo)
    ./.claude/rules/api.md   # Reglas específicas
    ./.claude/rules/test.md  # Documentos de test
    src/components/CLAUDE.md # Desarrollo de componentes
```

Se cargan solo en el momento necesario, simplificando el contenido del archivo principal.

---

## 6. Patrones de habilidades — Inyección bajo demanda

### Cómo separar CLAUDE.md y Skills

Skills están en `/.claude/skills/{nombre}/SKILL.md`, especializados en conocimientos específicos.

```
CLAUDE.md → Información global y constante
Skills → Información específica para tareas particulares
```

Por ejemplo, un Skill podría ser sus reglas de diseño de APIs o procedimientos de despliegue, solo en los momentos necesarios.

### Cómo convertir especificaciones en Skills — Arquitectura SDD

Para proyectos grandes, las especificaciones enteras no entran en CLAUDE.md. Se dividen en capas (L0-L5) en un SDD, que ses un conjunto de Skills.

```
.claude/skills/
  spec-l0-core/
  spec-l1-vision/
  spec-l1-content-types/
  spec-l4-schema/
  spec-l4-article/
  generate-thumbnail/
  common-doc-writer/
```

Los agentes llaman `Skill("...")` para importar solo las partes relevantes, manteniendo limpio el contexto del líder.

### Skills en Subagents

Los subagentes no heredan Skills automáticamente. Deben especificarlos en su frontmatter.

```yaml
---
name: api-developer
skills:
  - api-conventions
  - error-handling
  - security-checklist
---

Implementa siguiendo estas reglas.
```

### Ejecución independiente con `context: fork`

En el frontmatter de Skills, `context: fork` hace que se ejecuten como subagentes aislados, sin consumir al líder.

```yaml
---
name: security-audit
context: fork
---
```

Ideal para revisiones y auditorías extensas.

---

## 7. Control determinista con Hooks — Garantía automática de calidad

### CLAUDE.md (aconsejador) vs Hooks (control determinista)

| | CLAUDE.md | Hooks |
|---|---|---|
| Probabilidad de seguir | ~80% | 100% |
| Uso adecuado | Planificación y contexto | Formato, lint, seguridad |
| Tiempos de ejecución | Inicio de sesión | Eventos de ciclo completo |

Lo que debe ejecutarse siempre va en hooks. CLAUDE.md solo proporciona guía, pero no garantiza.

### Puertas de calidad en Agent Teams

Dos hooks clave: `TeammateIdle` y `TaskCompleted`.

```bash
# ejemplo de script para quality gate
#!/bin/bash
set -e
npm test || { echo "Fallo en tests" >&2; exit 2; }
 npx tsc --noEmit || { echo "Errores de Tipo" >&2; exit 2; }
 npm run build || { echo "Fallo en build" >&2; exit 2; }
echo "Calidad aprobada"
exit 0
```

Un `exit 2` bloquea el proceso y envía retroalimentación automática a Claude.

### Control de seguridad — Bloqueo de comandos peligrosos

```bash
# Script para bloquear comandos peligrosos
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')
DANGEROUS_PATTERNS=("rm -rf /" "DROP TABLE" "git push --force.*main" "chmod 777")
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "Comando peligroso bloqueado: $pattern" >&2
    exit 2
  fi
done
exit 0
```

La salida `exit 2` bloquea y retroalimenta.

### Código de retorno `exit 2` — Bloqueo + feedback

Hay tres códigos de salida:
- `exit 0` → Permitir
- `exit 2` → Bloquear y retroalimentar
- Otros → Error (no bloquea)

`exit 2` es muy potente porque evita ejecutar comandos peligrosos y además informa a Claude del motivo, permitiendo una autoreflexión y ajuste.

---

## 8. Ejemplos prácticos — Casos reales de Anthropic y la industria

### Compilador en C de Anthropic: 16 agentes, 100,000 líneas en Rust

Anthropic desarrolló un compilador en C usando 16 agentes paralelos y 2,000 sesiones, procesando 200 millones de tokens. Lograron compilar 100,000 líneas de código en Rust en Linux, compatible con varias arquitecturas.

Este proyecto muestra que una correcta "arquitectura de contexto" incluye:
- Agentes independientes en contenedores Docker
- Uso de bloqueo de archivos con Git para evitar conflictos
- Especialización en tareas: eliminación de duplicados, optimización de rendimiento, mantenimiento de documentación

La lección clave: "Sin un verificador de pruebas casi perfecto, Claude se equivoca". La calidad de pruebas y la gestión de dependencias son pilares.

### Investigación de Anthropic sobre multiagentes: rendimiento 15 veces mejor

Los estudios muestran que usar múltiples agentes en paralelo puede reducir los tokens totales en un 85%. Comparando Opus 4 solo vs Opus 4 + Sonnet 4, se logra un aumento de rendimiento del **90.2%**. La innovación estructural supera a la mera actualización de modelos.

Se concluye que, aunque el costo aumenta, la mejora en calidad justifica la inversión.

### Ejemplo de prompt para revisión de PR en agentes

"Revisa el PR #142 en equipo con tres aspectos independientes: seguridad, rendimiento y tests. Genera revisores específicos, y al final, combina los hallazgos en un reporte consolidado." 

### Detección de hipótesis de conflicto

"Dado un reporte de login fallido, genera 5 agentes investigando distintas hipótesis: token JWT, gestión de estado, configuración de rutas, manejo de errores, respuesta de API. Cada uno recopila evidencia y descarta hipótesis incorrectas, llegando a la causa raíz más probable." 

### Doctolib: aceleración del lanzamiento en un 40%

El sistema de reservas médicas Doctolib implementó Claude Code en toda la organización, reemplazando infraestructura de testing legacy en horas, y acelerando en un 40% la velocidad de lanzamiento de nuevas funcionalidades. La prioridad: garantizar calidad automática con tests, revisiones y hooks.

---

## 9. Antipatrón y lecciones de fracasos

### Sesiones Kitchen Sink — Contaminación de contexto

**Problema**: agregar tareas irrelevantes en la misma sesión degrada la calidad.

**Razón**: acumulación de información no relacionada. Es recomendable usar `/clear` entre tareas, manteniendo cada tarea en un contexto limpio.

### Repetición de errores — acumulación de contexto fallido

**Problema**: Claude repite errores; las correcciones anteriores quedan en la memoria.

**Solución**: después de repetir errores, usar `/clear` y empezar desde cero, comunicando solo el objetivo.

### Uso excesivo de Agent Teams — coste y efectividad

Aplicar Agent Teams en tareas simples o muy breves produce un incremento de coste de hasta 15 veces. La estrategia es usarlos solo en tareas que lo requieran, no en todo.

### Pérdida de contexto en entregas

La transferencia de agentes puede perder información clave si no se explican los "porqués" y las decisiones. Esto genera errores de coordinación y retrabajo.

### Problemas en convergencia paralela — todos en la misma falla

En proyectos como el compilador, todos los agentes centrados en una misma versión de un bug pueden bloquearse mutuamente. La clave es dividir en tareas independientes.

### Testeo sin calidad — confianza ciega

La ausencia de tests fiables puede hacer que Claude acepte soluciones equivocadas, lo que pone en riesgo la integridad del sistema.

### La mentira de que "multiagentes siempre son rápidos"

Contrario a la creencia popular, la paralelización no siempre reduce tiempo. El overhead en comunicación, gestión de contexto y conflictos puede impactar en eficiencia.

**Realidad**: la ventaja principal es ampliar la escala de tareas complejas sin contaminación del contexto, logrando calidad más que velocidad superficial.

---

## 10. Hoja de ruta — De la fase 1 a la 4

### Fase 1: Bases — Optimización de CLAUDE.md + Hooks

- Generar CLAUDE.md en 300 líneas o menos
- Eliminar reglas innecesarias que Claude ya conoce
- Automatizar lint y tests con hooks
- Mejorar el rendimiento de inferencia

**Meta**: mayor precisión, automatización y claridad.

### Fase 2: Uso de subagentes — Aislar tareas y proteger contextos

- Definir agentes especializados en tareas específicas
- Delegar investigaciones pesadas a subagentes aislados
- Usar `context: fork` para ejecución independiente

### Fase 3: Implementar Agent Teams — Paralelización segura

- Inicialmente, solo en tareas de lectura
- Automatizar calidad con hooks
- Gestionar conflictos con archivos de bloqueo

### Fase 4: Orquestación avanzada — Arquitectura de 3 capas y DAG

- Definir plan de ejecución en archivos `orchestrator`
- Crear agentes especializados en interpretación de especificaciones
- Planificar tareas en olas para entregas por etapas
- Implementar control de calidad en cada fase

Este proceso permite una automatización compleja y robusta de tareas multiagente, mejorando calidad y eficiencia.

---

## Resumen — La esencia del diseño

Maximizar la eficiencia y calidad en Claude Code radica en el "diseño del contexto". Determinar quién debe saber qué, qué compartir y qué olvidar, así como cómo dividir tareas y estructurar dependencias, es la clave.

Star Topology centraliza conocimiento para mejorar calidad, DAG define dependencias para optimizar paralelismo, y la regla 80/20 mantiene la frescura del contexto.

Anthropic logró construir un compilador en Rust, compatible con Linux y varias arquitecturas, usando 16 agentes y 10 millones de tokens. Un éxito basado en un correcto diseño del contexto, pruebas rigurosas y entornos aislados.

Comienza por optimizar CLAUDE.md en fase 1 y avanza en tu ritmo hacia la fase 4. La potencialidad del diseño multiagente en Claude Code es mucho mayor de lo que imaginas, solo requiere una estrategia consciente y estructurada.

---

> Este artículo fue generado automáticamente por LLM. Puede contener errores.
