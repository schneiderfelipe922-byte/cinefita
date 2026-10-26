const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../site-motion.js'), 'utf8');
function setup({fine = true} = {}) {
  const frames = new Map(), styles = new Map(), events = {}, windowEvents = {}, mediaEvents = {}, containerEvents = {};
  let id = 0, moving = true, active = true;
  const stage = {getBoundingClientRect: () => ({left: 100, top: 200})};
  const slide = {classList: {contains: () => active}};
  const poster = {offsetLeft: 20, offsetTop: 10, offsetWidth: 200, offsetHeight: 300,
    style: {setProperty: (k,v) => styles.set(k,v),removeProperty: k => styles.delete(k)},
    closest: selector => selector === '.hero-slide' ? slide : stage,
    getBoundingClientRect() {throw Error('Do not measure the transformed poster');},
    addEventListener: (type,handler) => events[type] = handler};
  const media = {matches: fine,addEventListener: (type,handler) => mediaEvents[type] = handler};
  const container = {querySelectorAll: () => [poster],addEventListener: (type,handler) => containerEvents[type] = handler};
  const context = vm.createContext({matchMedia: () => media,
    requestAnimationFrame: callback => {frames.set(++id,callback); return id;},
    cancelAnimationFrame: frame => frames.delete(frame),
    window: {addEventListener: (type,handler) => windowEvents[type] = handler}});
  vm.runInContext(source.slice(0,source.indexOf('\n(() => {')), context);
  const controller = context.createCinefitaPosterTilt(container, () => moving);
  return {styles,frames,events,media,mediaEvents,windowEvents,containerEvents,controller,
    move(x,y,type='mouse') {events.pointermove({pointerType:type,clientX:x,clientY:y});},
    flush() {const queue=[...frames.values()];frames.clear();queue.forEach(callback=>callback());},
    setMoving(value) {moving=value;},setActive(value) {active=value;}};
}
test('cursor changes both axes using stable layout; center is neutral and tilt stays within 10 degrees', () => {
  const ui=setup();
  ui.move(120,210);ui.flush();
  assert.equal(ui.styles.get('--poster-axis-x'),'1.0000');
  assert.equal(ui.styles.get('--poster-axis-y'),'-1.0000');
  assert.equal(ui.styles.get('--poster-angle'),'10.000deg');
  ui.move(320,510);ui.flush();
  assert.equal(ui.styles.get('--poster-axis-x'),'-1.0000');
  assert.equal(ui.styles.get('--poster-axis-y'),'1.0000');
  ui.move(220,360);ui.flush();
  assert.equal(ui.styles.get('--poster-angle'),'0.000deg');
  ui.move(10000,-10000);ui.flush();
  assert.equal(ui.styles.get('--poster-angle'),'10.000deg');
});
test('multiple pointer events schedule one frame with the last cursor position', () => {
  const ui=setup();ui.move(120,210);ui.move(320,510);
  assert.equal(ui.frames.size,1);ui.flush();
  assert.equal(ui.styles.get('--poster-axis-y'),'1.0000');
});
test('leaving, cancellation, focus and resize cancel pending movement and restore rest', () => {
  for(const trigger of ['pointerleave','pointercancel','focusin','resize','scroll']){
    const ui=setup();ui.move(120,210);ui.flush();ui.move(320,510);
    (ui.events[trigger]||ui.containerEvents[trigger]||ui.windowEvents[trigger])();
    assert.equal(ui.frames.size,0);assert.equal(ui.styles.size,0);
  }
});
test('touch, pen, inactive posters and non-hover pointers never tilt', () => {
  for(const type of ['touch','pen']){const ui=setup();ui.move(120,210,type);assert.equal(ui.frames.size,0);}
  const narrow=setup({fine:false});narrow.move(120,210);assert.equal(narrow.frames.size,0);
  const inactive=setup();inactive.setActive(false);inactive.move(120,210);assert.equal(inactive.frames.size,0);
});
test('motion suspension and pointer preference changes clear tilt without replaying', () => {
  const ui=setup();ui.move(120,210);ui.flush();
  ui.setMoving(false);ui.move(320,510);assert.equal(ui.styles.size,0);assert.equal(ui.frames.size,0);
  ui.setMoving(true);ui.move(120,210);ui.flush();
  ui.media.matches=false;ui.mediaEvents.change();assert.equal(ui.styles.size,0);
  ui.media.matches=true;ui.mediaEvents.change();assert.equal(ui.frames.size,0);
});
test('slide choice reset cancels the pending frame, including movement disabled before paint', () => {
  const ui=setup();ui.move(120,210);ui.controller.reset();ui.flush();assert.equal(ui.styles.size,0);
  ui.move(120,210);ui.setMoving(false);ui.flush();assert.equal(ui.styles.size,0);
});
