/* Shared editorial navigation and device-local organization. */
const markLabels={owned:'Tenho',wanted:'Quero ter',watched:'Já assisti'};
let personalFilter='all',organizeFilm,organizeTrigger;
let personalStorage;
try{personalStorage=window.localStorage;}catch{personalStorage={getItem(){throw Error();},setItem(){throw Error();}};}
const personalStore=CinefitaCollection.createStore({storage:personalStorage,filmIds:films.map(f=>f.image),onChange:refreshPersonal});
function markButtons(id){const marks=personalStore.get(id);return Object.entries(markLabels).map(([key,label])=>`<button type="button" data-mark="${key}" data-mark-film="${esc(id)}" aria-pressed="${marks[key]}"><span aria-hidden="true">${marks[key]?'✓':'＋'}</span> ${label}</button>`).join('');}
function refreshPersonal(){
  const focused=document.hasFocus()?document.activeElement:null;
  const focusMark=focused?.dataset.mark?{film:focused.dataset.markFilm,type:focused.dataset.mark}:null;
  const focusFilm=focused?.dataset.organize;
  document.querySelectorAll('[data-film-marks]').forEach(el=>el.innerHTML=markButtons(el.dataset.filmMarks));
  if(organizeFilm)$('organizeMarks').innerHTML=markButtons(organizeFilm);
  document.querySelectorAll('[data-storage-notice]').forEach(el=>{el.hidden=personalStore.isPersistent();el.textContent='Não foi possível guardar as marcações neste navegador. Elas ficam nesta página até você sair. Tente marcar novamente para salvar.';});
  renderPersonal();
  if(focusMark){const scope=$('organizeDialog').open?$('organizeMarks'):document;scope.querySelector(`[data-mark-film="${focusMark.film}"][data-mark="${focusMark.type}"]`)?.focus();}
  else if(focusFilm&&!focused.isConnected)document.querySelector(`[data-organize="${focusFilm}"]`)?.focus();
}
function personalParams(){return new URLSearchParams(location.search);}
function restorePersonal(){const params=personalParams();personalFilter=['all',...Object.keys(markLabels)].includes(params.get('filter'))?params.get('filter'):'all';const order=params.get('sort');$('collectionSort').value=['az','newest','oldest'].includes(order)?order:'az';$('searchInput').value=params.get('q')||'';syncSearchClear();renderPersonal();}
function renderPersonal(){
  if(!$('personalGrid'))return;
  const marked=films.filter(f=>personalStore.ids().includes(f.image));
  const result=CinefitaCatalog.select(marked.filter(f=>personalFilter==='all'||personalStore.get(f.image)[personalFilter]),{query:$('searchInput').value,sort:$('collectionSort').value});
  $('collectionCounts').innerHTML=Object.entries(markLabels).map(([key,label])=>`<span><strong>${marked.filter(f=>personalStore.get(f.image)[key]).length}</strong> ${label}</span>`).join('');
  document.querySelectorAll('[data-personal-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.personalFilter===personalFilter)));
  $('collectionResult').textContent=`${result.length} ${result.length===1?'filme':'filmes'} nesta seleção`;
  $('personalGrid').innerHTML=result.length?result.map(card).join(''):`<div class="empty-state"><h2>${marked.length?'Nenhum filme nesta seleção.':'Sua coleção começa com um filme.'}</h2><p>${marked.length?'Escolha outra marcação ou limpe a busca.':'Explore o acervo e use Organizar para marcar Tenho, Quero ter ou Já assisti.'}</p><a class="cta" href="catalogo.html">Explorar catálogo ↗</a></div>`;
}
function commitPersonal(){const params=new URLSearchParams();if(personalFilter!=='all')params.set('filter',personalFilter);if($('searchInput').value.trim())params.set('q',$('searchInput').value.trim());if($('collectionSort').value!=='az')params.set('sort',$('collectionSort').value);history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));renderPersonal();}
if($('personalGrid')){
  restorePersonal();
  document.querySelector('.search').addEventListener('submit',e=>{e.preventDefault();commitPersonal();});
  $('searchInput').addEventListener('input',e=>{if(!e.isComposing)commitPersonal();});
  $('searchInput').addEventListener('compositionend',commitPersonal);
  $('clearSearch').onclick=()=>{$('searchInput').value='';syncSearchClear();commitPersonal();$('searchInput').focus();};
  $('collectionSort').addEventListener('change',commitPersonal);
  window.addEventListener('popstate',restorePersonal);
}
document.addEventListener('click',e=>{
  const organize=e.target.closest('[data-organize]');
  if(organize){organizeTrigger=organize;organizeFilm=organize.dataset.organize;$('organizeTitle').textContent=displayTitle(films.find(f=>f.image===organizeFilm));refreshPersonal();$('organizeDialog').showModal();document.body.style.overflow='hidden';$('closeOrganize').focus();return;}
  const mark=e.target.closest('[data-mark]');
  if(mark){const id=mark.dataset.markFilm,key=mark.dataset.mark;const enabled=!personalStore.get(id)[key];const result=personalStore.set(id,key,enabled);const scope=$('organizeDialog').open?$('organizeMarks'):document.querySelector(`[data-film-marks="${id}"]`);scope?.querySelector(`[data-mark="${key}"]`)?.focus();toast(result.persistent?'Marcação salva neste navegador.':'Marcação mantida apenas nesta página.');return;}
  const filter=e.target.closest('[data-personal-filter]');if(filter){personalFilter=filter.dataset.personalFilter;commitPersonal();}
});
$('closeOrganize').onclick=()=>$('organizeDialog').close();
$('organizeDialog').addEventListener('close',()=>{document.body.style.overflow='';const id=organizeFilm;organizeFilm=undefined;(organizeTrigger?.isConnected?organizeTrigger:document.querySelector(`[data-organize="${id}"]`)||$('mainContent')).focus();});
window.addEventListener('storage',e=>{if(e.key===CinefitaCollection.KEY||e.key===null)personalStore.reload();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&personalStore.isPersistent())personalStore.reload();});
window.addEventListener('focus',()=>{if(personalStore.isPersistent())personalStore.reload();});
refreshPersonal();

function collectionPreview(collection,index){return `<article class="collection-preview"><div class="collection-preview-copy"><p class="eyebrow"><span class="collection-index" aria-hidden="true">${String(index+1).padStart(2,'0')}</span>${esc(collection.kicker)}</p><h3><a href="colecoes.html?id=${collection.id}">${esc(collection.title)}</a></h3><p>${esc(collection.description)}</p><div class="collection-preview-footer"><a class="film-link" href="colecoes.html?id=${collection.id}">Abrir seleção ↗</a><span class="counter">${collection.films.length} filmes</span></div></div><a class="collection-triptych" href="colecoes.html?id=${collection.id}" aria-label="Explorar ${esc(collection.title)}">${collection.films.slice(0,3).map(id=>posterImage(films.find(f=>f.image===id),{decorative:true,sizes:'(max-width: 900px) 27vw, 200px'})).join('')}</a></article>`;}
if($('homeCollections'))$('homeCollections').innerHTML=curatedCollections.map(collectionPreview).join('');
if($('curatedPage')){
  const id=new URLSearchParams(location.search).get('id');const collection=curatedCollections.find(c=>c.id===id);
  if(id&&!collection){$('curatedPage').innerHTML='<div class="empty-state"><h1>Seleção não encontrada.</h1><p>Escolha um dos quatro caminhos pelo acervo.</p><a class="cta" href="colecoes.html">Ver coleções</a></div>';}
  else if(collection){document.title=collection.title+' — Cinefita';$('curatedPage').innerHTML=`<a class="back-link" href="colecoes.html">← Todas as coleções</a><div class="page-intro selection-intro"><p class="eyebrow">${esc(collection.kicker)}</p><h1>${esc(collection.title)}</h1><p>${esc(collection.introduction)}</p><span class="counter">${collection.films.length} FILMES</span></div><div class="grid">${collection.films.map(id=>card(films.find(f=>f.image===id))).join('')}</div>`;}
  else $('curatedPage').innerHTML=`<div class="page-intro"><p class="eyebrow">CINEMA EM BOA COMPANHIA</p><h1>Coleções para descobrir.</h1><p>Um tema aproxima os filmes. Cada sessão revela as diferenças. Escolha um caminho e encontre as histórias que o atravessam.</p></div><div class="collection-previews">${curatedCollections.map(collectionPreview).join('')}</div>`;
}
const menu=$('menuToggle'),navigation=$('primaryNav');
function closeMenu(){menu.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');}
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));navigation.classList.toggle('is-open',!expanded);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu();});
window.matchMedia('(min-width: 901px)').addEventListener('change',closeMenu);
