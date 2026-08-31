# GGCC · Suite comercial — README de referencia

**Última actualización:** 30/08/2026
**Repo:** `github.com/ecelata/CC` · **Publicado en:** `https://ecelata.github.io/CC/`

Este documento es el ancla del proyecto — si en algún momento una conversación con Claude se pierde o se comprime, este archivo (más el código y los datos en Firestore) alcanza para retomar todo desde cero.

---

## 1. Qué es esto

Suite de 4 herramientas HTML standalone para gestión comercial GGCC (Grandes Cuentas), books Banca + CCEE Servicios + CCEE Industria, bajo Gerente G1 Ramírez Gonzalo, con 3 responsables: Casil Silvana Paula (G2, Banca), Urrutigoity Raúl (Jefe/Coordinador, CCEE), Banovaz Gabriela Edith (Jefe/Coordinador, CCEE).

Comparten identidad visual (beige + celeste pastel, Montserrat/Inter/IBM Plex Mono) y una barra de navegación común.

| Herramienta | Archivo | Qué hace | Datos |
|---|---|---|---|
| Portal | `index.html` | Landing con tarjetas a las 3 herramientas | — |
| Cartera | `dashboard.html` | Visualiza las ~587 cuentas de la cartera filtrada | Lee `cuentas.csv` (estático) |
| Backlog | `Backlog_Preventa.html` | Pipeline de oportunidades, BANT, bitácora | Firestore (`backlog/data`) |
| Calculadora | `calculadora.html` | Dimensionamiento de costos DCV (BOM) | Firestore (`backlog/calculadora_escenarios`) + lee `tarifario.csv` |
| Personal Tech | `personal-tech/index.html` | Microsite de recursos cloud (AWS, IA, playbooks) — independiente, no toca Firestore | Archivos propios en `/personal-tech/` |

---

## 2. Infraestructura

- **Hosting:** GitHub Pages, repo público `ecelata/CC`. Cero build step — son archivos HTML planos, se suben y listo.
- **Base de datos:** Firebase Firestore, proyecto `backlog-cc`, plan Spark (gratis). `apiKey` embebido en el HTML a propósito (es público por diseño de Firebase; la seguridad la dan las reglas).
- **Reglas de Firestore actuales:**
  ```
  match /backlog/{docId} {
    allow read, write: if true;
  }
  match /{document=**} {
    allow read, write: if false;
  }
  ```
  O sea: cualquiera con el link puede leer/escribir, pero **solo** dentro de `/backlog/*`. No hay autenticación todavía (ver sección 6, pendientes).
- **Documentos Firestore en uso:**
  - `backlog/data` → array completo de oportunidades del Backlog (un solo blob JSON)
  - `backlog/calculadora_escenarios` → objeto con todos los escenarios guardados de la Calculadora, keyed por id

---

## 3. Datos: cuentas.csv y tarifario.csv

### cuentas.csv
- Fuente: Excel corporativo "BASE GGCC + PYMES EXECUTIVE" (~13.500 filas totales), que Edgardo baja **semanalmente**.
- Filtro aplicado: `Gerente G1 Comercial == 'RAMIREZ GONZALO' AND (Gerente G2 Comercial == 'CASIL SILVANA PAULA' OR Jefe/Coordinador IN ('URRUTIGOITY RAUL', 'BANOVAZ GABRIELA EDITH'))`
- ~587 cuentas resultantes (variable semana a semana).
- Columnas: Cuit, Razón Social, Segmento Comercial Confirmado, Ejecutivo, Mail Ejecutivo, Telefono Celular Ejecutivo, Jefe/Coordinador, Mail Jefe/Coordinador, Gerente G2 Comercial, Mail Gerente G2 Comercial, Gerente G1 Comercial, Ingeniero, Mail Ingeniero, Celular Ingeniero, VERTICAL, **Tipo Holding**.
- Lo usan `dashboard.html` (Cartera completa) y `Backlog_Preventa.html` (autocompletado al cargar una oportunidad nueva).
- **Campo clave: `Tipo Holding`** — valores `PRIVADO AMBA-SERVICIOS` / `PRIVADO AMBA-INDUSTRIAS` / `PRIVADO AMBA-FINANZAS` (± variantes GGEE). Es la única fuente confiable, a nivel de cuenta, para derivar el Segmento (Banca/CCEE Servicios/CCEE Industria) del Backlog. **No usar el EECC para inferir el segmento** — un mismo EECC (ej. Arnedo Gustavo Javier) puede atender cuentas de ambos segmentos (caso confirmado: Murchison).

### tarifario.csv
- Tarifario propio del pool de recursos DCV (Personal Cloud): cómputo, storage, licencias SO/SQL, SSPP/SSAA por hora, Veeam. 19 ítems.
- Editable a mano — reemplazar el archivo en el repo actualiza los precios en la Calculadora automáticamente.
- **No cubre** AWS/Azure/GCP/Huawei — para eso la Calculadora linkea a las calculadoras oficiales de cada cloud.

### Rutina semanal (ya en memoria de Claude)
Cada vez que Edgardo trae un Excel nuevo: comparar contra la base anterior, detectar altas/bajas en la cartera filtrada, actualizar `historial_cambios_cartera_[fecha].docx` con la entrada nueva, avisar si hay reasignación de cuentas grandes/conocidas a otro equipo (red flag).

---

## 4. Backlog — esquema de datos

Cada oportunidad (documento dentro del array en `backlog/data`):

**Identificación:** `id` (OPP-001...), `cliente`, `nombreOpp`, `cuit`, `industria` (= Vertical, actividad del cliente, texto libre autocompletado desde cuentas.csv), `segmento` (Banca/CCEE Servicios/CCEE Industria — autocompletado desde Tipo Holding), `eecc`, `ingenieroPreventa`, `responsableSegmento` (ambos autocompletados directo desde la fila de la cuenta en el CSV, no desde mapeos fijos).

**Clasificación de negocio:** `vertical` (= Unidad de Negocio interna de Personal Tech: Cloud Híbrida, IA/ML, Licenciamiento, etc. — manual), `proveedor` (AWS/Azure/GCP/Huawei/Microsoft/Personal Cloud propio — manual), `producto` (DCV, MaaS IA, Licenciamiento, etc. — texto libre con sugerencias), `tipoProyecto`, `competidores`.

**Funnel:** `etapa` (1-Prospección → 2-Calificado → 3-Análisis Técnico → **4-POC** → 5-Propuesta → 6-Negociación → 7-Cierre), `probCierre` (%), `estadoFinal` (Abierto/Ganado/Perdido/Suspendido), `motivoPerdida`.

**BANT:** `bantBudget/Authority/Need/Timeline` (✅Sí/⚠️Parcial/❌No/N/A), `necesidad` (texto libre, el "N" desarrollado), `bantObs`.

**Plata:** `montoOneShot`, `mesRecurrente` → derivan `valorTotal` (= oneShot + mesRecurrente×12) y `montoPonderado` (= valorTotal × probCierre).

**Fechas:** `fechaEntrada`, `fechaDeadline`, `fechaEstCierre` → `diasRestantes` calculado.

**Seguimiento:** `estadoPropuesta`, `documentosGenerados`, `notasTecnicas`, `proximoPaso`, `bitacora` (array de `{fechaHora, tipo, nota}` — timeline estilo WhatsApp, con chips de tipo rápido: Llamado/Email/Propuesta/Reunión/Demo/No atendió/Seguimiento/Otro).

**Vistas:** Tablero (solo Abiertas) / Cerradas (Ganado+Perdido+Suspendido, con sus propios KPIs) / Panorama (analítica completa, gráficos con drill-down).

---

## 5. Las 12 oportunidades cargadas (estado al 30/08/2026)

| ID | Cliente (razón social real) | Segmento | Etapa | Notas |
|---|---|---|---|---|
| OPP-001 | Gimnasios Argentinos SA (Megatlón) | CCEE Servicios | 3-Análisis Técnico | Renovación 54hs, roadmap 3 pilares 2026-27 |
| OPP-002 | IRSA Inversiones y Representaciones SA | CCEE Servicios | 5-Propuesta | EA Microsoft, ~$1.08M total |
| OPP-003 | Banco Cetelem Argentina SA (= Revolut) | Banca | 3-Análisis Técnico | Revolut sin personería propia en AR, opera sobre Cetelem |
| OPP-004 | Smurfit Kappa de Argentina SA | **CCEE Industria** | 5-Propuesta | Corregido desde Servicios |
| OPP-005 | Molinos Agro SA | CCEE Industria | 6-Negociación | Direct Connect AWS |
| OPP-006 | Galeno Argentina SA | **CCEE Servicios** | 3-Análisis Técnico | Corregido desde Industria |
| OPP-007 | Play Digital SA (MODO) | Banca | 3-Análisis Técnico | — |
| OPP-008 | Automóvil Club Argentino | CCEE Servicios | 4-POC | — |
| OPP-009 | Skyblue Analytics | Banca | 4-POC | No encontrada en cuentas.csv aún |
| OPP-010 | Defiba Servicios Portuarios SA | **CCEE Servicios** | 4-POC | Corregido desde Industria; EECC real = Arnedo Gustavo Javier |
| OPP-011 | Terminal Zarate SA | **CCEE Servicios** | 4-POC | Corregido desde Industria |
| OPP-012 | Arte Gráfico Editorial Argentino SA (AGEA) | CCEE Servicios | 6-Negociación | Commitment GCP USD 1.4M/5 años |

---

## 6. Pendientes / próximos pasos

- **Escalar a compañeros de equipo + tablero de gerencia consolidado.** Plan definido (ver conversación), no iniciado:
  1. Firebase Auth (login Google)
  2. Separar datos por usuario en Firestore (`backlog/{uid}` en vez de `backlog/data`)
  3. Reglas de seguridad por dueño + lectura ampliada para gerentes
  4. Página nueva "Tablero de gerencia" (consolida todos los backlogs)
  5. Filtro de `cuentas.csv` configurable por persona (hoy está hardcodeado a Ramírez Gonzalo + Casil/Urrutigoity/Banovaz)
- **Agenda/lista diaria de oportunidades a trabajar** dentro del Backlog — en diseño (ver conversación del 30/08).
- **Verificar** si Megatlón/REVOLUT/Skyblue/AGEA (nombres comerciales) coinciden bien con sus razones sociales reales — Edgardo ya corrigió Megatlón→Gimnasios Argentinos y AGEA→Arte Gráfico Editorial Argentino a mano.
- **4 cuentas siguen sin aparecer en cuentas.csv:** ninguna pendiente real, Skyblue Analytics es la única que falta confirmar.

---

## 7. Decisiones de diseño que conviene recordar

- **Segmento nunca se deriva del EECC** — un EECC puede atender cuentas de ambos segmentos. Siempre usar `Tipo Holding` por cuenta.
- **Vertical (actividad del cliente) ≠ Unidad de Negocio (Personal Tech)** — son dos campos independientes, no confundir.
- **Producto ≠ Proveedor** — Producto es qué se vende (DCV, Licenciamiento), Proveedor es la infraestructura detrás (AWS, Personal Cloud propio, Microsoft).
- **Los montos de un dimensionamiento interno se duplican (x2)** antes de cargarlos como precio de venta en el Backlog — el tarifario/calculadora da costo, no precio.
- **Firestore no necesita cambios de esquema** para actualizaciones de datos — todo pasa por re-importar JSON o editar en la UI.
