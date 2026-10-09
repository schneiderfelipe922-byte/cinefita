// Structured origins complement the existing film records; titles/prices stay intact.
const FILM_ORIGINS = {
  psycho:['Estados Unidos'], nightmare:['Estados Unidos'], friday:['Estados Unidos'], texas:['Estados Unidos'],
  elephant:['Reino Unido','Estados Unidos'], dracula:['Reino Unido'], frankenstein:['Estados Unidos'],
  clockwork:['Reino Unido','Estados Unidos'], nightdead:['Estados Unidos'], thing:['Estados Unidos'],
  indiana:['Estados Unidos'], terminator:['Estados Unidos','Reino Unido'], deadpoets:['Estados Unidos'],
  gonewind:['Estados Unidos'], jaws:['Estados Unidos'], django:['Itália','Espanha'], hellraiser:['Reino Unido'],
  dragon:['Hong Kong','Estados Unidos'], it:['Estados Unidos','Canadá'], omen:['Reino Unido','Estados Unidos'],
  wickerman:['Reino Unido'], untouchables:['Estados Unidos'], oz:['Estados Unidos'],
  dollars:['Itália','Espanha','Alemanha Ocidental'], kingkong:['Estados Unidos'], casablanca:['Estados Unidos'],
  wonderful:['Estados Unidos'], indemnity:['Estados Unidos'], kane:['Estados Unidos'], angrymen:['Estados Unidos'],
  samurai:['Japão'], tokyo:['Japão'], platoon:['Estados Unidos'], mist:['Estados Unidos'], blair:['Estados Unidos'],
  deadzone:['Estados Unidos'], streetfighter:['Japão'], perfectblue:['Japão'], goonies:['Estados Unidos'],
  willow:['Estados Unidos'], species:['Estados Unidos']
};
films.forEach(film => {
  film.directors = film.directors || (film.image === 'kingkong' ? ['Merian C. Cooper','Ernest B. Schoedsack'] : film.image === 'blair' ? ['Daniel Myrick','Eduardo Sánchez'] : [film.director]);
  film.countries = film.countries || FILM_ORIGINS[film.image] || [];
  film.originSourceUrl = film.image === 'terminator'
    ? 'https://www.bfi.org.uk/film/1a106cc0-6503-5c76-b189-15cd0d2d114d/the-terminator'
    : film.metadataSourceUrl || film.sourceUrl;
});
const curatedCollections = [
  { id:'horror-80', title:'Horror dos anos 80', kicker:'NOITES QUE FICARAM',
    description:'O medo atravessa sonhos, acampamentos e portas que seria melhor manter fechadas.',
    introduction:'Um acampamento à beira do lago. A rua em que os sonhos se tornam perigosos. Uma caixa que promete o desconhecido. Uma estação isolada pelo gelo. Quatro caminhos pelo horror dos anos 80, entre efeitos práticos e ameaças que permanecem fora de quadro.',
    films:['nightmare','friday','hellraiser','thing'] },
  { id:'futuros', title:'Futuros inquietantes', kicker:'AMANHÃ, VISTO DE ONTEM',
    description:'Máquinas, criaturas e perguntas sobre o que nos torna humanos.',
    introduction:'Naves silenciosas, cidades iluminadas à noite e máquinas que decidem por nós. Estes filmes imaginam futuros distintos e colocam uma pergunta no centro da viagem: como reconhecer o humano quando as fronteiras começam a desaparecer?',
    films:['terminator','thing','alien','odyssey','bladerunner'] },
  { id:'brasil', title:'Cinema brasileiro', kicker:'IMAGENS DA NOSSA TERRA',
    description:'Do barco à deriva ao sertão e ao horror de Zé do Caixão.',
    introduction:'Três obras, três maneiras de olhar o cinema brasileiro. Mário Peixoto encontra poesia no silêncio; Glauber Rocha transforma o sertão em conflito e movimento; José Mojica Marins dá rosto a um horror enraizado no cotidiano. Um começo para seguir descobrindo.',
    films:['midnight','blackgod','limite'] },
  { id:'classicos', title:'Clássicos para começar', kicker:'A PRIMEIRA SESSÃO',
    description:'Um monstro, um reencontro, uma investigação e uma sala de jurados.',
    introduction:'Não existe uma única porta de entrada para os clássicos. Aqui, ela pode ser a criatura de James Whale, o reencontro em Casablanca, as lembranças de um magnata ou a dúvida de um jurado. Quatro filmes para conhecer e revisitar no seu próprio tempo.',
    films:['frankenstein','casablanca','kane','angrymen'] }
];
