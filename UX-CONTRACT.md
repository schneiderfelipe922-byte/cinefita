# Cinefita — contrato de experiência

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
| Prévia de produto | app.js productPreview + data-product-toggle + styles.css .product-preview | Hover abre temporariamente; botão nativo alterna e fixa capa/aberto com aria-pressed, Enter e Space. Disponível apenas na seção de edição física da ficha. Área reservada, texto/preço permanecem legíveis. FILME sem suporte cadastrado não recebe embalagem. | Browser: hover, botão, teclado, reflow |
| Cartaz | dialog nativo + app.js openPoster | Modal nativo, botão fechar, Escape, retorno ao acionador; consulta da imagem local otimizada e acesso à ficha | Browser desktop/mobile |
| Foto | app.js tapePhoto | JPG/PNG/WEBP até 5 MB; erro persistente; prévia local; revogar object URL | Browser: válido/inválido |

## Estados e resultados

- As 52 fichas trazem metadados editoriais de referência, consultados em 05/10/2026. Duração não identifica a edição do exemplar; variantes de It, ...E o Vento Levou e Os Sete Samurais têm nota própria. Dados físicos ausentes permanecem explicitamente não informados. Os 33 preços e chaves anteriores são preservados. Os oito novos títulos têm preço de referência pesquisado, rótulo demonstrativo e fonte; não representam estoque Cinefita.
- `from` aceita apenas páginas locais de início, catálogo, pôsteres, coleções ou Minha coleção; destinos externos caem no catálogo. Fichas relacionadas preservam a origem. Títulos em português e original entram na busca.
- Destaque do início: disco decorativo em rotação, controle de pausar/retomar acessível por teclado e estado aria-pressed; movimento reduzido mantém a arte estática e oculta o controle. Preferência explícita do usuário em 04/10/2026.

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
