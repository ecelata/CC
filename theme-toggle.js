// theme-toggle.js — selector de tema compartido (celeste / rojo / nuevo)
// Se importa en las 4 herramientas junto a design-system.css

(function(){
  const KEY = 'ggcc_theme';
  const saved = localStorage.getItem(KEY) || 'celeste';
  if(saved !== 'celeste'){
    document.documentElement.setAttribute('data-theme', saved);
  }
  // Fondo del tema Vidrio (zafiro / oceano / hielo / medianoche)
  const FKEY = 'ggcc_fondo';
  let fondo = 'zafiro';
  try{ fondo = localStorage.getItem(FKEY) || 'zafiro'; }catch(e){}
  document.documentElement.setAttribute('data-fondo', fondo);
  // Foto de fondo propia (tema Vidrio): se guarda solo en este navegador, no se sube al repo
  const FOTO_KEY = 'ggcc_fondo_foto', FOTO_ON = 'ggcc_foto_on';
  function fotoGuardada(){ try{ return localStorage.getItem(FOTO_KEY) || ''; }catch(e){ return ''; } }
  function aplicarFoto(on){
    const data = fotoGuardada();
    if(on && data){
      document.documentElement.style.setProperty('--foto', 'url("' + data + '")');
      document.documentElement.setAttribute('data-foto', '1');
    }else{
      document.documentElement.removeAttribute('data-foto');
    }
    try{ localStorage.setItem(FOTO_ON, on && data ? '1' : '0'); }catch(e){}
  }
  try{ if(localStorage.getItem(FOTO_ON) === '1') aplicarFoto(true); }catch(e){}
  // Achica la imagen (máx. 2000 px de ancho, JPEG) para que entre en el navegador
  function cargarFoto(file, listo){
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 2000, k = Math.min(1, max / img.width);
        const c = document.createElement('canvas'); c.width = Math.round(img.width*k); c.height = Math.round(img.height*k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        let q = 0.82, url = c.toDataURL('image/jpeg', q);
        while(url.length > 1800000 && q > 0.4){ q -= 0.1; url = c.toDataURL('image/jpeg', q); }
        try{ localStorage.setItem(FOTO_KEY, url); listo(true); }
        catch(e){ alert('La foto es muy pesada para guardarla en el navegador. Probá con una más chica.'); listo(false); }
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }
  // Inter para el tema Vidrio en las páginas que no la cargan
  // Source Serif 4 itálica para las palabras destacadas de los títulos (tema Vidrio)
  if(!document.querySelector('link[href*="Source+Serif"]')){
    const ls = document.createElement('link'); ls.rel='stylesheet';
    ls.href='https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@1,8..60,400&display=swap';
    document.head.appendChild(ls);
  }
  // IBM Plex Sans + Mono para el tema Grafito
  if(!document.querySelector('link[href*="family=IBM+Plex+Sans"]')){
    const lp = document.createElement('link'); lp.rel='stylesheet';
    lp.href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(lp);
  }
  if(!document.querySelector('link[href*="family=Inter"]')){
    const l = document.createElement('link'); l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }

  const NAV_ICONS = {
    'index.html': 'home',
    'dashboard.html': 'building-2',
    'Backlog_Preventa.html': 'target',
    'calculadora.html': 'calculator'
  };

  function injectNavIcons(){
    document.querySelectorAll('.suite-nav a').forEach(a=>{
      if(a.querySelector('.nav-icon')) return;
      const href = a.getAttribute('href') || '';
      const filename = href.split('/').pop();
      const iconName = NAV_ICONS[filename];
      if(!iconName) return;
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', iconName);
      icon.className = 'nav-icon';
      a.insertBefore(icon, a.firstChild);
    });
  }

  function loadLucideAndRender(){
    if(window.lucide){ window.lucide.createIcons(); return; }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest';
    script.onload = () => { if(window.lucide) window.lucide.createIcons(); };
    document.head.appendChild(script);
  }

  function applyTheme(theme){
    if(theme === 'celeste'){
      document.documentElement.removeAttribute('data-theme');
    }else{
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem(KEY, theme);
  }

  function injectToggle(){
    const nav = document.querySelector('.suite-nav');
    if(!nav) return;

    injectNavIcons();
    loadLucideAndRender();

    const wrap = document.createElement('div');
    wrap.className = 'theme-toggle';
    wrap.innerHTML = `
      <button type="button" class="dot-celeste ${saved==='celeste'?'active':''}" data-theme-btn="celeste" title="Celeste"></button>
      <button type="button" class="dot-rojo ${saved==='rojo'?'active':''}" data-theme-btn="rojo" title="Rojo"></button>
      <button type="button" class="dot-nuevo ${saved==='nuevo'?'active':''}" data-theme-btn="nuevo" title="Nuevo"></button>
      <button type="button" class="dot-claro ${saved==='claro'?'active':''}" data-theme-btn="claro" title="Claro"></button>
      <button type="button" class="dot-oscuro ${saved==='oscuro'?'active':''}" data-theme-btn="oscuro" title="Oscuro"></button>
      <button type="button" class="dot-vidrio ${saved==='vidrio'?'active':''}" data-theme-btn="vidrio" title="Vidrio"></button>
      <button type="button" class="dot-grafito ${saved==='grafito'?'active':''}" data-theme-btn="grafito" title="Grafito"></button>
      <span class="fondo-pick" aria-label="Fondo del tema Vidrio">
        ${['zafiro','oceano','hielo','medianoche','atardecer','plata','tierra'].map(f=>`<button type="button" class="f-${f} ${fondo===f?'active':''}" data-fondo-btn="${f}" title="Fondo ${f==='oceano'?'océano':f}"></button>`).join('')}
        <button type="button" class="f-foto" data-foto-btn="toggle" title="Usar mi foto de fondo (encender / apagar)" aria-label="Mi foto de fondo"></button>
        <button type="button" class="f-foto-subir" data-foto-btn="subir" title="Subir o cambiar mi foto de fondo" aria-label="Subir foto de fondo">+</button>
        <input type="file" accept="image/*" data-foto-file style="display:none">
      </span>
    `;
    nav.appendChild(wrap);
    const fotoBtn = wrap.querySelector('[data-foto-btn="toggle"]'), fotoFile = wrap.querySelector('[data-foto-file]');
    function pintarMiniatura(){ const d = fotoGuardada(); if(fotoBtn){ fotoBtn.style.backgroundImage = d ? 'url("'+d+'")' : ''; fotoBtn.classList.toggle('vacia', !d); fotoBtn.classList.toggle('active', document.documentElement.getAttribute('data-foto')==='1'); } }
    pintarMiniatura();
    if(fotoBtn) fotoBtn.addEventListener('click', ()=>{
      if(!fotoGuardada()){ fotoFile.click(); return; }
      aplicarFoto(document.documentElement.getAttribute('data-foto')!=='1'); pintarMiniatura();
    });
    const subir = wrap.querySelector('[data-foto-btn="subir"]');
    if(subir) subir.addEventListener('click', ()=> fotoFile.click());
    if(fotoFile) fotoFile.addEventListener('change', ()=>{
      const f = fotoFile.files && fotoFile.files[0]; if(!f) return;
      cargarFoto(f, ok => { if(ok){ aplicarFoto(true); pintarMiniatura(); } fotoFile.value=''; });
    });
    wrap.querySelectorAll('[data-fondo-btn]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        fondo = btn.getAttribute('data-fondo-btn');
        document.documentElement.setAttribute('data-fondo', fondo);
        try{ localStorage.setItem(FKEY, fondo); }catch(e){}
        wrap.querySelectorAll('[data-fondo-btn]').forEach(b=>b.classList.toggle('active', b===btn));
      });
    });
    wrap.querySelectorAll('[data-theme-btn]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const theme = btn.getAttribute('data-theme-btn');
        applyTheme(theme);
        wrap.querySelectorAll('[data-theme-btn]').forEach(b=>b.classList.toggle('active', b===btn));
        loadLucideAndRender();
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectToggle);
  }else{
    injectToggle();
  }
})();
