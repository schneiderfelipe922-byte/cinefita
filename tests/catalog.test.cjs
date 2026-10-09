const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const catalog=require('../catalog-core.js');
const collection=require('../personal-collection.js');
const context=vm.createContext({});
for(const file of ['data.js','film-details.js','catalog-expansion.js','editorial-data.js','collections-data.js','poster-artwork.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const films=JSON.parse(vm.runInContext('JSON.stringify(films)',context));
const curated=JSON.parse(vm.runInContext('JSON.stringify(curatedCollections)',context));
function memory(){let data={};return {getItem:key=>data[key]??null,setItem:(key,value)=>data[key]=value};}
test('52 obras únicas, metadados completos e imagens locais presentes',()=>{
  assert.equal(films.length,52);assert.equal(new Set(films.map(f=>f.image)).size,52);
  for(const film of films){for(const key of ['title','originalTitle','director','runtime','synopsis','sourceUrl'])assert.ok(film[key],`${film.image}: ${key}`);assert.ok(film.directors.length);assert.ok(film.countries.length);for(const version of Object.values(film.artwork.versions))assert.ok(fs.existsSync(path.join(root,version.src)),version.src);}
  assert.equal(films.filter(f=>!catalog.hasOffer(f)).length,11);
  for(const selection of curated)for(const id of selection.films)assert.ok(films.some(f=>f.image===id),id);
});
test('combina filtros e encontra diretores de obras com codireção',()=>{
  assert.deepEqual(catalog.select(films,{decade:'1970',director:'John Carpenter',country:'Estados Unidos'}).map(f=>f.image),['halloween']);
  assert.deepEqual(catalog.select(films,{director:'Eduardo Sánchez',genre:'Terror'}).map(f=>f.image),['blair']);
  assert.equal(catalog.select(films,{country:'Brasil'}).length,3);
  assert.equal(catalog.select(films,{query:'cleo Agnes'}).at(0).image,'cleo');
  assert.equal(catalog.select(films,{query:'naoexiste'}).length,0);
});
test('preço ascendente e descendente deixam todas as obras sem oferta no final',()=>{
  for(const sort of ['price-low','price-high']){const selected=catalog.select(films,{sort});assert.ok(selected.slice(0,41).every(catalog.hasOffer));assert.ok(selected.slice(41).every(f=>!catalog.hasOffer(f)));const prices=selected.slice(0,41).map(f=>f.price);assert.deepEqual(prices,[...prices].sort((a,b)=>sort==='price-low'?a-b:b-a));}
  for(const price of [null,0,NaN,Infinity,'10',-1])assert.equal(catalog.hasOffer({price}),false);
});
test('marcações independentes persistem e remoção não desfaz outras opções',()=>{
  const storage=memory(),ids=films.map(f=>f.image);const store=collection.createStore({storage,filmIds:ids});
  store.set('alien','owned',true);store.set('alien','watched',true);store.set('alien','owned',false);
  const reloaded=collection.createStore({storage,filmIds:ids});assert.deepEqual(reloaded.get('alien'),{owned:false,wanted:false,watched:true});
  reloaded.set('alien','watched',false);assert.deepEqual(reloaded.ids(),[]);
  assert.throws(()=>store.set('invalido','owned',true));assert.throws(()=>store.set('alien','invalid',true));
});
test('mudanças de outra aba são mescladas antes de salvar',()=>{
  const storage=memory();const a=collection.createStore({storage,filmIds:['alien','house']});const b=collection.createStore({storage,filmIds:['alien','house']});
  a.set('alien','owned',true);b.set('house','wanted',true);a.set('alien','watched',true);b.reload();assert.equal(b.get('alien').owned,true);assert.equal(b.get('alien').watched,true);assert.equal(b.get('house').wanted,true);
});
test('armazenamento corrompido ou bloqueado informa falha sem perder estado em memória',()=>{
  const storage={getItem(){throw Error('bloqueado');},setItem(){throw Error('bloqueado');}};
  const store=collection.createStore({storage,filmIds:['alien']});assert.equal(store.isPersistent(),false);assert.equal(store.set('alien','wanted',true).persistent,false);store.reload();assert.equal(store.get('alien').wanted,true);
  const corrupted=collection.createStore({storage:{getItem:()=>'{',setItem(){}},filmIds:['alien']});assert.equal(corrupted.isPersistent(),false);
});
test('retorno da ficha só aceita páginas locais reconhecidas',()=>{
  const source=fs.readFileSync(path.join(root,'app.js'),'utf8');const code=source.slice(source.indexOf('function catalogReturn()'),source.indexOf('function filmUrl('));
  for(const [from,expected] of [['catalogo.html?country=Brasil','catalogo.html?country=Brasil'],['colecoes.html?id=futuros','colecoes.html?id=futuros'],['colecao.html?filter=owned','colecao.html?filter=owned'],['https://example.com/catalogo.html','catalogo.html'],['javascript:alert(1)','catalogo.html'],['conta.html','catalogo.html']]){
    const ctx=vm.createContext({URL,URLSearchParams,location:{origin:'https://cinefita.test',href:'https://cinefita.test/filme.html',pathname:'/filme.html',search:'?from='+encodeURIComponent(from)}});vm.runInContext(code,ctx);assert.equal(vm.runInContext('catalogReturn()',ctx),expected);
  }
});
