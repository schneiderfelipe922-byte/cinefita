/* Sound starts only from the listener's button. Animation follows the audio clock. */
(() => {
  const button = document.querySelector('[data-brand-sound]');
  const audio = document.querySelector('#brandAudio');
  if (!button || !audio) return;
  const stage = document.querySelector('.animation-stage') || document.querySelector('header .brand');
  if (!stage) return;
  const logo = stage.querySelector('.cinefita-motion, .brand-logo');
  if (!logo) return;
  const animatedLogo = logo.matches('.cinefita-motion');
  const status = document.querySelector('#brandSoundStatus');
  const volume = document.querySelector('#brandVolume');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const label = button.textContent;
  let active = false, generation = 0, frame = 0, animations = [];
  audio.volume = volume ? Number(volume.value) : .55;
  button.disabled = false;

  function settle() {
    stage.getAnimations({subtree: true}).forEach(animation => {
      try { animation.finish(); } catch (_) { /* An idle animation already has its final state. */ }
    });
    logo.classList.add('is-complete');
    stage.classList.add('is-complete');
  }
  function stop(finalize = true, message = '') {
    ++generation;
    active = false;
    cancelAnimationFrame(frame);
    audio.pause();
    audio.currentTime = 0;
    if (finalize) settle();
    logo.style.removeProperty('--narration-gap');
    stage.classList.remove('is-narrating');
    stage.style.removeProperty('--narration-caption-delay');
    animations = [];
    button.textContent = label;
    button.setAttribute('aria-pressed', 'false');
    button.removeAttribute('aria-busy');
    status.textContent = message;
  }
  function followAudio() {
    if (!active) return;
    animations.forEach(animation => { animation.currentTime = audio.currentTime * 1000; });
    frame = requestAnimationFrame(followAudio);
  }
  button.addEventListener('click', async () => {
    if (active) { stop(true, 'Som interrompido.'); return; }
    if (animatedLogo && document.body.classList.contains('motion-paused') && !reduced.matches) {
      status.textContent = 'Retome a animação da loja para ouvir a logo.';
      return;
    }
    const attempt = ++generation;
    active = true;
    button.textContent = 'Parar som';
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Preparando o som…';
    try {
      if (audio.error) audio.load();
      audio.currentTime = 0;
      await audio.play();
      if (attempt !== generation) return;
      button.removeAttribute('aria-busy');
      // Release the one-time entrance controller before starting a requested replay.
      stage.dispatchEvent(new Event('brand:soundstart'));
      if (!reduced.matches && animatedLogo) {
        logo.style.setProperty('--narration-gap', (Number(audio.dataset.narrationGapMs) || 0) + 'ms');
        if (audio.dataset.narrationCaptionMs) {
          stage.style.setProperty('--narration-caption-delay', audio.dataset.narrationCaptionMs + 'ms');
          stage.classList.add('is-narrating');
        }
        stage.classList.remove('is-complete');
        logo.classList.remove('is-complete');
        void logo.getBoundingClientRect();
        animations = stage.getAnimations({subtree: true});
        animations.forEach(animation => animation.pause());
        followAudio();
      } else settle();
      status.textContent = !animatedLogo || reduced.matches ? 'Som em reprodução; logo estática.' : 'Animação com som em reprodução.';
    } catch (_) {
      if (attempt === generation) stop(true, 'Não foi possível reproduzir o som. Tente novamente.');
    }
  });
  audio.addEventListener('ended', () => stop(true, 'Reprodução concluída.'));
  audio.addEventListener('error', () => { if (active) stop(true, 'Som indisponível. Tente novamente.'); });
  volume?.addEventListener('input', () => { audio.volume = Number(volume.value); });
  // A silent replay must not be cancelled by the audio controller.
  document.querySelector('#replay')?.addEventListener('click', () => { if (active) stop(false); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && active) stop(); });
  window.addEventListener('pagehide', () => { if (active) stop(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && active) stop(true, 'Som interrompido.'); });
  reduced.addEventListener('change', () => { if (reduced.matches && active) stop(); });
  stage.addEventListener('focus', () => { if (active) stop(); });
  new MutationObserver(() => {
    if (active && document.body.classList.contains('motion-paused')) stop();
  }).observe(document.body, {attributes: true, attributeFilter: ['class']});
})();
