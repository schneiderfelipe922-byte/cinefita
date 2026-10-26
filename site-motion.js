// Measure stable layout boxes, never an animated child's translated position.
function cinefitaRevealDirection(rect, viewportWidth) {
  const offset = rect.left + rect.width / 2 - viewportWidth / 2;
  return Math.abs(offset) <= 24 ? 0 : Math.sign(offset);
}

function createCinefitaHero(container, canMove, onChoice = () => {}) {
  const slides = [...container.querySelectorAll('[data-hero-film]')];
  const status = container.querySelector('[data-hero-status]');
  function announce(message, failed = false) {
    status.textContent = message;
    status.classList.toggle('is-error', failed);
  }
  let current = 0, requested = 0, version = 0, timer = 0;
  function finish() {
    clearTimeout(timer); timer = 0;
    slides.forEach((slide, index) => {
      slide.classList.remove('is-entering', 'is-leaving');
      slide.classList.toggle('is-active', index === current);
      slide.hidden = index !== current;
      slide.inert = index !== current;
      slide.setAttribute('aria-hidden', String(index !== current));
    });
  }
  function commit(index) {
    clearTimeout(timer); timer = 0;
    const incoming = slides[index];
    // Establish the hidden slide's starting opacity before making it active.
    // Already visible slides retain their interpolated opacity on rapid choices.
    incoming.hidden = false;
    void incoming.offsetWidth;
    current = index;
    if (canMove()) {
      slides.forEach((slide, position) => {
        const active = position === current;
        slide.classList.toggle('is-active', active);
        slide.classList.toggle('is-entering', active);
        slide.classList.toggle('is-leaving', !active && !slide.hidden);
        slide.inert = !active;
        slide.setAttribute('aria-hidden', String(!active));
      });
      timer = setTimeout(finish, 900);
    } else finish();
    announce(`${incoming.dataset.heroTitle}. Destaque ${current + 1} de ${slides.length}.`);
  }
  async function select(index) {
    onChoice();
    requested = (index + slides.length) % slides.length;
    const ticket = ++version, target = requested;
    container.setAttribute('aria-busy', 'false');
    if (target === current) { announce(''); return; }
    announce(`Carregando ${slides[target].dataset.heroTitle}…`);
    container.setAttribute('aria-busy', 'true');
    try {
      await Promise.all([...slides[target].querySelectorAll('img')].map(async img => {
        img.loading = 'eager';
        if (img.complete && img.naturalWidth) return;
        let timeout;
        const loaded = img.decode ? img.decode() : new Promise((resolve, reject) => {
          img.addEventListener('load', resolve, {once: true});
          img.addEventListener('error', reject, {once: true});
        });
        try {
          await Promise.race([loaded, new Promise((_, reject) => {
            timeout = setTimeout(() => reject(new Error('Image timed out')), 10000);
          })]);
        } finally { clearTimeout(timeout); }
      }));
      if (ticket !== version) return;
      container.setAttribute('aria-busy', 'false');
      commit(target);
    } catch {
      if (ticket !== version) return;
      requested = current;
      container.setAttribute('aria-busy', 'false');
      announce(`Não foi possível carregar ${slides[target].dataset.heroTitle}. Tente novamente.`, true);
    }
  }
  if (slides.length !== 3) return null;
  finish();
  container.classList.add('hero-ready');
  container.querySelector('[data-hero-prev]').addEventListener('click', () => select(requested - 1));
  container.querySelector('[data-hero-next]').addEventListener('click', () => select(requested + 1));
  return {finish, select};
}

/* Cursor tilt uses the poster's layout box, never its transformed bounds. */
function createCinefitaPosterTilt(container, canMove) {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const posters = [...container.querySelectorAll('.hero-cover')];
  let frame = 0, pending = null;
  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    pending = null;
    posters.forEach(poster => {
      poster.style.removeProperty('--poster-axis-x');
      poster.style.removeProperty('--poster-axis-y');
      poster.style.removeProperty('--poster-angle');
    });
  }
  function enabled(poster) {
    return finePointer.matches && canMove() &&
      poster.closest('.hero-slide')?.classList.contains('is-active');
  }
  function paint() {
    frame = 0;
    if (!pending || !enabled(pending.poster)) { reset(); return; }
    const {poster, clientX, clientY} = pending;
    const stage = poster.closest('.hero-artwork');
    const box = stage.getBoundingClientRect();
    const width = poster.offsetWidth, height = poster.offsetHeight;
    if (!width || !height) { reset(); return; }
    const x = Math.max(-1, Math.min(1, (clientX - box.left - poster.offsetLeft) / width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (clientY - box.top - poster.offsetTop) / height * 2 - 1));
    const distance = Math.hypot(x, y);
    poster.style.setProperty('--poster-axis-x', (-y).toFixed(4));
    poster.style.setProperty('--poster-axis-y', x.toFixed(4));
    poster.style.setProperty('--poster-angle', (Math.min(1, distance) * 10).toFixed(3) + 'deg');
  }
  posters.forEach(poster => {
    function follow(event) {
      if (event.pointerType !== 'mouse' || !enabled(poster)) { reset(); return; }
      pending = {poster, clientX: event.clientX, clientY: event.clientY};
      if (!frame) frame = requestAnimationFrame(paint);
    }
    poster.addEventListener('pointerenter', follow);
    poster.addEventListener('pointermove', follow);
    poster.addEventListener('pointerleave', reset);
    poster.addEventListener('pointercancel', reset);
  });
  finePointer.addEventListener('change', reset);
  container.addEventListener('focusin', reset);
  window.addEventListener('resize', reset);
  window.addEventListener('scroll', reset, {passive: true});
  return {reset};
}

/* Shared progressive motion; catalog data, forms and storage stay independent. */
(() => {
  const root = document.body;
  if (!root.classList.contains('site-contemporary')) return;
  root.classList.add('site-interactive');
  const hero = root.querySelector('.hero');
  const artwork = root.querySelector('.hero-showcase') || root.querySelector('.hero-artwork');
  const toggle = root.querySelector('.disc-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px)');
  let paused = false;
  let heroVisible = true;
  let frame = 0;
  let revealObserver;
  let contentObserver;
  const registered = new WeakSet();
  const revealTargets = '.editorial-section .section-head, .category-head, .collection-preview-copy, .collection-triptych, .grid .poster-wrap, .poster-card .poster-art, .film-art > .poster-frame, .film-art .product-stage, .gallery-invite > div, .gallery-teaser';
  const showcase = root.querySelector('[data-hero-showcase]');
  const posterTilt = showcase ? createCinefitaPosterTilt(showcase, () => heroVisible && canMove()) : null;
  const heroController = showcase ? createCinefitaHero(showcase, canMove, () => {
    root.classList.remove('home-enter');
    posterTilt?.reset();
  }) : null;
  let resizeFrame = 0;

  function canMove() { return !paused && !reduced.matches && !document.hidden; }
  function setDirection(el) {
    const direction = cinefitaRevealDirection(el.getBoundingClientRect(), window.innerWidth);
    el.style.setProperty('--reveal-x', direction === 0 ? '0px' : `calc(${direction} * var(--home-slide))`);
  }
  function refreshDirections() {
    resizeFrame = 0;
    root.querySelectorAll('.reveal-pending').forEach(setDirection);
    if (root.classList.contains('home-enter')) root.querySelectorAll('.hero-copy, .hero-card.is-active').forEach(setDirection);
  }
  function canParallax() { return !!hero && !!artwork && canMove() && desktop.matches && heroVisible; }
  function resetDepth() {
    if (!artwork) return;
    artwork.style.removeProperty('--light-shift');
    artwork.style.removeProperty('--prop-shift');
  }
  function paintDepth() {
    frame = 0;
    if (!canParallax()) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, -rect.top / rect.height));
    artwork.style.setProperty('--light-shift', `${(progress * 24).toFixed(2)}px`);
    artwork.style.setProperty('--prop-shift', `${(progress * -16).toFixed(2)}px`);
  }
  function requestDepth() {
    if (canParallax() && !frame) frame = requestAnimationFrame(paintDepth);
  }
  function showAll() {
    revealObserver?.disconnect();
    contentObserver?.disconnect();
    root.querySelectorAll('.reveal-pending, .reveal-visible').forEach(el => {
      el.classList.remove('reveal-pending', 'reveal-visible');
    });
    root.classList.remove('home-enter', 'site-enter');
    heroController?.finish();
  }
  function syncMotion() {
    root.classList.toggle('motion-paused', paused || reduced.matches);
    root.classList.toggle('document-hidden', document.hidden);
    root.classList.toggle('hero-motion-running', !!hero && heroVisible && canMove());
    toggle?.setAttribute('aria-pressed', String(paused));
    if (toggle) toggle.textContent = paused ? 'Retomar animações' : 'Pausar animações';
    if (!heroVisible || !canMove()) posterTilt?.reset();
    if (!canMove()) showAll();
    if (!canParallax()) {
      cancelAnimationFrame(frame);
      frame = 0;
      resetDepth();
    } else requestDepth();
  }

  toggle?.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  desktop.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('scroll', requestDepth, {passive: true});
  window.addEventListener('resize', () => {
    requestDepth();
    if (!resizeFrame) resizeFrame = requestAnimationFrame(refreshDirections);
  }, {passive: true});
  window.addEventListener('pageshow', syncMotion);
  root.addEventListener('animationend', event => {
    // Release the entrance transform so the poster hover can take over.
    if (event.animationName === 'home-reveal') {
      const owner = event.target.closest('.reveal-visible');
      if (owner) owner.classList.remove('reveal-visible');
    }
    if (event.animationName === 'home-art-enter') root.classList.remove('home-enter');
    if (event.animationName === 'cinema-text-enter') root.classList.remove('site-enter');
  });
  root.addEventListener('focusin', event => {
    if (event.target.closest('.hero-copy, .hero-card')) root.classList.remove('home-enter');
    if (event.target.closest('[data-hero-film]')) heroController?.finish();
    const pending = event.target.closest('.reveal-pending, .reveal-visible') || event.target.closest('[data-product-preview]')?.querySelector('.reveal-pending, .reveal-visible');
    if (pending) {
      pending.classList.remove('reveal-pending', 'reveal-visible');
      revealObserver?.unobserve(pending);
    }
  });

  if ('IntersectionObserver' in window) {
    if (hero) {
      const heroObserver = new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting;
        root.classList.toggle('hero-offscreen', !heroVisible);
        syncMotion();
      });
      heroObserver.observe(hero);
    }
    if (canMove() && !root.classList.contains('home-contemporary')) {
      revealObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('reveal-pending');
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      }, {threshold: .08});
      function registerReveals(initial = false) {
        root.querySelectorAll(revealTargets).forEach((el, index) => {
          if (registered.has(el)) return;
          registered.add(el);
          const rect = el.getBoundingClientRect();
          setDirection(el);
          // Filtering must show its current results immediately. Only the first
          // page load animates visible images; labels and form fields stay ready.
          if (rect.top < innerHeight) {
            if (initial && !hero && rect.top >= 0 && el.matches('.poster-wrap, .poster-art, .poster-frame, .product-stage, .collection-triptych')) {
              el.style.setProperty('--reveal-index', index % 4);
              el.classList.add('reveal-visible');
            }
            return;
          }
          el.style.setProperty('--reveal-index', index % 4);
          el.classList.add('reveal-pending');
          revealObserver.observe(el);
        });
      }
      registerReveals(true);
      // Lists are rendered again by the existing search, filters and marks.
      if ('MutationObserver' in window) {
        contentObserver = new MutationObserver(records => {
          for (const record of records) {
            for (const removed of record.removedNodes) {
              if (removed.nodeType !== 1) continue;
              revealObserver.unobserve(removed);
              removed.querySelectorAll('.reveal-pending').forEach(el => revealObserver.unobserve(el));
            }
          }
          if (canMove()) registerReveals();
        });
        contentObserver.observe(root.querySelector('main'), {childList: true, subtree: true});
      }
    }
  }
  root.querySelectorAll('.hero-copy, .hero-card.is-active, main h1').forEach(setDirection);
  if (canMove() && !root.classList.contains('home-contemporary')) root.classList.add(hero ? 'home-enter' : 'site-enter');
  syncMotion();
})();
