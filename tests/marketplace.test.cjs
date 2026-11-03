const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const M=require('../marketplace-core.js');
const C=require('../catalog-core.js');
const checkout=require('../checkout-core.js');
const ctx=vm.createContext({});
for(const file of ['data.js','film-details.js','catalog-expansion.js','editorial-data.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),ctx);
const films=JSON.parse(vm.runInContext('JSON.stringify(films)',ctx)),m=M.createCatalog(films);
test('mantém as 52 obras e os preços oficiais, sem criar oferta em filme editorial',()=>{
 assert.equal(films.length,52);assert.equal(m.offers.filter(o=>o.sellerId==='cinefita').length,41);
 for(const f of films){const official=m.get('cinefita-'+f.image);if(C.hasOffer(f))assert.equal(official.priceCents,Math.round(f.price*100));else assert.equal(m.matching(f.image).length,0);}
 assert.ok(m.sellers.length>=3);assert.ok(m.matching('frankenstein').length>=2);
});
test('filtros precisam corresponder à mesma oferta e preço ordena ofertas elegíveis',()=>{
 assert.equal(m.select(films,{seller:'aurora',format:'DVD'}).length,0);
 assert.deepEqual(m.select(films,{seller:'bairro',format:'DVD',condition:'new'}).map(f=>f.image),['frankenstein']);
 const results=m.select(films,{seller:'aurora',sort:'price-low'});assert.deepEqual(results.map(f=>f.image),['psycho','frankenstein']);
 assert.equal(m.select(films,{offer:'available'}).length,41);
 assert.equal(m.select(films,{seller:'invalido'}).length,0);
});
test('duas ofertas do mesmo filme não se fundem e os dados restaurados são canônicos',()=>{
 const r=m.restore([{offerId:'cinefita-frankenstein',price:0,sellerId:'aurora',qty:1},{offerId:'aurora-frankenstein-vhs',qty:2},{offerId:'cinefita-frankenstein',qty:1}]);
 assert.equal(r.items.length,2);assert.equal(r.items[0].qty,2);assert.equal(r.items[0].sellerId,'cinefita');assert.equal(r.items[0].price,84.9);assert.equal(r.items[1].price,79.9);
 assert.notEqual(r.items[0].key,r.items[1].key);
});
test('migra somente correspondências seguras e informa itens rejeitados',()=>{
 const r=m.restore([{title:'Frankenstein',image:'frankenstein',qty:2},{title:'Frankenstein',image:'psycho'},{title:'Desconhecido'},{offerId:'nao-existe'},{title:films.find(f=>!C.hasOffer(f)).title}],{legacy:true});
 assert.equal(r.items.length,1);assert.equal(r.items[0].offerId,'cinefita-frankenstein');assert.equal(r.items[0].qty,2);assert.equal(r.rejected,4);
 assert.equal(m.restore({}).rejected,1);assert.equal(m.restore([null]).rejected,1);
 assert.equal(m.restore([{title:'Frankenstein'}]).rejected,1);
});
test('carrinho limita quantidades e ignora serviços forjados',()=>{
 assert.equal(m.item('cinefita-frankenstein',999).qty,99);assert.equal(m.item('cinefita-frankenstein',-1).qty,1);
 assert.equal(m.serviceItem({title:'Outro',service:'Restauração'}),null);
 assert.equal(m.serviceItem({title:'Revitalização — VHS',service:'Serviço falso'}),null);
 assert.equal(m.serviceItem({title:'Revitalização — VHS',service:'Restauração',price:0}).price,89.9);
});
test('frete é cobrado uma vez por vendedor; parceiro não permite retirada',()=>{
 const items=[m.item('cinefita-frankenstein'),m.item('aurora-psycho-vhs')];
 let t=M.totals(items,{cinefita:'shipping',aurora:'shipping'});assert.equal(t.subtotalCents,15980);assert.equal(t.shippingCents,3980);assert.equal(t.totalCents,19960);assert.equal(t.groups.length,2);
 t=M.totals(items,{cinefita:'pickup',aurora:'pickup'});assert.equal(t.totalCents,17970);assert.equal(t.groups[1].method,'shipping');
 t=M.totals([m.item('aurora-psycho-vhs',2),m.item('aurora-frankenstein-vhs')],{});assert.equal(t.shippingCents,1990);
 assert.equal(M.totals([],{}).totalCents,0);
});
test('serviço é presencial; produtos do mesmo vendedor conservam a entrega',()=>{
 const service=m.serviceItem({title:'Revitalização — VHS',service:'Restauração'});
 assert.equal(M.totals([service],{cinefita:'shipping'}).shippingCents,0);
 assert.equal(M.totals([service,m.item('cinefita-frankenstein')],{cinefita:'shipping'}).shippingCents,1990);
});
test('parcelas incluem todos os fretes e somam o total exato',()=>{
 const total=M.totals([m.item('cinefita-frankenstein'),m.item('aurora-psycho-vhs')],{cinefita:'shipping'}).totalCents;
 for(let n=1;n<=12;n++)assert.equal(checkout.quote(total,'credit',n).installments.reduce((a,b)=>a+b,0),total);
 assert.deepEqual(checkout.quote(total,'credit',3).installments,[6654,6653,6653]);
});
