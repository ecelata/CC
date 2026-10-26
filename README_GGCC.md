# GGCC · Suite comercial — README de referencia

**Última actualización:** 25/10/2026 (madrugada) — nuevo `backlog.html` (Backlog estilo tablero, en paralelo al clásico). Antes, el mismo día: reconciliado contra el repo publicado (último commit 03/10/2026): Backlog con 7 pestañas (Histórico, Equipo, Kanban de oportunidades), importación Salesforce, rol solo lectura, etapas nuevas. Mismo día: purga del historial del repo (ver sección 9) y tarifario solo desde Firestore.
**Repo:** `github.com/ecelata/CC` · **Publicado en:** `https://ecelata.github.io/CC/`

> **Fuente de verdad = el código del repo `ecelata/CC` (público, se puede clonar).** Si este README y el código discrepan, manda el código. Los datos (oportunidades, cuentas, histórico, tareas, proyectos, escenarios) viven en Firestore y solo se ven logueado.

Este documento es el ancla del proyecto — si en algún momento una conversación con Claude se pierde o se comprime, este archivo (más el código y los datos en Firestore) alcanza para retomar todo desde cero.

---

## 1. Qué es esto

Suite de 5 herramientas HTML standalone para gestión comercial GGCC (Grandes Clientes), books Banca + CCEE (Cuentas Estratégicas) Servicios + CCEE Industria, bajo Gerente G1 Ramírez Gonzalo, con 3 responsables: Casil Silvana Paula (G2, Banca), Urrutigoity Raúl (Jefe/Coordinador, CCEE), Banovaz Gabriela Edith (Jefe/Coordinador, CCEE).

Comparten identidad visual (beige + celeste Bitrix, DM Sans, con **5 temas intercambiables**: celeste, rojo, nuevo, claro, oscuro), un **CSS compartido** (`design-system.css` + `theme-toggle.js`), una barra de navegación común, y login obligatorio con Google.

| Herramienta | Archivo | Qué hace | Datos |
|---|---|---|---|
| Sistema de diseño | `design-system.css` | Colores, tipografías, nav, login, botones — compartido por las 4 | No es una página, es la hoja de estilos de todas |
| Selector de tema | `theme-toggle.js` | Inyecta los 5 puntitos de tema en la nav (e íconos Lucide en el tema Nuevo), guarda la elección en localStorage | No es una página, es lógica compartida |
| Portal | `index.html` | Landing con tarjetas a las herramientas | Sin datos propios |
| Cartera | `dashboard.html` | Visualiza las ~587 cuentas de la cartera filtrada | Firestore (`backlog/cuentas`) |
| Backlog | `Backlog_Preventa.html` (~3.100 líneas) | Pipeline de oportunidades, BANT, bitácora, Agenda, Kanban de oportunidades, Equipo, Histórico de ganadas, importación Salesforce | Firestore (`backlog/data`, `backlog/agenda_tasks`) |
| Backlog nuevo | `backlog.html` | Tablero estilo Jira (en paralelo al clásico): alta rápida con BANT, panel lateral, import del portal, Staff del martes, Ideas y campañas (ver sección 6d) | Firestore (`backlog/oportunidades_v2`) |
| Proyectos | `proyectos.html` | Seguimiento de proyectos creados desde oportunidades Ganadas del Backlog (ver sección 6b) | Firestore (`backlog/proyectos`) |
| Calculadora | `calculadora.html` | Dimensionamiento de costos DCV (BOM) | Firestore (`backlog/tarifario`, `backlog/calculadora_escenarios`) |
| Otros en el repo | `Consultor_Cloud_All_In_One.html`, `logo-personal-tech.png` (logo en la barra de navegación, linkeado al repo) | Brand de la nav: "B2B / CCEE Banca Servicios e Industria" |
| Personal Tech | `personal-tech/index.html` | Microsite de recursos cloud (AWS, IA, playbooks) — independiente, sin login, no toca Firestore ni el CSS compartido | Archivos propios en `/personal-tech/` |

**Ningún archivo CSV vive más en el repo** — `cuentas.csv` y `tarifario.csv` se migraron a Firestore y fueron borrados del repo público **y de todo su historial** (purga del 25/10/2026). Todo el contenido sensible (CUITs, mails, teléfonos, montos de pipeline) queda detrás del login.

---

## 2. Diseño — CSS compartido (`design-system.css`)

**Regla de oro: nunca pegar colores, fuentes, o estilos del nav/login/botones adentro de un HTML individual.** Todo eso vive en `design-system.css`, y las 4 páginas lo importan con:
```html
<link rel="stylesheet" href="design-system.css">
```

**Qué vive en el archivo compartido:**
- Variables de color (`--paper`, `--ink`, `--stamp`, `--gold`, `--red`, `--green`, etc.)
- Variables de tipografía (`--sans`, `--heading`, `--display`, `--mono`)
- `body` base, `h1/h2/h3` genéricos
- `.suite-nav` (la barra de navegación superior)
- `#authGate` (la pantalla de login)
- Botones genéricos (`button`, `.primary`, `.danger`, `.ghost`)

**Qué se queda local en cada HTML:** todo lo específico de esa herramienta — la tabla del Backlog, el Kanban de Agenda, el sidebar del Cartera, los paneles de la Calculadora, etc.

**Paleta y tipografía actuales:**
- Fondo: `#F5F3EE` (beige cálido) · Tarjetas: `#FFFFFF`
- Texto: `#1A1A18` (principal) / `#4A4A46` (suave) / `#8A8A84` (tenue)
- **Acento de marca:** celeste Bitrix `#00AEEF` (oscuro `#005B7F`, fondo pálido `#E3F6FD`)
- Secundarios: mostaza `#B8940A` (`--gold`), terracota `#C44D1A` (`--red`, semántico de alerta/perdido), verde `#1E5C3A` (`--green`, semántico de "Ganado" — ya no es el acento de marca)
- Tipografía: **DM Sans** para todo (cuerpo y títulos, peso 700 en los `h1`). Se probó Instrument Serif para los títulos grandes y se descartó — quedaba mal, mantener todo en DM Sans.

**Selector de tema (celeste/rojo):** `theme-toggle.js` agrega dos puntitos a la barra de navegación (izquierda de todo, no requiere tocar el HTML). El tema se guarda en `localStorage` (`ggcc_theme`), persiste entre sesiones.
- **Celeste** (default): paleta beige + acento Bitrix, tipografía DM Sans.
- **Rojo**: fondo blanco/gris neutro (`#F5F5F6`), acento rojo institucional (`#D32433`), tipografía **Inter** (no DM Sans) — inspirado en un sitio bancario (ICBC), sin replicar su marca exacta.
- Ambas variantes viven en `design-system.css`, bajo el selector `html[data-theme="rojo"]{...}` — cualquier color/fuente que se use en un HTML individual **tiene que pasar por variable** (`var(--paper)`, `var(--stamp)`, etc.), nunca un hex pegado a mano, o no va a responder al cambio de tema. Ya pasó una vez (paneles/zebra-stripe con `#FBFAF6`/`#F8F6F1` hardcodeados) y hubo que salir a cazarlos — variables `--zebra-odd`/`--zebra-even` se agregaron después para cubrir ese caso.
- Para agregar Inter (u otra fuente del tema alternativo) hay que importarla en el `<link>` de Google Fonts de **cada** HTML, aunque el tema por defecto no la use — si no, el navegador no la tiene descargada cuando el usuario cambia de tema.

**Los 5 temas** (`html[data-theme="..."]` en `design-system.css`, elección guardada en `localStorage` clave `ggcc_theme`):
- **celeste** (default): beige + celeste Bitrix, DM Sans.
- **rojo**: blanco/gris, rojo institucional `#D32433`, Inter.
- **nuevo**: estilo "work OS" (azul/verde/rojo), Figtree, texto gris más suave, íconos Lucide en la nav (solo visibles en este tema).
- **claro**: minimalista tipo Notion — blanco puro, texto `#37352F`, fuentes del sistema, tarjetas casi sin borde.
- **oscuro**: modo oscuro simple, fondo `#191919`, acento cyan. Ojo: los botones primary/danger necesitaron overrides explícitos por especificidad.
- Fuentes por tema: hay que importar DM Sans, Inter y Figtree en el `<link>` de Google Fonts de cada HTML.
- Idea pendiente: un solo botón que rote entre temas en vez de 5 puntitos.

**Para cambiar la paleta/tipografía en el futuro:** editar solo `design-system.css` (y `theme-toggle.js` si cambia la lógica del selector), subir esos archivos — las 4 herramientas heredan el cambio automáticamente, sin tocar cada HTML.

---

## 3. Seguridad — Login con Google

- **Firebase Authentication**, proveedor Google habilitado. Las 4 herramientas principales (Portal, Cartera, Backlog, Calculadora) muestran una pantalla de login que tapa todo hasta autenticarse.
- **Roles (solo en el Backlog):** `ALLOWED_USERS = {'ecelata@gmail.com':'editor', 'emcelata@personal.com.ar':'readonly'}`; `isReadonly()` / `blockIfReadonly()` bloquean guardar. **Portal, Cartera, Proyectos y Calculadora siguen con `ALLOWED_EMAIL` único** (el solo lectura no entra ahí). Falta confirmar que las reglas de Firestore permitan al segundo mail (solo lectura); hoy las reglas documentadas abajo solo habilitan a `ecelata@gmail.com`.
- **Acceso restringido a un solo mail (resto del sitio):** `ecelata@gmail.com`. Cualquier otra cuenta de Google puede autenticarse (Firebase lo permite), pero queda rechazada tanto en el cliente como en las reglas de Firestore.
- **Dominio autorizado en Firebase:** `ecelata.github.io` (Authentication → Configuración → Dominios autorizados).
- **Reglas de Firestore actuales:**
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.token.email == 'ecelata@gmail.com';
      }
    }
  }
  ```
- **Personal Tech (microsite) queda fuera del login** — no tiene datos sensibles ni toca Firestore.

### Errores ya resueltos al armar el login
- `auth/api-key-not-valid`: la `apiKey` tenía un typo (L mayúscula en vez de minúscula). Firestore lo toleraba, Auth no — comparar carácter por carácter contra "Mostrar clave" en Firebase.
- `auth/unauthorized-domain`: faltaba agregar `ecelata.github.io` a dominios autorizados.
- Google Cloud Console (`console.cloud.google.com`) y Firebase Console (`console.firebase.google.com`) son sitios distintos del mismo proyecto — en Cloud hay que elegir `Backlog-CC` a mano en el selector.

---

## 4. Infraestructura

- **Hosting:** GitHub Pages, repo público `ecelata/CC` (Settings → Pages → Deploy from a branch → `main` / root). El código es público (en plan gratis, Pages exige repo público), pero ya no contiene datos, ni siquiera en el historial.
- **Acceso de Claude al repo:** Claude GitHub App instalada en la cuenta `ecelata` (lectura y push). Claude puede commitear y pushear directo.
- **Base de datos:** Firebase Firestore, proyecto `backlog-cc`, plan Spark (gratis, 50k lecturas/día, 20k escrituras/día).
- **Documentos Firestore** (todos bajo `/backlog/`):
  - `backlog/data` → oportunidades del Backlog
  - `backlog/agenda_tasks` → tareas del Kanban de Agenda
  - `backlog/cuentas` → CSV completo de la cartera filtrada (reemplaza a `cuentas.csv`)
  - `backlog/tarifario` → CSV del tarifario DCV (reemplaza a `tarifario.csv`; para cambiar precios, editar el campo `csv` en la consola de Firestore)
  - `backlog/calculadora_escenarios` → escenarios de la Calculadora

---

## 5. Cómo actualizar los datos semanales (cartera) — ya NO es por GitHub

- **Ahora:** en el Cartera, logueado, botón **"📤 Actualizar cartera"** → elegís el CSV nuevo desde tu compu → se sube directo a Firestore, sin GitHub Desktop de por medio.
- El CSV se genera igual que siempre: Excel corporativo "BASE GGCC + PYMES EXECUTIVE" semanal, filtrado por `Gerente G1 Comercial == 'RAMIREZ GONZALO' AND (Gerente G2 Comercial == 'CASIL SILVANA PAULA' OR Jefe/Coordinador IN ('URRUTIGOITY RAUL', 'BANOVAZ GABRIELA EDITH'))`, incluyendo `Tipo Holding`.
- **Campo clave `Tipo Holding`** (`PRIVADO AMBA-SERVICIOS` / `-INDUSTRIAS` / `-FINANZAS`, ± variantes GGEE) — única fuente confiable para derivar Segmento a nivel de cuenta. **Nunca usar el EECC para inferir segmento** (un mismo EECC puede atender ambos: caso Arnedo Gustavo Javier con Murchison y Depósito Fiscal Norte).
- **Rutina semanal (en memoria de Claude):** comparar Excel nuevo contra el anterior, detectar altas/bajas en la cartera filtrada, actualizar `historial_cambios_cartera_[fecha].docx`, avisar si hay reasignación de cuentas grandes a otro equipo.

---

## 6. Backlog — esquema de datos

**Identificación:** `id`, `cliente`, `nombreOpp`, `cuit`, `industria` (= Vertical del cliente, autocompletado), `segmento` (autocompletado desde Tipo Holding), `eecc`, `ingenieroPreventa`, `responsableSegmento` (autocompletados de la fila real de la cuenta).

**Clasificación:** `vertical` (= Unidad de Negocio interna: Cloud Híbrida, IA/ML, Licenciamiento... — manual), `proveedor` (AWS/Azure/GCP/Huawei/Microsoft/Personal Cloud propio), `producto` (DCV, MaaS IA, etc. — texto libre con sugerencias), `tipoProyecto`, `competidores`.

**Funnel (versión vigente, 6 fases del proceso real de preventa):** `etapa` ∈ `1-Identificada`, `2-POC`, `3-En Diseño`, `4-Arquitectura`, `5-En Pricing/PPCC`, `6-Envío y Negociación`. Existe `ETAPA_MIGRACION` que convierte los nombres viejos (el funnel de 7 etapas y versiones intermedias) en la primera lectura. La etapa 2 (POC, equipo Huawei, cupón/trial) puede saltear directo a la 6. "Dimensionada" no es etapa propia. Estados finales: Abierto / Ganado / Perdido / **Suspendido**. Campos nuevos: `salesforceId` (Nº Win/ID Cotización), `ticketJira` (arquitectura se pide por Jira). Las columnas BANT aceptan Sí/Parcial/No/**N/A**., `probCierre`, `prioridad` (Alta/Media/Baja, pinta borde de color), `estadoFinal`, `motivoPerdida`.

**BANT:** `bantBudget/Authority/Need/Timeline` (cuadrante 2x2 compacto en tabla), `necesidad`, `bantObs`.

**Plata:** `montoOneShot`, `mesRecurrente` → `valorTotal` (oneShot + mesRecurrente×12), `montoPonderado` (valorTotal × probCierre). `tipoContrato` (**One-Shot** / **MRR** / **ARR** / **Mixto** — MRR = *Monthly Recurring Revenue*, ARR = *Annual Recurring Revenue*, no son iniciales de "mes/año" en español aunque coincida el significado). Distingue naturaleza del pago (único vs. recurrente), no si el monto recurrente es fijo o variable — un fee % variable sigue siendo MRR si se cobra mes a mes. `margenEstimado` (%) es un campo informativo, no participa en ningún cálculo automático.

**Fechas:** `fechaEntrada`, `fechaDeadline`, `fechaEstCierre` → `diasRestantes`.

**Seguimiento:** `estadoPropuesta`, `documentosGenerados`, `notasTecnicas`, `proximoPaso`, `bitacora` (array `{fechaHora, tipo, nota}`, timeline WhatsApp-style).

**Navegación (desde 25/10/2026):** las 7 vistas ya no van en una fila de pestañas arriba: están en una **barra lateral de íconos** a la izquierda (mismo estilo que `backlog.html`), con el nombre al pasar el mouse. Los KPIs quedaron compactos (CUV, AM mensual, Opps abiertas…) y la **Composición del pipeline abierto** va al costado, en la misma franja. El desplegable de Agenda dentro del Tablero se ocultó (la Agenda tiene su ícono). Resultado: la tabla y el Kanban arrancan ~400 px más arriba. Copia previa en la rama `version/backlog-clasico-antes-rail`.

**Mejoras traídas del Backlog nuevo (25/10/2026, tarde):**
- **Alta rápida** al tocar "+ Nueva oportunidad": cliente (autocompleta de la cartera), qué se vende, etapa, prioridad, mensual/one shot, próximo paso con fecha y BANT rápido (Sí/Parcial/No/N/A). "Crear y completar" abre la ficha completa; "Crear otra" para cargar varias seguidas.
- **Ficha como panel lateral**: ya no oscurece ni bloquea el tablero; un clic en la fila (o doble clic en el Kanban) la abre. Arriba: nombre, etapa, prioridad, estado, próximo paso + fecha, bitácora, plata y BANT con botones; el resto de las secciones quedan plegadas (mismos campos de siempre). Sigue con botón Guardar; si cambiás de opp o cerrás con cambios sin guardar, pregunta. Escape cierra.
- **Próximos pasos**: campo nuevo `proximoPasoFecha`; indicador verde (al día) / ámbar (sin próximo paso) / rojo (vencido) en la tabla y en el Kanban; vista "Próximos pasos" en la barra con contador de vencidos.
- **Ideas y campañas** (barra lateral): igual que en el nuevo; campo nuevo `campanaId` en la opp (ficha → Comercial → Campaña).
- **Staff del martes** (barra lateral): exporta el JSON para la planilla del sector (`Consultor_Cloud_All_In_One_Persistente.html`). Bitácora: se sumaron los tipos Visita, Evento y Soporte; para las Acciones, Reunión cuenta como Visita, Demo técnica como Demo y Propuesta enviada como Propuesta. Probado: la planilla importa el JSON sin errores.
- **Importar del portal** (reemplaza a "Importar Salesforce", menú ⋯): filtra tus EECC según la cartera vigente + Jefe/G2 = Banovaz, Urrutigoity o Casil; corte de 6 meses (configurable); vista previa con avisos (ya está / sin monto / posible duplicado / vieja / descartada antes). Al reimportar **ya no pisa la etapa** (el import viejo la recalculaba por probabilidad): solo actualiza monto (si viene distinto de 0), probabilidad, etapa del portal (`etapaCRM`) y mes de cierre. Se conserva el **autocierre** como tilde opcional. Las opps con Nº CRM que borrás quedan como "descartadas" y vuelven destildadas en el próximo import.
- **Datos nuevos en Firestore:** `backlog/extras` = `{campanas, staff, nextCamp, descartadas}`. Las opps siguen en `backlog/data`.
- **Tareas (reemplaza a la Agenda, 25/10/2026 noche):** cada tarea tiene título, tipo (To-do, Llamada, Mail, Visita, Demo, Propuesta), fecha, hora opcional, prioridad y **vínculo** a una **Opp**, un **Proyecto** (ej. Transener, Genneia), una **Campaña** o **Interna**. Se crean con **"+ Crear tarea"** (arriba, junto a "+ Nueva oportunidad"), desde la vista Tareas, o en la ficha de la opp (caja "Próximo paso · tareas", Enter para crear).
  - **Regla de oro:** el próximo paso de una opp = su tarea abierta de fecha más cercana; se copia solo a `proximoPaso` / `proximoPasoFecha` (así el semáforo, la vista Próximos pasos, el Kanban, el staff y los exports siguen igual). Las opps cerradas conservan su último texto.
  - **Completar** (círculo a la izquierda): pide el resultado en una línea → se registra en la bitácora de la opp (tipo: Llamada→Llamado, Mail→Email enviado, Visita→Visita, Demo→Demo técnica, Propuesta→Propuesta enviada, To-do→Seguimiento), en las notas del proyecto o en los comentarios de la campaña → ofrece el siguiente paso (atajos +2 días / +1 / +2 semanas). Si no se carga, la opp queda en ámbar.
  - **Cerrar una opp** (ganada/perdida/suspendida) pregunta si cancela sus tareas abiertas; **eliminarla** borra sus tareas.
  - **Vista Tareas** (ícono de calendario de la barra, antes "Agenda"): lista compacta por grupos (Vencidas / Hoy / Esta semana / Más adelante / Sin fecha), filtros por vínculo (Opps, Proyectos, Campañas, Internas) y "Ver hechas". Título = editar; vínculo = abre la opp.
  - **Avisos del navegador** (con el Backlog abierto): botón "🔔 Activar avisos" en la vista Tareas; avisa 10 min antes de las tareas del día (sin hora = 9:00). Las vencidas de días anteriores no notifican (se ven en rojo).
  - **Migración automática (una sola vez):** las tareas de la Agenda vieja (`backlog/agenda_tasks`, que no se borra) y el texto de próximo paso de cada opp abierta pasaron al nuevo módulo. Datos: `backlog/tareas` = `{tareas, nextSeq, migrado}`; vínculo `{tipo: opp|proyecto|campana|interna, id}`.

**Tanda del 26/10/2026 (madrugada):**
- **Filas desplegables en el Tablero:** un clic en la fila la despliega ahí mismo (doble clic abre la ficha completa). Se cambia en la fila y se guarda al instante: Etapa, Estado (si pasa a ganada/perdida/suspendida pregunta si cancela sus tareas y la fila se va a Cerradas), Prioridad, Prob. %, Mensual, One Shot y BANT (botones). Además: tareas abiertas de la opp con check para completar y alta rápida (Enter), últimos 3 movimientos de la bitácora y botón "Ficha completa". Si la ficha de esa opp está abierta, se actualiza también (no se pisan los cambios al guardarla).
- **Calificar BANT** (botón junto a "Oportunidades activas", con el número de opps abiertas con BANT incompleto): las recorre una por una (las de mayor mensual primero); cada toque se guarda y al completar las 4 letras pasa sola a la siguiente.
- **Montos corregidos a mano:** si cambiás Mensual u One Shot (en la ficha o en la fila), la opp queda marcada (`mrManual` / `cuvManual`) y el **Importar del portal ya no los pisa**; en la vista previa aparece el aviso "Monto a mano (portal: …)".
- **Modo foco** (vista Tareas, botón "▶ Modo foco · n"): cola de tareas vencidas y de hoy, una por una, con el resumen de la opp (etapa, mensual, prob., BANT, EECC, últimos movimientos). Completar (pide resultado y siguiente paso, y pasa a la próxima), Posponer a mañana, +1 semana, Saltear, Abrir ficha.
- Copia previa: rama `version/backlog-clasico-26-10-antes-filas`.

**Probabilidad de cierre fija (26/10/2026, mañana):**
- Solo 5 niveles, en desplegable (ficha, fila desplegada y alta rápida): **25% Inicial · 50% En evaluación · 75% Avanzada · 90% Casi ganada · 100% Ganada, falta cerrar** (falta OC, firma o alta). Constantes `PROBS` / `PROB_LBL`.
- Valores viejos o importados se redondean al nivel más cercano (`snapProb`: hasta 37→25, hasta 62→50, hasta 82→75, hasta 95→90, más→100). Vacío queda vacío.
- **Panorama:** el panel "Estado del negocio" se reemplazó por **Probabilidad de cierre**: opps abiertas por nivel con cantidad y mensual (tooltip con el total ponderado), más "Sin probabilidad". Click en un nivel filtra el Tablero.
- Nuevo filtro **Prob.** en la barra de filtros del Tablero (incluye "Sin probabilidad").
- Copia previa: rama `version/backlog-clasico-26-10-antes-prob`.

**Orden alfabético en el Kanban (26/10/2026):** click en el nombre de la columna (etapa) ordena sus tarjetas por cliente y nombre de opp: 1 click A→Z, 2 clicks Z→A, 3 clicks vuelve al orden original. Se marca al lado del nombre y se recuerda en el navegador (`KO_SORT`, localStorage `koSort`). Copia previa: rama `version/backlog-clasico-26-10-antes-orden-kanban`.

**Arrastrar en el Kanban y tooltips de la barra (26/10/2026):** ahora la columna entera recibe la tarjeta (encabezado, total y espacio vacío, no solo la lista), se resalta al pasar por encima, el cursor muestra la manito y aparece un aviso "↪ Cliente → Etapa". Si la ficha de esa opp está abierta, se actualiza la etapa. En solo lectura no se puede soltar. Los nombres de la barra lateral (Tablero, Kanban…) quedan por encima de los indicadores (`z-index` de `.tabs.rail`). Copia previa: rama `version/backlog-clasico-26-10-antes-drag`.

**Vistas (7, ahora en la barra lateral):** 📋 Tablero · ✅ Cerradas · 📊 Panorama (analítica con drill-down) · 📅 Agenda (Kanban de tareas, vinculables a oportunidad) · 🗂️ Kanban (oportunidades por etapa, drag & drop) · 👥 Equipo (organigrama por responsable con EECC, segmento, mail y cuentas a cargo) · 📈 Histórico (ver 6c).

**Menú de exportar/importar:** Exportar JSON / CSV / **planilla** (Excel agrupado como el reporte semanal: Cerrados / A cerrar / Pipeline / POCs, foco en monto mensual); Importar JSON; **Importar Salesforce**.

---

**Orden por columnas:** las 18 columnas de la tabla del Tablero ordenan al clic (asc/desc, flecha indicadora, vacíos siempre al final). Código: `data-sort`, `sortKey/sortDir`, `applySort`, `wireSortableHeaders`.

**Agenda en el Tablero:** el Kanban de tareas también está embebido en la página principal dentro de un desplegable (`#agendaAccordion`) cerrado por defecto, con contador de pendientes (`#agendaPendingCount`), para no empujar la tabla hacia abajo.

**Prioridad:** campo `prioridad` (Alta/Media/Baja) pinta una franja de color en la celda del ID.

---

## 6c. Histórico de ganadas y importación Salesforce

- **Importar Salesforce** (`btnImportSF`): lee el export del tablero "Cotizaciones Cloud" y crea/actualiza oportunidades. **Nunca pisa** lo que solo cargás a mano (BANT, bitácora, notas técnicas, próximo paso, prioridad, tipo de contrato, margen, horas, estado de propuesta, competidores, necesidad, vertical, tipo de proyecto). Mapea Probabilidad → etapa (`SF_PROB_TO_ETAPA`: 0/10 Identificada, 25 En Diseño, 50 En Pricing/PPCC, 75+ Envío y Negociación); es una aproximación a revisar. Hay opción de autocierre.
- **Histórico** (pestaña, Firestore `backlog/historico`, caché local `backlog_historico_cache_v1`): cotizaciones *Cerrada-Ganada* de los 19 EECC mes a mes, para ver la evolución (base de comisiones). Importa el Excel "Cotizaciones Cloud todos" con botón "Importar Excel" y deduplica por **ID Cotización**; también carga manual.
- Modelo vigente: `montoMensual` (Abono Mensual / MRR) y `montoOneShot` (Cargo Única Vez), por **divisa** (USD y ARS separados). Registros viejos con un único `monto` se muestran bajo "Mensual" (helpers `histMontoMensual/OneShot` con fallback): ojo, es una aproximación (caso Transener sep-2026 con ~US$56.650 de one-shot; se corrige reimportando).
- Gráfico de evolución con toggle Mensual/Trimestral (`histChartGrouping`); `HIST_PRIMER_MES = '2025-01'`; KPIs: Mensual MRR, One Shot, Cotizaciones, Cuentas distintas. Detalle: columnas Mes/Cuenta/Ejecutivo/Producto/Divisa/Mensual/One Shot/Total/Origen.
- `misEeccSet()` define "mis EECC" a partir de las cuentas cargadas; `EECC_POR_SEGMENTO` está hardcodeada en el código (ojo: incluye algún nombre, p. ej. FLORES RAUL, que ya no figura en la cartera; revisarla al subir cartera).

---

## 6d. Backlog nuevo (`backlog.html`) — en paralelo al clásico

Decisión del 25/10/2026: en vez de seguir parchando `Backlog_Preventa.html`, se armó una página nueva con cara de tablero tipo Jira, reusando lo de abajo (login, Firestore, autocompletado de la cartera). Corre **en paralelo**: guarda en su propio documento `backlog/oportunidades_v2`, así que el Backlog clásico (`backlog/data`) no se toca. Si el nuevo prospera, se borra el clásico. Diseño aprobado en el lienzo "Backlog estilo Jira" (artifact de Claude).

**Estructura:** barra de íconos a la izquierda (Tablero, Lista, Próximos pasos, Ideas y campañas, Staff del martes, Cerradas; links a Histórico y Cartera) y panel lateral a la derecha que se abre al tocar una tarjeta (con botón para verlo en grande). Todo color y fuente por variables de `design-system.css`: funcionan los 5 temas.

**Tablero:** 6 columnas por etapa (mismas `ETAPAS` del clásico), arrastrar tarjetas cambia la etapa. Tarjeta: nombre, cliente, segmento, monto ("Sin monto" punteado si mensual y único están en 0), prioridad, Nº CRM, 4 puntitos de BANT, e indicador de próximo paso: verde (al día), ámbar (sin próximo paso), rojo (fecha vencida). Filtros: búsqueda, segmento, prioridad alta, sin monto, paso vencido, EECC, campaña.

**Alta rápida:** cliente (lista de la cartera; autocompleta segmento por Tipo Holding, EECC, CUIT, ingeniero, responsable y vertical), qué se vende, etapa, prioridad, mensual/único/divisa, próximo paso con fecha y BANT rápido (Sí/Parcial/No/N/A). Si el cliente no está en la cartera, pide el segmento. "Crear otra" para cargar varias seguidas.

**Detalle (panel):** etapa, prioridad, estado, próximo paso + fecha, bitácora con tipos de la planilla del staff (Visita, Demo, Propuesta, Evento, Soporte, más Llamada, Mail, Nota), plata (valor total = único + mensual × 12; ponderado por probabilidad), BANT, datos de la cuenta, y "Más campos" con todo el inventario del clásico (proveedor, producto, tipo de contrato, fechas, Jira, Nº CRM, campaña, competidores, notas técnicas, etc.). Ganada / Perdida / Suspendida / Reabrir / Eliminar. Autoguardado.

**Importar del portal** (export "Cotizaciones Cloud" de agentes.murranet.com/tablero, el Excel completo sin filtrar):
- Filtra solo tus opps: EECC de la cartera (match apellido + otro nombre, tolera nombres truncados) o con Jefe Equipo / G2 = Banovaz, Urrutigoity o Casil.
- Corte por fecha de creación: últimos 6 meses por defecto (configurable 3/6/9/12/24); las viejas quedan destildadas.
- Vista previa con avisos: "Ya está: se actualiza" (mismo Nº CRM), "Sin monto", "Posible duplicado" (misma cuenta y producto en el archivo).
- Al crear: etapa según la etapa del portal (Identificación → 1; Propuesta-Negociación / Riesgo Crediticio / Gestión Contrato → 6; Preparación según probabilidad). Después la etapa es tuya.
- Al reimportar: solo actualiza datos del portal (monto si viene distinto de 0, probabilidad, etapa del portal, mes de cierre). Nunca pisa etapa, BANT, bitácora, próximo paso, prioridad ni notas. Baja un backup JSON antes de importar.
- Primera prueba con el export del 25/10/2026: 1.386 cotizaciones → 50 tuyas → 34 de los últimos 6 meses (18 sin monto).

**Staff del martes:** KPIs, secciones con tildes (Cerrados del mes, A cerrar = etapa 6 o cierre estimado en el mes, Pipeline, PoCs = etapa 2, Jira = opps con ticket), Acciones (bitácora de los 7 días previos al corte; tildados por defecto los 5 tipos de la planilla), datos del consultor y notas. **"Exportar JSON para la planilla"** genera el archivo con el formato exacto de la planilla del sector (`Consultor_Cloud_All_In_One_Persistente.html`, que NO es parte de la suite): en la planilla, ➕ Nuevo → ⬆️ Importar. Las Alertas se completan a mano. Montos en ARS no se suman (la planilla es en USD). Probado: la planilla carga el JSON sin errores.

**Ideas y campañas:** tablero Idea → En armado → Lanzada → Cerrada; ficha (disparador, a quién apunta, propuesta de valor, oferta, plazo); EECC de la campaña con cuentas objetivo / contactadas / derivadas (a mano) y opps abiertas (automático, por la campaña asignada a cada opp); hilo de ideas y comentarios; "Copiar mensaje para los EECC"; "Llevar al staff del martes" (suma la campaña a las notas del JSON).

**Datos:** `backlog/oportunidades_v2` = `{json: {opps, campanas, staff, nextSeq, nextCamp}}`, caché local `backlog_v2_cache`. IDs `BK-001`… Menú ⋯: exportar / restaurar backup JSON. Rol solo lectura: mismo `ALLOWED_USERS` que el clásico (oculta todo lo que edita).

**Pendiente del Backlog nuevo:** decidir si se migra algo del clásico (BANT/bitácora de opps viejas), la vista de Histórico (hoy link al clásico) y, más adelante, Cartera y el resto de la suite con este mismo estilo.

---

## 6b. Proyectos — esquema y flujo

- Botón **"Convertir a Proyecto"** en las oportunidades en estado Ganado: crea un proyecto en Firestore (`backlog/proyectos` = `{items, nextSeq}`) heredando cliente, CUIT, segmento, EECC, ingeniero y montos tal cual, sin retipear.
- Vínculo en los dos sentidos: `oppId` en el proyecto, `proyectoId` en la oportunidad (el Backlog muestra un badge con link).
- IDs `PROY-001`, `PROY-002`… con contador persistente `nextSeq` (borrar un proyecto nunca reutiliza el ID).
- Borrar un proyecto limpia solo el `proyectoId` de la oportunidad (auto-unlink). Existe además "Quitar vínculo" del lado de la oportunidad para vínculos huérfanos.
- Cada proyecto: PM, líder técnico, fechas, estado, notas y lista simple de fases/hitos. Sin Gantt visual todavía (fase 2 si hace falta).
- No toda oportunidad Ganada se vuelve proyecto: es decisión manual.
- Caso pendiente: **Transener** (migración a GCP + Nutanix on-prem). Diego Porcel lo inició; Edgardo lo reemplaza como líder técnico. Kickoff aún no realizado. Faltan fechas y estructura de olas.

---

## 7. Las 12 oportunidades cargadas (al 31/08/2026)

| ID | Cliente real | Segmento | Etapa |
|---|---|---|---|
| OPP-001 | Gimnasios Argentinos SA (Megatlón) | CCEE Servicios | 3-Análisis Técnico |
| OPP-002 | IRSA Inversiones y Representaciones SA | CCEE Servicios | 5-Propuesta |
| OPP-003 | Banco Cetelem Argentina SA (= Revolut) | Banca | 3-Análisis Técnico |
| OPP-004 | Smurfit Kappa de Argentina SA | CCEE Industria | 5-Propuesta |
| OPP-005 | Molinos Agro SA | CCEE Industria | 6-Negociación |
| OPP-006 | Galeno Argentina SA | CCEE Servicios | 3-Análisis Técnico |
| OPP-007 | Play Digital SA (MODO) | Banca | 3-Análisis Técnico |
| OPP-008 | Automóvil Club Argentino | CCEE Servicios | 4-POC |
| OPP-009 | Skyblue Analytics | Banca | 4-POC |
| OPP-010 | Defiba Servicios Portuarios SA | CCEE Servicios | 4-POC |
| OPP-011 | Terminal Zarate SA | CCEE Servicios | 4-POC |
| OPP-012 | Arte Gráfico Editorial Argentino SA (AGEA) | CCEE Servicios | 6-Negociación |

**AGEA — desglose de la propuesta (Alternativa 1, fee 5%):** commitment GCP a 5 años, NO son USD 1.4MM anuales — ese es el **consumo actual** (baseline). El commit nuevo escala de USD 1.493.500 (año 1) a USD 1.699.500 (año 5), total USD 8.075.200. Ingreso real para Personal Tech: fee 5% sobre consumo (prom. ≈USD 6.729/mes) + Cloud Interconnect USD 3.900/mes + SSPP FinOps/DBA Oracle USD 2.300/mes ≈ **USD 12.929/mes total**, cargado como `tipoContrato: MRR` (no Mixto — no hay pago único). Créditos Google (USD 440K) y descuentos (~USD 1.3MM ahorro) son beneficio para AGEA, no facturación de Personal Tech — van en Notas técnicas, no en los campos de monto.

**Molinos Agro — lección de reasignación interna:** el EECC cambió de Pronzati Diego Fabian a Varela Mariano entre el Excel de hace 3 meses y el de ayer, **sin cambiar de Jefe/Coordinador** (ambos bajo Urrutigoity). Este tipo de cambio no lo detecta la comparación semanal de altas/bajas (que solo mira movimientos de Jefe/G2) — para corregirlo, reseleccionar el cliente en el desplegable de la oportunidad afectada.

Revolut opera en Argentina bajo la razón social de Banco Cetelem Argentina SA (entidad adquirida, sin personería jurídica propia todavía).

---

## 7b. Trabajo analítico reciente (oct-2026)

- **Cartera 23/10/2026 (vigente): 591 cuentas** (+3 vs. 11/09: Bonatti Argentina y PM Technologies bajo Monzón/Urrutigoity, First Overseas Bank bajo Pérez/Casil), sin bajas ni cambios de EECC/jefe/ingeniero/Tipo Holding. Tipo Holding: Servicios 234, Industrias 201, Finanzas 156. Cambió la columna VERTICAL en 24 cuentas (nueva etiqueta AGRO TOP, 21 cuentas con #N/A). Archivo origen: BASE_GGCC_PYMES_EXECUTIVE_231026.xlsx; cargada en Firestore por Edgardo.
- **Cartera 11/09/2026 (anterior):** 588 cuentas (+1 vs. semana previa: Unblock Computing Argentina SAU, Urrutigoity), 100% AMBA. Hoja del Excel semanal renombrada ("BASE_GGCC_PYMES EXECUTIVE_04092"). La comparación semanal cubre altas/bajas de equipo, cambios de EECC dentro del mismo equipo y cambios de Tipo Holding.
- **"Mis EECC":** 19 ejecutivos (Banovaz 7, Casil 6, Urrutigoity 6), cada uno con ingeniero de preventa asignado.
- **Nube pública en mi cartera** (`Nube_Publica_Mi_Cartera.xlsx`, generado del archivo "Facturación Telecom Nube Pública" Sep-23 a Sep-26 cruzado por CUIT contra cuentas.csv): pestañas Resumen, Plan Huawei, Consolidado, AWS, Azure, GCP, Huawei. 28 clientes con nube en algún mes, 25 activos en Sep-26. Facturación Teco Sep-26: AWS 393.714 / GCP 143.099 / Huawei 87.088 / Azure 67.577 (el archivo no aclara la moneda). Azure incluye Instancias Reservadas. Payway SAU (CUIT 30717664406) no tiene nube con Teco.
- **Plan Huawei:** cuentas dormidas (Carburando, Fast Food, Sáenz Valiente), caídas a cero (River, Arte Gráfico, ACA), en riesgo (Arte Radiotelevisivo -80% en 12 meses), crecientes (Open Pass, Radio Mitre). Pestaña con prioridad, estrategia, próximo paso y estado desplegable.
- **Campaña "Radar Cloud"** (idea propuesta, no ejecutada): 6 semanas, los EECC detectan 4 disparadores (vencimiento de licencias, fin de vida de hardware, consumo hyperscaler actual, backup/DR) y derivan a Edgardo; arrancar con licenciamiento y FinOps; medir en el Backlog.

---

## 8. Pendientes

- **Decisión de plataforma (20/09/2026):** se evaluó migrar a un CRM en Lovable/Supabase (se cargaron 588 cuentas y 20 opps de prueba); se descartó por falta de columnas nativas, costo en créditos e inestabilidad. Se sigue con `Backlog_Preventa.html`; Lovable queda en reserva para reporting/multiusuario. Ver también `backlog-preventa-arquitectura.md` en el Project (plan de simplificar la carga: 3-5 campos de entrada y el resto colapsado; Agenda más liviana).
- **Escalar a equipo + tablero de gerencia consolidado.** Plan definido, no iniciado: Firebase Auth multi-usuario, datos por usuario (`backlog/{uid}`), reglas por dueño + lectura ampliada para gerentes, página de gerencia consolidada, filtro de cartera configurable por persona.
- **Acceso de solo lectura para el gerente:** decidido, falta el Gmail del gerente. Plan: segundo mail permitido en reglas de Firestore y en el cliente + rol admin/solo lectura.
- **README:** mantener al día cada vez que se agregue una función.
- **Gantt visual en Proyectos** (fase 2, opcional).
- **Skyblue Analytics** — única de las 12 sin confirmar razón social real en la cartera.
- **Historial en la Agenda (Kanban):** hoy las tarjetas "Hecho" no acumulan historial — idea a implementar: que cada tarjeta tenga su propia bitácora (igual que las oportunidades), y que al resolver una tarea, en vez de archivarla sin más, se pueda generar una tarea nueva vinculada a la misma raíz (mismo cliente/oportunidad) volviendo a "Por hacer" — así se arma una cadena trazable en el tiempo por proyecto, no tarjetas sueltas sin conexión.
- **Opcional:** pedir a GitHub Support que limpie la caché de vistas de commits viejos (anteriores a la purga del 25/10/2026). Riesgo bajo.

**Documento de referencia ya generado:** `Resumen_Funcionalidades_GGCC.docx` — listado de funcionalidades en viñetas, pensado para presentar la suite al equipo. Si se agregan funcionalidades nuevas grandes, conviene regenerarlo.

---

## 8b. Workflow de despliegue y problemas ya vividos

- Despliegue: copiar archivos al repo local, GitHub Desktop → Commit → **Push origin** (un commit con flecha hacia arriba sigue solo local y el sitio no cambia). Claude también puede pushear directo al repo; en ese caso, en GitHub Desktop hacer **Fetch origin + Pull** antes de commitear.
- **Después de la purga del 25/10/2026** hubo que borrar y volver a clonar el repo local en GitHub Desktop: pushear desde una copia vieja reintroduce el CSV en el historial.
- Si el sitio se ve viejo: Ctrl+Shift+R o ventana de incógnito (caché distinto entre navegadores).
- Si al "pegar" en el repo se pierden estilos, verificar que `design-system.css` y `theme-toggle.js` estén en la misma carpeta que los HTML.
- "?" en lugar de "ñ" en razones sociales: viene así del Excel/ERP, no es un bug de la suite.
- El archivo `backlog_preventa_import.json` está obsoleto: no importarlo, pisaría correcciones manuales.
- Método de prueba usado: Playwright headless con rutas de Firebase/Lucide simuladas; validación de HTML con parser y chequeo de sintaxis JS.
- Datos reales nunca en el repo; la apiKey de Firebase es pública por diseño, la protección son el login y las reglas.

---

## 8c. Documentos hermanos en el Project "Base Clientes"

- `claude/backlog-preventa-arquitectura.md`: inventario de ~30-44 campos por oportunidad y plan de simplificación.
- `claude/cambios-pendientes-suite.md`: lista viva de cambios chicos para aplicar en lote; tanda del 03/10/2026 ya aplicada (brand de la nav, toggle mensual/trimestral, histórico desde 2025-01, split Mensual/One Shot).
- Historia: el desarrollo del Backlog nuevo (Histórico, Equipo, Kanban, Salesforce) ocurrió en otro chat del Project ("Crear nuevo chat sin perder historial", ~417 turnos); este README se reconcilió contra el repo.

---

## 9. Decisiones de diseño que conviene recordar

- **Segmento nunca se deriva del EECC** — siempre usar `Tipo Holding` por cuenta.
- **Vertical (cliente) ≠ Unidad de Negocio (Personal Tech)** — campos independientes.
- **Producto ≠ Proveedor** — qué se vende vs. la infraestructura detrás.
- **Los montos de dimensionamiento interno se duplican (x2)** antes de cargarlos como precio de venta.
- **Resuelto 25/10/2026:** se sacaron `tarifario.csv` y los `.crdownload` del repo; `calculadora.html` lee el tarifario solo de Firestore (`backlog/tarifario`). Además se **purgó el historial** con `git filter-repo` + force push: `cuentas.csv` (había una versión de 13.733 filas con CUIT, mails y celulares, subida el 27/08) y `tarifario.csv` ya no existen en ningún commit.
- **Borrar un archivo del repo no alcanza: queda en el historial.** Si alguna vez se sube algo con datos por error, hay que purgarlo del historial, no solo borrarlo.
- **Ningún CSV con datos reales debe volver a vivir en el repo** — todo pasa por Firestore, con login. Un `.csv` nuevo con datos de cuentas/tarifario en el repo es un retroceso de seguridad.
- **GitHub Pages en plan gratis solo funciona con repo público.** Se probó pasar el repo a privado (25/10/2026) y el sitio dio 404; se volvió a público y se reactivó Pages. Con GitHub Pro andaría con repo privado, pero el sitio igual sería público. La seguridad real es login + reglas de Firestore, nunca ocultar el hosting.
- **Nunca duplicar colores/fuentes/nav/botones dentro de un HTML** — todo eso va a `design-system.css`. Si alguna herramienta nueva necesita un estilo que ya existe ahí, importarlo, no copiarlo.
- **Todo color/fuente visible debe pasar por variable CSS** (`var(--paper)`, `var(--stamp)`, etc.), nunca un hex pegado a mano — si no, el selector de tema (celeste/rojo) no lo detecta y queda "roto" a mitad de camino.
