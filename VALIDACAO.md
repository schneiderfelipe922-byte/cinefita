# Validação — 09/10/2026

Escopo final: redesign editorial, 52 filmes, quatro curadorias, filtros e organização local. Login, Supabase e Resend foram adiados a pedido do usuário. O ambiente de validação é HTTP local; não houve publicação.

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
