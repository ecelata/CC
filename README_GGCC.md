# GGCC · Suite comercial — README de referencia

**Última actualización:** 31/08/2026 (tarde) — sumado el CSS compartido y la paleta celeste Bitrix
**Repo:** `github.com/ecelata/CC` · **Publicado en:** `https://ecelata.github.io/CC/`

Este documento es el ancla del proyecto — si en algún momento una conversación con Claude se pierde o se comprime, este archivo (más el código y los datos en Firestore) alcanza para retomar todo desde cero.

---

## 1. Qué es esto

Suite de 4 herramientas HTML standalone para gestión comercial GGCC (Grandes Cuentas), books Banca + CCEE Servicios + CCEE Industria, bajo Gerente G1 Ramírez Gonzalo, con 3 responsables: Casil Silvana Paula (G2, Banca), Urrutigoity Raúl (Jefe/Coordinador, CCEE), Banovaz Gabriela Edith (Jefe/Coordinador, CCEE).

Comparten identidad visual (beige + celeste Bitrix, DM Sans), un **CSS compartido** (`design-system.css`), una barra de navegación común, y login obligatorio con Google.

| Herramienta | Archivo | Qué hace | Datos |
|---|---|---|---|
| Sistema de diseño | `design-system.css` | Colores, tipografías, nav, login, botones — compartido por las 4 | No es una página, es la hoja de estilos de todas |
| Portal | `index.html` | Landing con tarjetas a las 3 herramientas | Sin datos propios |
| Cartera | `dashboard.html` | Visualiza las ~587 cuentas de la cartera filtrada | Firestore (`backlog/cuentas`) |
| Backlog | `Backlog_Preventa.html` | Pipeline de oportunidades, BANT, bitácora, Agenda/Kanban | Firestore (`backlog/data`, `backlog/agenda_tasks`) |
| Calculadora | `calculadora.html` | Dimensionamiento de costos DCV (BOM) | Firestore (`backlog/tarifario`, `backlog/calculadora_escenarios`) |
| Personal Tech | `personal-tech/index.html` | Microsite de recursos cloud (AWS, IA, playbooks) — independiente, sin login, no toca Firestore ni el CSS compartido | Archivos propios en `/personal-tech/` |

**Ningún archivo CSV vive más en el repo** — `cuentas.csv` y `tarifario.csv` se migraron a Firestore y fueron borrados del repo público. Todo el contenido sensible (CUITs, mails, teléfonos, montos de pipeline) queda detrás del login.

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

**Para cambiar la paleta/tipografía en el futuro:** editar solo `design-system.css`, subir ese único archivo — las 4 herramientas heredan el cambio automáticamente, sin tocar cada HTML.

---

## 3. Seguridad — Login con Google

- **Firebase Authentication**, proveedor Google habilitado. Las 4 herramientas principales (Portal, Cartera, Backlog, Calculadora) muestran una pantalla de login que tapa todo hasta autenticarse.
- **Acceso restringido a un solo mail:** `ecelata@gmail.com`. Cualquier otra cuenta de Google puede autenticarse (Firebase lo permite), pero queda rechazada tanto en el cliente como en las reglas de Firestore.
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

- **Hosting:** GitHub Pages, repo público `ecelata/CC`. El código es público (inevitable sin plan Enterprise), pero ya no contiene datos.
- **Base de datos:** Firebase Firestore, proyecto `backlog-cc`, plan Spark (gratis, 50k lecturas/día, 20k escrituras/día).
- **Documentos Firestore** (todos bajo `/backlog/`):
  - `backlog/data` → oportunidades del Backlog
  - `backlog/agenda_tasks` → tareas del Kanban de Agenda
  - `backlog/cuentas` → CSV completo de la cartera filtrada (reemplaza a `cuentas.csv`)
  - `backlog/tarifario` → CSV del tarifario DCV (reemplaza a `tarifario.csv`)
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

**Funnel:** `etapa` (1-Prospección → 2-Calificado → 3-Análisis Técnico → 4-POC → 5-Propuesta → 6-Negociación → 7-Cierre), `probCierre`, `prioridad` (Alta/Media/Baja, pinta borde de color), `estadoFinal`, `motivoPerdida`.

**BANT:** `bantBudget/Authority/Need/Timeline` (cuadrante 2x2 compacto en tabla), `necesidad`, `bantObs`.

**Plata:** `montoOneShot`, `mesRecurrente` → `valorTotal` (oneShot + mesRecurrente×12), `montoPonderado` (valorTotal × probCierre).

**Fechas:** `fechaEntrada`, `fechaDeadline`, `fechaEstCierre` → `diasRestantes`.

**Seguimiento:** `estadoPropuesta`, `documentosGenerados`, `notasTecnicas`, `proximoPaso`, `bitacora` (array `{fechaHora, tipo, nota}`, timeline WhatsApp-style).

**Vistas:** Tablero (Abiertas) / Cerradas / Panorama (analítica con drill-down) / **Agenda** (Kanban Por hacer/En curso/Hecho, tarjetas vinculables a una oportunidad o standalone).

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

Revolut opera en Argentina bajo la razón social de Banco Cetelem Argentina SA (entidad adquirida, sin personería jurídica propia todavía).

---

## 8. Pendientes

- **Escalar a equipo + tablero de gerencia consolidado.** Plan definido, no iniciado: Firebase Auth multi-usuario, datos por usuario (`backlog/{uid}`), reglas por dueño + lectura ampliada para gerentes, página de gerencia consolidada, filtro de cartera configurable por persona.
- **Skyblue Analytics** — única de las 12 sin confirmar razón social real en la cartera.

---

## 9. Decisiones de diseño que conviene recordar

- **Segmento nunca se deriva del EECC** — siempre usar `Tipo Holding` por cuenta.
- **Vertical (cliente) ≠ Unidad de Negocio (Personal Tech)** — campos independientes.
- **Producto ≠ Proveedor** — qué se vende vs. la infraestructura detrás.
- **Los montos de dimensionamiento interno se duplican (x2)** antes de cargarlos como precio de venta.
- **Ningún CSV con datos reales debe volver a vivir en el repo** — todo pasa por Firestore, con login. Un `.csv` nuevo con datos de cuentas/tarifario en el repo es un retroceso de seguridad.
- **GitHub Pages nunca es privado**, aunque el repo lo sea (salvo Enterprise) — la seguridad real es login + reglas de Firestore, nunca ocultar el hosting.
- **Nunca duplicar colores/fuentes/nav/botones dentro de un HTML** — todo eso va a `design-system.css`. Si alguna herramienta nueva necesita un estilo que ya existe ahí, importarlo, no copiarlo.
