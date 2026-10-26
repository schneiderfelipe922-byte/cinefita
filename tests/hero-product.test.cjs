const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const motion = fs.readFileSync(path.join(__dirname, '../site-motion.js'), 'utf8');

function element(dataset = {}) {
  const classes = new Set(), attributes = {}, events = {};
  return {dataset, attributes, events, hidden: false, inert: false, textContent: '',
    classList: {add: (...names) => names.forEach(n => classes.add(n)), remove: (...names) => names.forEach(n => classes.delete(n)), contains: n => classes.has(n), toggle(n, on) {on ? classes.add(n) : classes.delete(n);}},
    setAttribute: (name, value) => attributes[name] = value,
    addEventListener: (name, callback) => events[name] = callback,
  };
}
function setupHero() {
  const timers = new Map(); let nextTimer = 0, moving = true, choices = 0;
  const context = vm.createContext({setTimeout: (callback, ms) => {const id = ++nextTimer; timers.set(id, {callback, ms}); return id;}, clearTimeout: id => timers.delete(id)});
  vm.runInContext(motion.slice(0, motion.indexOf('/* Shared progressive')), context);
  const images = Array.from({length: 3}, () => ({complete: true, naturalWidth: 900}));
  const slides = ['Frankenstein', 'Alien', 'Hellraiser'].map((name, i) => Object.assign(element({heroTitle: name}), {querySelectorAll: () => [images[i]]}));
  const status = element(), previous = element(), next = element();
  const container = Object.assign(element(), {
    querySelectorAll: selector => selector === '[data-hero-film]' ? slides : [],
    querySelector: selector => ({'[data-hero-status]': status, '[data-hero-prev]': previous, '[data-hero-next]': next})[selector],
  });
  const controller = context.createCinefitaHero(container, () => moving, () => choices++);
  return {context, controller, images, slides, status, container, timers, previous, next,
    pause() {moving = false; controller.finish();},
    finish() {for (const [id, timer] of timers) if (timer.ms === 900) {timers.delete(id); timer.callback();}},
    get choices() {return choices;},
  };
}
function deferred() {let resolve, reject; const promise = new Promise((yes, no) => {resolve = yes; reject = no;}); return {promise, resolve, reject};}

test('direção segue posição real em grades de duas, três e quatro colunas', () => {
  const {context} = setupHero();
  for (const columns of [2, 3, 4]) {
    const width = 1200 / columns;
    const result = Array.from({length: columns}, (_, i) => context.cinefitaRevealDirection({left: i * width, width}, 1200));
    assert.deepEqual(result, columns === 2 ? [-1, 1] : columns === 3 ? [-1, 0, 1] : [-1, -1, 1, 1]);
  }
  assert.equal(context.cinefitaRevealDirection({left: 20, width: 320}, 360), 0);
});
test('destaques são manuais, circulares e mantêm apenas a composição atual acessível', async () => {
  const ui = setupHero();
  assert.equal(ui.slides.filter(s => !s.hidden).length, 1);
  assert.equal(ui.timers.size, 0);
  await ui.controller.select(-1);
  assert.equal(ui.slides[2].attributes['aria-hidden'], 'false');
  assert.match(ui.status.textContent, /Destaque 3 de 3/);
  assert.equal(ui.slides[0].inert, true);
  assert.equal(ui.slides[0].attributes['aria-hidden'], 'true');
  ui.finish();
  assert.deepEqual(ui.slides.map(s => s.hidden), [true, true, false]);
  await ui.controller.select(3);
  ui.finish();
  assert.equal(ui.slides[0].attributes['aria-hidden'], 'false');
});
test('última escolha prevalece mesmo se as imagens terminarem em outra ordem', async () => {
  const ui = setupHero(), alien = deferred(), cleo = deferred();
  ui.images[1] = {complete: false, naturalWidth: 0, decode: () => alien.promise};
  ui.images[2] = {complete: false, naturalWidth: 0, decode: () => cleo.promise};
  const first = ui.controller.select(1), last = ui.controller.select(2);
  assert.equal(ui.slides[0].hidden, false);
  cleo.resolve(); await last;
  alien.resolve(); await first;
  ui.finish();
  assert.equal(ui.slides[2].attributes['aria-hidden'], 'false');
  assert.equal(ui.slides[1].hidden, true);
  assert.equal(ui.container.attributes['aria-busy'], 'false');
});
test('falha de imagem mantém o destaque anterior e permite tentar novamente', async () => {
  const ui = setupHero();
  ui.images[1] = {complete: false, naturalWidth: 0, decode: () => Promise.reject(new Error('offline'))};
  await ui.controller.select(1);
  assert.equal(ui.slides[0].hidden, false);
  assert.equal(ui.slides[0].attributes['aria-hidden'], 'false');
  assert.match(ui.status.textContent, /Não foi possível carregar Alien/);
  assert.equal(ui.container.attributes['aria-busy'], 'false');
  ui.images[1] = {complete: true, naturalWidth: 900};
  await ui.controller.select(1); ui.finish();
  assert.equal(ui.slides[1].hidden, false);
});
test('objeto decorativo também carrega antes da troca e sua falha mantém a composição anterior', async () => {
  const ui = setupHero(), egg = deferred();
  ui.slides[1].querySelectorAll = () => [ui.images[1], {complete: false, naturalWidth: 0, decode: () => egg.promise}];
  const choosing = ui.controller.select(1);
  assert.equal(ui.slides[0].attributes['aria-hidden'], 'false');
  assert.equal(ui.container.attributes['aria-busy'], 'true');
  egg.resolve(); await choosing; ui.finish();
  assert.equal(ui.slides[1].attributes['aria-hidden'], 'false');
  ui.slides[2].querySelectorAll = () => [ui.images[2], {complete: false, naturalWidth: 0, decode: () => Promise.reject(new Error('ornament missing'))}];
  await ui.controller.select(2);
  assert.equal(ui.slides[1].attributes['aria-hidden'], 'false');
  assert.match(ui.status.textContent, /Não foi possível carregar Hellraiser/);
});
test('imagem que não responde encerra carregamento em dez segundos', async () => {
  const ui = setupHero();
  ui.images[1] = {complete: false, naturalWidth: 0, decode: () => new Promise(() => {})};
  const selecting = ui.controller.select(1);
  const timer = [...ui.timers.values()].find(t => t.ms === 10000);
  timer.callback(); await selecting;
  assert.match(ui.status.textContent, /Tente novamente/);
  assert.equal(ui.slides[0].hidden, false);
});
test('pausa finaliza a troca e novas escolhas funcionam instantaneamente', async () => {
  const ui = setupHero();
  await ui.controller.select(1); ui.pause();
  assert.equal(ui.slides.filter(s => !s.hidden).length, 1);
  await ui.controller.select(2);
  assert.equal(ui.slides[2].classList.contains('is-entering'), false);
  assert.equal(ui.timers.size, 0);
});
test('voltar ao destaque atual cancela uma escolha ainda carregando', async () => {
  const ui = setupHero(), pending = deferred();
  ui.images[1] = {complete: false, naturalWidth: 0, decode: () => pending.promise};
  const selecting = ui.controller.select(1);
  await ui.controller.select(0);
  pending.resolve(); await selecting;
  assert.equal(ui.slides[0].hidden, false);
  assert.equal(ui.slides[1].hidden, true);
  assert.equal(ui.status.textContent, '');
});

function setupProduct() {
  const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  const preview = element({film: 'frankenstein'}), button = element(), label = element(), open = element(), closed = element();
  button.querySelector = () => label;
  preview.querySelector = selector => ({'[data-product-toggle]': button, '.product-open': open, '.product-closed': closed})[selector];
  const context = vm.createContext({films: [{image: 'frankenstein', title: 'Frankenstein'}], displayTitle: f => f.title});
  vm.runInContext(source.slice(source.indexOf('function syncProductView'), source.indexOf('function catalogReturn')), context);
  return {preview, button, label, open, closed, context};
}
test('hover temporário, abertura fixada e fechamento prevalecem até sair', () => {
  const ui = setupProduct();
  ui.preview.dataset.hovered = 'true'; ui.context.syncProductView(ui.preview);
  assert.equal(ui.preview.classList.contains('is-open'), true);
  assert.equal(ui.button.attributes['aria-pressed'], 'false');
  ui.context.toggleProductView(ui.preview);
  ui.preview.dataset.hovered = 'false'; ui.context.syncProductView(ui.preview);
  assert.equal(ui.preview.classList.contains('is-open'), true);
  assert.equal(ui.label.textContent, 'Ver cartaz');
  ui.preview.dataset.hovered = 'true'; ui.context.toggleProductView(ui.preview);
  assert.equal(ui.preview.classList.contains('is-open'), false);
  assert.equal(ui.open.attributes['aria-hidden'], 'true');
  assert.equal(ui.closed.attributes['aria-hidden'], 'false');
  ui.preview.dataset.hovered = 'false'; ui.preview.dataset.closedByButton = 'false'; ui.context.syncProductView(ui.preview);
  ui.preview.dataset.hovered = 'true'; ui.context.syncProductView(ui.preview);
  assert.equal(ui.preview.classList.contains('is-open'), true);
});
test('botão alterna de forma reversível sem depender de hover', () => {
  const ui = setupProduct();
  ui.context.toggleProductView(ui.preview);
  assert.equal(ui.button.attributes['aria-pressed'], 'true');
  assert.equal(ui.open.attributes['aria-hidden'], 'false');
  ui.context.toggleProductView(ui.preview);
  assert.equal(ui.button.attributes['aria-pressed'], 'false');
  assert.equal(ui.label.textContent, 'Ver aberto');
});
test('suporte desconhecido não cria embalagem e formatos conhecidos reutilizam ativos existentes', () => {
  const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  const context = vm.createContext({esc: x => x, posterImage: () => '<img alt="Cartaz completo">', filmUrl: () => 'filme.html?id=alien', displayTitle: f => f.title, formatLabel: f => f.format});
  vm.runInContext(source.slice(source.indexOf('function productPreview'), source.indexOf('function syncProductView')), context);
  const unknown = context.productPreview({format: 'FILME', image: 'alien', title: 'Alien'}, {detail: true});
  assert.ok(!unknown.includes('data-product-toggle'));
  assert.ok(!unknown.includes('assets/products/'));
  for (const [format, kind] of [['VHS', 'vhs'], ['DVD', 'dvd'], ['BLU-RAY', 'bluray']]) {
    const preview = context.productPreview({format, image: 'film', title: 'Filme'}, {detail: true});
    assert.ok(preview.includes(`assets/products/${kind}-open.webp`));
    assert.ok(fs.existsSync(path.join(__dirname, `../assets/products/${kind}-open.webp`)));
  }
});

test('trocas rápidas preservam as camadas visíveis até a fusão terminar', async () => {
  const ui = setupHero();
  await ui.controller.select(1);
  await ui.controller.select(2);
  assert.equal(ui.slides[0].hidden, false);
  assert.equal(ui.slides[1].hidden, false);
  assert.equal(ui.slides[2].hidden, false);
  assert.equal(ui.slides.filter(s => !s.inert).length, 1);
  assert.equal(ui.slides[2].inert, false);
  assert.equal([...ui.timers.values()].filter(t => t.ms === 900).length, 1);
  ui.finish();
  assert.deepEqual(ui.slides.map(s => s.hidden), [true, true, false]);
});
test('repetir o destaque atual não encerra uma fusão em andamento', async () => {
  const ui = setupHero();
  await ui.controller.select(1);
  await ui.controller.select(1);
  assert.equal(ui.slides[0].hidden, false);
  assert.equal(ui.slides[1].classList.contains('is-entering'), true);
  ui.finish();
  assert.deepEqual(ui.slides.map(s => s.hidden), [true, false, true]);
});
