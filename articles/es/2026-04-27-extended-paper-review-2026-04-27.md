---
title: "Revisión ampliada de artículos: “Nuevos modelos y verificación” que atraviesan la autonomía, la creación de fármacos y el impacto social"
slug: "extended-paper-review-2026-04-27"
summary: "A partir del 2026-04-27 (JST), a partir de artículos recientes desde la publicación anterior, se abordan agentes autónomos, IA para creación de fármacos, finanzas/economía conductual y ciencias soc..."
date: "2026-04-27T18:30"
tags: ["arXiv","Agentes autónomos","IA para creación de fármacos","Economía conductual","Ciencias sociales computacionales"]
category: "extended-paper-review"
automated: true
provider: "openai"
sources: ["https://arxiv.org/abs/2604.07921","https://arxiv.org/abs/2604.18373","https://arxiv.org/abs/2602.09362","https://arxiv.org/abs/q-bio/0606012","https://arxiv.org/abs/2112.01871","https://arxiv.org/abs/2401.17435"]
sns_topics: [{"topic":"Conciencia sobre sostenibilidad en robótica (cs.RO)","summary":"En un estudio a gran escala, los artículos de robótica mencionan los ODS en muy pocos casos, y se cuantificó la brecha entre la intención y la implementación."},{"topic":"Economía conductual de agentes con LLM (mercados experimentales)","summary":"A partir de operaciones de mercado de agentes con LLM, se observaron patrones conductuales como el efecto de disposición y creencias retrospectivas, y también se demostró el efecto de las intervenciones."},{"topic":"El supuesto de la IA para el descubrimiento de fármacos: predicción de estructuras de proteínas","summary":"Con base en marcos clásicos, se revisó el contexto de investigación de los enfoques generativos y predictivos recientes."}]
thumbnail: "/images/extended-paper-review-2026-04-27.png"
---
### 1. Resumen ejecutivo
En esta revisión, el eje no fue solo “construir un nuevo modelo”, sino “en qué medida puede reproducir o mejorar las restricciones del mundo real y el comportamiento social”.

En robótica, se aprecia una tendencia a cuantificar la escasez de menciones sobre sostenibilidad mediante el análisis de enormes corpus.

En finanzas y economía conductual, el foco está en los sesgos de comportamiento que los agentes con LLM muestran en el mercado y cómo aumentan o disminuyen con intervenciones en el prompt.

Por otro lado, se organiza también qué hereda el conjunto de técnicas actuales, partiendo de la base esencial de la predicción de estructuras de proteínas, que constituye el cimiento de la IA para creación de fármacos.

### 2. Artículos destacados (selección desde cada área)

#### Artículo 1: La brecha de sostenibilidad en robótica: una encuesta a gran escala sobre 50.000 artículos de investigación (robótica, agentes autónomos)

- **Autores y afiliaciones**: Antun Skuric, Leandro Von Werra, Thomas Wolf (la afiliación figura en la página del artículo)
- **Contexto e investigación del estudio**: Si bien los robots autónomos o la automatización se convierten en un tema de carga ambiental e impacto ético a medida que se implementan en la sociedad, es un problema difícil de cuantificar “si la comunidad investigadora lo explicita con la sostenibilidad como motivación”. Así, este estudio plantea como pregunta investigar en el inmenso conjunto de artículos del área cs.RO hasta qué punto aparece la conciencia sobre sostenibilidad (motivación, descripción de impactos y conexión con los ODS).
- **Método propuesto**: Para un corpus de gran escala, se agregan como indicadores basados en reglas/clasificatorios la aparición de términos relacionados con sostenibilidad, la presencia o ausencia de menciones sobre lo social, ecosistemas o sostenibilidad, y además menciones explícitas a los UN Sustainable Development Goals (SDGs). En resumen, es un diseño para medir “hasta qué punto el punto de vista de sostenibilidad está ‘escrito’ dentro de las afirmaciones de investigación”.
- **Resultados principales**: Como resultado, se muestra una “brecha” en la que la proporción que toca impactos relacionados con sostenibilidad es extremadamente baja, y en particular las referencias explícitas a SDGs son aún menores (en el resumen de los abstracts de los artículos hay reportes de rangos como “menciones explícitas a SDGs por debajo del 0,1%” y “motivación de sostenibilidad por debajo del 5%”). Incluso en áreas donde la investigación en robótica podría aplicarse a problemas sociales, el planteamiento de la investigación (la forma en que se narra) no se vuelve estándar con la sostenibilidad.
- **Significado y limitaciones**: La contribución es que visualiza, a una escala muy fuerte, si la sostenibilidad se habla como un “objetivo de esfuerzo” o si se posiciona como el valor de los resultados de investigación. Por otro lado, como limitación, que haya pocas menciones no equivale necesariamente a que la carga ambiental sea baja o que no se haya considerado. Es, como mínimo, una “exposición explícita en el texto”, y podría no seguir directamente el estado real de la implementación ni la medición (por ejemplo, evaluación del ciclo de vida).
- **Fuente**: [The Sustainability Gap in Robotics: A Large-Scale Survey of Sustainability Awareness in 50,000 Research Articles](https://arxiv.org/abs/2604.07921)

Este artículo ofrece a quienes empiezan una perspectiva: “el valor de la investigación no está solo en los puntajes de rendimiento, sino también en para qué objetivos se construye (motivación e impacto)”. Para ponerlo en términos sencillos, es la diferencia entre un auto que solo dice “qué tan seguro es” y un auto que explica “cómo se diseñó incluyendo el consumo de combustible y las emisiones”. Si la comunidad investigadora no adopta el segundo tipo de discurso, será difícil para el lado social decidir “por qué se necesita esta tecnología”. En términos industriales, si desde la fase de investigación se alinea la sostenibilidad, podría avanzar con antelación la discusión sobre compras, cumplimiento normativo y evaluación ESG.

#### Artículo 2: “Descomponer” las burbujas de comportamiento financiero y de mercado: formación de expectativas y trading mediante agentes LLM (ingeniería financiera, finanzas computacionales)

- **Autores y afiliaciones**: Shumiao Ouyang, Pengfei Sui (la afiliación figura en la página del artículo)
- **Contexto e investigación del estudio**: En los mercados se observan factores conductuales que no pueden explicarse completamente incluso asumiendo expectativas racionales (por ejemplo, sesgo hacia la información más reciente, o tanto la aversión a las pérdidas como, por el contrario, una tendencia a “deshacerse” de activos). Por tanto, la pregunta es: “cuando se hace que un modelo de lenguaje a gran escala como LLM participe en el mercado como agente, aparecen los patrones conductuales conocidos en la investigación humana?” y “además, ¿cómo se detecta ese ‘mecanismo’ y cuánto puede cambiarse mediante intervenciones como el prompt?”.
- **Método propuesto**: Se construye un mercado de subasta de llamada abierta en simulación y se hace participar a agentes LLM (en términos generales, entidades autónomas que realizan generación de lenguaje e inferencia). Se observan la formación de expectativas y la conducta de órdenes de cada agente, y se evalúan fenómenos conocidos en economía conductual (por ejemplo, el efecto de disposición, o el ponderado de información retrospectiva/reciente) mediante indicadores. Además, se puntúan los textos de razonamiento de los agentes con un marco tipo “20 mecanismos” para explorar qué mecanismos se relacionan con la formación de burbujas.
- **Resultados principales**: En el resumen del abstract se reporta que (1) como patrones conductuales clásicos se observan el efecto de disposición y “recency-weighted extrapolative beliefs (creencias extrapolativas ponderadas por lo reciente)”; (2) eso se agrega como dinámica de equilibrio y reproduce relaciones conocidas en mercados de activos experimentales (como que el exceso de demanda predice futuros precios, o que la discrepancia de opiniones y el volumen de trading se relacionan de forma positiva, etc.); y (3) usando un “puntaje por mecanismo” sobre los textos de razonamiento, algunas intervenciones específicas en el prompt pueden aumentar o disminuir de manera causal el tamaño de la burbuja.
- **Significado y limitaciones**: La contribución es que sugiere que los LLM pueden ser agentes con un “estilo de comportamiento” en la toma de decisiones económicas, no solo generadores de texto, y que intenta vincular cómo actúan las intervenciones con qué mecanismos de comportamiento las vuelven efectivas, usando huellas basadas en lenguaje. Como limitación, la causalidad que se obtiene aquí puede depender fuertemente del entorno de mercado diseñado, del espacio de prompts y de los indicadores de evaluación. Además, como no es posible reproducir completamente las instituciones del mercado real y las asimetrías de información, hay que tener cuidado al generalizar.
- **Fuente**: [Dissecting AI Trading: Behavioral Finance and Market Bubbles](https://arxiv.org/abs/2604.18373)

El núcleo de este trabajo es la postura de “leer la fluctuación del mercado hasta el contenido del razonamiento”. Reformulándolo para principiantes: no se estima solo si el precio sube o baja (resultado), sino que se infiere desde el texto por qué los agentes tomaron esa decisión (posibles causas) y, luego, se interviene en esas causas para comprobar la reproducibilidad. Es una idea similar a verificar, en el control de robots, no solo que “la salida sea buena”, sino que “la ley de control opere en el lado seguro”. A nivel industrial, se vuelve importante entender “de qué mecanismos de comportamiento depende” en el diseño, regulación y auditoría (auditing) de traders con IA. Por ejemplo, si cambios en prompts determinan la resistencia a burbujas, la gestión de cambios durante la operación (gobernanza de versiones de modelos/prompts) se traduce directamente en riesgos económicos.

#### Artículo 3: Economía conductual de la IA: sesgos de LLM y sus correcciones (psicología, ciencias cognitivas)

- **Autores y afiliaciones**: Autores tal como se indica en el abstract (seguir lo indicado en la página del artículo)
- **Contexto e investigación del estudio**: En la investigación sobre toma de decisiones humanas se sabe que los sesgos cognitivos distorsionan el comportamiento de manera sistemática. En escenarios donde la IA —en particular los LLM— se usa para la toma de decisiones, aparece el problema de cómo afectan al resultado conductual los “hábitos de salida” o la susceptibilidad a ser inducido del propio sistema. Por ello, este artículo busca capturar los sesgos observados en LLM dentro de un marco de economía conductual y evaluar la posibilidad de corrección (corrección de sesgos).
- **Método propuesto**: Se proporcionan a los LLM entradas relacionadas con la toma de decisiones y se analiza el sesgo de la salida. Además, se introducen intervenciones para reducir el sesgo (prompts y restricciones, y en algunos casos diseños comparativos), y se evalúa si el sesgo mejora “de manera estadística”.
- **Resultados principales**: A partir del resumen en la página del artículo, se sugiere que los LLM pueden mostrar patrones de error sistemáticos similares a los observados en estudios con humanos, y que existe posibilidad de corrección con ciertas intervenciones (para indicadores detallados o tamaños de efecto, hay que revisar el cuerpo del artículo). En cualquier caso, la postura central es que “los errores de LLM no son aleatorios, sino que pueden estar sesgados en relación con el diseño”.
- **Significado y limitaciones**: La contribución es conectar conceptos de psicología y ciencias cognitivas con la evaluación de IA, moviendo el sesgo de un “fenómeno” a un “objeto de mejora”. Como limitación, no está claro qué sesgos se reproducen en qué tareas prácticas específicas; eso depende del diseño de la tarea y de la distribución de datos. La investigación sobre sesgos de IA suele enfrentar el problema de la brecha entre el diseño del laboratorio y los entornos operativos reales.
- **Fuente**: [Behavioral Economics of AI: LLM Biases and Corrections](https://arxiv.org/abs/2602.09362)

Si se resume el punto de este artículo para principiantes, es el siguiente: “los ‘hábitos de respuesta’ de un LLM pueden interpretarse como del mismo tipo que los sesgos que trata la economía conductual”. Por ejemplo, así como las personas en encuestas pueden ser llevadas hacia opciones específicas, los LLM también pueden ser arrastrados hacia un formato o un contexto particular. En cuanto al impacto social e industrial, en el apoyo a la toma de decisiones (selección en contratación, concesión de préstamos, selección educativa, etc.) no basta con dar “respuestas que suenan convincentes”; se necesita auditar por tipo de sesgo y preparar medios de corrección.

#### Artículo 4: Inferencia activa (Active Inference) aplicada a robótica y agentes artificiales: encuesta y retos (robótica, agentes autónomos)

- **Autores y afiliaciones**: Autores principales y afiliaciones tal como se indica en la página del artículo (el abstract se basa en la página del artículo)
- **Contexto e investigación del estudio**: Los agentes autónomos deben observar, razonar y actuar en presencia de incertidumbre. Como enfoque, la “inferência activa” es conocida como una forma de optimizar el mundo: actualizar estados del mundo y políticas a través de la optimización mediante errores de predicción (la discrepancia entre la expectativa y la observación). Esta encuesta parte de la pregunta de cómo puede usarse este marco en robótica y en qué puntos existen dificultades.
- **Método propuesto**: Más que proponer una sola idea, como una encuesta se revisan casos de aplicación de Active Inference en robótica y agentes artificiales (estimación de estado, control, comportamiento orientado a metas, etc.) y se resume el estado alcanzado y los cuellos de botella.
- **Resultados principales**: En el resumen del abstract se menciona la posibilidad de que Active Inference sea una base para estimación de estados y control bajo incertidumbre, así como para el comportamiento guiado por metas.
- **Significado y limitaciones**: La contribución es proporcionar un mapa general del panorama metodológico, de modo que los investigadores que se incorporen puedan identificar “dónde están las brechas”. Como limitación, dado que es una encuesta, podría no presentar directamente “los números de rendimiento del nuevo resultado de esta semana”.
- **Fuente**: [Active Inference in Robotics and Artificial Agents: Survey and Challenges](https://arxiv.org/abs/2112.01871)

Este artículo reafirma a principiantes que “la autonomía no es solo aprendizaje por refuerzo”. Active Inference, por así decirlo, es como si “el robot siguiera actualizando un mapa del mundo dentro de su cabeza”: observa, corrige el mapa (creencias) y vuelve a actualizarlo con la siguiente acción. En sociedad e industria, podría despertar interés como un marco con buena compatibilidad con la explicabilidad (por qué eligió esa acción) y con las verificaciones de seguridad.

#### Artículo 5: Predicción de estructuras de proteínas: la próxima generación (ciencias de la vida, IA para creación de fármacos)

- **Autores y afiliaciones**: Michael C. Prentiss y otros (se indica en la página del artículo)
- **Contexto e investigación del estudio**: En la IA para creación de fármacos, la predicción de estructuras de proteínas es una fase previa para comprender “la forma en que el fármaco se une”. Sin embargo, la predicción de estructuras depende fuertemente de supuestos sobre el paisaje de energía y el plegamiento, y requiere ajustes tanto teóricos como de implementación para mejorar la precisión. Este estudio ofrece una visión general de la evolución en predicción de estructuras de proteínas y presenta ideas para la mejora.
- **Método propuesto**: Basándose en una visión desde la mecánica estadística y el paisaje de energía, se presentan ideas que conducen a la mejora de la función de energía predictiva, como el uso del ensamble (un conjunto de estructuras candidatas múltiples).
- **Resultados principales**: En el contexto de una revisión del artículo, se explica cómo ha evolucionado el marco de predicción y conceptos subyacentes a ese paisaje de energía (por ejemplo, “funnelled energy landscape”).
- **Significado y limitaciones**: La contribución es que permite ordenar el trasfondo teórico como base para entender “el estado actual” de la IA para creación de fármacos. Como limitación, este artículo en sí contiene contenido clásico, por lo que la correspondencia directa con modelos generativos recientes y benchmarks recientes depende del cuerpo del texto.
- **Fuente**: [Protein Structure Prediction: The Next Generation](https://arxiv.org/abs/q-bio/0606012)

Este artículo cumple un rol de estructurar el “punto de entrada” para principiantes en IA para creación de fármacos. A menudo la IA para creación de fármacos parece terminar “cuando el modelo predice”, pero conocer cómo esas “intuiciones basadas en física” que sustentan los supuestos se reflejan en el diseño del modelo y en lo que se usa para entrenarlo conecta directamente con la precisión y la reproducibilidad en aplicaciones. En el plano industrial, cuanto mayor sea la fiabilidad de la predicción de estructuras, más fuertes pueden ser los preprocesos para la predicción de acoplamientos y la exploración de leads, lo que potencialmente reduce el coste de exploración.

### 3. Consideraciones transversales entre artículos
El tema común que atraviesa estos cinco trabajos es: “cómo construir no solo el rendimiento del modelo (tasa de aciertos), sino también el diseño de evaluación, la verificabilidad y la coherencia social”.

En robótica, la “explicitud” de la sostenibilidad se convirtió en objeto de medición, y el modo en que se narra la investigación se transformó en un indicador. Esto apunta a una dirección similar a los “meta-evaluaciones” que conectan la ingeniería con la sociedad.

En finanzas computacionales y economía conductual, se mostró que las acciones de los agentes LLM reproducen relaciones de mercados clásicos de activos experimentales, y que además pueden cambiarse causalmente mediante intervenciones. Aquí, no solo importa el comportamiento observable, sino también la estimación del mecanismo a partir de textos de razonamiento.

Los artículos desde psicología y ciencias cognitivas toman los sesgos de la IA con el lenguaje del sesgo, y al verificar la posibilidad de corrección acercan la evaluación de IA a “experimentos de ciencias cognitivas”.

En IA para creación de fármacos, el ordenamiento del trasfondo teórico de la predicción de estructuras de proteínas funciona como base para comprender las técnicas actuales. Aunque el avance de los modelos generativos es rápido, la continuidad de la intuición física puede afectar la robustez y la interpretabilidad de los modelos.

En conjunto, aunque existan diferencias entre las áreas de estas 10 líneas, como interés común a nivel de diseño de investigación emergen tres puntos: “indicadores verificables”, “variables que pueden intervenirse” y “explicaciones que conectan con las exigencias de la sociedad”.

### 4. Referencias
| Título | Fuente de información | URL |
|---------|--------|-----|
| The Sustainability Gap in Robotics: A Large-Scale Survey of Sustainability Awareness in 50,000 Research Articles | arXiv | https://arxiv.org/abs/2604.07921 |
| Dissecting AI Trading: Behavioral Finance and Market Bubbles | arXiv | https://arxiv.org/abs/2604.18373 |
| Behavioral Economics of AI: LLM Biases and Corrections | arXiv | https://arxiv.org/abs/2602.09362 |
| Active Inference in Robotics and Artificial Agents: Survey and Challenges | arXiv | https://arxiv.org/abs/2112.01871 |
| Protein Structure Prediction: The Next Generation | arXiv | https://arxiv.org/abs/q-bio/0606012 |

---

> Este artículo fue generado automáticamente por LLM. Puede contener errores.
