// theme-toggle.js — selector de tema compartido (celeste Bitrix / rojo institucional)
// Se importa en las 4 herramientas junto a design-system.css

(function(){
  const KEY = 'ggcc_theme';
  const saved = localStorage.getItem(KEY) || 'celeste';
  if(saved === 'rojo'){
    document.documentElement.setAttribute('data-theme', 'rojo');
  }

  function injectToggle(){
    const nav = document.querySelector('.suite-nav');
    if(!nav) return;
    const wrap = document.createElement('div');
    wrap.className = 'theme-toggle';
    wrap.innerHTML = `
      <button type="button" class="dot-celeste ${saved==='celeste'?'active':''}" data-theme-btn="celeste" title="Celeste"></button>
      <button type="button" class="dot-rojo ${saved==='rojo'?'active':''}" data-theme-btn="rojo" title="Rojo"></button>
    `;
    nav.appendChild(wrap);
    wrap.querySelectorAll('[data-theme-btn]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const theme = btn.getAttribute('data-theme-btn');
        localStorage.setItem(KEY, theme);
        if(theme === 'rojo'){
          document.documentElement.setAttribute('data-theme', 'rojo');
        }else{
          document.documentElement.removeAttribute('data-theme');
        }
        wrap.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b===btn));
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectToggle);
  }else{
    injectToggle();
  }
})();
