/* One entrance per homepage load. Interruptions settle the brand permanently. */
(() => {
  const logo = document.querySelector('header .cinefita-motion');
  if (!logo) return;
  const brand = logo.closest('.brand');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let timer;
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains('motion-paused')) finish();
  });
  function finish() {
    logo.classList.add('is-complete');
    clearTimeout(timer);
    observer.disconnect();
    events.abort();
  }
  brand.addEventListener('animationend', event => {
    if (event.animationName === 'film-glint') finish();
  }, {signal: events.signal});
  brand.addEventListener('brand:soundstart', finish, {signal: events.signal});
  brand.addEventListener('focus', finish, {signal: events.signal});
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); }, {signal: events.signal});
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); }, {signal: events.signal});
  observer.observe(document.body, {attributes: true, attributeFilter: ['class']});
  if (reduced.matches || document.hidden || document.body.classList.contains('motion-paused')) finish();
  else timer = setTimeout(finish, 5650);
})();
