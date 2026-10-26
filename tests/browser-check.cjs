/* Run separately from unit tests. Requires Playwright and a running local HTTP server. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.CINEFITA_PLAYWRIGHT || 'playwright');
const origin = process.env.CINEFITA_URL || 'http://127.0.0.1:8000/';
const output = path.resolve(process.env.CINEFITA_REPORT_DIR || 'relatorios/validacao-alt-mod');
const routes = ['index.html','catalogo.html','colecoes.html','colecao.html','filme.html?id=frankenstein','posters.html','revitalizar.html','carrinho.html','compra.html'];
(async () => {
  fs.mkdirSync(output,{recursive:true});
  const browser = await chromium.launch({headless:true,...(process.env.CINEFITA_CHROMIUM ? {executablePath:process.env.CINEFITA_CHROMIUM} : {})});
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [], checks = [];
  page.on('pageerror',error=>errors.push(error.message));
  async function go(route){await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);}
  async function loadImages(){await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});}
  async function layout(label){const result=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,duplicates:[...document.querySelectorAll('[id]')].map(el=>el.id).filter((id,i,ids)=>ids.indexOf(id)!==i)}));assert.ok(result.scroll<=result.width+1,`${label}: overflow ${result.scroll}/${result.width}`);assert.deepEqual(result.duplicates,[],label);checks.push(label);}
  for(const width of [320,390,768,1024,1440]){
    await page.setViewportSize({width,height:1000});
    for(const route of routes){await go(route);await layout(`${route} @ ${width}`);if([390,1440].includes(width)){await loadImages();await page.screenshot({path:path.join(output,route.split('.')[0]+(width===390?'-mobile':'-desktop')+'.png'),fullPage:true});}}
  }
  // 200% zoom-equivalent reflow: half the CSS viewport with double pixel density.
  await page.setViewportSize({width:720,height:500});
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:720,height:500,deviceScaleFactor:2,mobile:false,screenWidth:1440,screenHeight:1000});
  for(const route of routes){await go(route);await layout(`${route} @ 200% equivalent`);}
  await cdp.send('Emulation.clearDeviceMetricsOverride');
  await page.setViewportSize({width:1440,height:1000});
  await go('catalogo.html?offer=available&sort=az');
  assert.match(await page.locator('#searchResults').textContent(),/41 de 52/);
  await page.locator('#searchInput').fill('Frankenstein');
  assert.equal(await page.locator('#categorySections .card').count(),1);
  const from=await page.locator('#categorySections .poster-wrap').getAttribute('href');
  assert.ok(from.includes('q%3DFrankenstein'));
  await page.locator('#categorySections .poster-wrap').click();
  assert.equal(await page.locator('.physical-edition').count(),1);
  await page.locator('[data-mark="wanted"]').click();
  await page.locator('[data-mark="watched"]').click();
  assert.equal(await page.locator('[data-mark="wanted"]').getAttribute('aria-pressed'),'true');
  await page.reload();
  assert.equal(await page.locator('[data-mark="watched"]').getAttribute('aria-pressed'),'true');
  await page.locator('.back-link').click();
  assert.ok(page.url().includes('q=Frankenstein'));assert.equal(await page.locator('#searchInput').inputValue(),'Frankenstein');
  await page.locator('[data-clear-filter="offer"]').click();assert.ok(!page.url().includes('offer='));await page.locator('#clearSearch').click();assert.equal(await page.locator('#searchInput').inputValue(),'');assert.ok(await page.locator('#searchInput').evaluate(el=>el===document.activeElement));
  await page.locator('#searchInput').fill('zzzzinexistente');assert.match(await page.locator('#categorySections').textContent(),/Nenhum título/);
  await page.locator('#clearSearch').click();
  await page.locator('[data-organize]').first().click();assert.ok(await page.locator('#organizeDialog').evaluate(el=>el.open));await page.keyboard.press('Escape');assert.ok(await page.evaluate(()=>!!document.activeElement.dataset.organize));
  await go('colecao.html?filter=wanted');assert.equal(await page.locator('#personalGrid .card').count(),1);
  await go('filme.html?id=alien');assert.equal(await page.locator('.physical-edition [data-buy]').count(),0);assert.match(await page.locator('.edition-unavailable').textContent(),/não tem preço/);
  await go('filme.html?id=invalido');assert.match(await page.locator('h1').textContent(),/não encontrado/);
  await go('colecoes.html?id=invalido');assert.match(await page.locator('main').textContent(),/não encontrada/i);
  await go('filme.html?id=frankenstein');
  await page.locator('[data-product-toggle]').click();assert.equal(await page.locator('[data-product-toggle]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-buy]').click();assert.ok(await page.locator('#cartDrawer').evaluate(el=>el.classList.contains('open')));
  assert.ok(await page.locator('main').evaluate(el=>el.inert));
  await page.keyboard.press('Escape');assert.ok(await page.locator('[data-buy]').evaluate(el=>el===document.activeElement));
  await page.locator('#cartButton').click();await page.locator('#checkoutButton').click();
  await page.locator('#completePurchase').click();assert.equal(await page.locator('[name="name"]').getAttribute('aria-invalid'),'true');
  await page.locator('[name="name"]').fill('Pessoa de teste');await page.locator('[name="email"]').fill('teste@example.com');
  await page.locator('[name="delivery"][value="shipping"]').check();await page.locator('#completePurchase').click();assert.ok(await page.locator('#addressFields').isVisible());
  for(const [field,value] of Object.entries({zip:'01001-000',street:'Rua de teste',number:'123',district:'Centro',city:'São Paulo',state:'SP'}))await page.locator(`[name="${field}"]`).fill(value);
  await page.locator('#completePurchase').click();assert.ok(await page.locator('#orderSuccess').isVisible());assert.match(await page.locator('#orderSuccess').textContent(),/Nenhuma cobrança/);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('cinefitaCart')).length),0);
  await go('carrinho.html');assert.ok(await page.locator('#pageCheckout').isHidden());
  await go('posters.html');await page.locator('[data-poster]').first().click();assert.ok(await page.locator('#posterDialog').evaluate(el=>el.open));await page.keyboard.press('Escape');assert.ok(await page.evaluate(()=>!!document.activeElement.dataset.poster));
  await page.setViewportSize({width:390,height:844});await go('index.html');await page.locator('#menuToggle').click();assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.ok(await page.locator('#menuToggle').evaluate(el=>el===document.activeElement));
  assert.ok(await page.locator('body').evaluate(el=>el.classList.contains('hero-motion-running')));
  await page.locator('[data-hero-next]').click();await page.waitForFunction(()=>document.querySelector('[data-hero-film="alien"]').classList.contains('is-active'));assert.equal(await page.locator('[data-hero-film]:not([aria-hidden="true"])').count(),1);
  assert.equal(await page.locator('.hero-showcase .disc-toggle').count(),1);await page.locator('.hero-showcase .disc-toggle').click();assert.equal(await page.locator('.cinema-glow-red').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');await page.locator('.hero-showcase .disc-toggle').click();
  await page.emulateMedia({reducedMotion:'reduce'});assert.ok(await page.locator('body').evaluate(el=>el.classList.contains('motion-paused')));assert.ok(!await page.locator('body').evaluate(el=>el.classList.contains('hero-motion-running')));
  await go('catalogo.html');assert.equal(await page.locator('.cinema-atmosphere').count(),1);assert.equal(await page.locator('.disc-toggle').count(),1);
  await go('revitalizar.html');await page.locator('#tapePhoto').setInputFiles({name:'teste.txt',mimeType:'text/plain',buffer:Buffer.from('teste')});assert.ok(await page.locator('#uploadError').isVisible());
  await page.locator('#tapePhoto').setInputFiles(path.resolve('assets/filmstrip.png'));await page.locator('#photoPreview').waitFor({state:'visible'});
  const blocked=await browser.newContext();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}});});const bp=await blocked.newPage();await bp.goto(origin+'filme.html?id=alien');await bp.locator('[data-mark="wanted"]').click();assert.ok(await bp.locator('.film-personal .storage-notice').isVisible());assert.equal(await bp.locator('[data-mark="wanted"]').getAttribute('aria-pressed'),'true');await blocked.close();
  const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto(origin+'index.html');assert.equal(await np.locator('[data-hero-film]').count(),3);assert.equal(await np.locator('[data-hero-prev]').isVisible(),false);await nojs.close();
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({layoutChecks:checks.length,checks,flows:'pass',pageErrors:errors,limitations:'Chromium desktop with emulated viewports; 200% zoom-equivalent CSS viewport/DPR; no physical device or screen-reader certification.'},null,2));
  console.log(`${checks.length} verificações de layout e todos os fluxos passaram.`);await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
