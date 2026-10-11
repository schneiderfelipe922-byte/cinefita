# Validação — 09/10/2026

Escopo final: redesign editorial, 52 filmes, quatro curadorias, filtros e organização local. Login, Supabase e Resend foram adiados a pedido do usuário. O ambiente de validação é HTTP local; não houve publicação.

## Setas sem caixa, inclinação do cartaz e artes ampliadas — 10/10/2026

As setas laterais ficaram transparentes, sem borda ou sombra; os alvos de 44px e o foco acessível foram preservados. Somente o cartaz ativo inclina no hover de mouse. Caveira, ovo e cubo foram ampliados e ficam parcialmente escondidos pelos cartazes completos. O cubo continua estático. Alteração restrita à composição da inicial e contratos, preservando o backup e as artes originais.

- 32 testes existentes passaram, sem falhas.
- 12 combinações em 360, 768, 1024 e 1440px: zero rolagem horizontal, cartazes carregados com contain, uma composição ativa e setas de 44px com fundo transparente e borda zero. Altura estável por largura; diferença inferior a 1px em 360px entre destaques.
- Hover verificado no navegador: rotação apenas no cartaz; figura e decoração sem rotação. Hellraiser conserva animation:none. Ao pausar, a inclinação computada volta a none. Redução de movimento dinâmica permanece coberta pelos testes do controlador e regra CSS; a preferência do sistema não foi alterada nesta rodada.
- DESIGN.md validado com zero erros e avisos; git diff --check sem erros. Auditoria strict dos fontes de runtime da raiz mantém os 100 apontamentos affordance.actionless-button já registrados, sem novos tipos. O reconhecimento de listeners nativos/delegados permanece limitado; não representa aprovação automática.
- Capturas dos três destaques em desktop e celular, hover, auditoria e matriz em relatorios/ajustes-palco-2026-10-10. Não foi repetida a matriz de zoom de 200% nesta alteração; a rodada anterior está registrada abaixo.

## Navegação somente por setas laterais — 10/10/2026

Removidos os três seletores nomeados e o contador visual, conforme pedido do usuário. Anterior/próximo ficam ao lado da área de arte, em espaço reservado, com alvos de 44px. Pausa e anúncios de status continuam disponíveis. O controlador não depende mais dos seletores; navegação circular, preloading, falha/timeout e proteção de escolhas rápidas permanecem.

- 32 testes passaram com fixture sem seletores, preservando os casos de estado e recuperação.
- Browser: Enter em próximo abre Alien; Espaço em anterior retorna a Frankenstein. Conferência em 360, 768, 1024 e 1440px sem overflow, setas alinhadas à arte e zero seletores no DOM. Evidências: setas-desktop.png, setas-celular.png e setas-responsivas.json em relatorios/artes-geradas-2026-10-10.
- Auditoria strict dos fontes de runtime: 100 apontamentos affordance.actionless-button; três a menos por remoção dos seletores, sem outro tipo. Limitação do reconhecimento de listeners já documentada; não é aprovação automática. Dados, cartazes e demais rotas não alterados.

## Artes geradas, correntes saindo do cubo e caveira à direita — 10/10/2026

A pedido do usuário, geradas imagens com a ferramenta integrada: ovo de Alien a partir da referência, cubo aberto de Hellraiser combinado com correntes diagonais a partir das duas referências, caveira com pregos e parafusos. Após a correção solicitada, a caveira foi gerada voltada para a direita. PNG RGBA com alpha preservado, copiados para assets/hero; originais e versões anteriores mantidos. Prompts em assets/hero/ARTES-GERADAS.md.

- 32 testes passaram; sintaxe de site-motion.js e git diff --check sem erros. Parallax usa agora o nome neutro --prop-shift, acompanhando a caveira; cubo não participa do deslocamento.
- 12 combinações da abertura em 360, 768, 1024 e 1440px: imagens carregadas, cartazes completos com contain, uma composição acessível, zero overflow horizontal. Alturas constantes e iguais às anteriores: 755,58 / 980,66 / 780,70 / 896,59px. Capturas desktop/celular dos três destaques em relatorios/artes-geradas-2026-10-10.
- Runtime confirmou caveira com flutuação de 20s e pausa quando inativa. Hellraiser usa uma única imagem: animation:none e transform:none, sem disco, faces CSS 3D ou correntes de moldura no DOM. Seleção por teclado, últimas escolhas e pausa continuam funcionando. Evidência: movimento-runtime.json.
- Auditoria Premium strict dos fontes de runtime da raiz: mesmos 103 apontamentos affordance.actionless-button, sem novos tipos. O detector não reconhece listeners nativos/delegados, como registrado nas rodadas anteriores; não é aprovação automática. DESIGN.md validado com zero erros e avisos.
- As artes antigas SVG e a caveira na orientação anterior continuam guardadas, mas não são usadas na abertura. Cartazes, preços, dados e demais páginas preservados. Nenhuma publicação. Não foi repetida a matriz de zoom de 200% ou inspeção física de toque nesta troca de assets; a rodada anterior permanece registrada abaixo.

## Ovo de Alien e cubo com correntes de Hellraiser — 10/10/2026

Rodada restrita à abertura: Frankenstein mantém o disco; Alien recebe ovo orgânico, fissura verde e névoa; Hellraiser substitui Cléo somente no terceiro destaque. Cléo permanece nas novidades, no acervo e na galeria. SVG e CSS 3D nativos, sem framework, geração paga ou alteração das artes existentes.

- **32 testes passaram**. Acrescentados carregamento/falha dos objetos decorativos e controle dos ciclos por pausa, visibilidade da abertura, aba oculta e redução de movimento. Casos anteriores de navegação circular, escolhas rápidas, falha/timeout, foco, embalagem, filtros e armazenamento continuam passando. Sintaxe de site-motion.js e git diff --check sem erros; DESIGN.md validado com zero erros e avisos. Sem build configurado.
- **12 combinações na abertura**: três destaques em 360, 768, 1024 e 1440px. Uma composição acessível, imagens carregadas, cartazes completos com contain e ausência de rolagem horizontal. Altura idêntica nos três destaques em cada largura: 755,58 / 980,66 / 780,70 / 896,59px, igual à rodada anterior. Caixas das correntes não intersectam a área efetivamente ocupada pelo cartaz. Evidência: matriz-destaques.json.
- Navegador: anterior/próximo circular, Espaço/Enter nos seletores, última escolha Hellraiser em seleção rápida Alien→Hellraiser e link para sua ficha conferidos. Os metadados de Hellraiser vêm do cadastro existente: 1987, Clive Barker, VHS e 6,9 no IMDb. Sem novos preços ou dados.
- Ciclos computados em runtime: Alien 20s/16s/28s; Hellraiser 20s/48s/28s. Pausa interrompe os novos elementos; destaque inativo fica parado. Fora da abertura, hero-motion-running é removida e todos os ciclos novos pausam. Aba oculta e preferência dinâmica de redução também cobertas pelos testes. Evidência: movimento-runtime.json.
- **Zoom nativo de página 200% no Safari confirmado**: Alien e Hellraiser selecionáveis, arte ampliada acessível pela rolagem natural e controles separados. Ovo, cubo e folga das correntes conferidos nas capturas de arte; não há certificação de aparelho físico ou matriz completa de zoom em todas as rotas. Zoom restaurado e aba temporária fechada. Capturas alien-arte-zoom-200.png, hellraiser-arte-zoom-200.png e hellraiser-zoom-200.png.
- Sem scripts, fixture sandbox confirma Frankenstein/Alien/Hellraiser visíveis em sequência, links funcionais e todos os novos ciclos sem animação. Evidência: sem-javascript.json. A preferência do sistema operacional não foi modificada.
- **Auditoria Premium strict: 103 apontamentos**, todos affordance.actionless-button, exatamente o total anterior. O detector não reconhece listeners nativos/delegados; controles foram conferidos em runtime. A auditoria não passou automaticamente. Mesmo filtro de fontes de runtime na raiz, conforme limitação já documentada. Resultado bruto: auditoria-runtime.json.
- Revisão das capturas conforme **Composition Director e Visual QA do Designly**: hierarquia da chamada e cartaz preservada; objetos reconhecíveis, à direita e parcialmente atrás da arte; correntes restritas à área visual; metadados/controles separados; cartazes completos e estados selecionados legíveis. Refinados textura do ovo, posição dos objetos e folga do cartaz de Hellraiser. Não há substituição dos cartazes.
- **AI Graphic Design:** oito referências antes/depois adicionadas ao Moodboard autorizado: Alien e terceiro destaque em desktop 1440×1180 e celular 360×900. Uploads confirmados e identificadores em canvas-assets.json, sem geração paga. A sessão integrada renovada ainda retorna “session expired”; não foi possível inspecionar o canvas pelo navegador integrado. [Moodboard](https://superdesign.dev/teams/1d1bc809-60a7-44b1-9242-1880b7006cad/projects/ae2d0565-faa6-4095-aba0-658b6a7953e6).
- Comparação com o início desta rodada: **227 arquivos verificados**, somente index.html, site-theme.css e site-motion.js alterados entre os fontes/ativos existentes monitorados. Cartazes, dados, preços, armazenamento e demais páginas mantidos; quatro SVG decorativos novos. Backup original preservado. Evidência: preservacao.json.

Contratos reconciliados em DESIGN.md, UX-CONTRACT.md e README.md. Evidências em relatorios/objetos-destaques-2026-10-10/. Sem publicação, backend ou login.

## Movimento corrigido, embalagem no topo e três destaques — 10/10/2026

Esta rodada substitui as entradas alternadas e o destaque único descritos no histórico abaixo. Implementação nativa em `site-motion.js`, `site-theme.css` e `app.js`, sem dependências novas.

- **30 testes passaram** em `node --test tests/*.test.cjs`. Além dos casos existentes, cobrem direção real em grades 2/3/4 e itens centrais, redimensionamento de alvos pendentes, foco na abertura e no controle de embalagem, três destaques manuais/circulares, última escolha com carregamentos fora de ordem, falha de imagem, timeout de dez segundos, cancelamento de escolha pendente, pausa, hover temporário, fixação, fechamento durante hover e suporte desconhecido. VHS, DVD e Blu-ray reutilizam ativos locais existentes.
- Sintaxe de `app.js` e `site-motion.js` e `git diff --check`: sem erros. Sem build configurado.
- **36 combinações de navegador**: nove páginas em 360, 768, 1024 e 1440px, todas com o tema e Manrope ativos, sem rolagem horizontal. Grade de catálogo medida em 2/2/3/4 colunas. Na grade de três, o centro recebe `0px`; nas quatro, duas entradas de cada lado. A caixa externa não anima, os filhos recebem a entrada e o recorte temporário está ativo. Evidências: `matriz-responsiva.json` e `direcoes-grades.json`.
- Os três destaques foram medidos em cada largura: altura constante dentro de cada viewport (755,58 / 980,66 / 780,70 / 896,59px), cartazes com contain e uma composição acessível após a troca. Navegação circular, seleção por Enter, escolhas rápidas e pausa durante a troca funcionaram. A nota do IMDb permanece apenas onde cadastrada; Alien e Cléo não recebem avaliações inventadas. Evidência: `destaques-responsivos.json`.
- Frankenstein: Enter abre e Espaço fecha; mouse abre temporariamente, botão fixa, sair mantém a fixação, fechar prevalece sobre hover até sair. Transição computada de 600ms, ou nenhuma quando pausada; palco de 780px no desktop e 480px em 360px, sem deslocamento entre estados. Uma única prévia na ficha. Blu-ray de A Hora da Zona Morta também abriu/fechou por teclado; “Explorar embalagem no topo” deslocou e devolveu foco ao botão. Alien, sem suporte físico conhecido, conserva cartaz completo sem embalagem.
- Busca por Frankenstein mostrou um resultado imediatamente, sem classes de entrada. Menu móvel abriu por Enter e fechou por Escape. Organização pessoal abriu, salvou Quero ter e fechou devolvendo foco; a marcação foi desfeita. Compra de A Hora da Zona Morta abriu o carrinho com R$ 169,90, e remover devolveu carrinho vazio e conclusão desabilitada. Dados de teste restaurados. Nenhum erro de JavaScript nos logs conferidos.
- Safari nativo com **zoom de página 200% confirmado**: inicial reorganizada, busca/menu visíveis e seleção de Alien funcional; ficha com abertura da embalagem funcional. Capturas `inicial-zoom-200.png` e `ficha-zoom-200.png`. Zoom restaurado e abas temporárias encerradas. Não foi feita certificação de zoom em todas as páginas nem teste em aparelho físico; ativação móvel foi exercitada por clique e teclado em viewport estreito, sem emulação de toque.
- Sem JavaScript: fixture com scripts bloqueados confirmou os três destaques em sequência e seus links, controles interativos ocultos, zero alvos pendentes e fundo estático. Evidência: `sem-javascript.json`. Redução de movimento inicial/dinâmica está coberta pelos testes do controlador e CSS; a preferência do sistema operacional não foi alterada.
- Auditoria Premium strict, limitada aos fontes de runtime na raiz como nas rodadas anteriores: **103 apontamentos `affordance.actionless-button`**, nenhum outro tipo. Cinco adicionais são anterior/próximo e três seletores. O scanner só reconhece eventos inline; esses botões usam listeners nativos e foram exercitados no navegador. A auditoria **não passou automaticamente**; resultado bruto em `auditoria-runtime.json`.
- Revisão das capturas pelos critérios de composição, tipografia e Visual QA do **Designly**: chamada e cartaz organizam a hierarquia, imagens completas, textos e controles separados, títulos legíveis, cores da marca preservadas e estados selecionados visíveis. Ajustados reserva de altura para avaliação/mensagens, título móvel de Cléo e foco durante entradas. O fundo animado continua atrás do conteúdo. Não há geração ou substituição de cartazes.
- **AI Graphic Design**: quatro referências antes/depois da inicial, em desktop 1440×1000 e celular 360×900, adicionadas ao Moodboard autorizado. Identificadores e URLs em `canvas-assets.json`; nenhuma geração paga. O link integrado renovado ainda mostrou sessão expirada. Uploads confirmados pelo CLI, sem alegar inspeção do canvas. [Moodboard](https://superdesign.dev/teams/1d1bc809-60a7-44b1-9242-1880b7006cad/projects/ae2d0565-faa6-4095-aba0-658b6a7953e6).
- Comparação de **215 arquivos** de assets, dados, curadoria, busca e armazenamento com o backup: nenhum alterado. Evidência `preservacao.json`. Backup preservado em `/Users/Admin/Desktop/cinefita-5-backup-2026-10-09`.

Todas as evidências desta rodada ficam em `relatorios/movimento-destaques-2026-10-10/`. Contratos atualizados em DESIGN.md, UX-CONTRACT.md e README.md. Sem publicação, backend ou login.

## Verificações executadas

### Refinamento Designly / AI Graphic Design — 09/10/2026

55 verificações de largura (11 estados em 320, 390, 768, 1024 e 1440px), sem rolagem horizontal. Colunas do catálogo preservadas: 1/2/2/3/4. Destaque medido em 577,8px de altura em 1440px, ante 710,8px. Revisão visual independente com Visual QA, Composition Director e Typography Director não apontou defeitos críticos nas três capturas finais. Menu e Organizar foram abertos por Enter e fechados por Escape, com foco devolvido ao controle. Os sete testes passaram novamente e git diff --check permaneceu limpo; documento de design validado com zero erros e avisos. Evidências em relatorios/designly-2026-10-09/. Canvas Moodboard do Superdesign recebeu referências da abertura anterior e revisada; não houve geração paga ou mudança nos cartazes originais. [Canvas de referências](https://superdesign.dev/teams/1d1bc809-60a7-44b1-9242-1880b7006cad/projects/ae2d0565-faa6-4095-aba0-658b6a7953e6).

- `node --test tests/catalog.test.cjs`: **7 testes passaram**. Acervo e ativos locais, filtros combinados e codireção, preços ausentes no fim das duas ordenações, marcações independentes, persistência/remoção, falha de armazenamento, alterações entre abas e retorno local seguro.
- Sintaxe JavaScript e `git diff --check`: sem erros.
- Linter oficial `@google/design.md` 0.4.0: **0 erros e 0 avisos**. Paleta e famílias tipográficas preservadas; tokens de execução pertencem a styles.css.
- Navegador: 10 estados de páginas em **320, 390, 768, 1024 e 1440px**, total de 50 verificações de largura. Nenhuma rolagem horizontal do documento. Grade de catálogo: 1/2/2/3/4 colunas respectivamente.
- Catálogo: década 1970 + John Carpenter + Estados Unidos retorna Halloween; retorno da ficha e recarga mantêm filtros. Busca sem resultado, limpar busca, limpar filtros e seletor nativo de país por teclado funcionaram.
- As 52 fichas foram abertas no navegador: título, seção física e três marcações presentes, sem texto indefinido; exatamente onze sem compra. Endereços inválidos de filme e seleção mostraram saídas úteis.
- Organização: Tenho e Já assisti independentes, recarga preserva opções; diálogo fecha por Escape e devolve foco a Organizar. Minha coleção filtra, informa vazio e atualiza contadores. Alterações e remoções apareceram em outra aba do mesmo navegador. Dados de teste foram removidos pelos controles da interface.
- Pôsteres: a ampliação de Psicose usa a mesma arte alternativa da miniatura, apresenta fonte e devolve foco após Escape.
- Edição física: Ver aberto de Frankenstein funciona por Enter; compra fica na ficha. Os onze filmes sem oferta não recebem preço, compra ou embalagem. Preço do card medido em Manrope 14px, cor secundária e fundo transparente; nenhum botão de compra nos cards.
- Carrinho: adicionar filme e serviço, quantidade, subtotal e navegação para compra funcionaram. Compra demonstrativa mostrou erros associados, focalizou primeiro campo inválido, ativou/desativou endereço e concluiu sem cobrança, limpando carrinho.
- Revitalização: formato/serviço atualizam orçamento. Arquivo inválido mostra erro; PNG válido recupera a prévia local com aviso de ausência de envio.
- Menu mobile: Enter abre navegação; Escape fecha e devolve foco. Pausa do disco confirmou animation-play-state paused e aria-pressed true.

## Auditoria estática e limites

Superdesign: conexão e uploads concluídos pelo CLI oficial, com identificadores de referência retornados. A abertura no navegador do agente apresentou "This canvas session has expired", inclusive após renovar o link. O link permanente foi entregue para a conta conectada; não se afirmou aprovação visual do canvas nem geração de um novo draft. A revisão visual do site foi feita sobre as capturas locais e o navegador local.

O auditor de Frontend Design Premium foi executado em modo strict. A varredura integral também alcançou cópias históricas e páginas de terceiros guardadas em relatorios/, fora do código servido. Uma segunda varredura sobre cópia dos arquivos atuais isolou **83 ocorrências exclusivamente de affordance.actionless-button**: essa regra reconhece eventos inline no HTML, mas não reconhece os listeners e a delegação de eventos de app.js e collection-ui.js. Esses controles têm handlers compartilhados; os fluxos foram conferidos no navegador. O resultado bruto não foi apresentado como aprovação automática. Relatório local em relatorios/redesign-editorial-2026-10-08/auditoria-live.json.

Movimento reduzido e forced-colors conservam regras específicas no CSS; a preferência do sistema não foi alterada durante os testes. Reflow em navegador desktop não substitui teste em aparelho físico ou certificação de acessibilidade. Sem backend, não se aplicam testes de sessão, códigos, rede de marcações, duas contas ou sincronização entre navegadores/dispositivos.

## Evidências visuais

Capturas locais em relatorios/redesign-editorial-2026-10-08/: inicio-desktop.jpg, catalogo-desktop.jpg e colecao-mobile.jpg. DESIGN.md, UX-CONTRACT.md, README.md e LEIA-ME.txt descrevem o comportamento atual e a decisão de manter Minha coleção sem login.
# Inicial contemporânea — 09/10/2026

- 13 testes passaram em `node --test tests/*.test.cjs`: sete do acervo/persistência/retorno e seis do controlador de movimento. Cobrem pausa, retomada sem repetição, redução de movimento inicial e alterada durante a sessão, desktop/mobile, aba oculta, abertura fora da tela, coalescência de frames, limite de 24px, revelação por teclado e ausência de IntersectionObserver.
- `node --check` passou para app.js e home-motion.js; `git diff --check` passou. Projeto estático, sem etapa de build ou typecheck configurada.
- Navegador integrado em 360, 768, 1024 e 1440px: zero rolagem horizontal, abertura em uma coluna até 900px, coleções 2/1 e busca móvel com largura completa. Imagens completas com contain e dimensões reservadas; nenhuma ação depende de hover.
- Fluxos exercitados: menu móvel com Escape; busca Alien, limpar com retorno de foco e URL do catálogo; abertura da seleção Horror dos anos 80; ficha de Frankenstein e retorno à inicial; marcar/desmarcar Quero ter e Escape com foco em Organizar Halloween; adicionar Frankenstein, persistir entre páginas, aumentar/diminuir quantidade e remover, retornando ao carrinho vazio com conclusão desabilitada. Estado de teste do carrinho e marcação foi restaurado.
- Catálogo e ficha mantêm fundo `rgb(33,23,26)` e direção editorial; overlays na inicial usam superfície `rgb(32,38,47)`. Nenhum HTML das outras rotas nem ativos do acervo foi alterado.
- Sem JavaScript: iframe com sandbox bloqueando scripts confirmou quatro coleções, sete cards, links presentes e disco estático. Fixture reproduzível em relatorios/experimento-inicial-2026-10-09/sem-javascript.html.
- Safari nativo: zoom de página 200% confirmado nos ajustes do site, conteúdo reorganizado em uma coluna e links de ação legíveis. Captura local safari-zoom-200.png; zoom restaurado e aba de teste encerrada.
- Redução de movimento foi verificada pelos testes de estado do controlador e pela regra CSS existente que desliga animações/transições. A preferência do sistema operacional não foi alterada.
- Contraste calculado: texto/fundo 16,07:1; apoio/superfície 8,14:1; botão carvão/vermelho 5,23:1. Texto pequeno em overlays e footer usa branco quente; vermelho sobre superfície fica restrito a detalhes de interface com contraste acima de 3:1.
- Auditoria Premium em modo strict: 90 alertas `affordance.actionless-button`; baseline do backup: 83 alertas da mesma regra. O scanner reconhece somente handlers inline e não identifica addEventListener ou delegação. Os sete novos alertas correspondem aos botões Organizar pré-renderizados, que usam o controlador existente e foram verificados em runtime. Nenhum alerta em home-theme.css ou home-motion.js; sem outros tipos de finding. A auditoria **não passou automaticamente**. Relatórios brutos preservados na pasta de evidências.
- Escopo da auditoria: todos os HTML, CSS e JS de runtime na raiz. A varredura global foi interrompida porque o parser ficou preso em um script histórico ignorado pelo Git dentro de relatorios; a mesma implementação de auditoria foi executada com filtro de fontes da raiz, sem alterar suas regras.
- Revisão Designly das capturas reais: marca e artes preservadas; Frankenstein como âncora da abertura; separação clara entre texto e imagens; cartões sem molduras ornamentais; títulos completos; adaptação móvel e contraste conferidos. Ajustes de rolagem lateral, busca móvel e contraste em superfícies foram feitos antes da entrega.
- Canvas autorizado pelo usuário: Moodboard, com capturas de referência antes/depois em desktop 1440px e celular 360px, sem geração paga. Link registrado em relatorios/experimento-inicial-2026-10-09/comparacao.md.
- Limitação do canvas: uploads confirmados com identificadores no arquivo canvas-assets.json, mas a abertura integrada continuou mostrando sessão expirada após uma renovação do link. O link normal e todas as capturas locais foram preservados.


### Revisão extravagante da inicial — 09/10/2026

A pedido do usuário, acrescentados fundos decorativos animados (luzes vermelha/azulada, feixe de projetor e órbita), halo de Frankenstein e entradas laterais alternadas. Conferência de composição e tipografia conforme Designly: fundo atrás do conteúdo, hierarquia preservada, cartazes inteiros, texto antes da arte no celular. Os fundos são CSS nativo; não houve geração paga.

- 14 testes passaram, incluindo liberação do transform após a entrada para permitir hover de 4px; os testes anteriores seguem cobrindo pausa, redução de movimento inicial/dinâmica, parallax e teclado.
- Navegador: 360, 768, 1024 e 1440px, sem rolagem horizontal; entradas de 48px/100px confirmadas por estilo computado.
- Pausa: todos os sete planos decorativos/disco com estado pausado, nenhum conteúdo pendente oculto. Retomada sem repetir entradas.
- Menu móvel abre/fecha; carrinho acessível. Todos os cartazes carregados nas capturas completas desktop/móvel.
- Sem JavaScript: conteúdo visível e fundo com animation-name none, conferido no iframe com scripts bloqueados.
- Auditoria estática do runtime: os mesmos 90 apontamentos affordance.actionless-button da rodada anterior, sem novos apontamentos. A limitação do detector de eventos já está documentada acima; o resultado strict não é aprovação total.
- Capturas extravagante-desktop.png e extravagante-celular.png adicionadas como referências ao Moodboard autorizado; originais antes/depois preservadas.

A verificação de zoom de 200% da rodada anterior permanece registrada acima; não foi repetida nesta revisão de movimento. Backup, demais páginas, cartazes, dados e contratos continuam preservados.

### Tema compartilhado e movimento mais lento — 09/10/2026

O usuário autorizou a expansão para todas as páginas e pediu desaceleração das imagens. Esta rodada substitui o escopo restrito à inicial das seções históricas acima. O tema agora usa `site-theme.css` e `site-motion.js`; cores e tipografia globais pertencem a `styles.css :root`. Cartazes entram em 1400ms, Frankenstein em 1800ms, textos em 900ms, escalonamento em 120ms e disco em 32s. Fundos têm ciclos de 28–36s. Hover continua limitado a 4px.

- 17 testes passaram: sete do acervo e dez de movimento. Novos casos verificam páginas internas sem abertura, remoção de observadores de cards descartados, resultados de filtros imediatamente visíveis e foco durante a entrada de imagens. Redução de movimento inicial/dinâmica, pausa, parallax e retomada seguem cobertos.
- `node --check` passou para app.js e site-motion.js; `git diff --check` passou. Sem build ou typecheck configurado.
- As nove páginas foram conferidas em 360, 768, 1024 e 1440px: 36 combinações sem rolagem horizontal, todas com tema e Manrope ativos. Matriz em `relatorios/tema-global-2026-10-09/matriz-responsiva.json`. Textos e controles principais também foram inspecionados quanto a overflow em 360px.
- Pausar/retomar foi exercitado em todas as páginas: ciclos decorativos pausados, nenhum conteúdo pendente oculto e retomada sem repetição. Evidência em `pausa-por-pagina.json`. Menu do catálogo abriu por Enter e fechou por Escape em 360px.
- Busca por Frankenstein retornou um resultado visível sem repetir a entrada; organização pessoal abriu o diálogo e Minha coleção refletiu a marcação. Marcação de teste foi desfeita. Galeria abriu a arte alternativa de Psicose; Escape devolveu foco ao cartaz.
- Ficha adicionou Frankenstein ao carrinho; quantidade 2 produziu R$ 169,80 e navegação para compra preservou o item. Em 360px, validação vazia exibiu erros de nome/e-mail e focou o primeiro campo; entrega em domicílio exibiu endereço e custo de R$ 19,90 sem overflow. Item de teste removido depois, retornando ao carrinho vazio. Nenhuma compra concluída.
- Revitalização: seleção de Cassete e restauração completa atualizou o resumo para R$ 149,90. Formatos usam uma coluna em telas estreitas; formulário e resumo não recebem entradas laterais.
- Safari nativo: zoom de página 200% confirmado para o catálogo, com cabeçalho reorganizado, busca visível e título legível. Captura `catalogo-zoom-200.png`; zoom restaurado e aba temporária encerrada. Esta rodada não certifica zoom em todas as nove páginas nem aparelho físico.
- Sem JavaScript: fixture com sandbox confirmou quatro coleções, sete cards, zero alvos ocultos e fundo estático (`animation-name: none`). As páginas internas conservam a renderização e os fallbacks existentes. Preferência do sistema operacional não alterada; redução de movimento verificada por testes e CSS.
- Revisão visual conforme Designly das capturas reais de catálogo, ficha, galeria, coleções e revitalização: títulos fortes e consistentes, artes completas sem molduras decorativas, texto separado das imagens e formulários legíveis em superfícies sólidas. Ajustados foco, placeholder, opções de formato móveis e contraste de texto pequeno sobre superfícies.
- Auditoria Premium strict do runtime: 98 apontamentos, todos `affordance.actionless-button`; oito adicionais correspondem aos controles de pausa das páginas internas. O detector não reconhece os eventos nativos/delegados usados pelo site. Controles de pausa e fluxos acima foram conferidos no navegador. A auditoria **não passou automaticamente**; relatório bruto `auditoria-runtime.json`. Mantido o mesmo filtro de runtime da raiz explicado acima.
- Capturas desktop das nove páginas e comparação do catálogo em desktop/celular estão em `relatorios/tema-global-2026-10-09`. As quatro referências antes/depois do catálogo foram adicionadas ao Moodboard autorizado, sem geração paga; identificadores em `canvas-assets.json`.

Backup preservado em `/Users/Admin/Desktop/cinefita-5-backup-2026-10-09`. Cartazes, dados, URLs e contratos de armazenamento permanecem intactos. Sem publicação, backend ou login.
