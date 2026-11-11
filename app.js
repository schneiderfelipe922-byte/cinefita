const $=id=>document.getElementById(id);
const money=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let marketplace=CinefitaMarketplace.createCatalog(films);
let cart=[],cartNotice='',cartPersistent=true,deliveryChoices={cinefita:'pickup'};
try {
  cartNotice=localStorage.getItem('cinefitaCart.migrationNotice')||'';
  const current=localStorage.getItem(CinefitaMarketplace.storageKey);
  const legacy=current===null;
  const raw=JSON.parse((legacy?localStorage.getItem('cinefitaCart'):current)||'[]');
  const restored=marketplace.restore(raw,{legacy});cart=restored.items;
  if(restored.rejected){cartNotice=`${restored.rejected} item(ns) antigo(s) não puderam ser recuperados com segurança. Confira suas ofertas.`;localStorage.setItem('cinefitaCart.migrationNotice',cartNotice);}
  if(legacy&&cart.length)localStorage.setItem(CinefitaMarketplace.storageKey,JSON.stringify(cart));
} catch {cartNotice='Não foi possível recuperar o carrinho salvo. Os itens desta página ficam em memória até você sair.';cartPersistent=false;}
let chosenFormat='VHS',chosenService={name:'Limpeza e diagnóstico',price:39.9};let category='',lastFocus=null,photoURL;
const subtotal=()=>cart.reduce((sum,it)=>sum+Math.round(it.price*100)*it.qty,0)/100;
function save(){cart=marketplace.restore(cart).items;try{localStorage.setItem(CinefitaMarketplace.storageKey,JSON.stringify(cart));localStorage.setItem('cinefitaCart',JSON.stringify(cart));cartPersistent=true;}catch{cartPersistent=false;cartNotice='Não foi possível salvar o carrinho neste navegador. Ele fica apenas nesta página até você sair.';}updateCart();}
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
    <div class="product-stage poster-frame" id="productStage-${esc(f.image)}"><div class="product-surface">
      <div class="product-closed">${posterImage(f,{eager:detail,sizes:detail?'(max-width: 900px) calc(100vw - 40px), 520px':'(max-width: 680px) 240px, 180px'})}</div>
      <div class="product-open" aria-hidden="true"><div class="product-open-scene"><img class="product-package" src="assets/products/${kind}-open.webp" width="1000" height="667" alt="Embalagem ${esc(formatLabel(f))} aberta, ilustração gerada" loading="${detail?'eager':'lazy'}" decoding="async"><div class="product-insert">${posterImage(f,{decorative:true})}</div></div></div>
      <span class="product-state-label" aria-hidden="true">EMBALAGEM ILUSTRATIVA</span>
    </div></div>
    <button class="product-control" id="productToggle-${esc(f.image)}" type="button" data-product-toggle aria-controls="productStage-${esc(f.image)}" aria-pressed="false" aria-label="Ver embalagem aberta de ${esc(displayTitle(f))}"><span>Ver aberto</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5h7v14H4zM13 5h7v14h-7zM8 9v6m8-6v6"/></svg></button>
  </div>`;
}

function syncProductView(preview) {
  const pinned = preview.dataset.pinned === 'true';
  const open = pinned || (preview.dataset.hovered === 'true' && preview.dataset.closedByButton !== 'true');
  preview.classList.toggle('is-open', open);
  const button = preview.querySelector('[data-product-toggle]');
  button.setAttribute('aria-pressed', String(pinned));
  button.querySelector('span').textContent = pinned ? 'Ver cartaz' : 'Ver aberto';
  const f = films.find(f => f.image === preview.dataset.film);
  button.setAttribute('aria-label', `${pinned ? 'Ver cartaz' : 'Ver embalagem aberta'} de ${displayTitle(f)}`);
  preview.querySelector('.product-open').setAttribute('aria-hidden', String(!open));
  preview.querySelector('.product-closed').setAttribute('aria-hidden', String(open));
}
function toggleProductView(preview) {
  const open = preview.dataset.pinned !== 'true';
  preview.dataset.pinned = String(open);
  preview.dataset.closedByButton = String(!open);
  syncProductView(preview);
}

function catalogReturn() {
  const allowed = new Set(['index.html','catalogo.html','posters.html','colecoes.html','colecao.html','revista.html','vendedores.html','empresa.html']);
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

function posterImage(f, {className='', sizes='(max-width: 359px) 280px, (max-width: 900px) 44vw, (max-width: 1150px) 28vw, 300px', eager=false, decorative=false, gallery=false}={}) {
  const versions = (gallery ? f.posterArtwork || f.artwork : f.artwork)?.versions;
  const large = versions?.large;
  const srcset = versions?.small && versions.small.width < large.width
    ? ` srcset="${esc(versions.small.src)} ${versions.small.width}w, ${esc(large.src)} ${large.width}w" sizes="${esc(sizes)}"` : '';
  return `<img class="${esc(className)}" src="${esc(large?.src || IMAGES[f.image])}"${srcset} alt="${decorative?'':esc((f.artwork?.versions?.large?.src==='assets/editorial/placeholder.svg'?'Imagem editorial neutra para ':'Cartaz de referência de ')+displayTitle(f))}" width="${large?.width || 150}" height="${large?.height || 225}" loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}>`;
}

function card(f, filters=activeOfferFilters()) {
  const title=displayTitle(f),offers=marketplace.matching(f.image,filters);
  const available=offers.filter(o=>o.stock!==0);
  const priced=CinefitaMarketplace.displayOffer(offers);
  return `<article class="card" data-genre="${esc(f.category)}"><a class="poster-wrap poster-frame art-only" href="${esc(filmUrl(f))}" aria-label="Ver ficha de ${esc(title)}">${posterImage(f,{decorative:true})}</a><div class="card-body"><h3><a href="${esc(filmUrl(f))}">${esc(title)}</a></h3><div class="meta">${f.year} · ${esc(f.category)}</div><p class="card-description">${esc(f.synopsis)}</p>${priced?`<p class="card-price">${money(priced.priceCents/100)} <small>· ${priced.sellerId==='cinefita'?'Loja Oficial':esc(marketplace.seller(priced.sellerId).name)}</small></p><p class="offer-count">${available.length?`${offers.length} ${offers.length===1?'oferta demonstrativa':'ofertas demonstrativas'}`:'Ofertas indisponíveis'}</p><a class="film-link edition-link" href="${esc(filmUrl(f))}">Comparar ofertas <span aria-hidden="true">↗</span></a>`:`<p class="card-price"><small>${f.unverified?'Cadastro demonstrativo · sem oferta':'Acervo editorial · sem oferta física'}</small></p>`}<button class="organize-button" type="button" data-organize="${esc(f.image)}" aria-label="Organizar ${esc(title)}">Organizar <span aria-hidden="true">＋</span></button></div></article>`;
}

function activeOfferFilters(){
  if(!$('categorySections'))return {};
  return Object.fromEntries(['seller','condition','format'].map(key=>[key,$(key+'Filter')?.value||'']));
}
function formatHelp(){return `<details class="format-help"><summary>VHS, DVD ou Blu-ray: qual escolher?</summary><dl><div><dt>VHS</dt><dd>Fita de vídeo. Precisa de videocassete compatível.</dd></div><div><dt>DVD</dt><dd>Disco que precisa de leitor de DVD ou Blu-ray. Confira a região da edição.</dd></div><div><dt>Blu-ray</dt><dd>Precisa de leitor Blu-ray; um leitor somente de DVD não reproduz Blu-ray. Confira a região.</dd></div></dl><p>As imagens são referências do filme e embalagens ilustrativas. Confira o formato de cada oferta.</p></details>`;}
function offerMarkup(f){
  const offers=marketplace.matching(f.image);
  if(!offers.length)return '<p class="edition-unavailable">Ainda não pesquisamos uma edição física deste filme. Por isso, ele não tem preço, embalagem ou compra no catálogo. Você pode organizá-lo na sua coleção.</p>';
  const requested=new URLSearchParams(location.search).get('offerId');
  const chosen=offers.find(o=>o.id===requested&&o.stock!==0)?.id||CinefitaMarketplace.displayOffer(offers).id;
  return `<p class="marketplace-disclaimer">Ofertas e vendedores demonstrativos. Parceiros fictícios, sem estoque ou avaliações comerciais reais.</p><fieldset class="offers-fieldset"><legend>Escolha uma oferta</legend><div class="offers-grid">${offers.map(o=>{const seller=marketplace.seller(o.sellerId);return `<label class="offer-card"><span class="offer-select"><input type="radio" name="filmOffer" value="${esc(o.id)}" ${o.id===chosen?'checked':''} ${o.stock===0?'disabled':''}><strong>${esc(seller.name)}</strong></span><span class="seller-description">${seller.official?'Loja da operadora':'Parceiro fictício'} · ${esc(seller.reputation)}</span><span>${esc(formatLabel(o))} · ${esc(CinefitaMarketplace.conditions[o.condition])}</span><strong class="offer-price">${money(o.priceCents/100)}</strong><span class="offer-delivery">Entrega ${money(seller.shippingCents/100)} por vendedor${seller.pickup?' ou retirada gratuita':''}</span><a class="film-link" href="vendedores.html?id=${esc(seller.id)}">Ver vendedor →</a><span>${o.stock===0?'Indisponível':o.stock!=null?`${o.stock} unidade(s) na demonstração`:''}</span><span>${esc(o.description||'Condições ilustrativas do exercício; não descrevem um exemplar real.')}</span>${editionMarkup(o)}</label>`;}).join('')}</div></fieldset><div class="offer-action"><p id="selectedOfferSummary" role="status">Oferta selecionada: ${esc(marketplace.seller(marketplace.get(chosen).sellerId).name)} · ${money(marketplace.get(chosen).priceCents/100)}</p><button class="buy" type="button" data-buy="${esc(f.image)}" ${offers.every(o=>o.stock===0)?'disabled':''}>Adicionar ao carrinho</button></div>`;
}
document.addEventListener('change',event=>{
  if(event.target.name!=='filmOffer')return;
  const o=marketplace.get(event.target.value);if(!o)return;
  const params=new URLSearchParams(location.search);params.set('offerId',o.id);history.replaceState(null,'',location.pathname+'?'+params.toString());
  $('selectedOfferSummary').textContent=`Oferta selecionada: ${marketplace.seller(o.sellerId).name} · ${formatLabel(o)} · ${money(o.priceCents/100)}`;
  const preview=document.querySelector('#filmArtwork .product-preview');
  if(preview)preview.outerHTML=productPreview({...films.find(f=>f.image===o.filmId),format:o.format},{detail:true});
});
function renderFilmDetail() {
  if (!$('filmDetail')) return;
  const f = films.find(film=>film.image===new URLSearchParams(location.search).get('id'));
  const back = catalogReturn();
  const label = back.startsWith('posters.html')?'Voltar à galeria':back.startsWith('index.html')?'Voltar ao início':back.startsWith('colecoes.html')?'Voltar à seleção':back.startsWith('colecao.html')?'Voltar à minha coleção':'Voltar aos resultados';
  if (!f) {
    document.title = 'Filme não encontrado — Cinefita';
    $('filmDetail').innerHTML = `<div class="empty-state"><p class="eyebrow">ACERVO CINEFITA</p><h1>Filme não encontrado.</h1><p>Este endereço não corresponde a uma obra do acervo.</p><a class="cta" href="catalogo.html">Explorar catálogo</a></div>`;
    return;
  }
  const title = displayTitle(f);
  document.title = `${title} (${f.year}) — Cinefita`;
  const related = films.filter(other=>other.image!==f.image)
    .sort((a,b)=>Number(b.category===f.category)-Number(a.category===f.category)||Math.abs(a.year-f.year)-Math.abs(b.year-f.year)).slice(0,2);
  const artSource = f.artwork?.referenceUrl;
  const requestedOffer=marketplace.get(new URLSearchParams(location.search).get('offerId'));
  const previewFormat=requestedOffer?.filmId===f.image&&requestedOffer.stock!==0?requestedOffer.format:(CinefitaMarketplace.displayOffer(marketplace.matching(f.image))?.format||f.format);
  $('filmDetail').innerHTML = `
    <nav class="breadcrumbs" aria-label="Localização"><a href="index.html">Início</a><span aria-hidden="true">/</span><a href="${esc(back.startsWith('catalogo.html')?back:'catalogo.html')}">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${esc(title)}</span></nav>
    <a class="back-link" href="${esc(back)}"><span aria-hidden="true">←</span> ${label}</a>
    <article class="film-layout">
      <div class="film-intro">
        <p class="eyebrow">ACERVO CINEFITA · ${String(films.indexOf(f)+1).padStart(2,'0')} / ${films.length}</p>
        <h1>${esc(title)}</h1>${f.unverified?'<p class="demo-banner">Cadastro demonstrativo da empresa — informações não verificadas</p>':''}
        ${f.originalTitle!==title?`<p class="film-original">${esc(f.originalTitle)}</p>`:''}
        <div class="film-meta"><span>${f.year}</span><span>${esc(f.category)}</span>${ratingMarkup(f)}</div><p class="micro">IMDb: nota do filme. Não avalia o exemplar nem o vendedor.</p><div class="film-personal"><p class="micro">Organize neste navegador</p><div class="personal-marks" data-film-marks="${f.image}"></div><p class="storage-notice" data-storage-notice role="status" hidden></p></div>
      </div>
      <figure class="film-art" id="filmArtwork">${productPreview({...f,format:previewFormat},{detail:true})}<figcaption>${f.artwork?.versions?.large?.src==='assets/editorial/placeholder.svg'?'Composição editorial Cinefita · não é cartaz nem imagem da edição comercial.':['VHS','DVD','BLU-RAY'].includes(f.format)?'Cartaz completo · embalagem ilustrativa. A edição e os itens reais podem variar.':'Cartaz de referência · arte completa.'}</figcaption></figure>
      <div class="film-content">
        <section class="film-synopsis" aria-labelledby="synopsisTitle"><h2 id="synopsisTitle">A história</h2><p>${esc(f.synopsis)}</p></section>
        <section class="film-facts" aria-labelledby="factsTitle"><h2 id="factsTitle">Ficha do filme</h2><dl>
          <div><dt>Direção</dt><dd>${esc(f.director)}</dd></div>
          <div><dt>País</dt><dd>${esc(f.countries.join(' · '))}</dd></div><div><dt>Lançamento</dt><dd>${f.year}</dd></div>
          <div><dt>Duração de referência</dt><dd>${esc(f.runtime)}</dd></div>
          <div><dt>Título original</dt><dd>${esc(f.originalTitle)}</dd></div>
        </dl>${f.runtimeNote?`<p class="fact-note">${esc(f.runtimeNote)}</p>`:''}</section>
        <div class="film-sources">${f.unverified?'<p>Informações fornecidas pela empresa demonstrativa, sem verificação editorial.</p>':''}<span>Fontes da ficha:</span> <a href="${esc(f.sourceUrl||'empresa.html')}" target="_blank" rel="noopener noreferrer">${esc(f.sourceLabel||(f.unverified?'Empresa demonstrativa':'Wikipedia'))} <span class="sr-only">(nova aba)</span>↗</a>
        ${f.originSourceUrl&&f.originSourceUrl!==f.sourceUrl?` · <a href="${esc(f.originSourceUrl)}" target="_blank" rel="noopener noreferrer">Metadados <span class="sr-only">(nova aba)</span>↗</a>`:''}
        ${f.durationSourceUrl?` · <a href="${esc(f.durationSourceUrl)}" target="_blank" rel="noopener noreferrer">AFI <span class="sr-only">(nova aba)</span>↗</a>`:''}
        ${artSource?`<br><span>Imagem:</span> <a href="${esc(artSource)}" target="_blank" rel="noopener noreferrer">${esc(f.artwork.provider)} <span class="sr-only">(nova aba)</span>↗</a>`:''}</div>
      </div>
    </article>
    <section class="physical-edition" aria-labelledby="editionTitle"><div class="section-head"><div><p class="eyebrow">COMPARE EDIÇÕES E VENDEDORES</p><h2 id="editionTitle">Ofertas deste filme</h2></div></div>
    ${offerMarkup(f)}${formatHelp()}</section>
    <section class="film-related" aria-labelledby="relatedTitle"><div class="section-head"><div><p class="eyebrow">OUTRAS DESCOBERTAS</p><h2 id="relatedTitle">Continue pelo acervo</h2></div><a class="film-link" href="catalogo.html">Ver catálogo <span aria-hidden="true">↗</span></a></div><div class="grid">${related.map(f=>card(f)).join('')}</div></section>`;
}
if ($('physicalGrid')) $('physicalGrid').innerHTML = ['frankenstein','casablanca','hellraiser','terminator'].map(id=>card(films.find(f=>f.image===id))).join('');
if ($('brazilGrid')) $('brazilGrid').innerHTML = ['midnight','blackgod','limite'].map(id=>card(films.find(f=>f.image===id))).join('');
if ($('discoveriesGrid')) $('discoveriesGrid').innerHTML = films.filter(f=>['halloween','alien','limite','cleo'].includes(f.image)).map(f=>card(f)).join('');
if ($('posterGrid')) $('posterGrid').innerHTML = films.filter(f => f.poster).map(f => `<article class="poster-card" data-genre="${esc(f.category)}"><button class="poster-art poster-frame" type="button" data-poster="${f.image}" aria-label="Ver cartaz de ${esc(displayTitle(f))}">${posterImage(f,{sizes:'(max-width: 680px) 150px, (max-width: 1000px) 240px, 270px',decorative:true,gallery:true})}</button><div class="poster-caption"><h3><a href="${esc(filmUrl(f))}">${esc(displayTitle(f))}</a></h3><p>${f.year} · ${esc(f.category)}</p><div class="poster-footer"><a class="film-link" href="${esc(filmUrl(f))}" aria-label="Ficha de ${esc(displayTitle(f))}">Ficha <span aria-hidden="true">↗</span></a></div></div></article>`).join('');
renderFilmDetail();
if($('catalogFormatHelp'))$('catalogFormatHelp').innerHTML=formatHelp();
const catalogGenres=[...new Set(films.map(f=>f.category))];
function syncSearchClear() { $('clearSearch').hidden = !$('searchInput').value; }
function updateFilterChips() {
  if (!$('activeFilters')) return;
  const query = $('searchInput').value.trim(), format = $('formatFilter').value;
  const chips = [['query', query], ['genre', category], ['format', format],...['decade','director','country','offer','seller','condition'].map(key=>[key,$(key+'Filter').value])].filter(([, value]) => value);
  $('activeFilters').hidden = !chips.length;
  $('activeFilters').innerHTML = chips.map(([key, value]) => {const label=key==='offer'?'Com edição física':key==='format'?formatLabel({format:value}):key==='seller'?marketplace.seller(value)?.name||value:key==='condition'?CinefitaMarketplace.conditions[value]||value:value;return `<button type="button" class="active-chip" data-clear-filter="${key}" aria-label="Remover filtro ${esc(label)}">${esc(label)} <span aria-hidden="true">×</span></button>`;}).join('');
  $('filterCount').textContent = chips.length ? `(${chips.length})` : '';
  syncSearchClear();
}
$('clearSearch').onclick = () => { $('searchInput').value = ''; syncSearchClear(); renderCatalog(); $('searchInput').focus(); };
$('searchInput').addEventListener('input', syncSearchClear);
syncSearchClear();
function selectCatalog(options={}){const sort=['price-low','price-high'].includes(options.sort)?'az':options.sort;return marketplace.select(CinefitaCatalog.select(films,{...options,offer:'',format:'',sort}),options);}
function renderCatalog(syncUrl=true){
  if(!$('categorySections'))return;
  const query=$('searchInput').value.trim(),format=$('formatFilter').value,sort=$('sortOrder').value;const extra=Object.fromEntries(['decade','director','country','offer','seller','condition'].map(key=>[key,$(key+'Filter').value]));
  if(syncUrl){const params=new URLSearchParams();if(query)params.set('q',query);if(category)params.set('genre',category);if(format)params.set('format',format);if(sort!=='category')params.set('sort',sort);for(const [key,value] of Object.entries(extra))if(value)params.set(key,value);try{history.replaceState(null,'',location.pathname+(params.size?'?'+params.toString():''));}catch{}}
  const result=selectCatalog({query,genre:category,format,sort,...extra});
  $('searchResults').textContent=`${result.length} de ${films.length} títulos${format?' · '+formatLabel({format}):''}${category?' · '+category:''}`;
  $('sortHint').textContent=sort==='category'?'Explore o acervo separado por gênero.':'Ordenação aplicada a todos os resultados; o gênero aparece em cada título.';
  document.querySelectorAll('.filter').forEach(b=>{const active=(b.dataset.cat||'')===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  $('categorySections').innerHTML=!result.length?'<div class="empty-state"><h2>Nenhum título encontrado.</h2><p>Tente outro termo ou use “Limpar filtros” para voltar ao acervo completo.</p></div>':sort!=='category'?`<div class="grid sorted-results">${result.map(f=>card(f)).join('')}</div>`:catalogGenres.map(cat=>{const list=result.filter(f=>f.category===cat);return list.length?`<section class="category-section" data-genre="${esc(cat)}"><div class="category-head"><h2>${esc(cat)}</h2><span>${list.length} ${list.length===1?'TÍTULO':'TÍTULOS'}</span></div><div class="grid">${list.map(f=>card(f)).join('')}</div></section>`:'';}).join('');
  updateFilterChips();
}
function restoreCatalog(){
  const params=new URLSearchParams(location.search);
  $('searchInput').value=params.get('q')||'';
  category=catalogGenres.includes(params.get('genre'))?params.get('genre'):'';
  $('formatFilter').value=[...$('formatFilter').options].some(o=>o.value===params.get('format'))?params.get('format'):'';
  const sort=params.get('sort');$('sortOrder').value=[...$('sortOrder').options].some(o=>o.value===sort)?sort:'category';
  ['decade','director','country','offer','seller','condition'].forEach(key=>{const control=$(key+'Filter');control.value=[...control.options].some(o=>o.value===params.get(key))?params.get(key):'';});
  renderCatalog(false);
}
if($('categorySections')){
  const genreBar=document.querySelector('[data-cat-all]')?.parentElement;if(genreBar)genreBar.innerHTML='<button class="filter active" data-cat-all>Todos</button>'+catalogGenres.map(g=>`<button class="filter" data-cat="${esc(g)}">${esc(g)}</button>`).join('');
  ['decade','director','country'].forEach(key=>{const values=[...new Set(films.flatMap(f=>key==='decade'?[String(Math.floor(f.year/10)*10)]:key==='director'?f.directors:f.countries))].sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}));$(key+'Filter').insertAdjacentHTML('beforeend',values.map(value=>`<option value="${esc(value)}">${key==='decade'?'Anos '+value:esc(value)}</option>`).join(''));});
  $('sellerFilter').insertAdjacentHTML('beforeend',marketplace.sellers.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join(''));
  $('conditionFilter').insertAdjacentHTML('beforeend',Object.entries(CinefitaMarketplace.conditions).map(([key,label])=>`<option value="${key}">${esc(label)}</option>`).join(''));
  restoreCatalog();
  $('searchInput').addEventListener('input',e=>{if(!e.isComposing)renderCatalog();});
  $('searchInput').addEventListener('compositionend',()=>renderCatalog());
  $('catalogFilters').open=false;
  document.querySelector('.search').addEventListener('submit',e=>{e.preventDefault();renderCatalog();});
  ['formatFilter','sortOrder','decadeFilter','directorFilter','countryFilter','offerFilter','sellerFilter','conditionFilter'].forEach(id=>$(id).addEventListener('change',()=>renderCatalog()));
  $('clearFilters').addEventListener('click',()=>{category='';$('searchInput').value='';$('formatFilter').value='';['decade','director','country','offer','seller','condition'].forEach(key=>$(key+'Filter').value='');$('sortOrder').value='category';renderCatalog();$('searchInput').focus();});
  window.addEventListener('popstate',restoreCatalog);
}
if($('posterCount'))$('posterCount').textContent=`${films.filter(f=>f.poster).length} / ${films.length}`;
document.querySelectorAll('.nav nav a').forEach(a=>{if(a.getAttribute('href')===((location.pathname.split('/').pop()==='filme.html'?'catalogo.html':location.pathname.split('/').pop())||'index.html')){a.classList.add('active');a.setAttribute('aria-current','page');}});
function itemMarkup(it,i){return `<div class="cart-item"><img src="${IMAGES[it.image]||IMAGES.filmstrip}" alt=""><div><strong>${esc(it.displayTitle||it.title)}</strong><small>${esc(it.service||formatLabel(it))}${it.condition?' · '+esc(CinefitaMarketplace.conditions[it.condition]):''} · ${money(it.price)} / un.</small><div class="quantity"><button data-delta="-1" data-index="${i}" aria-label="Diminuir quantidade de ${esc(it.displayTitle||it.title)}" ${it.qty<=1?'disabled':''}>−</button><span aria-label="Quantidade">${it.qty}</span><button data-delta="1" data-index="${i}" aria-label="Aumentar quantidade de ${esc(it.displayTitle||it.title)}" ${it.qty>=Math.min(99,marketplace.get(it.offerId)?.stock??99)?'disabled':''}>+</button></div></div><div><div class="cart-item-price">${money(it.price*it.qty)}</div><button class="cart-remove" data-remove="${i}" aria-label="Remover ${esc(it.displayTitle||it.title)}">Remover</button></div></div>`;}
function cartGroupsMarkup(){return CinefitaMarketplace.groups(cart,deliveryChoices).map(group=>`<section class="cart-seller-group" aria-label="Itens de ${esc(group.seller.name)}"><h3>${esc(group.seller.name)}</h3><p class="micro">${group.seller.official?'Loja da operadora':'Parceiro fictício'} · ${group.hasProducts?'Envio separado · entrega calculada no checkout':'Serviço presencial'}</p>${group.items.map(it=>itemMarkup(it,cart.indexOf(it))).join('')}<p class="seller-subtotal">Subtotal deste vendedor: <strong>${money(group.subtotalCents/100)}</strong></p></section>`).join('');}
function updateCart(){const html=cartGroupsMarkup();$('cartBadge').textContent=cart.reduce((s,i)=>s+i.qty,0);$('cartItems').innerHTML=html;$('cartEmpty').hidden=cart.length>0;$('cartEmpty').innerHTML='Seu carrinho ainda está vazio.<a href="catalogo.html">Explorar coleção →</a>';$('cartTotal').textContent=money(subtotal());$('checkoutButton').disabled=!cart.length;if($('cartPageItems')){$('cartPageItems').innerHTML=html||'<h2>Sua coleção começa aqui.</h2><p class="summary-desc">Escolha um clássico e uma oferta para adicionar ao carrinho.</p><a class="cta" href="catalogo.html">Explorar catálogo</a>';$('pageSubtotal').textContent=money(subtotal());$('pageCheckout').hidden=!cart.length; if(cart.length){$('pageCheckout').href='compra.html';$('pageCheckout').removeAttribute('aria-disabled');}else{$('pageCheckout').removeAttribute('href');$('pageCheckout').setAttribute('aria-disabled','true');}document.querySelector('.checkout-layout').classList.toggle('cart-is-empty',!cart.length);}renderCartNotices();renderOrder();}
function renderCartNotices(){for(const host of [$('cartDrawer'),$('cartPageItems')?.parentElement,$('checkoutEmpty')?.parentElement].filter(Boolean)){let notice=host.querySelector(':scope > .cart-storage-notice');if(!notice){notice=document.createElement('p');notice.className='cart-storage-notice';notice.setAttribute('role','status');host.prepend(notice);}notice.textContent=cartNotice;notice.hidden=!cartNotice;if(cartNotice&&cartPersistent){const close=document.createElement('button');close.type='button';close.dataset.dismissCartNotice='';close.textContent='Entendi';close.className='cart-link';notice.append(' ',close);}}}
function addToCart(value){let item;if(value?.offerId)item=marketplace.item(value.offerId);else if(value?.service)item=marketplace.serviceItem(value);else if(value?.image)item=marketplace.item('cinefita-'+value.image);if(!item)return;const existing=cart.find(i=>i.key===item.key);if(existing){if(existing.qty>=Math.min(99,item.stock??marketplace.get(item.offerId)?.stock??99)){toast('Limite de 99 unidades por item.');return;}existing.qty++;}else cart.push(item);save();openCart();toast('Oferta adicionada ao carrinho');}
function openCart(){void refreshEnterpriseCart();lastFocus=document.activeElement;$('cartDrawer').classList.add('open');$('cartOverlay').classList.add('open');$('cartDrawer').setAttribute('aria-hidden','false');$('cartDrawer').inert=false;document.querySelector('main').inert=true;document.querySelector('header').inert=true;document.querySelector('footer').inert=true;document.querySelector('.skip-link').inert=true;document.body.style.overflow='hidden';$('closeCart').focus();}
function closeCart(){$('cartDrawer').classList.remove('open');$('cartOverlay').classList.remove('open');$('cartDrawer').setAttribute('aria-hidden','true');$('cartDrawer').inert=true;document.querySelectorAll('main,header,footer,.skip-link').forEach(e=>e.inert=false);document.body.style.overflow='';lastFocus?.focus();}
$('cartDrawer').inert=true;$('cartButton').onclick=openCart;$('closeCart').onclick=closeCart;$('cartOverlay').onclick=closeCart;$('checkoutButton').onclick=()=>{if(cart.length)location.href='compra.html';};
document.addEventListener('keydown',e=>{if(!$('cartDrawer').classList.contains('open'))return;if(e.key==='Escape')closeCart();if(e.key==='Tab'){const f=[...$('cartDrawer').querySelectorAll('button:not(:disabled),a[href]')];const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.addEventListener('click',e=>{
  if(e.target.closest('[data-dismiss-cart-notice]')){cartNotice='';try{localStorage.removeItem('cinefitaCart.migrationNotice');}catch{}renderCartNotices();return;}
  const product=e.target.closest('[data-product-toggle]');
  if(product){toggleProductView(product.closest('[data-product-preview]'));return;}
  const chip=e.target.closest('[data-clear-filter]');
  if(chip){const key=chip.dataset.clearFilter;if(key==='query')$('searchInput').value='';if(key==='genre')category='';if(key==='format')$('formatFilter').value='';if(['decade','director','country','offer','seller','condition'].includes(key))$(key+'Filter').value='';renderCatalog();$('catalogFilters').querySelector('summary').focus();return;}
  const poster=e.target.closest('[data-poster]');
  if(poster){openPoster(poster);return;}
  const buy=e.target.closest('[data-buy]');if(buy){addToCart({offerId:document.querySelector('[name="filmOffer"]:checked')?.value||'cinefita-'+buy.dataset.buy});return;}const remove=e.target.closest('[data-remove]');if(remove){const scope=remove.closest('#cartPageItems')||$('cartItems');cart.splice(Number(remove.dataset.remove),1);save();(scope.querySelector('button:not(:disabled),a[href]')||(scope.id==='cartPageItems'?$('mainContent'):$('closeCart'))).focus();toast('Item removido');return;}const qty=e.target.closest('[data-delta]');if(qty){const i=Number(qty.dataset.index);cart[i].qty=Math.min(99,Math.max(1,cart[i].qty+Number(qty.dataset.delta)));const scope=qty.closest('#cartPageItems')||$('cartItems');const delta=qty.dataset.delta;save();const target=scope.querySelector(`[data-index="${i}"][data-delta="${delta}"]:not(:disabled)`)||scope.querySelector(`[data-index="${i}"]:not(:disabled)`);target?.focus();return;}const filter=e.target.closest('.filter');if(filter){category=filter.dataset.cat||'';document.querySelectorAll('.filter').forEach(b=>{const active=b===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});renderCatalog();}});
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
function shipping(){return CinefitaMarketplace.totals(cart,deliveryChoices).shippingCents/100;}
function orderCents(){return CinefitaMarketplace.totals(cart,deliveryChoices).totalCents;}
function syncAddress(){if(!$('addressFields'))return;const active=shipping()>0;$('addressFields').hidden=!active;$('addressFields').disabled=!active;$('addressFields').querySelectorAll('input').forEach(i=>{i.required=active&&i.name!=='extra';if(!active){i.removeAttribute('aria-invalid');const error=$(`${i.id}Error`);if(error)error.hidden=true;}});}
function renderDeliveries(){if(!$('sellerDeliveries'))return;const groups=CinefitaMarketplace.groups(cart,deliveryChoices);$('sellerDeliveries').innerHTML=groups.map(g=>`<fieldset class="seller-delivery"><legend>${esc(g.seller.name)}</legend>${g.hasProducts?`${g.seller.pickup?`<label class="delivery-option"><input type="radio" name="delivery-${g.seller.id}" value="pickup" data-seller-delivery="${g.seller.id}" ${g.method==='pickup'?'checked':''}> Retirada na Loja Oficial <strong>Grátis</strong></label>`:''}<label class="delivery-option"><input type="radio" name="delivery-${g.seller.id}" value="shipping" data-seller-delivery="${g.seller.id}" ${g.method==='shipping'?'checked':''}> Entrega em domicílio <strong>${money(g.seller.shippingCents/100)}</strong></label>`:'<p>Serviço de revitalização: avaliação e atendimento presenciais, sem frete de serviço.</p>'}${g.items.some(i=>i.service)&&g.hasProducts?'<p class="micro">A entrega se aplica aos produtos; os serviços continuam presenciais.</p>':''}<p class="micro">${g.seller.official?'Loja da operadora.':'Parceiro fictício. Envio separado.'} Valores e entregas ilustrativos.</p></fieldset>`).join('');syncAddress();}
document.addEventListener('change',e=>{if(!e.target.dataset.sellerDelivery)return;deliveryChoices[e.target.dataset.sellerDelivery]=e.target.value;syncAddress();renderOrder(false);$('validationSummary').hidden=true;});
function installmentText(amounts) {
  const groups = new Map();
  amounts.forEach(cents => groups.set(cents, (groups.get(cents) || 0) + 1));
  return [...groups].map(([cents,count]) => `${count}× de ${money(cents/100)}`).join(' + ');
}
function selectedPayment() {
  const method = document.querySelector('[name="payment"]:checked')?.value;
  const count = method === 'credit' ? Number($('installments').value) : 1;
  return CinefitaCheckout.quote(orderCents(), method, count);
}
function renderPayment() {
  if (!$('paymentOptions')) return;
  const method = document.querySelector('[name="payment"]:checked')?.value;
  const credit = method === 'credit';
  const card = credit || method === 'debit';
  $('cardFields').hidden = !card;
  $('cardFields').disabled = !card;
  $('pixFields').hidden = method !== 'pix';
  $('completePurchase').textContent = method === 'pix' ? 'Já paguei' : 'Concluir compra demonstrativa';
  $('creditFields').hidden = !credit;
  $('creditFields').disabled = !credit;
  // Preserve os nós das opções enquanto o seletor nativo está aberto.
  if ($('installments').dataset.totalCents !== String(orderCents())) {
    const previous = $('installments').value || '1';
    $('installments').innerHTML = cart.length ? Array.from({length:Math.min(12,orderCents())},(_,i) => {
      const quote = CinefitaCheckout.quote(orderCents(),'credit',i+1);
      const min = Math.min(...quote.installments), max = Math.max(...quote.installments);
      const label = min === max ? installmentText(quote.installments)+' · sem juros' : `${i+1}× sem juros · ${money(min/100)} a ${money(max/100)}`;
      return `<option value="${i+1}">${label}</option>`;
    }).join('') : '';
    $('installments').value = [...$('installments').options].some(option=>option.value===previous) ? previous : '1';
    $('installments').dataset.totalCents = String(orderCents());
  }
  const hints = {
    pix:'Use o QR Code fictício abaixo e clique em “Já paguei” para avançar na simulação.',
    debit:'Preencha os dados fictícios do cartão para simular o débito à vista.',
    credit:'Preencha os dados fictícios do cartão e escolha de 1 a 12 parcelas sem juros.'
  };
  $('paymentHint').textContent = hints[method] || 'Escolha uma forma de pagamento para continuar.';
  if (cart.length && Object.hasOwn(CinefitaCheckout.methods,method)) {
    const quote = selectedPayment();
    $('installments').removeAttribute('aria-invalid');
    $('orderPayment').textContent = quote.label;
    $('orderPaymentTerms').textContent = credit ? installmentText(quote.installments)+' · sem juros' : 'À vista';
    $('installmentNotice').textContent = credit ? `Total de ${money(quote.totalCents/100)} em ${quote.installments.length} ${quote.installments.length===1?'parcela':'parcelas'}. Os centavos são distribuídos entre as parcelas para preservar o total.` : '';
  } else {
    $('orderPayment').textContent = 'Não selecionado';
    $('orderPaymentTerms').textContent = '';
  }
}
function renderOrder(refreshDeliveries=true){if(!$('orderItems'))return;if(refreshDeliveries)renderDeliveries();$('checkoutEmpty').hidden=cart.length>0;$('checkoutContent').hidden=!cart.length;const summary=CinefitaMarketplace.totals(cart,deliveryChoices);$('orderItems').innerHTML=summary.groups.map(g=>`<section class="order-seller"><h3>${esc(g.seller.name)}</h3>${g.items.map(it=>`<div class="order-line"><span>${it.qty} × ${esc(it.displayTitle||it.title)}<small>${esc(it.service||formatLabel(it))}</small></span><strong>${money(Math.round(it.price*100)*it.qty/100)}</strong></div>`).join('')}<p class="micro">${g.method==='pickup'?'Retirada / atendimento presencial':'Entrega: '+money(g.shippingCents/100)} · total do vendedor ${money(g.totalCents/100)}</p></section>`).join('');$('orderSubtotal').textContent=money(summary.subtotalCents/100);$('orderShipping').textContent=summary.shippingCents?money(summary.shippingCents/100):'Grátis';$('orderTotal').textContent=money(summary.totalCents/100);renderPayment();}
document.querySelectorAll('[name="payment"]').forEach(input=>input.addEventListener('change',()=>{renderPayment();$('paymentError').hidden=true;}));
if ($('installments')) $('installments').addEventListener('change',renderPayment);
const purchaseForm = $('purchaseForm');
const fieldHints = {cardHolder:'Informe o nome fictício no cartão.',cardNumber:'Informe de 13 a 19 dígitos fictícios.',cardExpiry:'Informe a validade no formato MM/AA, como 12/30.',cardCvv:'Informe 3 ou 4 dígitos fictícios.',name:'Informe seu nome com pelo menos 3 caracteres.',email:'Informe um e-mail válido, como nome@exemplo.com.',zip:'Informe o CEP com 8 números, como 00000-000.',street:'Informe o nome da rua.',number:'Informe o número do endereço.',district:'Informe o bairro.',city:'Informe a cidade.',state:'Informe a UF com 2 letras, como SP.'};
function validateField(input) {
  const error = document.getElementById(`${input.id}Error`);
  if (!error) return true;
  const invalid = input.required && !input.value.trim() || !input.validity.valid || (input.name === 'name' && input.value.trim().length < 3) || (input.name === 'cardNumber' && !/^[0-9]{13,19}$/.test(input.value.replace(/ /g,'')));
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
  purchaseForm.onsubmit = async e => {
    e.preventDefault();
    if (!cart.length || $('completePurchase').disabled) return;
    if(!await refreshEnterpriseCart())return;
    if (!cart.length || $('completePurchase').disabled) return;
    const invalid = fields.filter(input => !input.disabled && !input.closest('fieldset[disabled]') && !validateField(input));
    let payment;
    try { payment = selectedPayment(); } catch {}
    $('paymentError').hidden = !!payment;
    $('installments').setAttribute('aria-invalid',String(!payment && document.querySelector('[name="payment"]:checked')?.value==='credit'));
    $('validationSummary').hidden = !invalid.length && !!payment;
    if (invalid.length || !payment) {
      $('validationSummary').textContent = 'Confira os campos indicados para continuar.';
      (invalid[0] || (document.querySelector('[name="payment"]:checked')?.value==='credit' ? $('installments') : document.querySelector('[name="payment"]'))).focus();
      return;
    }
    $('completePurchase').disabled = true;
    const total = money(payment.totalCents/100);
    const terms = payment.method === 'credit' ? `em ${payment.installments.length} ${payment.installments.length===1?'parcela':'parcelas'}: ${installmentText(payment.installments)} sem juros` : 'à vista';
    $('successPayment').textContent = `${payment.label} · ${terms}. Pagamento aprovado na simulação.`;
    const completed=CinefitaMarketplace.totals(cart,deliveryChoices);
    $('successGroups').innerHTML=completed.groups.map(g=>`<section class="order-seller"><h3>${esc(g.seller.name)}</h3><p>${g.items.map(i=>`${i.qty} × ${esc(i.displayTitle||i.title)} (${esc(i.service||formatLabel(i))})`).join(' · ')}</p><p>${g.method==='pickup'?'Retirada / atendimento presencial':'Entrega '+money(g.shippingCents/100)} · Total ${money(g.totalCents/100)}</p></section>`).join('');
    try{recordSimulation({type:'Compra',items:cart.map(i=>({title:i.displayTitle||i.title,qty:i.qty,price:i.price})),totalCents:completed.totalCents});}catch{toast('Compra concluída; não foi possível salvar o histórico.');}
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
document.querySelectorAll('[data-hero-film]').forEach(slide => {
  const f = films.find(f => f.image === slide.dataset.heroFilm);
  if (!f) return;
  slide.querySelector('[data-hero-rating]').innerHTML = ratingMarkup(f);
});

const discToggle = document.querySelector('.disc-toggle');
if (discToggle && !document.body.classList.contains('site-contemporary')) discToggle.addEventListener('click', () => {
  const paused = document.querySelector('.hero-card').classList.toggle('disc-paused');
  discToggle.setAttribute('aria-pressed', String(paused));
  discToggle.textContent = paused ? 'Retomar disco' : 'Pausar disco';
});
document.addEventListener('pointerover', e => {
  const stage = e.target.closest?.('.product-stage');
  if (!stage || stage.contains(e.relatedTarget) || e.pointerType === 'touch' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const preview = stage.closest('[data-product-preview]');
  preview.dataset.hovered = 'true'; syncProductView(preview);
});
document.addEventListener('pointerout', e => {
  const preview = e.target.closest?.('[data-product-preview]');
  if (!preview) return;
  const stage = e.target.closest('.product-stage');
  if (stage && !stage.contains(e.relatedTarget)) preview.dataset.hovered = 'false';
  if (!preview.contains(e.relatedTarget)) preview.dataset.closedByButton = 'false';
  syncProductView(preview);
});

function editionMarkup(o){const e=globalThis.CinefitaEditions?.find(e=>e.id===o.editionId)||{};return `<details><summary>Informações da edição</summary><dl>${[['distributor','Distribuidora'],['region','Região'],['audio','Áudio'],['subtitles','Legendas'],['extras','Extras'],['packaging','Embalagem']].map(([k,l])=>`<div><dt>${l}</dt><dd>${esc(e[k]||'Não informado')}</dd></div>`).join('')}</dl></details>${(o.photos||[]).map(p=>`<img class="offer-photo" src="${URL.createObjectURL(p)}" alt="Foto do exemplar enviada pela empresa demonstrativa">`).join('')}`;}
async function refreshEnterpriseCart(){
 if(!cart.some(i=>i.sellerId==='demo-company'))return true;
 try{Object.assign(CinefitaDemo,await CinefitaEnterprise.read());marketplace=CinefitaMarketplace.createCatalog(films);const before=JSON.stringify(cart.map(i=>[i.key,i.price,i.qty]));cart=marketplace.restore(cart).items;const changed=before!==JSON.stringify(cart.map(i=>[i.key,i.price,i.qty]));if(changed){cartNotice='Uma oferta mudou ou ficou indisponível. Confira novamente o carrinho.';save();renderOrder();toast(cartNotice);return false;}return true;}catch{toast('Não foi possível verificar as ofertas locais. Tente novamente.');return false;}
}
if(location.pathname.endsWith('carrinho.html')||location.pathname.endsWith('compra.html'))void refreshEnterpriseCart();
