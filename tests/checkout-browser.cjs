/* Execute com servidor HTTP ativo. Usa as mesmas variáveis de browser-check.cjs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.CINEFITA_PLAYWRIGHT || 'playwright');
const origin = process.env.CINEFITA_URL || 'http://127.0.0.1:8000/';
const output = path.resolve(process.env.CINEFITA_REPORT_DIR || 'relatorios/criterios-2026-10-25');
const brl = cents => (cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({headless:true,...(process.env.CINEFITA_CHROMIUM?{executablePath:process.env.CINEFITA_CHROMIUM}:{})});
  const errors=[],checks=[];
  try {
    const context=await browser.newContext();
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    async function go(route){await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);}
    async function add(){await go('filme.html?id=frankenstein');await page.locator('[data-buy]').click();await page.keyboard.press('Escape');}
    async function customer(){await page.locator('[name="name"]').fill('Cliente fictício');await page.locator('[name="email"]').fill('aluno@example.com');}
    async function layout(label){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label);checks.push(label);}

    await go('index.html');
    assert.equal(await page.locator('#physicalGrid .card').count(),4);
    for (const card of await page.locator('#physicalGrid .card').all()) {
      assert.ok((await card.locator('h3').textContent()).trim());
      assert.ok((await card.locator('.card-description').textContent()).trim());
      assert.match(await card.locator('.card-price').textContent(),/R\$/);
      assert.ok(await card.locator('img').getAttribute('src'));
    }
    checks.push('Inicial: quatro produtos com imagem, nome, descrição e preço');
    await add();await go('carrinho.html');
    const unit=await page.evaluate(()=>Math.round(films.find(f=>f.image==='frankenstein').price*100));
    await page.locator('#cartPageItems [data-delta="1"]').click();
    assert.equal(await page.locator('#pageSubtotal').textContent(),brl(unit*2));
    await page.reload();assert.equal(await page.locator('#pageSubtotal').textContent(),brl(unit*2));
    await page.locator('#cartPageItems [data-delta="-1"]').click();
    assert.equal(await page.locator('#pageSubtotal').textContent(),brl(unit));
    checks.push('Carrinho: quantidade, subtotal e persistência entre páginas/recarga');
    await page.locator('#pageCheckout').click();
    await page.locator('#completePurchase').click();
    assert.equal(await page.locator('[name="name"]').getAttribute('aria-invalid'),'true');
    assert.equal(await page.locator('[name="name"]').evaluate(el=>el===document.activeElement),true);
    await page.locator('[name="name"]').fill(' a ');await page.locator('[name="email"]').fill('inválido');
    await page.locator('#completePurchase').click();
    assert.equal(await page.locator('[name="name"]').getAttribute('aria-invalid'),'true');
    assert.equal(await page.locator('[name="email"]').getAttribute('aria-invalid'),'true');
    await customer();checks.push('Validação: nome/e-mail inválidos, foco e recuperação');

    for(const method of ['pix','debit','credit']){
      await page.locator(`[name="payment"][value="${method}"]`).check();
      assert.equal(await page.locator('#creditFields').isVisible(),method==='credit');
      assert.equal(await page.locator('#installments').isDisabled(),method!=='credit');
      assert.ok((await page.locator('#orderPayment').textContent()).trim());
      if(method==='credit'){
        assert.equal(await page.locator('#installments option').count(),12);
        await page.locator('#installments').selectOption('3');
        await page.locator('[name="delivery"][value="shipping"]').check();
        assert.equal(await page.locator('#installments').inputValue(),'3');
        assert.equal(await page.locator('#orderTotal').textContent(),brl(unit+1990));
        const quote=await page.evaluate(()=>selectedPayment());
        assert.equal(quote.installments.reduce((a,b)=>a+b,0),unit+1990);
        assert.match(await page.locator('#orderPaymentTerms').textContent(),/sem juros/);
        await page.locator('#completePurchase').click();
        assert.equal(await page.locator('[name="zip"]').getAttribute('aria-invalid'),'true');
        await page.locator('[name="delivery"][value="pickup"]').check();
        assert.equal(await page.locator('#orderTotal').textContent(),brl(unit));
        assert.equal(await page.locator('#installments').inputValue(),'3');
      }
    }
    checks.push('PIX/débito/crédito: estados, parcelas, frete e recálculo sem perda de seleção');
    // A ação final depende da seleção atual, não de um texto fixo.
    for(const method of ['pix','debit','credit']){
      if(method!=='pix'){await add();await go('compra.html');await customer();}
      await page.locator(`[name="payment"][value="${method}"]`).check();
      if(method==='credit')await page.locator('#installments').selectOption('12');
      await page.locator('#completePurchase').click();
      assert.ok(await page.locator('#orderSuccess').isVisible());
      assert.match(await page.locator('#successPayment').textContent(),new RegExp({pix:'PIX',debit:'débito',credit:'crédito'}[method]));
      if(method==='credit')assert.match(await page.locator('#successPayment').textContent(),/12 parcelas/);
      assert.equal(await page.locator('#orderSuccess').evaluate(el=>el===document.activeElement),true);
      assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('cinefitaCart'))),[]);
      await page.reload();assert.ok(await page.locator('#checkoutEmpty').isVisible());
      checks.push(`Compra concluída e carrinho limpo: ${method}`);
    }

    await add();await go('compra.html');await customer();
    // Simula estado inválido de pagamento para conferir a proteção no submit.
    await page.evaluate(()=>document.querySelectorAll('[name="payment"]').forEach(input=>input.checked=false));
    await page.locator('#completePurchase').click();
    assert.ok(await page.locator('#paymentError').isVisible());
    await page.locator('[name="payment"][value="credit"]').check();
    await page.locator('#installments').selectOption('3');
    assert.ok(await page.locator('#paymentError').isHidden());
    checks.push('Pagamento ausente bloqueia conclusão e permite recuperação');

    for(const width of [320,390,768,1024,1440]){
      await page.setViewportSize({width,height:1000});
      await layout(`Checkout preenchido / crédito em 3× @ ${width}`);
      if([390,1440].includes(width)){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,`checkout-${width}.png`),fullPage:true});}
      if(width===1440)await page.locator('#paymentOptions').screenshot({path:path.join(output,'pagamentos.png')});
      await page.locator('[name="delivery"][value="shipping"]').check();
      await layout(`Checkout com endereço / crédito @ ${width}`);
      await page.locator('[name="delivery"][value="pickup"]').check();
    }
    await page.setViewportSize({width:390,height:844});
    const option=await page.locator('#installments option[value="3"]').elementHandle();
    await page.locator('#installments').selectOption('4');
    assert.equal(await option.evaluate(el=>el.isConnected),true);
    assert.equal(await page.locator('#installments').inputValue(),'4');
    await page.locator('#installments').focus();
    assert.equal(await page.locator('#installments').evaluate(el=>el===document.activeElement),true);
    await page.keyboard.press('Tab');
    assert.notEqual(await page.evaluate(()=>document.activeElement.id),'installments');
    checks.push('Select nativo: opções estáveis, seleção e foco por teclado');
    // Contraste dos novos textos, incluindo o resumo e o texto de ajuda.
    const contrast=await page.evaluate(()=>{
      const lum=rgb=>{const a=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
      return ['#paymentHint','#installmentNotice','#orderPayment','#orderPaymentTerms','.installment-label'].map(selector=>{
        const el=document.querySelector(selector),style=getComputedStyle(el);let ancestor=el,bg;
        while(ancestor){bg=getComputedStyle(ancestor).backgroundColor;if(!bg.includes('rgba')&&bg!=='transparent')break;ancestor=ancestor.parentElement;}
        const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);const l=[lum(rgb(style.color)),lum(rgb(bg))].sort((a,b)=>b-a);
        return {selector,ratio:(l[0]+.05)/(l[1]+.05)};
      });
    });
    assert.ok(contrast.every(item=>item.ratio>=4.5),JSON.stringify(contrast));
    await go('carrinho.html');await page.locator('#cartPageItems [data-remove]').click();
    assert.ok(await page.locator('#pageCheckout').isHidden());
    assert.equal(await page.locator('#pageSubtotal').textContent(),brl(0));
    checks.push('Remover último produto retorna ao estado vazio sem checkout');
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(output,'checkout-results.json'),JSON.stringify({checks,contrast,pageErrors:errors,environment:'Chromium desktop com viewports emulados; simulação sem serviços externos.'},null,2));
    console.log(`${checks.length} verificações da atividade passaram; sem erros JavaScript.`);
    await context.close();
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
