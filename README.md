# Cinefita

O tema contemporâneo atende todo o site: carvão, branco quente, vermelho e Manrope, com fundos animados e entradas de imagens em 1,4s. Cada item entra pelo lado em que está na tela; itens centrais entram verticalmente, dentro da área reservada. “Pausar animações” interrompe o movimento em cada página; redução de movimento é respeitada durante a sessão. Tema e controlador compartilhados: site-theme.css e site-motion.js. Comparação e validação em VALIDACAO.md.

Site estático em português, com 52 filmes, quatro seleções editoriais e uma galeria de 47 cartazes. Logo, cartazes, dados e contratos preservados.

## Executar

Não há dependências de build. Sirva esta pasta por HTTP:

```sh
python3 -m http.server 8000
```

Abra `http://localhost:8000`. O carrinho usa `localStorage` e funciona entre as páginas na mesma origem.

## Recursos

- Catálogo com busca, filtros, ordenação e seleções preservadas na URL.
- Fichas com direção, duração, sinopse e fontes.
- Galeria com artes alternativas independentes das capas dos produtos, ampliação e link da fonte.
- Prévia ilustrativa da embalagem na arte principal da ficha, com hover temporário e botão “Ver aberto” / “Ver cartaz” para fixar o estado.
- Três destaques manuais na inicial: Frankenstein, Alien e Hellraiser; iluminação própria, navegação circular somente por setas laterais sem caixa, hover de inclinação exclusivo do cartaz, transição de 1,4s e imagens geradas com fundo transparente. Frankenstein tem caveira com pregos voltada à direita; Alien, ovo luminoso e névoa; Hellraiser, cubo aberto com correntes diagonais em uma única imagem estática, sem rotação. Ciclos de caveira/ovo somente no destaque ativo, suspensos fora da abertura, em aba oculta, pausa ou redução de movimento. Objetos ampliados ficam parcialmente escondidos atrás dos cartazes completos. Cléo permanece no acervo e na galeria.
- Layout responsivo, foco visível e respeito a `prefers-reduced-motion`.

O checkout é uma demonstração. Não processa pagamentos, envia pedidos ou mantém estoque real. Preços, frete e embalagens são referências ilustrativas.

## Estrutura

As nove páginas compartilham `styles.css` e `app.js`. `data.js`, `film-details.js` e `catalog-expansion.js` contêm o acervo; `poster-artwork.js` contém as artes alternativas da galeria. Imagens, fontes e manifestos de procedência ficam em `assets/`.

Veja [DESIGN.md](DESIGN.md), [UX-CONTRACT.md](UX-CONTRACT.md) e [LEIA-ME.txt](LEIA-ME.txt). Os relatórios históricos e backups são locais e não integram o repositório.

[Arquivo de design no Figma](https://www.figma.com/design/HFyHSw8FTmsVoewbVR5ry1).

## Créditos dos ativos

Cartazes são referências de obras de terceiros; seus direitos permanecem com os respectivos titulares. A procedência está em `assets/posters/sources.json`, `assets/posters/expansion-sources.json`, `assets/posters/editorial-sources.json` e `assets/posters/alternatives/sources.json`. A presença neste projeto não concede licença de reprodução comercial.

Embalagens abertas são ilustrações geradas, sem promessa de conteúdo de uma edição real. Fontes locais incluem suas licenças em `assets/fonts/`. As notas do IMDb são um recorte estático consultado em 20/09/2026, registrado em `imdb-ratings.json`.

## Redesign editorial e Minha coleção

Cartazes completos em grades 4/3/2/1, títulos sem truncamento, preço secundário e compra apenas na ficha. Filtros por gênero, suporte, década, direção e país podem ser combinados e permanecem na URL. Coleções: colecoes.html, com seleção por id. Minha coleção: colecao.html, com Tenho, Quero ter e Já assisti independentes.

Login foi adiado por decisão do usuário. Marcações ficam em localStorage neste navegador; não há conta, backend ou sincronização entre dispositivos. Não é necessário configurar Supabase ou Resend. Os onze filmes novos não têm preço ou oferta física pesquisada.

## Validação

`node --test tests/*.test.cjs` verifica acervo, imagens, curadorias, filtros, preços ausentes, persistência, falhas, alterações entre abas, retorno seguro e os estados de pausa, parallax e redução de movimento do site. Inclui páginas internas e listas atualizadas pela busca. Não há etapa de build. Verificação de reflow e fluxos descrita em VALIDACAO.md.
