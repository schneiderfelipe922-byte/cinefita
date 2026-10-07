---
version: alpha
name: Cinefita
description: 'Sala de acervo: cinema físico, composição editorial retrô e materiais contidos.'
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
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    rounded: '{rounded.DEFAULT}'
    padding: '10px 14px'
  card:
    backgroundColor: '{colors.surface}'
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

**Direção de 06/10/2026: Sala de acervo.** Redesign autorizado pelo usuário para combinar Designly e Frontend Design Premium com uma identidade retrô sofisticada. A referência é um programa de cinemateca e um livro de cinema: tinta vinho, títulos editoriais, dados de arquivo e objetos apresentados com moldura. A memória vem dos filmes; a sofisticação vem da proporção, do espaço e da clareza. Não simular papel envelhecido, ruído de VHS, ingressos ou autenticidade comercial.

Público presumido pelo conteúdo: pessoas interessadas em clássicos e objetos de cinema; não houve pesquisa de público. Locale pt-BR. O site continua um protótipo estático, com preços, entrega, compra e orçamento demonstrativos, conforme LEIA-ME.txt. Registro híbrido: início e galeria expressam a marca; catálogo, ficha, serviço, carrinho e compra priorizam consulta e conferência.

A assinatura preserva a preferência explícita do usuário de 04/10/2026: Frankenstein em moldura dupla e disco decorativo girando atrás da capa. O disco não identifica o suporte vendido. As 41 obras, fichas, fontes, valores, chaves do carrinho e imagens geradas de embalagens são preservados. Histórico: [relatório aprovado de setembro](relatorios/relatorio-design-cinefita-2026-09-27.html); pesquisa e imagens de 05/10/2026 em relatorios/interacoes-catalogo-2026-10-05/. A data do redesign não atualiza preços nem avaliações.

**Modelo B:** `styles.css :root` é o proprietário dos tokens em execução; este documento espelha os valores aceitos. Ambos mudam juntos. Sem framework, geração de tema ou segundo proprietário. Comportamento: [UX-CONTRACT.md](UX-CONTRACT.md). Direção e evidências deste redesign: relatorios/redesign-retro-2026-10-06/.

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

Cormorant Garamond 600, normal e itálica, cria a voz editorial. Fonte local WOFF2 de 23–24 KB por estilo, com acentos do português; licença e origem em assets/fonts/. Fallback Georgia. Manrope permanece para textos, títulos dos cards, preços e controles; Roboto Mono apenas para ano, suporte e etiquetas. Essas duas fontes mantêm o carregamento anterior com fallback local.

Hero 52–88px/1.02 no desktop, 58px no tablet e 48–64px no celular. O itálico marca uma palavra da chamada. Títulos de página 40–64px/1.08, 44px no celular; ficha 40–64px/1.08 e 42px no celular. Seções 32–44px/1.1. Cards 21px/1.3, peso 600, 20px no celular e 18px até 360px. Corpo 16px/1.55, introdução 16px/1.8; apoio 14px, dados 11–12px/1.5. Preço 24px, orçamento 28px e ficha 32px, com algarismos tabulares. Não truncar títulos. Títulos de formulários e dados técnicos usam Manrope para manter leitura funcional.

## Layout

Contêiner máximo 1320px. Margens mínimas 32px desktop e 16px mobile. Ritmo existente de 4, 8, 12, 16, 24, 32, 48 e 64px. Hero em duas colunas acima de 680px, uma abaixo. Moldura com objeto maior e ficha editorial alinhada à esquerda; capa e disco compõem um foco primário, chamada e ação são secundárias, metadados terciários.

Catálogo: três colunas acima de 1000px, duas entre 681 e 1000px, uma abaixo. As duas seleções do início têm quatro colunas acima de 1150px, duas entre 681 e 1150px, uma abaixo. Relacionados têm duas colunas desktop e uma mobile. As variantes alteram apenas a grade externa; o proprietário `card` continua compartilhado. Cada card segue arte → conteúdo → compra → ficha. Área de produto 4:3 em todos os cards, com imagem integral e geometria estável. Cards da mesma linha alinham ações sem truncar conteúdo. Obras FILME usam a mesma área reservada com cartaz, sem presumir embalagem.

Galeria conserva quatro colunas desktop, três até 1000px, duas até 680px e cartazes 2:3. Ficha em duas colunas acima de 680px, uma abaixo; o palco do produto permanece quadrado e limitado a 360px no celular. Cabeçalho mobile de três linhas mantém busca, carrinho e navegação acessíveis. Rolagem reserva 124px para foco no cabeçalho de duas linhas do tablet e 160px no mobile. Gêneros usam h2; títulos dos cards usam h3. Filtros inicialmente recolhidos; chips ativos ficam fora do painel. Documento usa rolagem natural. Resumo antecede conclusão no DOM mobile; desktop o posiciona ao lado.

## Elevation & Depth

Hierarquia por tom, tipografia, espaço e divisória. Cards planos, sem sombra ou elevação de hover no card inteiro. A arte recebe passe-partout e aro com contorno interno; galeria e ficha podem conservar sombra discreta. No início, a moldura dupla é a exceção expressiva: superfície tonal, sem degradê e sem ano gigante decorativo. Sombra da capa evidencia o objeto. Não aplicar textura sobre leitura. Carrinho escurece a página com overlay; galeria usa modal nativo.

## Shapes

Imagem e controle 4px; painel 6px. Pílulas apenas em filtros e contadores. `.poster-frame` é o proprietário do aro e passe-partout compartilhados. Galeria e cartaz ampliado usam 2:3; cards usam 4:3 para capa e abertura horizontal; ficha usa 1:1 no produto. Arte com `contain`, nunca cortar lettering. Mesma geometria entre gêneros. A moldura dupla do destaque é uma variante editorial documentada.

## Components

CTA principal sólido em latão; ação Adicionar dos cards usa contorno e texto em latão, preenchendo no hover ou foco. Assim as capas lideram o catálogo sem 41 ações preenchidas concorrentes. CTA da ficha, carrinho e conclusão mantém preenchimento. Link editorial sublinhado para pôsteres, ficha e fontes. Foco visível 2px com afastamento 3px; controles de tarefa com alvo mínimo 44px. Hover e estado pressionado não escondem texto nem preço. Ícones SVG de traço 1.8px, 20–24px; estrela de avaliação é exceção.

As sete páginas reutilizam styles.css e app.js. `productPreview` é o proprietário de capa/embalagem em início, catálogo e ficha; botão nativo Ver aberto / Ver capa, separado da moldura por 8px para manter o contorno de foco claro, `aria-pressed`, Enter e Space. Hover abre temporariamente com pointer fine/hover hover. Capa gira até -72° e a embalagem entra em 380ms, usando opacity/transform e easing `cubic-bezier(.2,.7,.2,1)`. Texto e preço permanecem visíveis. Movimento reduzido faz troca instantânea. Não animar geometria de layout. Feedback de controles 160ms, ease. Disco completa uma volta em 16s, linear; botão Pausar / Retomar interrompe na posição atual. É decorativo e aria-hidden. Movimento reduzido mantém disco estático e oculta a pausa. Scrollbars globais usam tokens de trilho, thumb, hover e ativo, com forced-colors nativo.

Busca, filtros, ordenação, URLs, retorno da ficha, cartaz ampliado e carrinho mantêm seus proprietários existentes. Validação tem mensagens associadas, aria-invalid, valores preservados e foco no primeiro erro. Select e details permanecem nativos. Não criar componentes paralelos para mudar aparência.

As 41 fichas trazem direção, ano, título original, sinopse, duração de referência e fontes. Não inventar edição, estado, estoque ou suporte de itens FILME. Os 33 preços anteriores são preservados; oito novos preços de referência continuam datados de 05/10/2026. IMDb continua estático, consultado em 20/09/2026.

**Ativos preservados:** 23 capas melhoradas por referências de Wikimedia Commons, Wikipedia, IMP Awards e Posteritati; as outras dez mantêm a referência anterior otimizada. Versões locais até 360px/900px sem ampliar origem, documentadas em assets/posters/sources.json. Oito novos cartazes em expansion-sources.json. Nenhum cartaz é foto do exemplar físico. Três embalagens abertas foram geradas com image_gen, WebP 1000px, 55–79 KB, com originais/prompts em assets/products/. O site usa VHS e Blu-ray; DVD fica preparado para futura edição cadastrada. A capa real é aplicada por HTML ao mockup genérico. Mostrar EMBALAGEM ILUSTRATIVA; não alegar que representa digipak, extras ou estoque de uma edição.

## Do's and Don'ts

- Preserve marca, acervo, fontes de pesquisa e preferências explícitas de interação.
- Dê prioridade a título, arte, suporte, preço e conferência.
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
