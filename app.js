const $=id=>document.getElementById(id);
const money=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cart=[];try{const saved=JSON.parse(localStorage.getItem('cinefitaCart')||'[]');if(Array.isArray(saved))saved.forEach(it=>{const film=films.find(f=>f.title===it.title);const service=it.service&&[39.9,89.9,149.9].includes(it.price);if(!film&&!service)return;const item=film?{...film}:it;const key=item.title+'|'+(item.service||'');const existing=cart.find(i=>i.key===key);const qty=Math.min(99,Math.max(1,Math.floor(Number(it.qty)||1)));if(existing)existing.qty=Math.min(99,existing.qty+qty);else cart.push({...item,key,qty});});}catch{}
let chosenFormat='VHS',chosenService={name:'Limpeza e diagnóstico',price:39.9};let category='',lastFocus=null,photoURL;
const subtotal=()=>cart.reduce((sum,it)=>sum+Math.round(it.price*100)*it.qty,0)/100;
function save(){try{localStorage.setItem('cinefitaCart',JSON.stringify(cart));}catch{toast('Não foi possível salvar o carrinho neste navegador.');}updateCart();}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2200);}
function ratingMarkup(f){
  if(!f.imdb)return '';
  const score=f.imdb.rating.toFixed(1).replace('.',',');
  return `<a class="imdb-rating" href="https://www.imdb.com/title/${f.imdb.id}/ratings/" target="_blank" rel="noopener noreferrer" aria-label="${esc(displayTitle(f))}: ${score} de 10 no IMDb. Abrir em nova aba." title="${f.imdb.votes.toLocaleString('pt-BR')} avaliações • consultado em 20/09/2026"><span class="rating-star" aria-hidden="true">★</span><strong>${score}<small>/10</small></strong><span class="imdb-label">IMDb</span><svg class="rating-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a>`;
}
function displayTitle(f) { return f.displayTitle || f.title; }
function formatLabel(f) { return f.format === 'FILME' ? 'Suporte não informado' : f.format === 'BLU-RAY' ? 'Blu-ray' : f.format; }

// One product view owns mouse, touch and keyboard states on every route.
function productPreview(f, {detail=false}={}) {
  const kind = {VHS:'vhs','BLU-RAY':'bluray',DVD:'dvd'}[f.format];
  if (!kind) return detail ? `<div class="poster-frame">${posterImage(f,{eager:true,sizes:'(max-width: 680px) 270px, 420px'})}</div>` : `<a class="poster-wrap poster-frame art-only" href="${esc(filmUrl(f))}" aria-label="Ver ficha de ${esc(displayTitle(f))}">${posterImage(f,{decorative:true})}</a>`;
  return `<div class="product-preview product-${kind}${detail?' product-detail':''}" data-product-preview data-film="${f.image}">
    <div class="product-stage poster-frame">
      <div class="product-closed">${posterImage(f,{eager:detail,sizes:detail?'(max-width: 680px) 240px, 360px':'(max-width: 680px) 240px, 180px'})}</div>
      <div class="product-open" aria-hidden="true"><div class="product-open-scene"><img class="product-package" src="assets/products/${kind}-open.webp" width="1000" height="667" alt="Embalagem ${esc(formatLabel(f))} aberta, ilustração gerada" loading="${detail?'eager':'lazy'}" decoding="async"><div class="product-insert">${posterImage(f,{decorative:true})}</div></div></div>
      <span class="product-state-label" aria-hidden="true">EMBALAGEM ILUSTRATIVA</span>
    </div>
    <button class="product-control" type="button" data-product-toggle aria-pressed="false" aria-label="Ver embalagem aberta de ${esc(displayTitle(f))}"><span>Ver aberto</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5h7v14H4zM13 5h7v14h-7zM8 9v6m8-6v6"/></svg></button>
  </div>`;
}

function catalogReturn() {
  const allowed = new Set(['index.html','catalogo.html','posters.html']);
  const file = location.pathname.split('/').pop() || 'index.html';
  if (allowed.has(file)) return file + location.search;
  const from = new URLSearchParams(location.search).get('from');
  if (!from) return 'catalogo.html';
  try {
    const url = new URL(from, location.href);
    const name = url.pathname.split('/').pop();
    if (url.origin === location.origin && allowed.has(name)) return name + url.search;
  } catch {}
  return 'catalogo.html';
}

function filmUrl(f) {
  const params = new URLSearchParams({id: f.image, from: catalogReturn()});
  return 'filme.html?' + params.toString();
}

function posterImage(f, {className='', sizes='(max-width: 680px) 110px, 164px', eager=false, decorative=false, gallery=false}={}) {
  const versions = (gallery ? f.posterArtwork || f.artwork : f.artwork)?.versions;
  const large = versions?.large;
  const srcset = versions && versions.small.width < large.width
    ? ` srcset="${esc(versions.small.src)} ${versions.small.width}w, ${esc(large.src)} ${large.width}w" sizes="${esc(sizes)}"` : '';
  return `<img class="${esc(className)}" src="${esc(large?.src || IMAGES[f.image])}"${srcset} alt="${decorative?'':esc('Cartaz de referência de '+displayTitle(f))}" width="${large?.width || 150}" height="${large?.height || 225}" loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}>`;
}

function card(f) {
  const title = displayTitle(f);
  return `<article class="card" data-genre="${esc(f.category)}">
    ${productPreview(f)}
    <div class="card-body"><span class="badge">${esc(f.category)}</span><h3><a href="${esc(filmUrl(f))}">${esc(title)}</a></h3>
    ${f.originalTitle && f.originalTitle!==title?`<span class="original-title">${esc(f.originalTitle)}</span>`:''}
    <div class="meta">${f.year} · ${esc(formatLabel(f))}${f.added?' · NOVO':''}</div><p>${esc(f.desc)}</p></div>
    <div class="card-bottom"><div class="card-price">${f.priceReference?'<small>Preço de referência</small>':''}<strong class="price">${money(f.price)}</strong></div><button class="buy" type="button" data-buy="${f.image}" aria-label="Adicionar ${esc(title)} ao carrinho">Adicionar</button></div>
    <div class="card-footer">${ratingMarkup(f)}<a class="film-link" href="${esc(filmUrl(f))}">Ver ficha <span aria-hidden="true">↗</span></a></div>
  </article>`;
}

function renderFilmDetail() {
  if (!$('filmDetail')) return;
  const f = films.find(film=>film.image===new URLSearchParams(location.search).get('id'));
  const back = catalogReturn();
  const label = back.startsWith('posters.html')?'Voltar à galeria':back.startsWith('index.html')?'Voltar ao início':'Voltar aos resultados';
  if (!f) {
    document.title = 'Filme não encontrado — Cinefita';
    $('filmDetail').innerHTML = `<div class="empty-state"><p class="eyebrow">ACERVO CINEFITA</p><h1>Filme não encontrado.</h1><p>Este endereço não corresponde a uma obra do acervo.</p><a class="cta" href="catalogo.html">Explorar catálogo</a></div>`;
    return;
  }
  const title = displayTitle(f);
  document.title = `${title} (${f.year}) — Cinefita`;
  const related = films.filter(other=>other.image!==f.image)
    .sort((a,b)=>Number(b.category===f.category)-Number(a.category===f.category)||Math.abs(a.year-f.year)-Math.abs(b.year-f.year)).slice(0,2);
  const artSource = f.artwork.referenceUrl;
  $('filmDetail').innerHTML = `
    <nav class="breadcrumbs" aria-label="Localização"><a href="index.html">Início</a><span aria-hidden="true">/</span><a href="${esc(back.startsWith('catalogo.html')?back:'catalogo.html')}">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${esc(title)}</span></nav>
    <a class="back-link" href="${esc(back)}"><span aria-hidden="true">←</span> ${label}</a>
    <article class="film-layout">
      <div class="film-intro">
        <p class="eyebrow">ACERVO CINEFITA · ${String(films.indexOf(f)+1).padStart(2,'0')} / ${films.length}</p>
        <h1>${esc(title)}</h1>
        ${f.originalTitle!==title?`<p class="film-original">${esc(f.originalTitle)}</p>`:''}
        <div class="film-meta"><span>${f.year}</span><span>${esc(f.category)}</span>${ratingMarkup(f)}</div>
      </div>
      <figure class="film-art">${productPreview(f,{detail:true})}<figcaption>${['VHS','BLU-RAY','DVD'].includes(f.format)?'Capa e embalagem ilustrativas. A edição e os itens reais podem variar.':'Cartaz de referência. Suporte físico ainda não informado.'}</figcaption></figure>
      <div class="film-content">
        <section class="film-synopsis" aria-labelledby="synopsisTitle"><h2 id="synopsisTitle">A história</h2><p>${esc(f.synopsis)}</p></section>
        <section class="film-facts" aria-labelledby="factsTitle"><h2 id="factsTitle">Ficha do filme</h2><dl>
          <div><dt>Direção</dt><dd>${esc(f.director)}</dd></div>
          <div><dt>Lançamento</dt><dd>${f.year}</dd></div>
          <div><dt>Duração de referência</dt><dd>${esc(f.runtime)}</dd></div>
          <div><dt>Título original</dt><dd>${esc(f.originalTitle)}</dd></div>
        </dl>${f.runtimeNote?`<p class="fact-note">${esc(f.runtimeNote)}</p>`:''}</section>
        <div class="film-purchase"><div><span class="purchase-label">${esc(formatLabel(f))} · catálogo demonstrativo</span><strong class="price">${money(f.price)}</strong></div><button class="buy" type="button" data-buy="${f.image}" aria-label="Adicionar ${esc(title)} ao carrinho">Adicionar ao carrinho</button><p>${f.priceReference?'Valor de referência para a demonstração, consultado em 05/10/2026.':'Preço de demonstração. Edição, conservação e detalhes do exemplar físico ainda não informados.'}</p></div>
        ${f.priceReference?`<section class="market-reference" aria-labelledby="marketTitle"><h2 id="marketTitle">Referência de mercado</h2><p>${esc(f.priceReference.edition)} · ${esc(f.priceReference.retailer)}</p><p>${esc(f.priceReference.status)}</p>${f.priceReference.note?`<p class="reference-note">${esc(f.priceReference.note)}</p>`:''}<a href="${esc(f.priceReference.url)}" target="_blank" rel="noopener noreferrer">Consultar a oferta na fonte <span class="sr-only">(nova aba)</span>↗</a><small>Preço anunciado, sem frete. Não representa estoque ou oferta da Cinefita.</small></section>`:''}
        <div class="film-sources"><span>Fontes da ficha:</span> <a href="${esc(f.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(f.sourceLabel||'Wikipedia')} <span class="sr-only">(nova aba)</span>↗</a>${f.durationSourceUrl?` · <a href="${esc(f.durationSourceUrl)}" target="_blank" rel="noopener noreferrer">AFI <span class="sr-only">(nova aba)</span>↗</a>`:''}${artSource?`<br><span>Imagem:</span> <a href="${esc(artSource)}" target="_blank" rel="noopener noreferrer">${esc(f.artwork.provider)} <span class="sr-only">(nova aba)</span>↗</a>`:''}</div>
      </div>
    </article>
    <section class="film-related" aria-labelledby="relatedTitle"><div class="section-head"><div><p class="eyebrow">OUTRAS DESCOBERTAS</p><h2 id="relatedTitle">Continue pelo acervo</h2></div><a class="film-link" href="catalogo.html">Ver catálogo <span aria-hidden="true">↗</span></a></div><div class="grid">${related.map(card).join('')}</div></section>`;
}
if ($('homeGrid')) $('homeGrid').innerHTML = films.filter(f => homeTitles.includes(f.title)).map(card).join('');
if ($('discoveriesGrid')) $('discoveriesGrid').innerHTML = films.filter(f=>['mist','perfectblue','goonies','willow'].includes(f.image)).map(card).join('');
if ($('posterGrid')) $('posterGrid').innerHTML = films.filter(f => f.poster).map(f => `<article class="poster-card" data-genre="${esc(f.category)}"><button class="poster-art poster-frame" type="button" data-poster="${f.image}" aria-label="Ver cartaz de ${esc(displayTitle(f))}">${posterImage(f,{sizes:'(max-width: 680px) 150px, (max-width: 1000px) 240px, 270px',decorative:true,gallery:true})}</button><div class="poster-caption"><h3><a href="${esc(filmUrl(f))}">${esc(displayTitle(f))}</a></h3><p>${f.year} · ${esc(f.category)}</p><div class="poster-footer">${ratingMarkup(f)}<a class="film-link" href="${esc(filmUrl(f))}" aria-label="Ficha de ${esc(displayTitle(f))}">Ficha <span aria-hidden="true">↗</span></a></div></div></article>`).join('');
renderFilmDetail();
const catalogGenres=[...new Set(films.map(f=>f.category))];
const normalizeSearch=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
function syncSearchClear() { $('clearSearch').hidden = !$('searchInput').value; }
function updateFilterChips() {
  if (!$('activeFilters')) return;
  const query = $('searchInput').value.trim(), format = $('formatFilter').value;
  const chips = [['query', query], ['genre', category], ['format', format]].filter(([, value]) => value);
  $('activeFilters').hidden = !chips.length;
  $('activeFilters').innerHTML = chips.map(([key, value]) => {const label=key==='format'?formatLabel({format:value}):value;return `<button type="button" class="active-chip" data-clear-filter="${key}" aria-label="Remover filtro ${esc(label)}">${esc(label)} <span aria-hidden="true">×</span></button>`;}).join('');
  $('filterCount').textContent = chips.length ? `(${chips.length})` : '';
  syncSearchClear();
}
$('clearSearch').onclick = () => { $('searchInput').value = ''; syncSearchClear(); renderCatalog(); $('searchInput').focus(); };
$('searchInput').addEventListener('input', syncSearchClear);
syncSearchClear();
const titleCompare=(a,b)=>displayTitle(a).localeCompare(displayTitle(b),'pt-BR',{sensitivity:'base',numeric:true});
function selectCatalog({query='',genre='',format='',sort='category'}={}){
  const terms=normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  const result=films.filter(f=>{
    const haystack=normalizeSearch(`${f.title} ${f.displayTitle||''} ${f.aliases||''} ${f.year} ${f.category} ${f.format}`);
    return (!genre||f.category===genre)&&(!format||f.format===format)&&terms.every(t=>haystack.includes(t));
  });
  const comparators={az:titleCompare,za:(a,b)=>titleCompare(b,a),rating:(a,b)=>(b.imdb?.rating??-1)-(a.imdb?.rating??-1)||titleCompare(a,b),newest:(a,b)=>b.year-a.year||titleCompare(a,b),oldest:(a,b)=>a.year-b.year||titleCompare(a,b),'price-low':(a,b)=>a.price-b.price||titleCompare(a,b),'price-high':(a,b)=>b.price-a.price||titleCompare(a,b)};
  if(sort==='added')return result.sort((a,b)=>Number(!!b.added)-Number(!!a.added)||titleCompare(a,b));
  return comparators[sort]?result.sort(comparators[sort]):result;
}
function renderCatalog(syncUrl=true){
  if(!$('categorySections'))return;
  const query=$('searchInput').value.trim(),format=$('formatFilter').value,sort=$('sortOrder').value;
  if(syncUrl){const params=new URLSearchParams();if(query)params.set('q',query);if(category)params.set('genre',category);if(format)params.set('format',format);if(sort!=='category')params.set('sort',sort);try{history.replaceState(null,'',location.pathname+(params.size?'?'+params.toString():''));}catch{}}
  const result=selectCatalog({query,genre:category,format,sort});
  $('searchResults').textContent=`${result.length} de ${films.length} títulos${format?' · '+formatLabel({format}):''}${category?' · '+category:''}`;
  $('sortHint').textContent=sort==='category'?'Explore o acervo separado por gênero.':'Ordenação aplicada a todos os resultados; o gênero aparece em cada título.';
  document.querySelectorAll('.filter').forEach(b=>{const active=(b.dataset.cat||'')===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  $('categorySections').innerHTML=!result.length?'<div class="empty-state"><h2>Nenhum título encontrado.</h2><p>Tente outro termo ou use “Limpar filtros” para voltar ao acervo completo.</p></div>':sort!=='category'?`<div class="grid sorted-results">${result.map(card).join('')}</div>`:catalogGenres.map(cat=>{const list=result.filter(f=>f.category===cat);return list.length?`<section class="category-section" data-genre="${cat}"><div class="category-head"><h2>${cat}</h2><span>${list.length} ${list.length===1?'TÍTULO':'TÍTULOS'}</span></div><div class="grid">${list.map(card).join('')}</div></section>`:'';}).join('');
  updateFilterChips();
}
function restoreCatalog(){
  const params=new URLSearchParams(location.search);
  $('searchInput').value=params.get('q')||'';
  category=catalogGenres.includes(params.get('genre'))?params.get('genre'):'';
  $('formatFilter').value=[...$('formatFilter').options].some(o=>o.value===params.get('format'))?params.get('format'):'';
  const sort=params.get('sort');$('sortOrder').value=[...$('sortOrder').options].some(o=>o.value===sort)?sort:'category';
  renderCatalog(false);
}
if($('categorySections')){
  restoreCatalog();
  $('searchInput').addEventListener('input',e=>{if(!e.isComposing)renderCatalog();});
  $('searchInput').addEventListener('compositionend',()=>renderCatalog());
  $('catalogFilters').open=false;
  document.querySelector('.search').addEventListener('submit',e=>{e.preventDefault();renderCatalog();});
  ['formatFilter','sortOrder'].forEach(id=>$(id).addEventListener('change',()=>renderCatalog()));
  $('clearFilters').addEventListener('click',()=>{category='';$('searchInput').value='';$('formatFilter').value='';$('sortOrder').value='category';renderCatalog();$('searchInput').focus();});
  window.addEventListener('popstate',restoreCatalog);
}
if($('posterCount'))$('posterCount').textContent=`${films.filter(f=>f.poster).length} / ${films.length}`;
document.querySelectorAll('.nav nav a').forEach(a=>{if(a.getAttribute('href')===((location.pathname.split('/').pop()==='filme.html'?'catalogo.html':location.pathname.split('/').pop())||'index.html')){a.classList.add('active');a.setAttribute('aria-current','page');}});
function itemMarkup(it,i){return `<div class="cart-item"><img src="${IMAGES[it.image]||IMAGES.filmstrip}" alt=""><div><strong>${esc(it.displayTitle||it.title)}</strong><small>${esc(it.service||it.category||'Coleção Cinefita')} · ${money(it.price)} / un.</small><div class="quantity"><button data-delta="-1" data-index="${i}" aria-label="Diminuir quantidade de ${esc(it.displayTitle||it.title)}" ${it.qty<=1?'disabled':''}>−</button><span aria-label="Quantidade">${it.qty}</span><button data-delta="1" data-index="${i}" aria-label="Aumentar quantidade de ${esc(it.displayTitle||it.title)}" ${it.qty>=99?'disabled':''}>+</button></div></div><div><div class="cart-item-price">${money(it.price*it.qty)}</div><button class="cart-remove" data-remove="${i}" aria-label="Remover ${esc(it.displayTitle||it.title)}">Remover</button></div></div>`;}
function updateCart(){const html=cart.map(itemMarkup).join('');$('cartBadge').textContent=cart.reduce((s,i)=>s+i.qty,0);$('cartItems').innerHTML=html;$('cartEmpty').hidden=cart.length>0;$('cartEmpty').innerHTML='Seu carrinho ainda está vazio.<a href="catalogo.html">Explorar coleção →</a>';$('cartTotal').textContent=money(subtotal());$('checkoutButton').disabled=!cart.length;if($('cartPageItems')){$('cartPageItems').innerHTML=html||'<h2>Sua coleção começa aqui.</h2><p class="summary-desc">Escolha um clássico para adicionar ao carrinho.</p><a class="cta" href="catalogo.html">Explorar catálogo</a>';$('pageSubtotal').textContent=money(subtotal());$('pageCheckout').hidden=!cart.length; if(cart.length){$('pageCheckout').href='compra.html';$('pageCheckout').removeAttribute('aria-disabled');}else{$('pageCheckout').removeAttribute('href');$('pageCheckout').setAttribute('aria-disabled','true');}document.querySelector('.checkout-layout').classList.toggle('cart-is-empty',!cart.length);}renderOrder();}
function addToCart(item){const key=item.title+'|'+(item.service||'');const existing=cart.find(i=>i.key===key);if(existing){if(existing.qty>=99){toast('Limite de 99 unidades por item.');return;}existing.qty++;}else cart.push({...item,key,qty:1});save();openCart();toast('Adicionado à sua coleção');}
function openCart(){lastFocus=document.activeElement;$('cartDrawer').classList.add('open');$('cartOverlay').classList.add('open');$('cartDrawer').setAttribute('aria-hidden','false');$('cartDrawer').inert=false;document.querySelector('main').inert=true;document.querySelector('header').inert=true;document.querySelector('footer').inert=true;document.querySelector('.skip-link').inert=true;document.body.style.overflow='hidden';$('closeCart').focus();}
function closeCart(){$('cartDrawer').classList.remove('open');$('cartOverlay').classList.remove('open');$('cartDrawer').setAttribute('aria-hidden','true');$('cartDrawer').inert=true;document.querySelectorAll('main,header,footer,.skip-link').forEach(e=>e.inert=false);document.body.style.overflow='';lastFocus?.focus();}
$('cartDrawer').inert=true;$('cartButton').onclick=openCart;$('closeCart').onclick=closeCart;$('cartOverlay').onclick=closeCart;$('checkoutButton').onclick=()=>{if(cart.length)location.href='compra.html';};
document.addEventListener('keydown',e=>{if(!$('cartDrawer').classList.contains('open'))return;if(e.key==='Escape')closeCart();if(e.key==='Tab'){const f=[...$('cartDrawer').querySelectorAll('button:not(:disabled),a[href]')];const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.addEventListener('click',e=>{
  const product=e.target.closest('[data-product-toggle]');
  if(product){const preview=product.closest('[data-product-preview]');const open=product.getAttribute('aria-pressed')!=='true';preview.classList.toggle('is-open',open);preview.classList.toggle('is-closed',!open);product.setAttribute('aria-pressed',String(open));product.querySelector('span').textContent=open?'Ver capa':'Ver aberto';const f=films.find(f=>f.image===preview.dataset.film);product.setAttribute('aria-label',`${open?'Ver capa':'Ver embalagem aberta'} de ${displayTitle(f)}`);preview.querySelector('.product-open').setAttribute('aria-hidden',String(!open));preview.querySelector('.product-closed').setAttribute('aria-hidden',String(open));return;}
  const chip=e.target.closest('[data-clear-filter]');
  if(chip){const key=chip.dataset.clearFilter;if(key==='query')$('searchInput').value='';if(key==='genre')category='';if(key==='format')$('formatFilter').value='';renderCatalog();$('catalogFilters').querySelector('summary').focus();return;}
  const poster=e.target.closest('[data-poster]');
  if(poster){openPoster(poster);return;}
  const buy=e.target.closest('[data-buy]');if(buy){addToCart(films.find(f=>f.image===buy.dataset.buy));return;}const remove=e.target.closest('[data-remove]');if(remove){const scope=remove.closest('#cartPageItems')||$('cartItems');cart.splice(Number(remove.dataset.remove),1);save();(scope.querySelector('button:not(:disabled),a[href]')||(scope.id==='cartPageItems'?$('mainContent'):$('closeCart'))).focus();toast('Item removido');return;}const qty=e.target.closest('[data-delta]');if(qty){const i=Number(qty.dataset.index);cart[i].qty=Math.min(99,Math.max(1,cart[i].qty+Number(qty.dataset.delta)));const scope=qty.closest('#cartPageItems')||$('cartItems');const delta=qty.dataset.delta;save();const target=scope.querySelector(`[data-index="${i}"][data-delta="${delta}"]:not(:disabled)`)||scope.querySelector(`[data-index="${i}"]:not(:disabled)`);target?.focus();return;}const filter=e.target.closest('.filter');if(filter){category=filter.dataset.cat||'';document.querySelectorAll('.filter').forEach(b=>{const active=b===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});renderCatalog();}});
function selection(selector,callback){document.querySelectorAll(selector).forEach(btn=>{btn.setAttribute('aria-pressed',btn.classList.contains('active'));btn.onclick=()=>{document.querySelectorAll(selector).forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',b===btn);});callback(btn);};});}
selection('.format-option',btn=>{chosenFormat=btn.dataset.format;$('summaryFormat').textContent=chosenFormat;});
selection('.service-option',btn=>{chosenService={name:btn.dataset.service,price:Number(btn.dataset.price)};$('summaryService').textContent=chosenService.name;$('summaryPrice').textContent=money(chosenService.price);document.querySelector('.summary-desc').textContent={'Limpeza e diagnóstico':'Triagem e limpeza externa para avaliar o estado da sua fita.','Restauração':'Limpeza e tratamento da fita para preservar sua coleção.','Restauração completa':'Tratamento da fita e digitalização para preservar suas memórias.'}[chosenService.name];});
if($('addRevitalizacao'))$('addRevitalizacao').onclick=()=>addToCart({title:`Revitalização — ${chosenFormat}`,service:chosenService.name,price:chosenService.price,image:'filmstrip'});
if ($('tapePhoto')) $('tapePhoto').onchange = e => {
  const file = e.target.files[0];
  if (photoURL) URL.revokeObjectURL(photoURL);
  photoURL = null;
  $('photoPreview').hidden = true;
  $('photoPreview').removeAttribute('src');
  $('uploadError').hidden = true;
  $('tapePhoto').removeAttribute('aria-invalid');
  $('uploadTitle').textContent = 'Adicionar foto da fita';
  $('uploadHint').textContent = 'JPG, PNG ou WEBP · até 5 MB';
  if (!file) return;
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5*1024*1024) {
    $('uploadError').textContent = 'Escolha uma imagem JPG, PNG ou WEBP de até 5 MB.';
    $('uploadError').hidden = false;
    $('tapePhoto').setAttribute('aria-invalid','true');
    e.target.value = '';
    return;
  }
  $('photoPreview').src = photoURL = URL.createObjectURL(file);
  $('photoPreview').hidden = false;
  $('uploadTitle').textContent = file.name;
  $('uploadHint').textContent = 'Prévia local · foto não enviada';
};
window.addEventListener('pagehide',()=>{if(photoURL)URL.revokeObjectURL(photoURL);});
function shipping(){return document.querySelector('[name="delivery"]:checked')?.value==='shipping'?19.9:0;}
function renderOrder(){if(!$('orderItems'))return;$('checkoutEmpty').hidden=cart.length>0;$('checkoutContent').hidden=!cart.length;$('orderItems').innerHTML=cart.map(it=>`<div class="order-line"><span>${it.qty} × ${esc(it.displayTitle||it.title)}<small>${esc(it.service||it.format||'')}</small></span><strong>${money(it.price*it.qty)}</strong></div>`).join('');$('orderSubtotal').textContent=money(subtotal());$('orderShipping').textContent=shipping()?money(shipping()):'Grátis';$('orderTotal').textContent=money(subtotal()+shipping());}
document.querySelectorAll('[name="delivery"]').forEach(input=>input.onchange=()=>{const active=shipping()>0;$('addressFields').hidden=!active;$('addressFields').disabled=!active;$('addressFields').querySelectorAll('input').forEach(i=>i.required=active&&i.name!=='extra');renderOrder();});
const purchaseForm = $('purchaseForm');
const fieldHints = {name:'Informe seu nome com pelo menos 3 caracteres.',email:'Informe um e-mail válido, como nome@exemplo.com.',zip:'Informe o CEP com 8 números, como 00000-000.',street:'Informe o nome da rua.',number:'Informe o número do endereço.',district:'Informe o bairro.',city:'Informe a cidade.',state:'Informe a UF com 2 letras, como SP.'};
function validateField(input) {
  const error = document.getElementById(`${input.id}Error`);
  if (!error) return true;
  const invalid = input.required && !input.value.trim() || !input.validity.valid;
  input.setAttribute('aria-invalid', String(invalid));
  error.textContent = invalid ? fieldHints[input.name] || 'Confira este campo.' : '';
  error.hidden = !invalid;
  return !invalid;
}
if (purchaseForm) {
  const fields = [...purchaseForm.querySelectorAll('.form-grid input')];
  fields.forEach(input => {
    input.id = `purchase-${input.name}`;
    input.setAttribute('aria-label', input.closest('label').textContent.trim());
    const error = document.createElement('span');
    error.id = `${input.id}Error`;
    error.className = 'field-error';
    error.hidden = true;
    input.setAttribute('aria-describedby', error.id);
    input.after(error);
    input.addEventListener('input', () => {if(input.getAttribute('aria-invalid')==='true')validateField(input);});
  });
  document.querySelectorAll('[name="delivery"]').forEach(input=>input.addEventListener('change',()=>{
    if(!shipping())$('addressFields').querySelectorAll('input').forEach(field=>{field.removeAttribute('aria-invalid');$(`${field.id}Error`).hidden=true;});
    $('validationSummary').hidden=true;
  }));
  purchaseForm.onsubmit = e => {
    e.preventDefault();
    if (!cart.length || $('completePurchase').disabled) return;
    const invalid = fields.filter(input => !input.disabled && !input.closest('fieldset[disabled]') && !validateField(input));
    $('validationSummary').hidden = !invalid.length;
    if (invalid.length) {
      $('validationSummary').textContent = `Confira ${invalid.length===1?'o campo indicado':'os '+invalid.length+' campos indicados'} para continuar.`;
      invalid[0].focus();
      return;
    }
    $('completePurchase').disabled = true;
    const total = money(subtotal()+shipping());
    cart = [];
    save();
    $('checkoutEmpty').hidden = true;
    $('checkoutContent').hidden = true;
    $('orderSuccess').hidden = false;
    $('successMessage').textContent = `Sua compra demonstrativa no valor de ${total} foi concluída.`;
    purchaseForm.reset();
    $('orderSuccess').focus();
    document.title = 'Simulação concluída — Cinefita';
  };
}
let posterTrigger;
function openPoster(trigger) {
  const film = films.find(f=>f.image===trigger.dataset.poster);
  if(!film)return;
  posterTrigger=trigger;
  $('posterTitle').textContent=displayTitle(film);
  const art = film.posterArtwork || film.artwork;
  $('posterPreview').src=art.versions.large.src;
  $('posterPreview').alt=`Cartaz de ${displayTitle(film)}`;
  const large=art.versions.large;
  $('posterPreview').width=large.width;
  $('posterPreview').height=large.height;
  $('posterDetailLink').href=filmUrl(film);
  $('posterDetailLink').setAttribute('aria-label',`Ver ficha de ${displayTitle(film)}`);
  $('posterCaption').textContent=`${film.year} · ${film.category} · ${film.posterArtwork ? 'Cartaz alternativo de referência' : 'Arte de referência do título'}`;
  const source = $('posterSource');
  if (source) {
    source.hidden = !art.referenceUrl;
    source.href = art.referenceUrl || '#';
    source.textContent = `Fonte da arte${art.provider ? ': ' + art.provider : ''} ↗`;
  }
  $('posterRating').innerHTML=ratingMarkup(film);
  $('posterDialog').showModal();
  document.body.style.overflow='hidden';
  $('closePoster').focus();
}
if($('posterDialog')){
  $('closePoster').onclick=()=>$('posterDialog').close();
  $('posterDialog').addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;
    const controls=[...$('posterDialog').querySelectorAll('button:not(:disabled),a[href]')];
    const first=controls[0],last=controls[controls.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  $('posterDialog').addEventListener('close',()=>{document.body.style.overflow='';posterTrigger?.focus();});
}
updateCart();

if($('heroRating')) $('heroRating').innerHTML=ratingMarkup(films.find(f=>f.image==='frankenstein'));

const discToggle = document.querySelector('.disc-toggle');
if (discToggle) discToggle.addEventListener('click', () => {
  const paused = document.querySelector('.hero-card').classList.toggle('disc-paused');
  discToggle.setAttribute('aria-pressed', String(paused));
  discToggle.textContent = paused ? 'Retomar disco' : 'Pausar disco';
});
document.addEventListener('pointerout',e=>{const preview=e.target.closest?.('[data-product-preview]');if(preview&&!preview.contains(e.relatedTarget))preview.classList.remove('is-closed');});
