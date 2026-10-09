---
version: alpha
name: Cinefita
description: 'Cinemateca editorial: cartazes completos, curadoria e memória afetiva pelo cinema.'
colors:
  background: '#21171A'
  surface: '#302126'
  text: '#F2E9D8'
  primary: '#C8AB78'
  on-action: '#21171A'
  muted: '#C5B9AB'
  divider: '#594249'
  control-border: '#887366'
  selected: '#463038'
  danger: '#FFB4AB'
  frame-rim: '#9E835B'
  frame-mat: '#261B1F'
typography:
  display:
    fontFamily: 'Cormorant Garamond, Georgia, serif'
    fontSize: '64px'
    lineHeight: '1.08'
  sans:
    fontFamily: 'Manrope, Arial, sans-serif'
    fontSize: '16px'
    lineHeight: '1.55'
  mono:
    fontFamily: 'Roboto Mono, ui-monospace, monospace'
    fontSize: '12px'
    lineHeight: '1.5'
rounded:
  DEFAULT: '4px'
  image: '4px'
  panel: '6px'
spacing:
  page-max: '1320px'
  section-gap: '64px'
  component-gap: '24px'
components:
  button:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-action}'
    rounded: '{rounded.DEFAULT}'
    padding: '12px 20px'
  catalog-button:
    backgroundColor: '{colors.background}'
    textColor: '{colors.text}'
    rounded: '{rounded.DEFAULT}'
    padding: '10px 14px'
  card:
    backgroundColor: '{colors.background}'
    textColor: '{colors.text}'
    rounded: '{rounded.panel}'
  field:
    backgroundColor: '{colors.background}'
    textColor: '{colors.text}'
    height: '48px'
    rounded: '{rounded.DEFAULT}'
  selected-option:
    backgroundColor: '{colors.selected}'
    textColor: '{colors.text}'
  supporting-text:
    textColor: '{colors.muted}'
  error-text:
    textColor: '{colors.danger}'
  divider:
    backgroundColor: '{colors.divider}'
  scrollbar-thumb:
    backgroundColor: '{colors.control-border}'
  poster-frame:
    backgroundColor: '{colors.frame-mat}'
    rounded: '{rounded.image}'
  poster-rim:
    backgroundColor: '{colors.frame-rim}'
---

# Cinefita Design System

## Overview

**Refinamento de 09/10/2026 — Designly.** Destaque de Frankenstein mais compacto (aproximadamente 578px em 1440px), mantendo moldura dupla, disco e pausa. Chamada desktop até 76px; metadados e IMDb dividem uma linha quando há espaço. Na abertura, quatro curadorias em duas colunas, cada uma com três cartazes completos, índice discreto e quantidade de filmes. Em telas até 900px, as curadorias voltam a uma coluna. A página Coleções mantém as apresentações em linhas. Introdução das seleções e rodapé móvel mais compactos; links do rodapé em duas colunas com alvos de 44px. Filtros avançados em quatro colunas acima de 1150px. Os cards e sua grade responsiva permanecem no padrão do acervo. AI Graphic Design foi usado como canvas de referências visuais antes/depois, sem geração de artes ou alteração dos cartazes originais.

**Direção de 08/10/2026: Cinemateca editorial.** Composição aprovada pelo usuário: preservar marca, vinho, marfim, latão e destaque de Frankenstein; dar escala aos cartazes e reduzir o conteúdo ao redor. A memória afetiva vem das artes de época, dos títulos reconhecíveis e de apresentações específicas das seleções, sem atribuir lembranças pessoais ao visitante.

Público presumido: pessoas interessadas em clássicos e objetos de cinema. Locale pt-BR. O site é estático e demonstrativo: compra, entrega e revitalização não geram pedidos nem cobrança. Decisão posterior do usuário: adiar login, Supabase e Resend. Minha coleção guarda marcações apenas no navegador, sem conta ou sincronização entre dispositivos.

**Modelo B:** `styles.css :root` possui os tokens em execução; este documento espelha os valores aceitos. Paleta, famílias tipográficas e marca foram preservadas. Os componentes compartilhados usam esses tokens diretamente, sem tema paralelo. Comportamento em [UX-CONTRACT.md](UX-CONTRACT.md). Histórico: relatórios locais de setembro e redesign de 06/10/2026; datas de preços e IMDb não foram atualizadas implicitamente.

## Colors

Paleta principal com seis papéis: vinho tinta `background`, vinho tonal `surface`, marfim `text`, latão fosco `primary`, apoio `muted` e contorno `control-border`. O latão ocupa ações e pequenos detalhes, sem degradê dourado. Fundo e superfícies sustentam as artes coloridas. Texto de apoio usa seu token, sem opacidade arbitrária. Divisórias decorativas têm cor própria; não substituem contornos de campos. Estados selecionados e erros usam também marcador e texto.

| Documento | CSS | Consumidores |
|---|---|---|
| background / surface | --bg / --ink | Página, cards, painéis |
| text / muted | --cream / --muted | Títulos, corpo, apoio |
| primary / on-action | --yellow / --espresso | CTA, links, foco, ação preenchida |
| divider / control-border | --line / --control-border | Divisórias / campos e controles |
| selected / danger | --selected / --danger | Seleção / mensagens de erro |
| frame-rim / frame-mat | --frame-rim / --frame-mat | Aro de latão / passe-partout |
| typography.display | --font-display | Hero, títulos de página e seção, destaque |
| typography.sans / mono | --font-body / --font-data | Conteúdo, controles / dados curtos |
| rounded.image / DEFAULT / panel | --radius-image / --radius-control / --radius-panel | Arte / controles / painéis |

Os nomes CSS `yellow`, `cream` e `espresso` são aliases históricos; seus valores aceitos são os do frontmatter. Um tema escuro; forced-colors usa cores do sistema. O logotipo original `assets/filmstrip.png` e sua cor são preservados, sem recoloração.

## Typography

Cormorant Garamond 600, normal e itálica, para títulos editoriais, páginas, seleções e filmes. Fonte local WOFF2, com licença em assets/fonts/; fallback Georgia. Manrope para leitura, controles e preços; Roboto Mono para dados curtos. As duas últimas famílias conservam o carregamento existente com fallbacks.

Hero 48–88px/1.02. Títulos de página 40–64px/1.08; seções 32–48px/1.1. Títulos de cards 23px/1.16, 22px no celular, sem truncamento. Corpo 16px/1.55; apoio 14px; metadados 12px/1.7. Preço do card: **Manrope 14px, peso 400, cor secundária**, sem caixa ou etiqueta. Valor da edição física na ficha 32px; orçamento e totais usam a hierarquia anterior. Dados técnicos e formulários usam Manrope.

## Layout

Contêiner máximo 1320px; margens 32px desktop e 16px até 900px. Cabeçalho desktop: marca, busca e carrinho na primeira linha; navegação na segunda. Até 900px: marca, carrinho e Menu; busca visível abaixo. O menu acessível reúne os seis destinos. Conta foi retirada por decisão do usuário.

Início: chamada e Frankenstein em duas colunas, chamada antes da arte no celular. Depois, quatro apresentações de coleções com três cartazes; seleção brasileira; novidades Halloween, Alien, Limite e Cléo; convite para galeria. Não repetir cards completos das coleções na abertura.

Uma grade compartilhada serve catálogo, seleção temática, Minha coleção e relacionados: quatro colunas acima de 1150px, três entre 901–1150px, duas entre 360–900px e uma abaixo de 360px. Hierarquia **cartaz → título → dados → ações**, com preço secundário quando há oferta. Área de cartaz 2:3, `object-fit: contain`; títulos completos, nenhuma informação necessária depende de hover.

Catálogo mantém agrupamento inicial por gênero; filtros combináveis em disclosure, chips e ordenação. Ficha: cartaz e identificação, organização pessoal próxima do título; sinopse, dados e fontes; edição física em seção própria com compra e embalagem. Ficha em duas colunas acima de 900px e uma abaixo. Coleções tem quatro apresentações ou introdução completa e filmes por `id`. Minha coleção tem contadores, quatro opções e mesma grade. Galeria: artes maiores, legendas e ampliação com fonte. Revitalização, carrinho e compra herdam superfícies, espaçamento e controles. Documento usa rolagem natural; resumo antecede conclusão no celular.

## Elevation & Depth

Hierarquia por espaço, tipografia e divisórias. Cards não têm painel ou sombra; moldura fina com margem interna de 4–6px. A moldura dupla e o disco de Frankenstein são a exceção expressiva preservada. Nenhuma textura artificial ou envelhecimento sobre cartazes ou leitura. Carrinho usa overlay; galeria e organização usam dialog nativo.

## Shapes

Imagem e controle 4px; painel 6px. Pílulas apenas em filtros. Cartazes de cards, galeria e ficha em área 2:3; imagens completas com contain. Embalagem na seção física em palco 4:3. `.poster-frame` fornece geometria comum; variantes editoriais usam borda simples, enquanto o destaque conserva a dupla.

## Components

Os nove HTML compartilham cabeçalho, footer, carrinho, toast, styles.css e app.js. `card` e `posterImage` são os proprietários das grades. Capa e título abrem a ficha; Organizar abre dialog com Tenho, Quero ter e Já assisti. Preço aparece apenas quando `CinefitaCatalog.hasOffer` é verdadeiro. Suporte desconhecido é omitido no card, explicado na seção física. Sinopse, original, IMDb, compra e Ver aberto ficam na ficha.

`CinefitaCatalog` concentra busca e seleção; `curatedCollections` guarda textos e identificadores das quatro seleções. `CinefitaCollection` concentra armazenamento e marcações; collection-ui.js monta os controles pessoais e a navegação. Filtros e selects permanecem nativos: popup e teclado pertencem ao navegador/OS. Controles têm alvo de 44px, foco de 2px e afastamento de 3px; latão fica em ações e detalhes. Mensagens críticas permanecem inline.

`productPreview` vive apenas na edição física da ficha. Hover temporário e botão Ver aberto / Ver capa usam o mesmo estado, aria-pressed, Enter e Space. Transição de opacity/transform em 380ms; feedback 160ms. Disco decorativo completa uma volta em 16s, com Pausar / Retomar. Movimento reduzido mantém a arte estática, oculta pausa e faz trocas instantâneas. Scrollbars usam os tokens existentes e cores do sistema em forced-colors.

52 filmes: 41 registros anteriores com preços preservados e 11 acréscimos editoriais sem oferta. Todos têm direção, país, ano, título original, duração, sinopse e fontes. Os novos cartazes e procedência estão em assets/posters/editorial-sources.json; fontes de ficha em editorial-data.js. Os oito preços de referência anteriores mantêm 05/10/2026, IMDb mantém 20/09/2026. Não inventar edição, estado ou estoque. Embalagens geradas existentes são ilustrações genéricas, com prompts e originais em assets/products/.

## Do's and Don'ts

- Preserve marca, acervo, fontes de pesquisa e preferências explícitas de interação.
- Dê prioridade a cartaz, título, dados e ações; preço tem papel secundário.
- Mantenha dados e ações visíveis fora dos hovers.
- Use a serifa para expressão editorial e Manrope para tarefa.
- Não invente escassez, autenticidade, selos, edição ou fotografia de produto.
- Não recorte cartazes nem altere a moldura por gênero.
- Não transforme o retrô em ruído, envelhecimento artificial ou decoração de ingresso.
- Não afirme que a compra ou a prévia de foto produz operação real.

## Artes da galeria

A galeria usa `posterArtwork` quando uma alternativa foi selecionada. O catálogo,
a ficha e a embalagem ilustrativa continuam usando `artwork`. Em 07/10/2026,
25 cartazes alternativos foram selecionados por composição, orientação vertical
e correspondência ao filme, com procedência em `assets/posters/alternatives/sources.json`.
A imagem ampliada deve corresponder à miniatura, conter o título acessível e
oferecer a fonte externa quando cadastrada. Nenhuma imagem é ampliada além
da resolução original ao gerar as versões locais.
