(() => {
  const root = document.documentElement;
  const key = 'cinefitaTheme';
  let theme = 'dark';
  try { if (localStorage.getItem(key) === 'light') theme = 'light'; } catch {}
  root.dataset.theme = theme;
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    const sync = () => {
      const light = root.dataset.theme === 'light';
      button.textContent = light ? '☾ Modo escuro' : '☀ Modo claro';
      button.setAttribute('aria-label', light ? 'Ativar modo escuro' : 'Ativar modo claro');
      button.setAttribute('aria-pressed', String(light));
    };
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(key, root.dataset.theme); } catch {}
      sync();
    });
    let host = document.querySelector('.motion-controls');
    if (!host) {
      host = document.createElement('div');
      host.className = 'container theme-controls';
      document.querySelector('main')?.prepend(host);
    }
    host.append(button);
    sync();
    window.addEventListener('storage', event => {
      if (event.key === key) { root.dataset.theme = event.newValue === 'light' ? 'light' : 'dark'; sync(); }
    });
  });
})();
