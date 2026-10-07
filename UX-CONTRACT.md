# Cinefita — contrato de experiência

Fonte de produto: LEIA-ME.txt; implementação existente; relatório de design aprovado; autorização explícita de implementação em 04/10/2026; redesign retrô sofisticado autorizado em 06/10/2026. O site é demonstrativo e não possui API, autenticação, cobrança ou envio de foto/pedido. Visual: [DESIGN.md](DESIGN.md).

## Jornada

Início → catálogo → busca/filtros → ficha do filme → adicionar → carrinho → conferir itens e entrega → concluir simulação → confirmação. Rota alternativa: revitalizar → formato/serviço → orçamento → carrinho. Galeria: pôsteres → consultar arte → fechar → retornar à mesma obra; também permite abrir a ficha pelo título, link ou modal.

## Mapa de proprietários canônicos

| Capacidade | Proprietário | Contrato | Verificação |
|---|---|---|---|
| Busca/filtros | app.js selectCatalog/renderCatalog | Busca local, normalização de acentos, filtros combináveis e ordenação na URL; limpar devolve foco | Browser: combinação, vazio, limpar, reload |
| Select | HTML nativo; styles.css | Popup e teclado pertencem ao navegador/OS; geometria do popup não é personalizada | Browser: abrir e selecionar |
| Formulário | app.js validateField/purchaseForm | novalidate; erros associados; dados preservados; foco primeiro inválido | Browser: inválido, recuperação, sucesso |
| Scrollbar | styles.css global | Visível, tokens herdados em novos scrollers; forced-colors nativo | Estilo computado |
| Toast | app.js toast + #toast | status compartilhado; informação crítica também permanece inline | Browser e DOM |
| Carrinho | app.js itemMarkup/updateCart/openCart/closeCart | Quantidade 1–99; remover reversível por adicionar; subtotal em centavos; painel modal com foco contido, Escape e retorno | Browser: adicionar, quantidade, remover último, vazio |
| Ficha e arte | app.js card/posterImage/renderFilmDetail + film-details.js + styles.css .poster-frame | Links nativos; id estável por obra; retorno preserva a URL da lista com busca, gênero, formato e ordenação; fonte dos dados visível; id inválido tem saída para o catálogo | Browser: abrir, retornar, inválido, imagens, reflow |
| Prévia de produto | app.js productPreview + data-product-toggle + styles.css .product-preview | Hover abre temporariamente; botão nativo alterna e fixa capa/aberto com aria-pressed, Enter e Space. Mesmo proprietário em início, catálogo e ficha. Área reservada, texto/preço permanecem legíveis. FILME sem suporte cadastrado não recebe embalagem. | Browser: hover, botão, teclado, reflow |
| Cartaz | dialog nativo + app.js openPoster | Modal nativo, botão fechar, Escape, retorno ao acionador; consulta da imagem local otimizada e acesso à ficha | Browser desktop/mobile |
| Foto | app.js tapePhoto | JPG/PNG/WEBP até 5 MB; erro persistente; prévia local; revogar object URL | Browser: válido/inválido |

## Estados e resultados

- As 41 fichas trazem metadados editoriais de referência, consultados em 05/10/2026. Duração não identifica a edição do exemplar; variantes de It, ...E o Vento Levou e Os Sete Samurais têm nota própria. Dados físicos ausentes permanecem explicitamente não informados. Os 33 preços e chaves anteriores são preservados. Os oito novos títulos têm preço de referência pesquisado, rótulo demonstrativo e fonte; não representam estoque Cinefita.
- `from` aceita apenas páginas locais de início, catálogo ou pôsteres; destinos externos caem no catálogo. Fichas relacionadas preservam a origem. Títulos em português e original entram na busca.
- Destaque do início: disco decorativo em rotação, controle de pausar/retomar acessível por teclado e estado aria-pressed; movimento reduzido mantém a arte estática e oculta o controle. Preferência explícita do usuário em 04/10/2026.

- Abrir/fechar filtros preserva valores. Chips removem um filtro; limpar remove busca, gênero, formato e ordenação. Busca não faz requisições; não requer loading, debounce remoto ou cancelamento de rede.
- Incluir produto/serviço abre o mesmo carrinho e anuncia sucesso. Quantidade atualiza total e mantém foco no controle correspondente.
- Remover último item mantém foco em caminho útil da mesma superfície. Carrinho vazio não oferece link habilitado para concluir.
- Formulário de compra mantém campos e erros inline. Retirada esconde/desabilita endereço; entrega ativa os campos obrigatórios. Resumo sempre antecede a conclusão no mobile.
- Sucesso da simulação limpa o carrinho, mostra valor e aviso de ausência de cobrança/envio, focaliza confirmação. Nenhuma informação pessoal do formulário é persistida.
- localStorage indisponível: carrinho continua na memória da página e aviso explica falha de persistência. Não alegar persistência entre páginas nesse estado.
- Native select e details são decisões intencionais. Não inventar popups ARIA quando o comportamento do navegador satisfaz o fluxo.
- Locale pt-BR, moeda BRL, dados IMDb estáticos de 20/09/2026. Sem atualização financeira ou de avaliação implícita.

## Limites de validação

Objetivo WCAG 2.2 AA; esta implementação não equivale a certificação. Navegador desktop com viewports móveis é evidência de reflow, não teste de aparelho físico. A solicitação de 05/10/2026 autorizou pesquisa externa de preços e três imagens geradas de embalagens. O redesign de 06/10/2026 altera composição e tokens; mantém preços, dados, ações e proprietários. Ilustrações genéricas não identificam os itens reais de uma edição. Stitch não faz parte desta implementação. A evolução de 05/10/2026 usa cartazes existentes de fontes públicas, documentados em assets/posters/sources.json, sem inventar fotografia de produto.

Referências atuais consultadas: [W3C modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [erros de formulário](https://www.w3.org/WAI/tutorials/forms/notifications/), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [alvos de toque](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Os oito novos filmes de `catalog-expansion.js` entram na mesma busca, galeria, ficha e carrinho. Blu-ray e Animação são filtros nativos; Novos no acervo ordena novidades antes das obras anteriores. A origem com os filtros continua sendo preservada ao abrir e voltar de uma ficha.

## Galeria de artes alternativas — 07/10/2026

`posterArtwork` é opcional e independente da capa `artwork`. A miniatura e o
diálogo de ampliação devem escolher a mesma arte. O diálogo apresenta o título,
ano, gênero e um link de procedência quando há fonte cadastrada. Fechar por
Escape restaura o foco no cartaz que abriu o diálogo.
