# Cinefita — versão alt mod

Loja virtual demonstrativa de cinema físico, feita com HTML, CSS e JavaScript. Possui 52 obras, 41 ofertas ilustrativas, quatro coleções editoriais, galeria, coleção pessoal e simulação completa de compra. A interface cinematográfica usa a identidade Cinefita, carvão e vermelho, cartazes completos e fundo de aurora em movimento.

## Site e versão principal

[Abrir a Cinefita online](https://schneiderfelipe922-byte.github.io/cinefita/)

A branch padrão do repositório e a origem do GitHub Pages são `versao-alt-mod`, usando os arquivos da raiz. O marcador `.nojekyll` mantém a publicação como site estático. A loja é demonstrativa: não processa pagamentos ou pedidos reais. Carrinho e coleção são locais ao navegador/origem; dados salvos no localhost não são transferidos para o domínio público.

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

## Créditos

[Figma da versão alternativa](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT/versao-alt-mod?node-id=43-2)
