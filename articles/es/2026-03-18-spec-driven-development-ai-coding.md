---
title: "Introducción al Desarrollo Dirigido por Especificaciones (Spec-Driven Development) — Por qué los Documentos de Especificaciones se han vuelto Cruciales en el Desarrollo Impulsado por IA"
slug: "spec-driven-development-ai-coding"
summary: "A medida que las limitaciones del \"Vibe Coding\" se vuelven evidentes, el Desarrollo Dirigido por Especificaciones (SDD), que trata las especificaciones como \"contratos\" para la IA, está emergiendo ..."
date: "2026-03-18"
tags: ["Desarrollo de IA","Especificaciones","SDD","Ingeniería de Contexto","LLM","Claude Code"]
category: "tech-article"
automated: false
thumbnail: "/images/spec-driven-development.png"
draft: false
---
## Introducción — Se acabó el idilio del "Vibe Coding"

A principios de 2025, Andrej Karpathy, cofundador de OpenAI, propuso el concepto de "Vibe Coding": un estilo de desarrollo donde se lanzan indicaciones intuitivas a la IA y se acepta el código generado casi sin cambios. Inicialmente fue recibido como una revolución en la productividad, pero el optimismo no duró mucho.

La realidad, según muestran los datos de investigación, es dura. Una encuesta de Veracode en 2025 reveló que el **45% del código generado por IA contenía vulnerabilidades de seguridad**. Un análisis de CodeRabbit de 470 Pull Requests de código abierto encontró que el código coescrito por IA tenía **1.7 veces más "problemas críticos"**, un 75% más de configuraciones erróneas y 2.74 veces más vulnerabilidades de seguridad que el código escrito por humanos. Paradójicamente, los desarrolladores experimentados vieron su **productividad disminuir en un 19%** al usar herramientas de codificación de IA (a pesar de que esperaban un aumento del 24%).

¿Cuál es la causa raíz de esta situación, a menudo denominada "resaca del Vibe Coding"? Y, ¿qué es el **Desarrollo Dirigido por Especificaciones (Spec-Driven Development - SDD)**, el paradigma que está surgiendo como solución? Este artículo lo explica en detalle, combinando estudios, casos de empresas y conocimiento práctico.

---

## Razones Estructurales por las que el Vibe Coding Falla

### El Problema de la "IA que no lee la mente"

El blog de GitHub lo expresa de forma concisa: "**Los LLM son excelentes para completar patrones, pero no pueden leer mentes**".

Si le pides a un asistente de codificación de IA que "cree una función de inicio de sesión", generará alguna forma de función de inicio de sesión. Pero, ¿utilizará OAuth 2.0, cómo manejará la gestión de sesiones, se ajustará al esquema de la base de datos existente o cumplirá con los requisitos de seguridad? Sin especificar esto explícitamente, la IA simplemente completará el código "apropiado".

### Problema de "Shadow Bug" y el Bucle de Alucinación

Los problemas creados por el Vibe Coding se pueden clasificar en dos categorías principales.

Una es el **Shadow Bug** (código que parece correcto pero contiene vulnerabilidades graves). El código funciona y pasa las pruebas, pero bajo ciertas condiciones puede ocurrir inyección SQL o ser posible eludir la autenticación. Los problemas a menudo solo se manifiestan en el entorno de producción.

La otra es el **bucle de alucinación**. En sistemas multiagente donde colaboran múltiples agentes de IA, un agente erróneo puede ser considerado correcto por otro agente, creando un círculo vicioso que refuerza los errores mutuos. Sin un "punto de referencia de la verdad" como un documento de especificaciones, es imposible romper esta cadena.

```mermaid
graph LR
    A[Agente A: Implementación errónea] --> B[Agente B: Revisión]
    B --> C[Aprobado sin problemas]
    C --> D[Implementación errónea en producción]
    D --> E[Demasiado tarde cuando se descubre el bug]
```

### Pérdida de Contexto e Inconsistencia Arquitectónica

Las conversaciones con la IA restablecen el contexto en cada sesión. La IA en la siguiente sesión no sabe que en la anterior se decidió "implementar la autenticación con JWT". Cuando intervienen múltiples conversaciones o agentes de IA, el diseño arquitectónico general se fragmenta, resultando en un sistema inconsistente donde una parte usa REST y otra GraphQL.

---

## ¿Qué es el Desarrollo Dirigido por Especificaciones (Spec-Driven Development)?

### Definición y Principios Fundamentales

El Desarrollo Dirigido por Especificaciones (SDD) es un paradigma de desarrollo donde **se definen especificaciones claras (Specs) como "contratos" para la IA, y se le indica a la IA que genere código basado en esos contratos**.

Thoughtworks lo describe así: "SDD es un paradigma que utiliza especificaciones de requisitos claras como indicaciones para que los agentes de IA generen código ejecutable. Las especificaciones definen explícitamente el comportamiento externo (mapeo de entrada/salida, precondiciones/postcondiciones, invariantes, restricciones, tipos de interfaz)".

El principio de "**Invertir una hora en planificación puede ahorrar diez horas de rehacer el trabajo**" (Thoughtworks) se aplica más fuertemente en el desarrollo impulsado por IA.

### Comparación: Vibe Coding vs. SDD

| Aspecto                  | Vibe Coding                 | Desarrollo Dirigido por Especificaciones (SDD) |
| :----------------------- | :-------------------------- | :--------------------------------------------- |
| Portador principal de información | Conversación/Indicaciones   | Archivo de especificaciones                    |
| Persistencia del contexto | Solo dentro de la sesión    | Persistente (almacenado como archivo)          |
| Registro de decisiones de diseño | Ninguno (implícito)         | Documentado explícitamente                     |
| Instrucción a la IA      | Indicaciones ad hoc         | Referencia a las especificaciones              |
| Objeto de revisión       | Código (después)            | Especificaciones (primero) → Código (después)  |
| Escalabilidad            | Individual/Pequeña escala   | Equipo/Sistemas de producción                  |

### Proceso de 4 Fases del SDD

El **Spec Kit** (Licencia MIT), lanzado por GitHub en septiembre de 2025, es un kit de herramientas de código abierto para implementar SDD. Su diseño define 4 fases:

**Specify (Definir Especificaciones)**: Definir las historias de usuario y los criterios de éxito. La IA genera un borrador de requirements.md, pero los humanos lo revisan y finalizan.

**Plan (Planificación Técnica)**: Declarar la arquitectura, el stack tecnológico y las restricciones. La IA propone un design.md, y los humanos toman la decisión.

**Tasks (Desglose de Tareas)**: Dividir en unidades de trabajo pequeñas y revisables. La IA genera un tasks.md.

**Implement (Implementación)**: Los agentes de IA implementan las tareas, mientras los humanos verifican en cada punto de control.

El punto clave de este proceso es que cada fase tiene **puntos de control explícitos**. Es una transformación del flujo de trabajo de "Prompt and Pray" (indicar y rezar) a "Specify and Verify" (especificar y verificar).

---

## Lo que Revelan los Estudios

### Más Allá de la Indicación: Estudio Empírico de las Reglas de Cursor (arXiv:2512.18925)

Un estudio realizado por Shaokang Jiang y Daye Nam, investigadores de Microsoft y GitHub, es el primer estudio empírico a gran escala que analiza los archivos `.cursorrules` en 401 repositorios de código abierto (presentado en MSR 2026).

La clasificación establecida por este estudio divide la provisión de contexto a los asistentes de codificación de IA en 5 temas:

| Tema                 | Contenido                                                                      |
| :------------------- | :----------------------------------------------------------------------------- |
| Convenciones         | Estilo de código, convenciones de nomenclatura, formato                      |
| Directrices          | Patrones arquitectónicos, mejores prácticas                                     |
| Información del Proyecto | Stack tecnológico, dependencias, estructura de directorios                       |
| Directivas de LLM    | Instrucciones de acción directas a la IA (qué hacer/no hacer)                  |
| Ejemplos             | Ejemplos concretos de patrones de código esperados                             |

El descubrimiento clave es que "**no solo las indicaciones, sino también las directivas persistentes legibles por máquina influyen en la efectividad de la IA**". Los archivos de contexto persistentes, como `.cursorrules` o `CLAUDE.md`, en lugar de las indicaciones temporales, son los que dictan la calidad de los asistentes de codificación de IA.

### Ingeniería de "Promptware": Gestión del Ciclo de Vida de las Especificaciones (arXiv:2503.02400)

El artículo "Promptware Engineering" señala que el desarrollo de indicaciones actual se encuentra en una "crisis de promptware dependiente de prueba y error" (aceptado en ACM TOSEM).

Como solución, propone tratar las indicaciones (especificaciones) como "artefactos de software" y gestionarlos a través del siguiente ciclo de vida:

```
Definición de requisitos → Diseño → Implementación → Pruebas → Depuración → Evolución → Despliegue → Monitoreo
```

Las especificaciones deben tratarse de la misma manera que el código, como objeto de "control de versiones, pruebas y mejora continua".

### 10 Directrices para Indicaciones de Generación de Código (arXiv:2601.13118)

Identificado a través de una encuesta a 50 profesionales, el descubrimiento más interesante de este estudio es que "**la utilidad percibida y la frecuencia de uso real no coinciden**".

Los profesionales saben que "especificar explícitamente las especificaciones de entrada/salida" y "definir precondiciones/postcondiciones" es útil, pero en la práctica no lo utilizan. El SDD intenta cerrar esta brecha de "lo sé pero no lo hago" incorporándolo como flujo de trabajo.

### Desglose de Tareas Multiagente y Protección de la Coherencia (arXiv:2511.01149)

El artículo "Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems" propone un método para incorporar **análisis de restricciones y mecanismos de protección de la coherencia** durante el desglose de tareas.

Detecta conflictos entre subtareas de antemano y previene "bucles de alucinación" en entornos multiagente. Esto se alinea directamente con el enfoque del SDD de "hacer de las especificaciones el lenguaje común entre agentes".

---

## Ingeniería de Contexto: Más Allá de las Especificaciones

### De la Ingeniería de Indicaciones a la "Ingeniería de Contexto"

En septiembre de 2025, Anthropic definió la evolución de este concepto en su artículo "Effective Context Engineering for AI Agents".

La **Ingeniería de Contexto** se define como "maximizar la probabilidad de resultados deseables con un conjunto mínimo de tokens de alta señal". Si la ingeniería de indicaciones es la técnica para "optimizar una interacción única entre humano y LLM", la ingeniería de contexto es la técnica para "**diseñar el flujo de información para agentes y el entorno en su conjunto**".

Anthropic advierte sobre el fenómeno de la "**corrupción de contexto**" que surge con la ampliación de las ventanas de contexto. Cuanto más largo es el contexto, mayor es el riesgo de que el LLM no pueda recordar con precisión la información posterior. Simplemente pasarle a la IA "lea todas las especificaciones" no es suficiente; el diseño de **proporcionar la información necesaria en el momento necesario** se vuelve crucial.

### 4 Técnicas Recomendadas

Las cuatro técnicas de gestión de contexto recomendadas por Anthropic son:

**Recuperación Justo a Tiempo (Just-in-Time Retrieval)**: En lugar de pasar todas las especificaciones a la vez, inyectar dinámicamente solo la información necesaria para la tarea.

**Compresión del Historial de Conversación**: Resumir y comprimir conversaciones largas para mantener la calidad del contexto.

**Toma de Notas Estructurada**: Registrar decisiones y descubrimientos importantes de forma estructurada para poder referenciarlos en llamadas posteriores a la IA.

**Arquitectura de Subagentes**: Dividir en agentes especializados para minimizar el contexto de cada agente.

### Principios de Diseño para AGENTS.md / CLAUDE.md

"How to Write a Great agents.md" de GitHub (basado en el análisis de más de 2.500 repositorios) define 6 áreas centrales para archivos de contexto efectivos:

```
1. Comandos — Comandos para ejecutar builds, tests, linters
2. Tests — Cómo ejecutar tests y resultados esperados
3. Estructura del Proyecto — Organización de directorios y rol de cada archivo
4. Estilo de Código — Convenciones de formato, reglas de nomenclatura
5. Flujo de Trabajo de Git — Estrategia de ramas, convenciones de mensajes de commit
6. Límites — Siempre ejecutar / Confirmación previa / Prohibido
```

Sin embargo, hay una advertencia: un estudio de ETH Zurich en 2026 señaló que "los archivos de contexto generados por LLM tienen un efecto marginalmente negativo en la tasa de éxito de las tareas". El mejor caso práctico actual es "limitar el contenido de los archivos de contexto únicamente a la información que no se puede inferir de las herramientas o el código existente".

---

## Práctica: 6 Elementos a Incluir en las Especificaciones de SDD

Las especificaciones creadas en SDD deben incluir los siguientes 6 elementos:

**1. Historias de Usuario y Stakeholders**
Describir claramente "quién" necesita "qué" y "para qué propósito".

**2. Criterios de Éxito Medibles**
Definir cuantitativamente, en lugar de "mejorar el rendimiento", por ejemplo, "LCP inferior a 2.5 segundos".

**3. Requisitos Funcionales y No Funcionales**
Describir "qué hace" y también "qué no hace" (restricciones explícitas).

**4. Contexto Técnico y Puntos de Integración**
Especificar interfaces con sistemas existentes, APIs y bibliotecas a utilizar.

**5. Precondiciones, Postcondiciones e Invariantes**
Definir formalmente las restricciones lógicas que la función, módulo o sistema debe cumplir.

```markdown
## API de Registro de Usuario (POST /api/users)

### Precondiciones
- La dirección de correo electrónico no debe estar registrada
- La contraseña debe tener al menos 8 caracteres

### Postcondiciones
- El usuario debe estar guardado en la base de datos
- Se debe haber enviado un correo de confirmación
- La respuesta debe incluir un JWT

### Invariantes
- La contraseña debe almacenarse hasheada (no en texto plano)
- La dirección de correo electrónico debe normalizarse a minúsculas
```

**6. Pruebas de Aceptación**
Describir "cuándo está completo" de una manera verificable. La IA utiliza esto como punto de referencia para el código de prueba.

### La Importancia de Especificar "Prohibiciones"

Como señala antirez, el autor de Redis, es crucial incluir "pistas sobre soluciones aparentemente buenas pero malas" en las especificaciones.

```markdown
## Patrones Prohibidos
- Uso de variables globales (usar inyección de dependencias en su lugar)
- Control asíncrono con setTimeout (usar Promises)
- Casting a tipo any (usar inferencia de tipos o union)
- Acceso directo a la base de datos (siempre pasar a través de la capa de repositorio)
```

### Cambio de Paradigma de Depuración

En SDD, la depuración significa **modificar las especificaciones**, no el código. Los errores en el código son síntomas de lagunas en las especificaciones; al modificar la especificación, la corrección se propaga a todo el código generado, asegurando una corrección coherente.

---

## El Futuro Revelado por el Informe de Tendencias 2026 de Anthropic

El "2026 Agentic Coding Trends Report" de Anthropic, publicado en enero de 2026, informa que el desarrollo de software está experimentando "**el mayor cambio desde la GUI**".

El rol del ingeniero está evolucionando de "escribir código" a "coordinar agentes de IA". Sin embargo, el informe también presenta una advertencia importante: **solo el 0-20% de las tareas son completamente delegables**; el resto requiere supervisión activa, verificación y juicio humano.

Las prioridades estratégicas para 2026 incluyen:
- Dominar la coordinación multiagente
- Escalar la supervisión humano-agente
- Incorporar arquitecturas de seguridad

Lo que este informe sugiere es que SDD no es solo "cómo escribir especificaciones", sino **una infraestructura organizacional y técnica para que los agentes de IA y los humanos colaboren de forma segura**.

---

## Resumen: ¿Son las Especificaciones Más Importantes que el Código?

La proposición que presenta SDD es provocadora: **las especificaciones son el entregable de ingeniería más crucial**.

Tradicionalmente, "escribir código" era el trabajo principal de un ingeniero. En un mundo donde la IA puede escribir código, "definir qué escribir" se convierte en el valor central del ingeniero.

"La IA puede escribir código. Pero definir "qué construir" sigue siendo trabajo humano". Este cambio de percepción es el primer paso para tener éxito en el desarrollo impulsado por IA.

El principio de "Invertir una hora en planificación puede ahorrar diez horas de rehacer el trabajo" es una de las inversiones con mayor retorno en 2026. La diversión intuitiva del Vibe Coding puede desaparecer. Sin embargo, a través de SDD, podemos recuperar la **confiabilidad y la previsibilidad** del código generado por IA.

---

## Referencias

| Título                                                                               | Fuente                | Fecha      | URL                                                                  |
| :----------------------------------------------------------------------------------- | :-------------------- | :--------- | :------------------------------------------------------------------- |
| Beyond the Prompt: An Empirical Study of Cursor Rules                                | MSR 2026 / arXiv      | 2025-12-21 | https://arxiv.org/abs/2512.18925                                     |
| Promptware Engineering: Software Engineering for Prompt-Enabled Systems              | ACM TOSEM / arXiv     | 2025-03-04 | https://arxiv.org/abs/2503.02400                                     |
| Guidelines to Prompt LLMs for Code Generation                                        | arXiv                 | 2026-01-19 | https://arxiv.org/abs/2601.13118                                     |
| Modular Task Decomposition and Dynamic Collaboration in Multi-Agent Systems          | arXiv                 | 2025-11-03 | https://arxiv.org/abs/2511.01149                                     |
| Context Engineering for AI Agents in Open-Source Software                            | arXiv                 | 2025-10-24 | https://arxiv.org/abs/2510.21413                                     |
| Effective Context Engineering for AI Agents                                          | Anthropic Engineering | 2025-09-29 | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents |
| 2026 Agentic Coding Trends Report                                                    | Anthropic             | 2026-01-21 | https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf |
| Spec-Driven Development with AI: Get Started with a New Open Source Toolkit          | GitHub Blog           | 2025-09-02 | https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/ |
| How to Write a Great agents.md: Lessons from Over 2,500 Repositories                 | GitHub Blog           | 2025-11-19 | https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/ |
| Spec-Driven Development: Unpacking One of 2025's Key New AI-Assisted Engineering Practices | Thoughtworks          | 2025-11    | https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices |
| My LLM Coding Workflow Going into 2026                                               | Addy Osmani           | 2025-12    | https://addyosmani.com/blog/ai-coding-workflow/                                  |
| How to Write a Good Spec for AI Agents                                               | Addy Osmani           | 2025-10    | https://addyosmani.com/blog/good-spec/                                           |
| Coding with LLMs in the Summer of 2025                                               | antirez               | 2025-07    | https://antirez.com/news/154                                                     |
| Vibe Coding: Pros, Cons, and 2026 Forecasts                                          | PVS-Studio            | 2025-12    | https://pvs-studio.com/en/blog/posts/1338/                                       |
| The Evidence Against Vibe Coding: What Research Reveals About AI Code Quality       | SoftwareSeni          | 2026       | https://www.softwareseni.com/the-evidence-against-vibe-coding-what-research-reveals-about-ai-code-quality/ |
| Spec-Driven Development with AI Coding Agents: The Workflow Replacing "Prompt and Pray" | Java Code Geeks       | 2026-03    | https://www.javacodegeeks.com/2026/03/spec-driven-developmentwith-ai-coding-agents-the-workflow-replacingprompt-and-pray.html |

---

> Este artículo fue generado automáticamente por LLM. Puede contener errores.
