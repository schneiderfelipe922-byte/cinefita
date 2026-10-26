# Cinefita — versão alt mod

Loja virtual demonstrativa de cinema físico, feita com HTML, CSS e JavaScript. Possui 52 obras, 41 ofertas ilustrativas, quatro coleções editoriais, galeria, coleção pessoal e simulação completa de compra. A interface cinematográfica usa a identidade Cinefita, carvão e vermelho, cartazes completos e fundo de aurora em movimento.

## Executar

Na pasta do projeto, execute `python3 -m http.server 8000` e abra [localhost:8000](http://localhost:8000). Não há build, backend, login ou chaves de API. As imagens e fontes usadas pelo site estão em `assets/`. O arquivo pode ser servido por qualquer servidor HTTP estático.

## Usar a loja

1. Explore a inicial ou o catálogo. Combine busca com gênero, oferta física, formato, década, direção, país e ordenação.
2. Abra um filme com oferta e adicione ao carrinho. Altere a quantidade, remova itens ou continue para a compra.
3. Use nome/e-mail fictícios. Escolha retirada gratuita ou endereço de entrega com frete ilustrativo de R$ 19,90.
4. Escolha PIX, débito à vista ou crédito em 1 a 12 parcelas sem juros. Resumo e confirmação acompanham a seleção; as parcelas sempre somam o total exato.
5. Conclua a simulação. O carrinho é limpo, e a confirmação recebe foco. Não há cobrança, transferência, dados bancários ou envio de pedido real.

Os onze filmes editoriais sem oferta não têm preço inventado nem botão de compra. A coleção pessoal oferece Tenho, Quero ter e Já assisti, de forma independente. Carrinho e marcações ficam no localStorage do navegador, sem sincronização entre dispositivos. Dados do formulário não são enviados nem persistidos. O som da marca é opcional e iniciado pelo botão “Ouvir logo”. Aurora, destaques e objetos respeitam pausa e movimento reduzido; a navegação dos destaques é manual.

## Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `index.html`, `catalogo.html`, `filme.html` | Inicial, catálogo e fichas de produtos. |
| `colecoes.html`, `colecao.html`, `posters.html` | Curadoria, coleção pessoal e galeria. |
| `revitalizar.html`, `carrinho.html`, `compra.html` | Serviço demonstrativo, carrinho e finalização. |
| `styles.css`, `site-theme.css` | Tokens, componentes, responsividade, layout moderno e aurora. |
| `app.js`, `collection-ui.js` | Renderização, eventos, validação, carrinho, filtros e diálogos. |
| `checkout-core.js` | Métodos de pagamento e cálculo em centavos. |
| `catalog-core.js`, `personal-collection.js` | Busca/filtros e persistência das marcações. |
| `site-motion.js` | Fusão dos destaques, pausa, visibilidade, redução de movimento e inclinação do cartaz. |
| `data.js` e complementos | Obras, sinopses, metadados e preços de referência. |

## Verificação e entrega

Execute `node --test tests/*.test.cjs`: 44 testes unitários. Com Playwright/Chromium disponíveis e servidor ativo, execute `node tests/browser-check.cjs` e `node tests/checkout-browser.cjs`. Eles aceitam `CINEFITA_PLAYWRIGHT`, `CINEFITA_CHROMIUM`, `CINEFITA_URL` e `CINEFITA_REPORT_DIR`.

Veja [CRITERIOS-ATIVIDADE.md](CRITERIOS-ATIVIDADE.md), [VALIDACAO.md](VALIDACAO.md), [APRESENTACAO.md](APRESENTACAO.md), [DESIGN.md](DESIGN.md) e [UX-CONTRACT.md](UX-CONTRACT.md). Relatórios/capturas gerados são locais, em `relatorios/`, e não integram o código necessário para execução.

Destino da entrega: [branch versao-alt-mod](https://github.com/schneiderfelipe922-byte/cinefita/tree/versao-alt-mod). A publicação desta revisão ainda precisa ser autorizada; o remoto foi conferido em bf8c2ff, anterior às mudanças locais. A apresentação e o envio do link ao professor cabem ao aluno.

## Design e créditos

A direção moderna foi aprovada no [Superdesign](https://superdesign.dev/teams/1d1bc809-60a7-44b1-9242-1880b7006cad/projects/1d51d169-d293-4577-aa15-0c123d62bd43). O histórico visual anterior está no [Figma da versão alternativa](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT/versao-alt-mod?node-id=43-2). A implementação atual está nesta pasta e é independente de `cinefita-5`.

Cartazes são referências de obras de terceiros; seus direitos permanecem com os titulares. Procedência: `assets/posters/sources.json`, `expansion-sources.json`, `editorial-sources.json` e `alternatives/sources.json`. Embalagens abertas são ilustrações geradas e não prometem conteúdo de uma edição real. Fontes locais incluem suas licenças em `assets/fonts/`. Dados IMDb são um recorte editorial de 20/09/2026; não representam avaliações de compradores nem atualização em tempo real.
