---
version: alpha
name: Cinefita
description: 'Cinemateca editorial: cartazes completos, curadoria e memória afetiva pelo cinema.'
colors:
  background: '#13161B'
  surface: '#20262F'
  text: '#F4F1EA'
  primary: '#E85B53'
  on-action: '#13161B'
  muted: '#B8BEC8'
  divider: '#39414D'
  control-border: '#78818F'
  selected: '#303843'
  danger: '#FFB4AB'
  frame-rim: '#78818F'
  frame-mat: '#13161B'
typography:
  display:
    fontFamily: 'Manrope, Arial, sans-serif'
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
  page-max: '1440px'
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

## Direção atual — cinema contemporâneo e imersivo

Em 09/10/2026 o usuário aprovou o experimento da inicial, pediu uma versão mais extravagante e depois autorizou aplicar o design ao restante do site, desacelerando as imagens. A direção atual atende às nove páginas: início, catálogo, coleções, Minha coleção, ficha, galeria, revitalização, carrinho e compra demonstrativa. Preservar nome, logo original, cartazes, textos do acervo e contratos de interação. O backup completo permanece em `/Users/Admin/Desktop/cinefita-5-backup-2026-10-09`.

Público: pessoas que exploram clássicos e colecionam cinema físico. Locale pt-BR. O site continua estático e demonstrativo, sem conta, cobrança, publicação ou envio de pedido/foto. Minha coleção continua local ao navegador, sem sincronização entre dispositivos.

## Tokens e proprietários

Modelo B: `styles.css :root` é a fonte dos tokens globais, espelhados no frontmatter acima. `site-theme.css`, carregado depois, possui composição, tipografia e movimento compartilhados; não mantém outra paleta. `body.site-contemporary` é aplicado em todas as rotas e seus overlays. `home-contemporary` identifica somente a inicial; não é um tema independente. `site-motion.js` é o controlador único e inicializa depois dos renderizadores existentes. Nenhum framework adicionado.

| Documento | CSS | Consumidores |
|---|---|---|
| background / surface | --bg / --ink | Carvão #13161B / painéis #20262F |
| text / muted | --cream / --muted | Branco quente #F4F1EA / apoio #B8BEC8 |
| primary / on-action | --yellow / --espresso | Vermelho #E85B53 / texto carvão em botões |
| divider / control-border | --line / --control-border | #39414D / #78818F |
| selected / danger | --selected / --danger | #303843 / #FFB4AB |
| typography.display | --font-display | Manrope, Arial, sans-serif |
| typography.sans / mono | --font-body / --font-data | Manrope / Roboto Mono |

Os aliases históricos yellow, cream e espresso permanecem para preservar os consumidores. Texto pequeno em superfícies e seleções usa branco quente; vermelho sinaliza borda e ação; foco usa branco quente para permanecer legível sobre o fundo animado. O scrollbar usa os mesmos tokens, também no documento via `html:has(.site-contemporary)`. Forced-colors conserva os padrões do sistema. O logo `assets/filmstrip.png` e sua cor não mudam.

## Tipografia e composição

Manrope 800 nos títulos principais, 700 nos cards e 400–600 na leitura; Roboto Mono nos metadados. Título da inicial 48–104px; demais páginas 44–80px, ficha 40–72px e títulos longos com reflow. Corpo 16px. Metadados e preço dos cards permanecem secundários; nenhuma informação exige hover.

Contêiner máximo 1440px, margens 48px no desktop e 20px até 900px. Cabeçalho compacto com marca, busca e carrinho, navegação abaixo. Até 900px, Menu acessível e busca visível. Cada página interna oferece “Pausar animações” antes do conteúdo; a inicial conserva o controle junto de Frankenstein.

Inicial: chamada original à esquerda e palco de destaques à direita, proporção 45/55. Texto precede arte até 900px. Frankenstein, Alien e Hellraiser aparecem nessa ordem, com cartazes completos, metadados existentes e links para as fichas. Frankenstein usa luz vermelha e caveira com pregos e parafusos, voltada à direita; Alien combina palco azulado com ovo escuro, fissura verde e névoa; Hellraiser traz uma única imagem do cubo aberto preto e dourado, com frestas vermelhas e correntes diagonais saindo do cubo. A arte permanece estática, sem giro. As três decorações são imagens geradas com fundo transparente, em assets/hero, preservando os cartazes e separação dos metadados e controles. Cléo permanece no acervo e na galeria. Somente anterior e próximo fazem navegação manual e circular, em setas de 44px nas laterais da arte, sem fundo, borda ou sombra, mantendo foco visível; não há seletores nomeados nem contador visual. A altura é reservada, inclusive para títulos, avaliação e mensagens; somente uma composição permanece acessível. Sem JavaScript, os três destaques aparecem em sequência. Quatro coleções em duas colunas desktop/uma móvel, seguidas de cinema brasileiro, novidades e galeria Alien/Cléo com texto separado.

Catálogo, seleções, Minha coleção e relacionados preservam a grade: quatro colunas acima de 1150px, três entre 901–1150px, duas entre 360–900px e uma abaixo de 360px. Coleções mantém apresentações com texto e tríptico em linhas no desktop, uma coluna móvel. Galeria preserva arte alternativa, legenda, ficha e ampliação. Cartazes completos em área 2:3 com contain, sem molduras ornamentais. Ficha amplia a arte em duas colunas acima de 900px e uma abaixo; sinopse, dados, organização e edição física mantêm seus lugares e contratos.

Revitalização, carrinho e compra usam superfícies sólidas para apoiar a tarefa, sem entradas animadas em campos ou resumos. Resumo antecede a conclusão no celular. Sticky de resumo começa abaixo do cabeçalho. Raios: imagens/controles 4px, painéis 6px. Rolagem natural, foco visível e alvos de 44px.

## Movimento desacelerado

Imagens e trípticos entram em **1400ms**, incluindo a arte da abertura, com atraso inicial de 180ms; textos e seções em 900ms. Curva `cubic-bezier(.25,.46,.45,.94)` distribui o deslocamento. Escalonamento de 120ms em grupos de até quatro; entrada lateral máxima de 100px desktop/48px até 900px. A direção vem do centro da caixa estável em relação ao centro da tela: esquerda/esquerda, direita/direita; diferença de até 24px é considerada central e recebe apenas 20px verticais. Uma camada interna recebe `translate` e opacidade; a caixa externa reserva espaço e recorta a entrada temporariamente. Itens ainda pendentes são recalculados após redimensionamento. Ao terminar, o recorte e a classe de entrada são removidos para liberar hover de até 4px em 450ms. Foco, pausa ou redução de movimento liberam conteúdo e recorte imediatamente.

O fundo compartilhado possui luzes radiais vermelha/azulada, feixe de projetor, órbita e textura estática; ciclos suaves de 28–36s. Halo da inicial em 18s; caveira flutua até 6px em 20s. Ciclos decorativos suaves, sem flashes. Camadas aria-hidden, sem interceptar cliques e com recorte local para impedir overflow decorativo. Não interceptar rolagem nem deslocar dimensões do layout.

Revelações acontecem uma vez por elemento via IntersectionObserver. MutationObserver registra cards recriados por busca/filtros, sem esconder os resultados já no viewport; remove observações de nós descartados. Rótulos, ações e formulários ficam prontos enquanto a imagem entra. Foco de teclado cancela a entrada do alvo imediatamente.

Pausar interrompe fundo, halo, caveira, ovo e parallax e revela conteúdo pendente. Retomar não repete entradas. A aba oculta suspende movimento. Preferência de redução é acompanhada durante a sessão e mantém tudo estático. Sem JavaScript, o fundo é estático e nenhum conteúdo é escondido por esta camada; a inicial mantém suas quatro coleções e sete cards em HTML. As páginas internas conservam seus fallbacks e renderização existentes. Parallax exclusivo da abertura, decorativo, limitado a 24px, acima de 900px e suspenso fora da tela, atualizado por requestAnimationFrame.

A prévia física pertence a `app.js` e aparece uma única vez, na arte principal da ficha. VHS, DVD e Blu-ray cadastrados reutilizam as ilustrações existentes; suporte desconhecido conserva somente o cartaz. O cartaz completo é o estado inicial. Hover abre temporariamente; o botão Ver aberto / Ver cartaz fixa a abertura, e fechar pelo botão prevalece até o ponteiro sair da prévia. `aria-pressed` representa abertura fixada; `aria-hidden` acompanha a arte realmente exibida. A troca reversível dura 600ms, dentro da mesma área 2:3; com pausa ou movimento reduzido é instantânea. A edição física conserva preço e compra, com link à exploração no topo. Cards e galeria não abrem embalagens.

Objetos da abertura: ovo oscila até 6px em 20s; fissura varia opacidade suavemente em 16s; névoa desloca em 28s. Caveira voltada à direita flutua até 6px em 20s. Cubo e correntes são uma composição raster única e estática, sem rotação, oscilação ou parallax. As imagens geradas preservam alpha; os antigos SVG decorativos ficam disponíveis para referência. Cartazes não são modificados. A classe hero-motion-running exige abertura visível, aba ativa e ausência de pausa/redução; somente .hero-slide.is-active executa seus ciclos. Sem JavaScript, essas camadas permanecem estáticas. Os objetos usam a altura existente do palco. Caveira, ovo e cubo foram ampliados e avançam parcialmente atrás dos cartazes, que ficam inteiros no primeiro plano. Somente o cartaz do destaque ativo inclina 10 graus no hover de mouse, com perspectiva de 900px e transição de 700ms; figura e decoração não recebem inclinação. Pausa, aba oculta e redução de movimento desativam esse efeito.

A troca de destaque usa somente opacidade, em 1400ms dentro do palco. Todos os cartazes e objetos da próxima composição são carregados antes da substituição; última escolha prevalece. Falha ou espera de mais de dez segundos conserva o destaque anterior e anuncia uma mensagem com opção de tentar novamente pelas setas. Pausa, redução de movimento e foco na composição finalizam a transição; novas escolhas pausadas funcionam instantaneamente. Não há avanço automático, gestos obrigatórios ou captura da rolagem. Feedback de tarefa permanece rápido, sem atrasar busca, formulário ou carrinho.

## Contratos e acervo

`card`, `posterImage` e `renderFilmDetail` permanecem em app.js. Busca/filtragem em catalog-core.js; seleções em collections-data.js + collection-ui.js; armazenamento em personal-collection.js. Dialog nativo para pôster e organização, carrinho com foco contido e Escape, toast compartilhado. Select e details nativos. URLs, chaves de armazenamento, dados, preços e serviços mantidos. Detalhes em UX-CONTRACT.md.

52 filmes e 47 cartazes; 41 registros anteriores com preços preservados e 11 acréscimos editoriais sem oferta. IMDb mantém 20/09/2026 e preços de referência 05/10/2026. Não inventar estoque, edição, escassez, autenticidade ou fotografia de produto. Galeria usa posterArtwork quando disponível; catálogo/ficha usam artwork. Miniatura e ampliação devem corresponder e informar procedência.

## Revisão e histórico

Designly orienta hierarquia, tipografia, composição e fidelidade da marca. AI Graphic Design mantém referências no Moodboard autorizado. Em 10/10, o usuário autorizou geração de imagens para substituir as decorações SVG por ovo, cubo aberto com correntes e caveira; foi usada a ferramenta integrada de geração, sem CLI/API. Prompts e arquivos em assets/hero/ARTES-GERADAS.md. Testes e evidências em VALIDACAO.md. A direção vinho/marfim/latão e Cormorant de 08/10 e o teste restrito à inicial foram substituídos pela autorização de expansão de 09/10. O backup e as capturas anteriores preservam a comparação. A expansão visual não autoriza publicação, backend ou login.
