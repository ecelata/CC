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
  // Inter para el tema Vidrio en las páginas que no la cargan
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
        ${['zafiro','oceano','hielo','medianoche','atardecer'].map(f=>`<button type="button" class="f-${f} ${fondo===f?'active':''}" data-fondo-btn="${f}" title="Fondo ${f==='oceano'?'océano':f}"></button>`).join('')}
      </span>
    `;
    nav.appendChild(wrap);
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
