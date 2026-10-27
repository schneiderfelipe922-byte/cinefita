# Roteiro de apresentação — Cinefita

Tempo sugerido: 7–10 minutos. Use somente dados fictícios, como “Cliente de teste” e `aluno@example.com`.

## Preparar

Abra [a Cinefita hospedada](https://schneiderfelipe922-byte.github.io/cinefita/). Para apresentar offline/localmente, use a versão `versao-alt-mod` do repositório, execute `python3 -m http.server 8000` e acesse `http://localhost:8000`. Confira o carrinho antes de começar. Tenha abertos o site, o código e o histórico do GitHub. Leia e ensaie as explicações abaixo; o professor avaliará sua compreensão do projeto.

## Demonstração da loja

1. **Nome e proposta.** Apresente a Cinefita como uma loja demonstrativa de cinema físico e curadoria de filmes. Explique a referência à película no C, os cartazes completos e as cores.
2. **Inicial.** Mostre os destaques, coleções e “Seu próximo clássico”, onde cada produto tem imagem, nome, descrição e preço.
3. **Categorias.** Entre no catálogo, use gênero e “Com edição física”, pesquise Frankenstein e abra a ficha. Explique a diferença entre os produtos disponíveis e as obras editoriais sem oferta.
4. **Produto.** Mostre a sinopse, ficha técnica, preço, embalagem ilustrativa e botão de adicionar ao carrinho.
5. **Carrinho.** Adicione Frankenstein e vá ao carrinho completo. Aumente a quantidade para 2: R$ 84,90 × 2 = R$ 169,80. Volte a 1 e demonstre a remoção; adicione novamente para continuar.
6. **Checkout.** Mostre a validação ao tentar concluir com campos vazios e depois preencha nome/e-mail fictícios.
7. **Frete e total.** Escolha entrega em domicílio: R$ 84,90 + R$ 19,90 = R$ 104,80. Preencha um endereço fictício ou retorne à retirada gratuita.
8. **Pagamentos.** Selecione PIX, débito e crédito, explicando que todos são simulados. No crédito, escolha 3 e depois 12 parcelas; o resumo acompanha a seleção. Se houver centavos indivisíveis, algumas parcelas diferem em um centavo e a soma permanece exata.
9. **Conclusão.** Finalize a simulação e mostre valor, método/parcelas, mensagem de aprovação simulada e carrinho vazio. Não há cobrança nem envio do pedido.
10. **Celular.** Reduza a janela para mostrar o menu móvel, as grades e o formulário em uma coluna.

## Explicação dos principais arquivos

| Arquivo | O que explicar |
|---|---|
| `index.html` | Estrutura: cabeçalho, navegação, conteúdo principal, seções e rodapé. |
| `compra.html` | Formulário, labels, fieldsets, radios de pagamento e select de parcelamento. |
| `styles.css` | Tokens de cor/tipografia, estilos compartilhados e media queries. |
| `site-theme.css` | Composição editorial aplicada às páginas e estilos do checkout. |
| `data.js` e complementos | Dados das obras e ofertas usados nas fichas/cards. |
| `catalog-core.js` | Filtros e busca local; como o catálogo seleciona os resultados. |
| `app.js` | Eventos, renderização dos cards, carrinho, validação, resumo e conclusão. |
| `checkout-core.js` | Cálculo das parcelas em centavos e validação das opções de pagamento. |
| `tests/checkout.test.cjs` | Como se verifica que a soma das parcelas coincide com o total. |

## Uma funcionalidade JavaScript para explicar em detalhe

O carrinho é uma lista de itens em memória. `addToCart` identifica um produto já existente para aumentar sua quantidade; `updateCart` atualiza a interface. `save` usa `JSON.stringify` para armazenar a lista em `localStorage`, permitindo navegar e recarregar na mesma origem sem perder o carrinho.

O subtotal multiplica preço em centavos pela quantidade antes de somar. No checkout, `orderCents` inclui o frete. `CinefitaCheckout.quote` divide esse total pelo número de parcelas, usa a parte inteira e distribui o resto de um centavo entre as primeiras parcelas. Por exemplo, R$ 104,80 em 3 vezes fica R$ 34,94 + R$ 34,93 + R$ 34,93. Essa soma continua sendo R$ 104,80.

`renderPayment` lê o radio selecionado e atualiza ajuda, parcelas e resumo. O seletor continua sendo um `<select>` nativo: o navegador cuida da interação e do teclado. Ao enviar o formulário, o JavaScript valida os dados, guarda total e forma escolhida para a confirmação, limpa o carrinho e mostra o sucesso. Não há integração com banco ou serviço de pagamento.

## Git e GitHub

Abra [o código da versão](https://github.com/schneiderfelipe922-byte/cinefita/tree/versao-alt-mod) e [o histórico de commits](https://github.com/schneiderfelipe922-byte/cinefita/commits/versao-alt-mod). Explique que Git registra versões locais e GitHub disponibiliza o repositório para o professor. Mostre commits com descrições das alterações e abra o README com as instruções de execução.

No terminal, `git log --oneline -10` mostra o histórico recente e `git status` mostra alterações locais ainda não registradas.

## Perguntas para ensaiar

- Qual a função de HTML, CSS e JavaScript neste projeto?
- Por que usar radio para pagamento e select para parcelas?
- Como a quantidade modifica o total? Como a soma das parcelas evita erro de arredondamento?
- Onde o carrinho fica salvo e por que não acompanha outro navegador/dispositivo?
- O que acontece se o cliente deixar o formulário vazio ou remover o último item?
- Qual a diferença entre obra editorial sem oferta e produto com preço?
- Como o layout se adapta ao celular?
- Qual a diferença entre Git, GitHub e um serviço de hospedagem do site?

O roteiro cobre a preparação. A realização da apresentação e a explicação pelo aluno só podem ser confirmadas em aula.

## Layout e aurora da versão alt mod

Mostre o cabeçalho compacto, as quatro ofertas da inicial, as curadorias e a aurora. Explique que o fundo usa gradientes, máscaras vetoriais curvas e transformações CSS lentas em duas camadas. A troca dos cartazes usa transição de opacidade de 900ms e carrega as imagens antes de trocar. Pausa e movimento reduzido mantêm a navegação funcional. Os proprietários são site-theme.css e site-motion.js; a proposta visual aprovada foi integrada ao site, não usada como uma imagem de fundo.
