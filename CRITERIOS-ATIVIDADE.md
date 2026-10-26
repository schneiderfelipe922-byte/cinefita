# Conferência da atividade — versão alt mod

Fonte: “Atividade Avaliativa – Desenvolvimento de Loja Virtual (1) (1).pdf”, seis páginas fornecidas pelo aluno. Conferência em 26/10/2026 na pasta `/Users/Admin/Desktop/cinefita-versao-alt-mod`. O PDF define requisitos de entrega; ele não concede autorização separada para publicar conteúdo ou declarar a apresentação realizada.

| Critério | Valor | Estado e evidência atual |
|---|---:|---|
| 1. Estrutura e organização | 1,0 | Nove páginas HTML; CSS/JS compartilhados; assets e testes organizados; README com execução. |
| 2. Identidade visual e design | 1,5 | Marca própria Cinefita, carvão/vermelho, Manrope, layout moderno aprovado, cartazes completos, aurora e fusão manual. Capturas desktop/móvel inspecionadas. |
| 3. Inicial e produtos | 1,5 | Quatro ofertas reais dos dados, com imagem, nome, descrição e preço. Catálogo por gênero, filtro de oferta física e fichas completas. |
| 4. Navegação e usabilidade | 1,0 | Links, busca/filtros, retorno preservado, menu mobile, diálogos/Escape/foco e estados vazios exercitados no navegador. |
| 5. Carrinho | 2,0 | Adicionar, alterar quantidade 1–99, remover, subtotal e localStorage. Persistência entre páginas/recarga e esvaziamento testados. |
| 6. Finalização | 1,0 | Nome/e-mail, validação inline, retirada ou endereço, resumo com frete, confirmação e limpeza do carrinho. |
| 7. Pagamentos | 1,5 | PIX, débito à vista e crédito em 1–12 parcelas sem juros. Cálculo em centavos, resumo e sucesso específicos; os três métodos concluídos no navegador. |
| 8. HTML, CSS e JavaScript | 1,0 | HTML semântico, CSS responsivo, eventos/cálculos em JS nativo; sem build/backend. Código explicado em APRESENTACAO.md. |
| 9. Git e GitHub | 1,0 | Histórico Git existente; implementação registrada localmente no commit 01dcad4, acompanhada de commit de documentação. Remoto público conferido em bf8c2ff; publicação final aguarda autorização. Não concluído. |
| 10. Responsividade e qualidade | 1,0 | 54 verificações: nove páginas × cinco larguras (320–1440px), mais nove em reflow equivalente a 200%; 20 verificações adicionais da compra. Sem erros de JS. |
| 11. Apresentação e explicação em aula | 1,5 | Roteiro preparado em APRESENTACAO.md. A demonstração, a explicação pelo aluno e a entrega do link ao professor ainda precisam ocorrer. Não concluído. |

Os critérios 1–8 e 10 têm evidência técnica local. Isso não garante a pontuação do professor. Os critérios 9 e 11 permanecem pendentes até a publicação, a entrega e a apresentação efetivas.

## Requisitos obrigatórios verificados

- Inicial organizada, marca própria, menu e categorias: index.html, catalogo.html e colecoes.html.
- Imagem/nome/descrição/preço: quatro cards #physicalGrid da inicial e todos os produtos com oferta no renderizador card de app.js. As onze obras editoriais sem oferta são identificadas separadamente; não recebem compra ou preço inventado.
- Detalhes e adicionar: filme.html?id=frankenstein, sinopse/ficha e botão data-buy.
- Carrinho: painel comum e carrinho.html, quantidades, remoção, subtotal, navegação ao checkout e estado vazio.
- Cliente/entrega: compra.html, nome/e-mail fictícios, endereço condicional, frete de referência e foco no primeiro erro.
- PIX/débito/crédito/parcelas: compra.html + checkout-core.js + app.js, resumo e confirmação sem dados bancários reais.
- Sucesso: valor, método/parcelas, foco na confirmação, carrinho limpo e aviso de simulação.
- Tecnologias: HTML/CSS/JS nativos e repositório Git. GitHub final ainda pendente.

## Repetir a verificação

1. Execute `python3 -m http.server 8000` na pasta e abra http://localhost:8000.
2. Execute `node --test tests/*.test.cjs` — 44 testes nesta revisão.
3. Com Playwright/Chromium disponíveis, execute `node tests/browser-check.cjs` e `node tests/checkout-browser.cjs`.
4. Confira os resultados e limitações em VALIDACAO.md. Capturas/JSON locais: relatorios/atividade-alt-mod-2026-10-26/ e .superdesign/previews/.

## Entrega e apresentação pendentes

Destino confirmado: [código da branch versao-alt-mod](https://github.com/schneiderfelipe922-byte/cinefita/tree/versao-alt-mod) e [histórico](https://github.com/schneiderfelipe922-byte/cinefita/commits/versao-alt-mod). O remoto público ainda apresenta a versão anterior. Após autorização e publicação, verificar que o SHA remoto coincide com o commit final local e que o link pode ser aberto para correção.

O aluno deve preencher nome/turma/data, entregar o link ao professor, ensaiar e realizar os treze passos de demonstração/explicação previstos nas páginas 4–5 do PDF. O roteiro preparado não substitui essa participação.

Busca, filtros, coleção pessoal, frete ilustrativo, persistência, tema escuro e animações já existem como extras. Login, cupons, histórico de pedidos e GitHub Pages são opcionais no PDF e não são necessários para cumprir os requisitos técnicos obrigatórios.
