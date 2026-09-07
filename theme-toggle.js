// theme-toggle.js — selector de tema compartido (celeste / rojo / nuevo)
// Se importa en las 4 herramientas junto a design-system.css

(function(){
  const KEY = 'ggcc_theme';
  const saved = localStorage.getItem(KEY) || 'celeste';
  if(saved !== 'celeste'){
    document.documentElement.setAttribute('data-theme', saved);
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
    `;
    nav.appendChild(wrap);
    wrap.querySelectorAll('[data-theme-btn]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const theme = btn.getAttribute('data-theme-btn');
        applyTheme(theme);
        wrap.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b===btn));
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
