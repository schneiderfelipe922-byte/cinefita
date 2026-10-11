# Cinefita — contrato de experiência

## Tema contemporâneo compartilhado — 09/10/2026

Fonte: plano de inicial contemporânea e imersiva aprovado pelo usuário em 09/10/2026. Após avaliar o experimento, o usuário autorizou a expansão para todas as nove rotas e pediu imagens mais lentas. `site-theme.css` compartilha o tema, incluindo cabeçalho, footer e overlays; os tokens pertencem a `styles.css :root`. Dados, URLs e chaves de armazenamento não mudam.

Movimento compartilhado pertence a `site-motion.js`; o controlador antigo de disco em `app.js` atende somente páginas sem a variante. “Pausar animações” / “Retomar animações” controla fundos, halo, caveira, ovo e parallax, com aria-pressed representando a pausa voluntária. Pausar revela qualquer conteúdo pendente, e retomar não repete animações de entrada. Movimento reduzido oculta o controle e mantém composição estática, inclusive se ativado durante a sessão. Parallax somente em elementos decorativos, acima de 900px, com abertura visível e aba ativa. Teclado revela imediatamente o alvo focado. Rolagem natural e dimensões reservadas permanecem obrigatórias.

Revisão de 10/10: fundos com luzes e feixe animados e entradas pela posição real da caixa estável na tela (100px desktop / 48px móvel). Itens à esquerda vêm da esquerda, os da direita vêm da direita e itens centrais recebem apenas 20px verticais. A camada interna anima com recorte temporário na caixa reservada, sem atravessar vizinhos. Imagens e abertura entram em 1400ms, textos em 900ms e escalonamento em 120ms; caveira de Frankenstein com flutuação em 20s, sem disco. Redimensionar recalcula itens pendentes; foco remove a entrada e o recorte imediatamente. O controlador registra cards recriados pelos renderizadores e exibe resultados no viewport imediatamente após filtrar. Campos e resumos não recebem revelação. Foco cancela também entradas em andamento. A pausa geral também interrompe esses fundos; sem JavaScript e com redução de movimento eles são estáticos. As camadas são decorativas, sem eventos de ponteiro e ocultas para tecnologias assistivas.

Sem JavaScript, a inicial fornece os três destaques em sequência, as quatro coleções e os sete cards em HTML, com links para filmes e seleções. Controles que exigem scripts ficam ocultos; navegação móvel permanece expandida. Busca continua como formulário nativo para o catálogo. Cartazes não são recortados nem alterados pelo experimento.

Refinamento visual em 09/10/2026 com Designly: abertura compacta, quatro curadorias em grade de duas colunas no desktop e uma até 900px, contagens de filmes e índices decorativos. A página Coleções mantém suas apresentações em linhas. Rodapé móvel com navegação em duas colunas; todos os links continuam na ordem original do teclado. Não houve alteração no armazenamento da coleção, URLs de filtros, carrinho ou compra demonstrativa. AI Graphic Design mantém capturas de referência em canvas, sem substituir cartazes ou introduzir controles sem comportamento.

Fonte de produto: LEIA-ME.txt; implementação existente; relatório de design aprovado; autorização explícita de implementação em 04/10/2026; redesign editorial autorizado em 08/10/2026 e decisão posterior de adiar login. O site é demonstrativo e não possui API, autenticação, cobrança ou envio de foto/pedido. Visual: [DESIGN.md](DESIGN.md).

## Jornada

Início → catálogo → busca/filtros → ficha do filme → adicionar → carrinho → conferir itens e entrega → concluir simulação → confirmação. Rota alternativa: revitalizar → formato/serviço → orçamento → carrinho. Galeria: pôsteres → consultar arte → fechar → retornar à mesma obra; também permite abrir a ficha pelo título, link ou modal.

## Mapa de proprietários canônicos

| Capacidade | Proprietário | Contrato | Verificação |
|---|---|---|---|
| Busca/filtros | catalog-core.js + app.js renderCatalog | Busca local, normalização de acentos, filtros combináveis e ordenação na URL; limpar devolve foco | Browser: combinação, vazio, limpar, reload |
| Select | HTML nativo; styles.css | Popup e teclado pertencem ao navegador/OS; geometria do popup não é personalizada | Browser: abrir e selecionar |
| Formulário | app.js validateField/purchaseForm | novalidate; erros associados; dados preservados; foco primeiro inválido | Browser: inválido, recuperação, sucesso |
| Scrollbar | styles.css global | Visível, tokens herdados em novos scrollers; forced-colors nativo | Estilo computado |
| Toast | app.js toast + #toast | status compartilhado; informação crítica também permanece inline | Browser e DOM |
| Carrinho | app.js itemMarkup/updateCart/openCart/closeCart | Quantidade 1–99; remover reversível por adicionar; subtotal em centavos; painel modal com foco contido, Escape e retorno | Browser: adicionar, quantidade, remover último, vazio |
| Ficha e arte | app.js card/posterImage/renderFilmDetail + film-details.js + styles.css .poster-frame | Links nativos; id estável por obra; retorno preserva a URL da lista com busca, gênero, formato, década, direção, país e ordenação; fonte dos dados visível; id inválido tem saída para o catálogo | Browser: abrir, retornar, inválido, imagens, reflow |
| Prévia de produto | app.js productPreview/syncProductView/toggleProductView + site-theme.css .product-preview | Única prévia na arte principal da ficha, inicialmente com cartaz completo. VHS/DVD/Blu-ray conhecidos reutilizam ilustrações; suporte desconhecido permanece cartaz. Hover temporário; botão Ver aberto / Ver cartaz fixa abertura por clique, toque, Enter ou Espaço. Fechar prevalece até sair da prévia. aria-pressed representa fixação, aria-hidden a arte visível. Mesma área 2:3 nos dois estados, transição reversível de 600ms ou instantânea com pausa/redução. Edição física mantém preço/compra e link à prévia no topo; cards/galeria só cartazes. | Browser: hover, fixação, fechamento durante hover, teclado, reflow; testes de estado e suportes |
| Destaques da inicial | site-motion.js createCinefitaHero + index.html + site-theme.css | Frankenstein, Alien e Hellraiser nessa ordem; navegação manual e circular somente por setas anterior/próximo, nas laterais da arte, com alvos de 44px e rótulos acessíveis, sem caixa, borda ou sombra e com foco visível. Seletores e contador visual removidos. Sem autoplay ou captura de rolagem. Carrega cartaz e imagens decorativas antes da troca, última escolha prevalece; falha ou timeout de 10s conserva a composição anterior e anuncia mensagem. Fades em 1400ms dentro de palco estável; uma composição acessível, outras inert/aria-hidden. Pausa/redução tornam troca instantânea; foco na composição encerra fade. Sem scripts, três figuras em sequência. Ciclos somente no destaque ativo com abertura visível, aba ativa e sem pausa/redução: caveira e ovo 20s/6px, luz 16s, névoa 28s. Cubo aberto com correntes diagonais é uma única imagem estática, sem giro, flutuação ou parallax. Decoração gerada com alpha preservado, sem interação, aria-hidden; CSS/JS nativos. | Browser: três destaques, circular, escolhas rápidas, pausa, alturas; testes de falha/timeout/concorrência |
| Cartaz | dialog nativo + app.js openPoster | Modal nativo, botão fechar, Escape, retorno ao acionador; consulta da imagem local otimizada e acesso à ficha | Browser desktop/mobile |
| Foto | app.js tapePhoto | JPG/PNG/WEBP até 5 MB; erro persistente; prévia local; revogar object URL | Browser: válido/inválido |

## Estados e resultados

- As 52 fichas trazem metadados editoriais de referência, consultados em 05/10/2026. Duração não identifica a edição do exemplar; variantes de It, ...E o Vento Levou e Os Sete Samurais têm nota própria. Dados físicos ausentes permanecem explicitamente não informados. Os 33 preços e chaves anteriores são preservados. Os oito novos títulos têm preço de referência pesquisado, rótulo demonstrativo e fonte; não representam estoque Cinefita.
- `from` aceita apenas páginas locais de início, catálogo, pôsteres, coleções ou Minha coleção; destinos externos caem no catálogo. Fichas relacionadas preservam a origem. Títulos em português e original entram na busca.
- Destaques do início: Frankenstein inicial com luz vermelha e caveira com pregos voltada à direita; Alien com palco azulado, ovo escuro de fissura verde e névoa; Hellraiser com imagem de cubo aberto escuro e dourado, frestas vermelhas e correntes saindo em diagonais. Cubo e correntes ficam estáticos. Decorações ampliadas ocupam a área de arte e ficam parcialmente escondidas atrás dos cartazes completos, separadas dos metadados e controles. Hover de mouse inclina somente o cartaz ativo em 10 graus/700ms; pausa e redução de movimento desativam a inclinação, sem impedir navegação. Cléo continua no acervo e na galeria. Ano, direção, categoria, suporte e avaliação aparecem somente quando cadastrados. Mensagem de status informa carregamento, escolha e falha; setas preservam foco e funcionam com Enter/Espaço. Controle de pausar/retomar acessível por teclado; movimento reduzido mantém arte estática e oculta o controle.

- Abrir/fechar filtros preserva valores. Chips removem um filtro; limpar remove busca, gênero, formato, década, direção, país e ordenação. Busca não faz requisições; não requer loading, debounce remoto ou cancelamento de rede.
- Incluir produto/serviço abre o mesmo carrinho e anuncia sucesso. Quantidade atualiza total e mantém foco no controle correspondente.
- Remover último item mantém foco em caminho útil da mesma superfície. Carrinho vazio não oferece link habilitado para concluir.
- Formulário de compra mantém campos e erros inline. Retirada esconde/desabilita endereço; entrega ativa os campos obrigatórios. Resumo sempre antecede a conclusão no mobile.
- Sucesso da simulação limpa o carrinho, mostra valor e aviso de ausência de cobrança/envio, focaliza confirmação. Nenhuma informação pessoal do formulário é persistida.
- localStorage indisponível: carrinho continua na memória da página e aviso explica falha de persistência. Não alegar persistência entre páginas nesse estado.
- Native select e details são decisões intencionais. Não inventar popups ARIA quando o comportamento do navegador satisfaz o fluxo.
- Locale pt-BR, moeda BRL, dados IMDb estáticos de 20/09/2026. Sem atualização financeira ou de avaliação implícita.

## Coleções e organização local — 08/10/2026

Decisão do usuário: **não implementar login agora**. Não há conta, Supabase, Resend ou envio de códigos. Minha coleção é local ao navegador, sem garantia de isolamento entre pessoas que compartilham o mesmo perfil. A interface informa que não existe sincronização entre dispositivos.

| Capacidade | Proprietário | Contrato | Verificação |
|---|---|---|---|
| Seleções editoriais | collections-data.js + collection-ui.js | Quatro coleções; `colecoes.html?id=`; id inválido oferece voltar | Navegador: seleção, inválido, retorno |
| Marcação pessoal | personal-collection.js createStore + collection-ui.js | Tenho, Quero ter e Já assisti independentes; uma entrada por filme; só identificadores conhecidos; salvar local e remover reversível | Testes de persistência, falha e abas; navegador |
| Dialog de organização | dialog nativo #organizeDialog | Nome acessível, foco inicial em fechar, background inerte, Escape e retorno; controles mostram aria-pressed | Navegador: teclado e fechamento |
| Minha coleção | collection-ui.js renderPersonal | Todos significa filmes com qualquer marca; contadores por tipo, filtros independentes, busca e ordenação na URL; vazio oferece catálogo | Navegador: filtros, recarga, vazio |
| Menu mobile | #menuToggle + #primaryNav | Até 900px: navegação recolhida; aria-expanded, Escape com retorno; busca e carrinho visíveis | Navegador: teclado, 320–900px |

O armazenamento usa cinefitaCollection.v1. Ao abrir, voltar à aba ou receber evento de outra aba, recarrega as marcações persistidas. Antes de salvar, mescla a versão mais recente para preservar alterações independentes. Se o armazenamento falhar ou estiver corrompido, mantém estado em memória e mostra mensagem permanente de que ele dura apenas nesta página; uma nova marcação tenta salvar novamente. Toast não afirma persistência quando a escrita falhou. Não há confirmação falsa de servidor nem fluxo de sessão.

Os onze títulos novos têm price:null e FILME. Cards omitem preço e suporte desconhecido; ficha explica a ausência e não oferece compra ou embalagem. Ordenar por preço coloca sem oferta no final nas duas direções. Carrinho ignora valores inválidos e filmes sem oferta ao restaurar. Fontes e metadados são editoriais locais; sem carregamento remoto do catálogo. As artes alternativas anteriores permanecem independentes.

## Limites de validação

Objetivo WCAG 2.2 AA; esta implementação não equivale a certificação. Navegador desktop com viewports móveis é evidência de reflow, não teste de aparelho físico. A solicitação de 05/10/2026 autorizou pesquisa externa de preços e três imagens geradas de embalagens. O redesign de 06/10/2026 altera composição e tokens; mantém preços, dados, ações e proprietários. Ilustrações genéricas não identificam os itens reais de uma edição. Stitch não faz parte desta implementação. A evolução de 05/10/2026 usa cartazes existentes de fontes públicas, documentados em assets/posters/sources.json, sem inventar fotografia de produto.

Referências atuais consultadas: [W3C modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [erros de formulário](https://www.w3.org/WAI/tutorials/forms/notifications/), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [alvos de toque](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Os oito novos filmes de `catalog-expansion.js` entram na mesma busca, galeria, ficha e carrinho. Blu-ray e Animação são filtros nativos; Novos no acervo ordena novidades antes das obras anteriores. A origem com os filtros continua sendo preservada ao abrir e voltar de uma ficha.

## Galeria de artes alternativas — 07/10/2026

`posterArtwork` é opcional e independente da capa `artwork`. A miniatura e o
diálogo de ampliação devem escolher a mesma arte. O diálogo apresenta o título,
ano, gênero e um link de procedência quando há fonte cadastrada. Fechar por
Escape restaura o foco no cartaz que abriu o diálogo.
