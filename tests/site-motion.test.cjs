const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../site-motion.js'), 'utf8');

function element(classes = [], top = 1400) {
  const names = new Set(classes), values = new Map(), events = {}, attributes = {};
  const target = {
    classList: {contains: value => names.has(value), add: (...v) => v.forEach(x => names.add(x)), remove: (...v) => v.forEach(x => names.delete(x)), toggle(value, on) {on ? names.add(value) : names.delete(value);}},
    style: {setProperty: (k, v) => values.set(k, v), removeProperty: k => values.delete(k), getPropertyValue: k => values.get(k) || ''},
    addEventListener: (k, v) => events[k] = v,
    fire: (k, value = {}) => events[k]?.(value),
    setAttribute: (k, v) => attributes[k] = v,
    getAttribute: k => attributes[k],
    getBoundingClientRect: () => ({top, height: 800, left: 0, width: 1000}),
    matches: () => true,
    closest: selector => selector === '.reveal-visible' && names.has('reveal-visible') ? target : null,
  };
  return target;
}
function setup({reduced = false, desktop = true, observers = true, home = true, mutations = false} = {}) {
  const root = element(['site-contemporary']), hero = element([], -400), artwork = element(), toggle = element();
  const targets = [element([], 400), element(), element(), element()];
  const media = {reduce: element(), desktop: element()};
  media.reduce.matches = reduced; media.desktop.matches = desktop;
  const instances = [], contentInstances = [], frames = new Map(); let nextFrame = 0;
  root.querySelector = selector => ({'.hero': home ? hero : null, '.hero-artwork': home ? artwork : null, '.disc-toggle': toggle, main: root})[selector];
  root.querySelectorAll = selector => selector.startsWith('.reveal-') ? targets.filter(el => el.classList.contains('reveal-pending') || el.classList.contains('reveal-visible')) : targets;
  const document = Object.assign(element(), {body: root, hidden: false});
  const window = Object.assign(element(), {innerWidth: 1000});
  if (observers) window.IntersectionObserver = class {
    constructor(callback) {this.callback = callback; this.targets = new Set(); instances.push(this);}
    observe(target) {this.targets.add(target);}
    unobserve(target) {this.targets.delete(target);}
    disconnect() {this.targets.clear();}
    fire(target, isIntersecting) {this.callback([{target, isIntersecting}]);}
  };
  if (mutations) window.MutationObserver = class {
    constructor(callback) {this.callback = callback; this.disconnected = false; contentInstances.push(this);}
    observe() {}
    disconnect() {this.disconnected = true;}
    fire(records) {this.callback(records);}
  };
  vm.runInNewContext(source, {
    document, window, innerHeight: 1000, matchMedia: query => query.includes('reduce') ? media.reduce : media.desktop,
    IntersectionObserver: window.IntersectionObserver,
    MutationObserver: window.MutationObserver,
    requestAnimationFrame: callback => {frames.set(++nextFrame, callback); return nextFrame;},
    cancelAnimationFrame: id => frames.delete(id),
  });
  return {root, hero, artwork, toggle, targets, media, document, window, instances, contentInstances, frames,
    paint() {const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback());},
  };
}

test('pausa revela o conteúdo pendente, cancela parallax e retoma sem repetir entradas', () => {
  const ui = setup();
  assert.equal(ui.targets[0].classList.contains('reveal-pending'), false);
  assert.equal(ui.targets[1].classList.contains('reveal-pending'), true);
  ui.paint(); assert.equal(ui.artwork.style.getPropertyValue('--light-shift'), '12.00px');
  ui.toggle.fire('click');
  assert.equal(ui.toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(ui.toggle.textContent, 'Retomar animações');
  assert.ok(ui.targets.every(el => !el.classList.contains('reveal-pending')));
  assert.equal(ui.artwork.style.getPropertyValue('--light-shift'), '');
  ui.window.fire('scroll'); assert.equal(ui.frames.size, 0);
  ui.toggle.fire('click');
  assert.equal(ui.toggle.getAttribute('aria-pressed'), 'false');
  assert.equal(ui.toggle.textContent, 'Pausar animações');
  assert.equal(ui.root.classList.contains('home-enter'), false);
});
test('redução de movimento inicial e mudança durante a sessão interrompem movimento', () => {
  const staticUI = setup({reduced: true});
  assert.equal(staticUI.frames.size, 0);
  assert.ok(staticUI.targets.every(el => !el.classList.contains('reveal-pending')));
  const ui = setup(); ui.paint();
  ui.media.reduce.matches = true; ui.media.reduce.fire('change');
  assert.equal(ui.root.classList.contains('motion-paused'), true);
  assert.equal(ui.artwork.style.getPropertyValue('--prop-shift'), '');
  assert.equal(ui.root.classList.contains('home-enter'), false);
  ui.media.reduce.matches = false; ui.media.reduce.fire('change');
  assert.equal(ui.root.classList.contains('motion-paused'), false);
  assert.ok(ui.targets.every(el => !el.classList.contains('reveal-pending')));
});
test('parallax desliga no celular, fora da abertura e na aba oculta', () => {
  const mobile = setup({desktop: false}); mobile.window.fire('scroll');
  assert.equal(mobile.frames.size, 0);
  const ui = setup(); ui.paint();
  ui.instances[0].fire(ui.hero, false);
  assert.equal(ui.root.classList.contains('hero-offscreen'), true);
  assert.equal(ui.artwork.style.getPropertyValue('--light-shift'), '');
  ui.window.fire('scroll'); assert.equal(ui.frames.size, 0);
  ui.instances[0].fire(ui.hero, true); assert.equal(ui.frames.size, 1);
  ui.document.hidden = true; ui.document.fire('visibilitychange');
  assert.equal(ui.frames.size, 0);
  ui.document.hidden = false; ui.document.fire('visibilitychange');
  ui.media.desktop.matches = false; ui.media.desktop.fire('change');
  assert.equal(ui.frames.size, 0);
});
test('ciclos dos objetos da abertura seguem pausa, visibilidade e redução de movimento', () => {
  const ui = setup();
  assert.equal(ui.root.classList.contains('hero-motion-running'), true);
  ui.toggle.fire('click');
  assert.equal(ui.root.classList.contains('hero-motion-running'), false);
  ui.toggle.fire('click');
  assert.equal(ui.root.classList.contains('hero-motion-running'), true);
  ui.instances[0].fire(ui.hero, false);
  assert.equal(ui.root.classList.contains('hero-motion-running'), false);
  ui.instances[0].fire(ui.hero, true);
  ui.document.hidden = true; ui.document.fire('visibilitychange');
  assert.equal(ui.root.classList.contains('hero-motion-running'), false);
  ui.document.hidden = false; ui.document.fire('visibilitychange');
  assert.equal(ui.root.classList.contains('hero-motion-running'), true);
  ui.media.reduce.matches = true; ui.media.reduce.fire('change');
  assert.equal(ui.root.classList.contains('hero-motion-running'), false);
  assert.equal(setup({home: false}).root.classList.contains('hero-motion-running'), false);
});
test('rolagem agenda um único frame e deslocamento permanece limitado', () => {
  const ui = setup();
  for (let i = 0; i < 15; i++) ui.window.fire('scroll');
  assert.equal(ui.frames.size, 1);
  ui.hero.getBoundingClientRect = () => ({top: -8000, height: 800}); ui.paint();
  assert.equal(ui.artwork.style.getPropertyValue('--light-shift'), '24.00px');
  assert.equal(ui.artwork.style.getPropertyValue('--prop-shift'), '-16.00px');
});
test('revelação acontece uma vez e teclado torna alvo pendente visível', () => {
  const ui = setup(), target = ui.targets[1];
  ui.instances[1].fire(target, true);
  assert.equal(target.classList.contains('reveal-visible'), true);
  assert.equal(ui.instances[1].targets.has(target), false);
  const pending = ui.targets[2];
  ui.root.fire('focusin', {target: {closest: () => pending}});
  assert.equal(pending.classList.contains('reveal-pending'), false);
  assert.equal(ui.instances[1].targets.has(pending), false);
});
test('sem IntersectionObserver nenhum conteúdo fica oculto', () => {
  const ui = setup({observers: false});
  assert.ok(ui.targets.every(el => !el.classList.contains('reveal-pending')));
});
test('foco nos acessos da abertura revela imediatamente sua entrada inicial', () => {
  const ui = setup();
  assert.equal(ui.root.classList.contains('home-enter'), true);
  ui.root.fire('focusin', {target: {closest: selector => selector === '.hero-copy, .hero-card' ? ui.hero : null}});
  assert.equal(ui.root.classList.contains('home-enter'), false);
});
test('entrada finalizada libera o hover sem afetar animações contínuas', () => {
  const ui = setup(), target = ui.targets[1];
  ui.instances[1].fire(target, true);
  ui.root.fire('animationend', {target, animationName: 'disc-spin'});
  assert.equal(target.classList.contains('reveal-visible'), true);
  ui.root.fire('animationend', {target, animationName: 'home-reveal'});
  assert.equal(target.classList.contains('reveal-visible'), false);
  assert.equal(ui.instances[1].targets.has(target), false);
  ui.root.fire('animationend', {target: ui.hero, animationName: 'home-art-enter'});
  assert.equal(ui.root.classList.contains('home-enter'), false);
});
test('páginas internas têm entrada e pausa sem depender da arte de Frankenstein', () => {
  const ui = setup({home: false});
  assert.equal(ui.frames.size, 0);
  assert.equal(ui.root.classList.contains('site-enter'), true);
  assert.equal(ui.targets[0].classList.contains('reveal-visible'), true);
  ui.toggle.fire('click');
  assert.equal(ui.root.classList.contains('motion-paused'), true);
  assert.equal(ui.root.classList.contains('site-enter'), false);
  assert.ok(ui.targets.every(el => !el.classList.contains('reveal-pending') && !el.classList.contains('reveal-visible')));
  ui.toggle.fire('click');
  assert.equal(ui.root.classList.contains('motion-paused'), false);
  assert.equal(ui.frames.size, 0);
});
test('filtrar lista exibe resultados visíveis imediatamente e descarta observação de cards removidos', () => {
  const ui = setup({home: false, mutations: true}), removed = ui.targets[1];
  removed.nodeType = 1; removed.querySelectorAll = () => [];
  const visible = element([], 400), below = element();
  ui.targets.splice(1, 1, visible, below);
  ui.contentInstances[0].fire([{removedNodes: [removed]}]);
  assert.equal(ui.instances[0].targets.has(removed), false);
  assert.equal(visible.classList.contains('reveal-pending'), false);
  assert.equal(visible.classList.contains('reveal-visible'), false);
  assert.equal(below.classList.contains('reveal-pending'), true);
  ui.toggle.fire('click');
  assert.equal(ui.contentInstances[0].disconnected, true);
  assert.equal(below.classList.contains('reveal-pending'), false);
});
test('teclado interrompe imediatamente a entrada de um cartaz já visível', () => {
  const ui = setup({home: false}), target = ui.targets[0];
  assert.equal(target.classList.contains('reveal-visible'), true);
  ui.root.fire('focusin', {target: {closest: () => target}});
  assert.equal(target.classList.contains('reveal-visible'), false);
});
test('redimensionamento recalcula o lado dos itens pendentes sem repetir entradas concluídas', () => {
  const ui = setup({home: false}), pending = ui.targets[1], done = ui.targets[0];
  pending.getBoundingClientRect = () => ({left: 700, width: 200, top: 1400, height: 300});
  ui.window.fire('resize'); ui.paint();
  assert.equal(pending.style.getPropertyValue('--reveal-x'), 'calc(1 * var(--home-slide))');
  done.classList.remove('reveal-visible');
  pending.getBoundingClientRect = () => ({left: 100, width: 200, top: 1400, height: 300});
  ui.window.fire('resize'); ui.paint();
  assert.equal(pending.style.getPropertyValue('--reveal-x'), 'calc(-1 * var(--home-slide))');
  assert.equal(done.classList.contains('reveal-visible'), false);
});
test('focar o controle de embalagem revela o palco associado sem animar o botão', () => {
  const ui = setup({home: false}), stage = ui.targets[1];
  const preview = {querySelector: () => stage};
  ui.root.fire('focusin', {target: {closest: selector => selector === '[data-product-preview]' ? preview : null}});
  assert.equal(stage.classList.contains('reveal-pending'), false);
  assert.equal(ui.instances[0].targets.has(stage), false);
});
