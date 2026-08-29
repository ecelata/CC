// STATE
var sidebarOpen = true;
var currentFile = null;
var isMobile = window.innerWidth <= 768;
var siteData = null;
var modalOpen = false;
var activeSearchTerm = '';
var activeTagFilter = '';
var activeCategoryFilter = '';

// ESTRUCTURA INTEGRADA (fallback si structure.json falla)
var fallbackStructure = {
  "site": {
    "title": "Personal Tech · Centro de Recursos Cloud",
    "description": "Material de consulta, argumentario comercial y herramientas para infraestructura, cloud e IA"
  },
  "categories": [
    {
      "id": "empresa",
      "icon": "🏢",
      "title": "Personal Tech — Empresa, Productos y Servicios",
      "modules": [
        {"file": "personal_tech_master.html", "title": "Master Reference — Personal Tech", "description": "Referencia completa. Qué es Personal Tech, historia, ecosistema, servicios, roadmap 2026–2028.", "color": "#378ADD", "tags": ["core", "referencia"], "keywords": ["personal tech", "empresa", "servicios", "productos", "infraestructura", "cloud", "ia", "soluciones"]},
        {"file": "personal_tech_kit.html", "title": "Kit de Arranque — Primeros 90 días", "description": "Qué leer primero. Estructura recomendada para entender Personal Tech en 90 días.", "color": "#378ADD", "tags": ["core", "inicio"], "keywords": ["kit", "90 días", "inicio", "introducción", "primeros pasos", "onboarding", "guía"]},
        {"file": "personal_tech_portfolio.html", "title": "Portfolio de Productos y Servicios", "description": "Catálogo completo de soluciones de Personal Tech por vertiente y caso de uso.", "color": "#378ADD", "tags": ["core", "servicios"], "keywords": ["portfolio", "productos", "servicios", "soluciones", "vertientes", "casos de uso", "oferta"]},
        {"file": "porque_personal_tech.html", "title": "Por qué Personal Tech", "description": "Propuesta de valor, diferenciadores, capacidades únicas, por qué somos diferentes.", "color": "#378ADD", "tags": ["core", "estrategia"], "keywords": ["propuesta de valor", "diferenciadores", "ventajas", "capacidades", "posicionamiento", "competitividad"]}
      ]
    },
    {
      "id": "cloud-tecnico",
      "icon": "☁️",
      "title": "Cloud Técnico — Conceptos, Arquitecturas y Glosarios",
      "modules": [
        {"file": "personal_tech_conceptos.html", "title": "Glosario y Diferenciadores Clave", "description": "Términos técnicos, conceptos cloud, diferenciadores de Personal Tech.", "color": "#1D9E75", "tags": ["glosario", "educación"], "keywords": ["glosario", "conceptos", "términos", "definiciones", "diferenciadores", "cloud", "iaas", "paas", "saas"]},
        {"file": "cloud_adoption_frameworks.html", "title": "Cloud Adoption Frameworks — CAF, NIST, COBIT", "description": "Marcos de adopción cloud: AWS CAF, Microsoft CAF, NIST, COBIT. Cuándo usar cada uno.", "color": "#1D9E75", "tags": ["frameworks", "educación"], "keywords": ["caf", "nist", "cobit", "frameworks", "adopción", "metodología", "aws", "microsoft", "governance"]},
        {"file": "glosario_unificado_cloud.html", "title": "Glosario Unificado Cloud — Términos A–Z", "description": "Diccionario cloud completo. Todos los términos técnicos explicados en español.", "color": "#1D9E75", "tags": ["glosario", "referencia"], "keywords": ["glosario", "diccionario", "términos", "api", "lambda", "s3", "iam", "vpc", "subnet", "cloudfront", "rds", "ec2", "elb", "alb", "autoscaling", "definiciones"]},
        {"file": "multicloud_comparativa.html", "title": "Comparativa Multicloud — AWS vs Azure vs GCP", "description": "Análisis detallado: servicios, pricing, casos de uso, fortalezas/debilidades de cada cloud.", "color": "#1D9E75", "tags": ["comparativa", "educación"], "keywords": ["comparativa", "aws", "azure", "gcp", "google cloud", "microsoft", "amazon", "multicloud", "versus", "diferencias", "pricing", "servicios", "huawei", "ibm", "oracle"]},
        {"file": "cloud_infra_tools.html", "title": "Cloud Infra Tools — Terraform, CloudFormation, CDK", "description": "Herramientas IaC: Terraform, CloudFormation, CDK, Ansible. Cuándo usar cada una.", "color": "#1D9E75", "tags": ["herramientas", "iac"], "keywords": ["terraform", "cloudformation", "cdk", "ansible", "iac", "infraestructura como código", "provisioning", "automatización", "herramientas"]}
      ]
    },
    {
      "id": "clevel",
      "icon": "👔",
      "title": "Conversaciones C-Level — Migración, TCO, ROI y Negocio",
      "modules": [
        {"file": "migracion_cloud_clevel.html", "title": "Migración Cloud · TCO · ROI · C-Level", "description": "Cómo hablar de migración con ejecutivos. TCO, ROI, business case, riesgos, timeline.", "color": "#0070F3", "tags": ["clevel", "migración", "negocio"], "keywords": ["migración", "tco", "roi", "c-level", "ejecutivos", "business case", "riesgos", "timeline", "inversión"]},
        {"file": "plan_comercial_cloud.html", "title": "Plan Comercial Cloud — Estructura y Pitch", "description": "Cómo armar el plan comercial. Estructura, propuesta, timeline, inversión, retorno.", "color": "#0070F3", "tags": ["comercial", "negocio"], "keywords": ["plan comercial", "pitch", "estructura", "propuesta", "timeline", "inversión", "retorno", "presentación"]},
        {"file": "calculadora_tco_roi.html", "title": "Calculadora TCO / ROI Cloud", "description": "Herramienta interactiva para calcular costo total de propiedad vs cloud.", "color": "#0070F3", "tags": ["herramienta", "financiero"], "keywords": ["calculadora", "tco", "roi", "costo", "retorno", "inversión", "herramienta", "simulador"]},
        {"file": "optimizacion_costos_cloud.html", "title": "Optimización de Costos Cloud — FinOps", "description": "Estrategias de optimización de costos. Reserved Instances, Savings Plans, rightsizing.", "color": "#0070F3", "tags": ["finops", "costos"], "keywords": ["finops", "optimización", "costos", "reserved instances", "savings plans", "rightsizing", "economía", "ahorro"]},
        {"file": "calculadora_finops.html", "title": "Calculadora FinOps — Modelo de Optimización", "description": "Modelo interactivo: qué cuesta, cómo optimizar, cuánto ahorras.", "color": "#0070F3", "tags": ["herramienta", "finops"], "keywords": ["finops", "calculadora", "optimización", "costos", "ahorro", "modelo", "simulador"]}
      ]
    },
    {
      "id": "capacitacion",
      "icon": "🎓",
      "title": "Capacitación Comercial — Training y Habilidades",
      "modules": [
        {"file": "training_vendedores_cloud.html", "title": "Training — 200 Vendedores de Campo", "description": "Programa de capacitación para team de ventas. Módulos, ejercicios, casos prácticos.", "color": "#BA7517", "tags": ["training", "ventas"], "keywords": ["training", "capacitación", "vendedores", "ventas", "equipo", "módulos", "ejercicios", "casos prácticos"]},
        {"file": "meddpicc_bant_spin.html", "title": "MEDDPICC · BANT · SPIN — Metodologías de Venta", "description": "Técnicas de venta comprobadas. MEDDPICC, BANT, SPIN. Cuándo usar cada una.", "color": "#BA7517", "tags": ["venta", "metodología"], "keywords": ["meddpicc", "bant", "spin", "metodología", "venta", "técnicas", "cierre", "negociación"]}
      ]
    },
    {
      "id": "argumentario",
      "icon": "🏆",
      "title": "Argumentario y Estrategia Comercial",
      "modules": [
        {"file": "battlecards_personal_tech.html", "title": "Battlecards Ganadoras — Por qué Personal Tech", "description": "Argumentario completo por servicio. Objeciones, pivots, argumento maestro.", "color": "#0C447C", "tags": ["argumentario", "ventas"], "keywords": ["battlecards", "argumentario", "objeciones", "pivots", "respuestas", "ventas", "argumentos", "razones"]},
        {"file": "argumentario_cloud_segmentos.html", "title": "Argumentario Cloud por Segmentos", "description": "Argumentos específicos por segmento: PYME, Corporate, Sector Público.", "color": "#0C447C", "tags": ["argumentario", "segmentación"], "keywords": ["argumentario", "segmentos", "pyme", "corporate", "sector público", "verticales", "industrias"]},
        {"file": "argumentos_cloud.html", "title": "Argumentos Cloud — El Caso Técnico y de Negocio", "description": "Por qué cloud. Argumentos técnicos, comerciales, estratégicos.", "color": "#0C447C", "tags": ["argumentario", "educación"], "keywords": ["argumentos", "cloud", "técnico", "negocio", "casos", "beneficios", "ventajas", "razones"]},
        {"file": "objeciones_avanzadas.html", "title": "Objeciones Avanzadas — Seguridad, Compliance, Legacy", "description": "Objeciones complejas y cómo responder. Security, compliance, migración de legacy.", "color": "#0C447C", "tags": ["argumentario", "objeciones"], "keywords": ["objeciones", "seguridad", "compliance", "legacy", "riesgos", "respuestas", "miedos", "preocupaciones"]}
      ]
    },
    {
      "id": "herramientas",
      "icon": "🧮",
      "title": "Herramientas de Preventa y Análisis",
      "modules": [
        {"file": "template_propuesta_comercial.html", "title": "Template Propuesta Comercial — Estructura Lista", "description": "Template listo para copiar. Estructura de propuesta, secciones, qué incluir.", "color": "#D85A30", "tags": ["herramienta", "comercial"], "keywords": ["template", "propuesta", "comercial", "estructura", "formato", "documento", "secciones"]},
        {"file": "casos_exito.html", "title": "Casos de Éxito — Prueba Social y ROI Real", "description": "Casos reales de clientes. Desafío, solución, resultados, números.", "color": "#D85A30", "tags": ["casos", "prueba social"], "keywords": ["casos de éxito", "casos", "clientes", "resultados", "roi", "prueba social", "testimonios", "ejemplos"]}
      ]
    },
    {
      "id": "aws",
      "icon": "🟠",
      "title": "AWS Deep Dive — Well-Architected, Pricing, Laboratorio",
      "modules": [
        {"file": "aws_deep_dive.html", "title": "Well-Architected · Pricing · Arquitecturas", "description": "AWS en profundidad. Well-Architected Framework, pricing model, arquitecturas de referencia.", "color": "#FF9900", "tags": ["aws", "educación"], "keywords": ["aws", "well-architected", "pricing", "arquitecturas", "framework", "pilares", "excelencia operativa"]},
        {"file": "aws_arquitecturas.html", "title": "Arquitecturas AWS — Patrones y Blueprints", "description": "Patrones de arquitectura recomendada. Web, mobile, enterprise, big data.", "color": "#FF9900", "tags": ["aws", "arquitectura"], "keywords": ["aws", "arquitecturas", "patrones", "blueprints", "web", "mobile", "enterprise", "big data", "diseño"]},
        {"file": "aws_free_tier.html", "title": "AWS Free Tier — Aprender sin Gastar", "description": "Servicios gratuitos de AWS. Qué está free, límites, cuánto tiempo.", "color": "#FF9900", "tags": ["aws", "educación", "free"], "keywords": ["aws", "free tier", "gratuito", "servicios gratis", "límites", "sin costo", "aprender", "poc"]},
        {"file": "aws_laboratorio.html", "title": "Laboratorio AWS — Practicar de Verdad", "description": "Labs prácticos. Cómo montar labs, ejercicios, paso a paso.", "color": "#FF9900", "tags": ["aws", "práctica", "hands-on"], "keywords": ["aws", "laboratorio", "lab", "práctico", "hands-on", "ejercicios", "paso a paso", "tutorial"]}
      ]
    },
    {
      "id": "ia",
      "icon": "🤖",
      "title": "Inteligencia Artificial — Guía Completa y Aplicaciones",
      "modules": [
        {"file": "inteligencia_artificial.html", "title": "IA — Guía Completa y Diccionario A–Z", "description": "Todo sobre IA. Conceptos, machine learning, deep learning, aplicaciones empresariales.", "color": "#7C3AED", "tags": ["ia", "educación", "referencia"], "keywords": ["ia", "inteligencia artificial", "machine learning", "deep learning", "neural networks", "algoritmos", "modelos", "aplicaciones"]},
        {"file": "caf_copilot_poc.html", "title": "CAF Copilot PoC — Piloto de IA en CAF", "description": "Caso de uso: copilot para Cloud Adoption Framework. Cómo implementarlo.", "color": "#7C3AED", "tags": ["ia", "caso uso", "poc"], "keywords": ["copilot", "ia", "poc", "prueba concepto", "caf", "automatización", "asistente", "implementación"]}
      ]
    },
    {
      "id": "interno",
      "icon": "🎙",
      "title": "Contexto Interno — Entrevistas y Conocimiento Corporativo",
      "modules": [
        {"file": "entrevistas_gerardo_resumen.html", "title": "Entrevistas Gerardo — Resumen Ejecutivo", "description": "Notas de entrevistas. Strategy, posicionamiento, roadmap, decisiones clave.", "color": "#888780", "tags": ["interno", "estrategia"], "keywords": ["entrevistas", "gerardo", "strategy", "posicionamiento", "roadmap", "decisiones", "resumen ejecutivo"]},
        {"file": "analisis_estrategico_personal_2026.html", "title": "Análisis Estratégico Personal Tech 2026", "description": "Análisis con datos reales. Convergencias, flywheel, escenarios, mapa de oportunidades.", "color": "#888780", "tags": ["interno", "estrategia"], "keywords": ["análisis estratégico", "2026", "convergencias", "flywheel", "escenarios", "oportunidades", "datos"]}
      ]
    },
    {
      "id": "iot",
      "icon": "📡",
      "title": "IoT y Telemetría — Conectividad y Datos en Tiempo Real",
      "modules": [
        {"file": "iot_telemetria.html", "title": "IoT y Telemetría — Arquitectura y Casos de Uso", "description": "IoT desde cero. Sensores, conectividad, telemetría, cloud integration, analytics.", "color": "#1A9696", "tags": ["iot", "educación"], "keywords": ["iot", "telemetría", "sensores", "conectividad", "5g", "dispositivos", "datos en tiempo real", "arquitectura", "analytics"]}
      ]
    },
    {
      "id": "migraciones",
      "icon": "🌊",
      "title": "Migraciones Cloud — Framework 7R y Metodologías",
      "modules": [
        {"file": "migraciones_cloud_7r.html", "title": "Las 7 R de la Migración — Estrategias de Movimiento", "description": "Framework 7R: Rehost, Replatform, Refactor, Repurchase, Retire, Retain, Re-architect.", "color": "#085041", "tags": ["migraciones", "frameworks"], "keywords": ["7r", "rehost", "replatform", "refactor", "repurchase", "retire", "retain", "re-architect", "migración", "estrategias"]},
        {"file": "practicas_migracion_cloud.html", "title": "Prácticas Mejores en Migración Cloud — Checklist", "description": "Best practices. Planificación, ejecución, testing, cutover, post-migración.", "color": "#085041", "tags": ["migraciones", "best practices"], "keywords": ["best practices", "migración", "checklist", "planificación", "ejecución", "testing", "cutover", "validación"]},
        {"file": "migration_frameworks.html", "title": "Migration Frameworks — AWS MGN, Azure Migrate, GCP", "description": "Herramientas de migración. AWS MGN, Azure Migrate, GCP. Cuándo usar cada una.", "color": "#085041", "tags": ["migraciones", "herramientas"], "keywords": ["aws mgn", "azure migrate", "gcp", "herramientas migración", "frameworks", "automatización", "replicación"]}
      ]
    },
    {
      "id": "legacy",
      "icon": "⚙️",
      "title": "Infraestructura Legacy — VMware, Veeam, Ciberseguridad, DR",
      "modules": [
        {"file": "vmware_veeam_matilda.html", "title": "VMware · Veeam · Matilda Cloud — Post-Broadcom", "description": "Infraestructura legacy. VMware post-Broadcom, Veeam, Matilda, evolución post-acquisition.", "color": "#633806", "tags": ["legacy", "infraestructura"], "keywords": ["vmware", "veeam", "matilda", "broadcom", "legacy", "virtualización", "backup", "recuperación"]},
        {"file": "ciberseguridad.html", "title": "Ciberseguridad y Cumplimiento Normativo", "description": "Seguridad en cloud. Threat model, compliance, BCRA, SOC 2, ISO, PCI-DSS.", "color": "#633806", "tags": ["seguridad", "compliance"], "keywords": ["ciberseguridad", "seguridad", "compliance", "bcra", "soc2", "iso", "pci-dss", "threat model", "regulación"]},
        {"file": "roles_y_dr.html", "title": "Roles y Responsabilidades · Disaster Recovery", "description": "Matriz RACI, roles en cloud, disaster recovery, continuidad de negocio.", "color": "#633806", "tags": ["dr", "governance"], "keywords": ["raci", "roles", "responsabilidades", "disaster recovery", "dr", "continuidad negocio", "backup", "recuperación"]},
        {"file": "legacy_migracion.html", "title": "Legacy Modernization — De On-Prem a Cloud", "description": "Cómo migrar legacy. Aplicaciones monolíticas, bases de datos, testing.", "color": "#633806", "tags": ["migraciones", "legacy"], "keywords": ["legacy", "modernización", "on-prem", "monolítico", "aplicaciones", "bases de datos", "refactoring"]}
      ]
    },
    {
      "id": "estrategia",
      "icon": "📈",
      "title": "Estrategia Personal Tech — Convergencia y Posicionamiento",
      "modules": [
        {"file": "cadena_valor_iiot_ia.html", "title": "De la Infraestructura a la Inteligencia — Cadena de Valor", "description": "Las 7 capas: Conectividad → Cloud → Ciberseguridad → IoT → Analytics → IA → Desarrollo.", "color": "#7C3AED", "tags": ["estrategia", "posicionamiento"], "keywords": ["cadena de valor", "7 capas", "conectividad", "cloud", "ciberseguridad", "iot", "analytics", "ia", "desarrollo"]},
        {"file": "playbook_vertical.html", "title": "Playbook Vertical — Go-to-Market por Industria", "description": "Estrategia por vertical. Manufacturing, Banking, Utilities, Retail, Healthcare.", "color": "#7C3AED", "tags": ["estrategia", "verticals"], "keywords": ["playbook", "vertical", "go-to-market", "industrias", "manufacturing", "banking", "utilities", "retail", "healthcare"]},
        {"file": "universo_workloads.html", "title": "Universo de Workloads — Mapeo de Casos de Uso", "description": "Catálogo de cargas de trabajo. Cuál se migra, cuál se reemplaza, cuál se transforma.", "color": "#7C3AED", "tags": ["estrategia", "casos uso"], "keywords": ["workloads", "casos de uso", "cargas de trabajo", "mapeo", "transformación", "modernización"]}
      ]
    }
  ]
};

// CARGAR ESTRUCTURA
function initSite() {
  fetch('structure.json')
    .then(r => r.json())
    .then(data => {
      console.log('✅ structure.json cargado correctamente');
      siteData = data;
      renderSidebar();
      renderHome();
    })
    .catch(e => {
      console.warn('⚠️ No se pudo cargar structure.json, usando fallback integrado');
      siteData = fallbackStructure;
      renderSidebar();
      renderHome();
    });
}

// ──────────────────────────────────────────────────────────────
// RENDER SIDEBAR CON MODAL POPUP
// ──────────────────────────────────────────────────────────────
function renderSidebar() {
  if (!siteData) return;
  
  var sidebarMenu = document.getElementById('sidebar-menu');
  sidebarMenu.innerHTML = '';
  
  siteData.categories.forEach(function(cat) {
    var section = document.createElement('div');
    section.className = 'sb-section';
    
    var header = document.createElement('button');
    header.className = 'sb-category-header';
    header.onclick = function(e) {
      e.preventDefault();
      openCategoryModal(cat);
    };
    
    var icon = document.createElement('span');
    icon.className = 'sb-category-icon';
    icon.textContent = cat.icon;
    header.appendChild(icon);
    
    var title = document.createElement('span');
    title.className = 'sb-category-title';
    title.textContent = cat.title;
    header.appendChild(title);
    
    var arrow = document.createElement('span');
    arrow.className = 'sb-category-arrow';
    arrow.textContent = '→';
    header.appendChild(arrow);
    
    section.appendChild(header);
    sidebarMenu.appendChild(section);
  });
}

// Abrir modal de categoría
function openCategoryModal(category) {
  if (modalOpen) return;
  modalOpen = true;
  
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'category-modal';
  
  var modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  var header = document.createElement('div');
  header.className = 'modal-header';
  
  var headerTitle = document.createElement('h2');
  headerTitle.className = 'modal-title';
  headerTitle.innerHTML = category.icon + ' ' + category.title;
  header.appendChild(headerTitle);
  
  var closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '✕';
  closeBtn.onclick = closeModal;
  header.appendChild(closeBtn);
  
  modalContent.appendChild(header);
  
  var list = document.createElement('div');
  list.className = 'modal-list';
  
  category.modules.forEach(function(mod) {
    var item = document.createElement('button');
    item.className = 'modal-item';
    item.onclick = function() {
      closeModal();
      loadModule(mod.file, mod.title);
    };
    
    var itemIcon = document.createElement('div');
    itemIcon.className = 'modal-item-icon';
    itemIcon.style.background = mod.color || '#378ADD';
    itemIcon.textContent = '●';
    item.appendChild(itemIcon);
    
    var itemText = document.createElement('div');
    itemText.className = 'modal-item-text';
    
    var itemTitle = document.createElement('div');
    itemTitle.className = 'modal-item-title';
    itemTitle.textContent = mod.title;
    itemText.appendChild(itemTitle);
    
    var itemDesc = document.createElement('div');
    itemDesc.className = 'modal-item-desc';
    itemDesc.textContent = mod.description;
    itemText.appendChild(itemDesc);
    
    item.appendChild(itemText);
    list.appendChild(item);
  });
  
  modalContent.appendChild(list);
  modal.appendChild(modalContent);
  
  modal.onclick = function(e) {
    if (e.target === modal) {
      closeModal();
    }
  };
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOpen) {
      closeModal();
    }
  });
  
  document.body.appendChild(modal);
}

function closeModal() {
  var modal = document.getElementById('category-modal');
  if (modal) {
    modal.remove();
  }
  modalOpen = false;
}

// ──────────────────────────────────────────────────────────────
// RENDER HOME CON BÚSQUEDA Y FILTROS
// ──────────────────────────────────────────────────────────────
function renderHome() {
  renderSearchBar();
  renderTagFilters();
  renderCategories();
}

function renderSearchBar() {
  var searchContainer = document.getElementById('search-container');
  if (!searchContainer) return;
  
  searchContainer.innerHTML = '';
  
  var input = document.createElement('input');
  input.id = 'search-input';
  input.type = 'text';
  input.placeholder = '🔍 Buscar módulos...';
  input.className = 'search-input';
  input.onkeyup = function() {
    activeSearchTerm = this.value.toLowerCase();
    applyFilters();
  };
  
  searchContainer.appendChild(input);
}

function renderTagFilters() {
  var filterContainer = document.getElementById('filter-container');
  if (!filterContainer) return;
  
  filterContainer.innerHTML = '';
  
  // Recolectar todos los tags únicos
  var allTags = new Set();
  siteData.categories.forEach(function(cat) {
    cat.modules.forEach(function(mod) {
      if (mod.tags) {
        mod.tags.forEach(function(tag) {
          allTags.add(tag);
        });
      }
    });
  });
  
  // Crear botones de filtro
  var tagsArray = Array.from(allTags).sort();
  tagsArray.forEach(function(tag) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = tag;
    btn.onclick = function() {
      activeTagFilter = activeTagFilter === tag ? '' : tag;
      document.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      if (activeTagFilter) {
        this.classList.add('active');
      }
      applyFilters();
    };
    filterContainer.appendChild(btn);
  });
}

function applyFilters() {
  if (!siteData) return;
  
  siteData.categories.forEach(function(cat) {
    cat.modules.forEach(function(mod) {
      // Búsqueda en título, descripción y keywords
      var searchText = activeSearchTerm;
      var matchSearch = !searchText || 
        mod.title.toLowerCase().includes(searchText) || 
        mod.description.toLowerCase().includes(searchText) ||
        (mod.keywords && mod.keywords.join(' ').toLowerCase().includes(searchText));
      
      var matchTag = !activeTagFilter || 
        (mod.tags && mod.tags.includes(activeTagFilter));
      
      var cardId = 'card-' + mod.file;
      var card = document.getElementById(cardId);
      if (card) {
        if (matchSearch && matchTag) {
          card.style.display = '';
          card.classList.remove('filtered-out');
        } else {
          card.style.display = 'none';
          card.classList.add('filtered-out');
        }
      }
    });
  });
}

function renderCategories() {
  if (!siteData) return;
  
  var container = document.getElementById('categories-container');
  container.innerHTML = '';
  
  siteData.categories.forEach(function(cat) {
    var catDiv = document.createElement('div');
    catDiv.className = 'home-cat';
    
    var title = document.createElement('div');
    title.className = 'home-cat-title';
    title.textContent = cat.title;
    catDiv.appendChild(title);
    
    var grid = document.createElement('div');
    grid.className = 'module-grid';
    
    cat.modules.forEach(function(mod) {
      var card = document.createElement('div');
      card.className = 'module-card';
      card.id = 'card-' + mod.file;
      card.onclick = function() { loadModule(mod.file, mod.title); };
      
      var accent = document.createElement('div');
      accent.className = 'mc-accent';
      accent.style.background = mod.color || '#378ADD';
      card.appendChild(accent);
      
      var body = document.createElement('div');
      body.className = 'mc-body';
      
      var header = document.createElement('div');
      header.className = 'mc-header';
      
      var iconDiv = document.createElement('div');
      iconDiv.className = 'mc-icon';
      iconDiv.style.background = getColorLight(mod.color || '#378ADD');
      iconDiv.innerHTML = cat.icon;
      header.appendChild(iconDiv);
      
      var catLabel = document.createElement('div');
      catLabel.className = 'mc-cat';
      catLabel.style.color = mod.color || '#378ADD';
      catLabel.textContent = cat.title.split('—')[0].trim();
      header.appendChild(catLabel);
      
      body.appendChild(header);
      
      var titleEl = document.createElement('div');
      titleEl.className = 'mc-title';
      titleEl.textContent = mod.title;
      body.appendChild(titleEl);
      
      var desc = document.createElement('div');
      desc.className = 'mc-desc';
      desc.textContent = mod.description;
      body.appendChild(desc);
      
      var footer = document.createElement('div');
      footer.className = 'mc-footer';
      
      var sections = document.createElement('span');
      sections.className = 'mc-sections';
      var tags = mod.tags ? mod.tags.join(' · ') : 'módulo';
      sections.textContent = tags;
      footer.appendChild(sections);
      
      var cta = document.createElement('span');
      cta.className = 'mc-cta';
      cta.style.background = mod.color || '#378ADD';
      cta.textContent = 'Abrir →';
      footer.appendChild(cta);
      
      body.appendChild(footer);
      card.appendChild(body);
      grid.appendChild(card);
    });
    
    catDiv.appendChild(grid);
    container.appendChild(catDiv);
  });
}

// Función auxiliar para obtener color más claro
function getColorLight(color) {
  var map = {
    '#378ADD': '#E6F1FB',
    '#1D9E75': '#E1F5EE',
    '#BA7517': '#FAEEDA',
    '#D85A30': '#FAECE7',
    '#7F77DD': '#EEEDFE',
    '#1A9696': '#E0F5F5',
    '#888780': '#F1EFE8',
    '#0070F3': '#EBF5FF',
    '#0C447C': '#E6F1FB',
    '#0A4040': '#E0F5F5',
    '#FF9900': '#FFF4E6',
    '#7C3AED': '#F3E8FF',
    '#085041': '#E1F5EE',
    '#633806': '#FAEEDA'
  };
  return map[color] || '#F1EFE8';
}

// ──────────────────────────────────────────────────────────────
// FUNCIONES DE NAVEGACIÓN
// ──────────────────────────────────────────────────────────────

function loadModule(file, title) {
  currentFile = file;
  
  document.getElementById('home-panel').classList.add('hidden');
  document.getElementById('iframe-panel').classList.add('visible');
  
  document.getElementById('iframe-title').textContent = title;
  document.getElementById('iframe-open-link').href = 'pages/' + file;
  document.getElementById('breadcrumb-current').textContent = title;
  document.getElementById('btn-open-new').style.display = 'inline-block';
  
  document.getElementById('iframe-el').src = 'pages/' + file;
  
  if(isMobile) closeSidebar();
}

function goHome() {
  currentFile = null;
  document.getElementById('home-panel').classList.remove('hidden');
  document.getElementById('iframe-panel').classList.remove('visible');
  document.getElementById('iframe-el').src = 'about:blank';
  document.getElementById('breadcrumb-current').textContent = 'Inicio';
  document.getElementById('btn-open-new').style.display = 'none';
}

function openInNew() {
  if(currentFile) window.open('pages/' + currentFile, '_blank');
}

function toggleSidebar() {
  if(isMobile) {
    var sb = document.getElementById('sidebar');
    var ov = document.getElementById('overlay');
    var isOpen = sb.classList.contains('open');
    sb.classList.toggle('open', !isOpen);
    ov.classList.toggle('show', !isOpen);
  } else {
    sidebarOpen = !sidebarOpen;
    var sb = document.getElementById('sidebar');
    var main = document.getElementById('main');
    sb.classList.toggle('collapsed', !sidebarOpen);
    main.classList.toggle('expanded', !sidebarOpen);
  }
}

function closeSidebar() {
  if(isMobile) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
  }
}

// ──────────────────────────────────────────────────────────────
// EVENTOS Y INICIALIZACIÓN
// ──────────────────────────────────────────────────────────────

var hoy = new Date().toLocaleDateString('es-AR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
var heroDate = document.getElementById('hero-date');
if (heroDate) heroDate.textContent = hoy;
var sbDate = document.getElementById('sb-date');
if (sbDate) sbDate.textContent = hoy;

window.addEventListener('resize', function() {
  isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
  }
});

window.addEventListener('DOMContentLoaded', function() {
  initSite();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
