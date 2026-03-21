---
title: "Introducción al Desarrollo Basado en Especificaciones — Por qué el Especificación se ha vuelto lo más importante en el Desarrollo Impulsado por IA"
slug: "spec-driven-development-ai-coding"
summary: "A medida que las limitaciones del \"Vibe Coding\" se hacen evidentes, el Desarrollo Basado en Especificaciones (SDD), que trata las especificaciones como \"contratos\" para la IA, está surgiendo como e..."
date: "2026-03-18"
tags: ["AI開発","仕様書","SDD","コンテキストエンジニアリング","LLM","Claude Code"]
category: "tech-article"
automated: false
thumbnail: "/images/spec-driven-development.png"
draft: false
---
## Introducción — Ha terminado el idilio del "Vibe Coding"

A principios de 2025, Andrej Karpathy, cofundador de OpenAI, propuso el concepto de "Vibe Coding". Este es un estilo de desarrollo que consiste en lanzar prompts sensoriales a la IA y aceptar el código generado casi sin modificaciones. Inicialmente fue recibido como una revolución en la productividad, pero la euforia no duró mucho.

La realidad que muestran los datos de investigación es dura. Una encuesta de Veracode en 2025 reveló que el **45% del código generado por IA contenía vulnerabilidades de seguridad**. Un análisis de 470 pull requests de código abierto por CodeRabbit encontró que el código coescrito por IA tenía **1.7 veces más "problemas importantes"** que el código escrito por humanos, un 75% más de configuraciones erróneas y 2.74 veces más vulnerabilidades de seguridad. Paradójicamente, un estudio también encontró que los desarrolladores experimentados **disminuyeron su productividad en un 19%** al usar herramientas de codificación de IA (a pesar de que ellos mismos predijeron una mejora del 24%).

¿Cuál es la causa fundamental de esta situación, también conocida como la "resaca del Vibe Coding"? Y, ¿qué tipo de paradigma está surgiendo como solución: el **Desarrollo Basado en Especificaciones (Spec-Driven Development - SDD)**? Este artículo lo explica en detalle, combinando investigaciones, casos empresariales y conocimiento práctico.

---

## Razones Estructurales por las que el "Vibe Coding" Falla

### El problema de la "IA que no lee la mente"

El blog de GitHub lo expresa concisamente: "**Los LLM son excelentes para completar patrones, pero no pueden leer la mente**".

Si le pide a un asistente de codificación de IA que "cree una función de inicio de sesión", generará alguna forma de función de inicio de sesión. Sin embargo, ¿utilizará OAuth 2.0, cómo se gestionarán las sesiones, se ajustará al esquema de la base de datos existente, cómo se cumplirán los requisitos de seguridad? Si no especifica esto, la IA solo completará "código que parece adecuado".

### Problema de "Shadow Bug" y bucles de alucinación

Los problemas creados por el Vibe Coding se pueden clasificar en dos categorías:

Una es el **Shadow Bug** (código que parece correcto pero contiene vulnerabilidades graves). El código se ejecuta y pasa las pruebas. Sin embargo, bajo ciertas condiciones, pueden ocurrir inyecciones SQL o bypass de autenticación. A menudo, el problema no se manifiesta hasta que llega al entorno de producción.

La otra es el **bucle de alucinación**. En sistemas multiagente donde cooperan varios agentes de IA, un agente puede juzgar incorrectamente la salida de otro agente como correcta, creando un círculo vicioso que refuerza los errores mutuos. Sin un "punto de referencia de la verdad", como una especificación, es imposible romper esta cadena.

```mermaid
graph LR
    A[Agente A: Implementación incorrecta] --> B[Agente B: Revisión]
    B --> C[Aprobado sin problemas]
    C --> D[Implementación incorrecta llega a producción]
    D --> E[Demasiado tarde cuando se descubre el error]
```

### Pérdida de contexto e inconsistencia arquitectónica

El contexto de una conversación con IA se restablece en cada sesión. La IA en la siguiente sesión no sabe que en la conversación anterior se decidió "implementar la autenticación con JWT". Cuando se involucran múltiples conversaciones o múltiples agentes de IA, el diseño general de la arquitectura se dispersa, lo que lleva a un sistema inconsistente donde una parte utiliza REST y otra GraphQL.

---

## ¿Qué es el Desarrollo Basado en Especificaciones (SDD)?

### Definición y principios básicos

El Desarrollo Basado en Especificaciones (SDD) es un paradigma de desarrollo que **define especificaciones (Specs) claras como "contratos" para la IA, y genera código basado en esos contratos**.

Thoughtworks lo describe así: "SDD es un paradigma que utiliza especificaciones de requisitos claras como prompts para que los agentes de IA generen código ejecutable. Las especificaciones definen explícitamente el comportamiento externo (mapeo de entrada/salida, precondiciones/postcondiciones, invariantes, restricciones, tipos de interfaz)".

El principio de "**invertir una hora en planificación para ahorrar diez horas de trabajo de rehacer**" (Thoughtworks) se aplica más fuertemente en el desarrollo impulsado por IA.

### Comparación Vibe Coding vs. SDD

| Aspecto | Vibe Coding | Desarrollo Basado en Especificaciones | 
|:---|:---|:---| 
| Portador principal de información | Conversación/Prompt | Archivo de especificación |
| Persistencia del contexto | Solo dentro de la sesión | Persistente (guardado como archivo) |
| Registro de decisiones de diseño | Ninguno (implícito) | Documentado explícitamente |
| Instrucciones a la IA | Prompt en cada ocasión | Referencia a la especificación |
| Objeto de revisión | Código | Especificación (primero) -> Código (después) |
| Escala | Individual/Pequeña escala | Equipo/Sistema de producción |

### Proceso de 4 fases del SDD

**Spec Kit** (MIT License), lanzado por GitHub en septiembre de 2025, es un kit de herramientas de código abierto para practicar SDD. Su diseño define 4 fases:

**Specify (Definición de Especificación)**: Define los viajes del usuario y los criterios de éxito. La IA genera un borrador de requirements.md, pero los humanos lo revisan y finalizan.

**Plan (Planificación Técnica)**: Declara la arquitectura, el stack tecnológico y las restricciones. La IA propone design.md, y los humanos toman la decisión.

**Tasks (Desglose de Tareas)**: Divide el trabajo en unidades pequeñas y revisables. La IA genera tasks.md.

**Implement (Implementación)**: Los agentes de IA implementan las tareas, y los humanos verifican en cada punto de control.

El punto clave de este proceso es que hay **puntos de control explícitos** en cada fase. Puede considerarse como un cambio de flujo de trabajo de "Prompt and Pray" a "Specify and Verify".

---

## Lo que revelan los Artículos de Investigación

### Beyond the Prompt: Estudio empírico de Cursor Rules (arXiv\:2512.18925)

Una investigación realizada por Shaokang Jiang y Daye Nam, investigadores de Microsoft y GitHub, es el primer estudio empírico a gran escala que analiza archivos `.cursorrules` en 401 repositorios de código abierto (presentación prevista en MSR 2026).

La clasificación establecida por este estudio clasifica la provisión de contexto a los asistentes de codificación de IA en 5 temas:

| Tema | Contenido |
|:---|:---| 
| Convenciones | Estilo de código, reglas de nomenclatura, formato |
| Directrices | Patrones de arquitectura, mejores prácticas |
| Información del Proyecto | Stack tecnológico, dependencias, estructura de directorios |
| Directivas LLM | Instrucciones directas a la IA (qué hacer/no hacer) |
| Ejemplos | Ejemplos específicos de patrones de código esperados |

Un descubrimiento importante es que "**no solo los prompts, sino también las directivas persistentes legibles por máquina influyen en la efectividad de la IA**". Los archivos de contexto persistentes como `.cursorrules` o `CLAUDE.md`, en lugar de prompts temporales, son los que dictan la calidad de los asistentes de codificación de IA.

### Promptware Engineering: Gestión del ciclo de vida de las especificaciones (arXiv\:2503.02400)

El artículo "Promptware Engineering" señala que el desarrollo actual de prompts se encuentra en una "crisis de promptware dependiente de prueba y error" (aceptado por ACM TOSEM).

Como solución, se propone tratar los prompts (especificaciones) como "artefactos de software" y gestionarlos en el siguiente ciclo de vida:

```
Definición de Requisitos → Diseño → Implementación → Pruebas → Depuración → Evolución → Despliegue → Monitoreo
```

Las especificaciones deben tratarse de la misma manera que el código, como objeto de "control de versiones, pruebas y mejora continua".

### 10 Directrices para Prompts de Generación de Código (arXiv\:2601.13118)

Identificado a través de una encuesta a 50 profesionales, el hallazgo más interesante de este estudio es que "**la utilidad percibida y la frecuencia de uso real no coinciden**".

Los profesionales saben que "especificar explícitamente las especificaciones de entrada/salida" y "definir precondiciones/postcondiciones" son útiles, pero en realidad no los utilizan. El SDD intenta resolver esta brecha de "saber pero no hacer" incorporándola como un flujo de trabajo.

### Desglose de Tareas Multiagente y Protección de la Consistencia (arXiv\:2511.01149)

El artículo "Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems" propone un método para incorporar **análisis de restricciones y mecanismos de protección de la consistencia** durante el desglose de tareas.

Detecta conflictos entre subtareas de antemano y previene "bucles de alucinación" en entornos multiagente. Esto se corresponde directamente con el enfoque del SDD de "hacer de la especificación el lenguaje común entre agentes".

---

## Ingeniería de Contexto: Más allá de las Especificaciones

### De la Ingeniería de Prompts a la "Ingeniería de Contexto"

Anthropic definió la evolución de este concepto en septiembre de 2025 en su artículo "Effective Context Engineering for AI Agents".

La **ingeniería de contexto** se define como "maximizar la probabilidad de obtener resultados deseables con un conjunto mínimo de tokens de alta señal". Si la ingeniería de prompts es la tecnología para "optimizar la interacción única entre humanos y LLM", entonces la ingeniería de contexto es la tecnología para "**diseñar el flujo de información entre el agente y todo el entorno**".

Anthropic advierte sobre el fenómeno de "**corrupción de contexto**" que acompaña a la expansión de la ventana de contexto. Cuanto más largo es el contexto, mayor es el riesgo de que el LLM no pueda recordar la información posterior con precisión. Simplemente entregarle a la IA "lea toda la especificación" no es suficiente; es crucial un diseño que **proporcione la información necesaria en el momento necesario**.

### 4 Tecnologías Recomendadas

Las técnicas de gestión de contexto recomendadas por Anthropic son las siguientes 4:

**Recuperación Justo a Tiempo**: En lugar de entregar toda la especificación a la vez, inyectar dinámicamente solo la información necesaria para la tarea.

**Compacción del Historial de Conversación**: Resumir y comprimir conversaciones largas para mantener la calidad del contexto.

**Toma de Notas Estructurada**: Registrar decisiones y descubrimientos importantes de forma estructurada para poder consultarlos en llamadas posteriores a la IA.

**Arquitectura de Subagentes**: Dividir en agentes especializados para minimizar el contexto de cada agente.

### Principios de Diseño de AGENTS.md / CLAUDE.md

"How to Write a Great agents.md" de GitHub (análisis de más de 2,500 repositorios) define 6 áreas principales para archivos de contexto efectivos:

```
1. Comandos — Comandos para ejecutar builds, pruebas, linters
2. Pruebas — Métodos de ejecución de pruebas y resultados esperados
3. Estructura del Proyecto — Organización de directorios y roles de cada archivo
4. Estilo de Código — Convenciones de formato, reglas de nomenclatura
5. Flujo de Trabajo Git — Estrategia de ramas, convenciones de mensajes de commit
6. Límites — Siempre ejecutar / Confirmación previa / Prohibido
```

Sin embargo, hay que tener en cuenta que una investigación de ETH Zurich publicada en 2026 señaló que "los archivos de contexto generados por LLM tienen un efecto marginalmente negativo en la tasa de éxito de las tareas". La mejor práctica actual es "limitar la escritura en archivos de contexto solo a la información que no se puede inferir de las herramientas o el código existente".

---

## Práctica: 6 Elementos a Incluir en las Especificaciones de SDD

Las especificaciones creadas en SDD deben incluir obligatoriamente los siguientes 6 elementos:

**1. Historias de Usuario y Stakeholders**
Describir claramente "quién" necesita "qué" "para qué propósito".

**2. Criterios de Éxito Medibles**
Definir cuantitativamente, en lugar de "mejorar el rendimiento", como "LCP inferior a 2.5 segundos".

**3. Requisitos Funcionales y No Funcionales**
Describir "qué hacer" y también "qué no hacer" (restricciones explícitas).

**4. Contexto Técnico y Puntos de Integración**
Especificar las interfaces con sistemas existentes, las API y las bibliotecas a utilizar.

**5. Precondiciones, Postcondiciones e Invariantes**
Definir formalmente las restricciones lógicas que la función, módulo o sistema debe cumplir.

```markdown
## API de Registro de Usuario (POST /api/users)

### Precondiciones
- La dirección de correo electrónico no está registrada
- La contraseña tiene 8 caracteres o más

### Postcondiciones
- El usuario se guarda en la base de datos
- Se envía un correo electrónico de confirmación
- La respuesta incluye JWT

### Invariantes
- La contraseña se almacena hasheada (no en texto plano)
- La dirección de correo electrónico se normaliza a minúsculas
```

**6. Pruebas de Aceptación**
Describir "cuándo está completo" de una manera verificable. La IA utiliza esto como punto de referencia para el código de prueba.

### La importancia de especificar "prohibiciones"

Como señala antirez, el autor de Redis, es importante incluir en la especificación "pistas sobre buenas soluciones que parecen malas".

```markdown
## Patrones Prohibidos
- Uso de variables globales (usar inyección de dependencias en su lugar)
- Control asíncrono con setTimeout (usar Promises)
- Casting a tipo any (usar inferencia de tipos o union)
- Acceso directo a la base de datos (siempre pasar por la capa de repositorio)
```

### Cambio de paradigma de depuración

En SDD, la depuración significa **modificar la especificación** en lugar de corregir el código. Los errores de código son síntomas de lagunas en la especificación, y la modificación de la especificación se propaga a todo el código generado, lo que resulta en correcciones consistentes.

---

## El Futuro según el Informe de Tendencias de Anthropic de 2026

El "2026 Agentic Coding Trends Report" publicado por Anthropic en enero de 2026 informa que el desarrollo de software está experimentando "**la mayor transformación desde la GUI**".

El rol del ingeniero está migrando de "escritor de código" a "coordinador de agentes de IA". Sin embargo, el informe también ofrece una advertencia importante: **solo entre el 0% y el 20% de las tareas son completamente delegables**; el resto requiere supervisión activa, verificación y juicio humano.

Las prioridades estratégicas para 2026 incluyen:
- Dominar la coordinación multiagente
- Escalar la supervisión humano-agente
- Incorporar arquitectura de seguridad

Lo que este informe muestra es que SDD no es solo una "forma de escribir especificaciones", sino una **infraestructura organizacional y técnica para la colaboración segura entre agentes de IA y humanos**.

---

## Conclusión: ¿Son las Especificaciones más importantes que el Código?

La proposición que presenta SDD es provocativa: **las especificaciones son el entregable de ingeniería más importante**.

Tradicionalmente, "escribir código" era el trabajo principal de un ingeniero. En un mundo donde la IA puede escribir código, "definir qué escribir" se convierte en el valor central del ingeniero.

"La IA puede escribir código, pero definir "qué construir" sigue siendo trabajo humano". Este cambio de percepción es el primer paso para tener éxito en el desarrollo impulsado por IA.

El principio de "invertir una hora en planificación para ahorrar diez horas de trabajo de rehacer" se ha convertido en una de las inversiones con mayor retorno en 2026. La diversión intuitiva del Vibe Coding puede desaparecer. Sin embargo, con SDD, podemos recuperar la **confiabilidad y la previsibilidad** del código generado por IA.

---

## Referencias

| Título | Fuente | Fecha | URL |
|:---|:---|:---|:---| 
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

> Este artículo fue generado automáticamente por LLM. Puede contener errores.
