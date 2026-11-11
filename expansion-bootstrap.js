const CinefitaEditorialWorks = films.slice();
(async()=>{
  const editorial = CinefitaCatalog.prepareEditorial(CinefitaEditorialWorks);
  films.splice(0, films.length, ...editorial);
  const editorialIds = new Set(editorial.map(film => film.image));
  for(const collection of curatedCollections)collection.films=collection.films.filter(id=>editorialIds.has(id));
  globalThis.CinefitaDemo={...CinefitaEnterprise.empty(),error:null};
  try{Object.assign(CinefitaDemo,await CinefitaEnterprise.read());}catch(e){CinefitaDemo.error=e;}
  const publishedIds = new Set(CinefitaDemo.offers.filter(offer=>offer.status==='published').map(offer=>offer.filmId));
  for(const film of CinefitaEditorialWorks){
    if(!editorialIds.has(film.image)&&publishedIds.has(film.image))films.push({...film,price:null});
  }
  const placeholder=f=>{IMAGES[f.image]='assets/editorial/placeholder.svg';f.artwork={provider:'Cinefita · composição tipográfica original; não é cartaz do filme',referenceUrl:'',versions:{small:{src:IMAGES[f.image],width:360,height:540},large:{src:IMAGES[f.image],width:360,height:540}}};f.poster=false;f.desc=f.synopsis;f.originSourceUrl=f.sourceUrl||'';};
  films.filter(f=>f.expansion).forEach(f=>{if(f.artwork?.versions?.large){IMAGES[f.image]=f.artwork.versions.large.src;}else placeholder(f);});
  CinefitaDemo.works.filter(f=>publishedIds.has(f.image)).forEach(f=>{placeholder(f);films.push(f);});
  globalThis.CinefitaEditions=films.filter(f=>f.price>0).map(f=>({id:'edition-'+f.image,filmId:f.image,format:f.format,distributor:'Não informado',region:'Não informado',audio:'Não informado',subtitles:'Não informado',extras:'Não informado',packaging:'Não informado'})).concat(CinefitaDemo.editions);
  const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.append(s);});
  try{for(const src of ['app.js?v=20261111-pagamento','collection-ui.js','expansion-ui.js?v=20261111-precos','enterprise-ui.js?v=20261111-precos','personal-tools.js','site-motion.js'])await load(src);document.documentElement.dataset.ready='true';}catch(e){const p=document.createElement('p');p.textContent='Não foi possível carregar a página. Recarregue para tentar novamente.';document.querySelector('main').prepend(p);console.error(e);}
})();
