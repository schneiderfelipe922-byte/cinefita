# Apresentação — Cinefita marketplace

Roteiro sugerido de 10–12 minutos. Use dados fictícios. A atualização está local; o site publicado ainda é a versão anterior.

## Preparar

Sirva a pasta alt mod com `python3 -m http.server 8000`, abra o site e o [Figma](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT). A entrega atual está nas páginas 07 · UX, 08 · Wireframes, 09 · Marketplace Desktop e 10 · Marketplace Celular. As outras páginas são estudos e fluxos preservados. Inicie o protótipo na Home do fluxo desejado por Apresentar.

## Apresentar o processo

1. **Briefing:** cinema físico, colecionadores iniciantes e comparação de edições de diferentes vendedores. Cinefita é operadora e loja oficial; parceiros são fictícios.
2. **Persona:** apresente Camila Rodrigues, 27 anos, assistente administrativa de Curitiba. Conte como as visitas às locadoras e as sessões em família despertaram sua vontade de começar uma coleção. Explique que possui um aparelho de DVD, está aprendendo sobre edições e precisa respeitar um orçamento reduzido. Identifique a ficha como proto-persona fictícia, ainda não validada por pesquisa; a frase-síntese é uma criação para a apresentação, não um depoimento.
3. **Jornada:** mostre descoberta, busca, comparação, seleção, revisão, finalização e confirmação, incluindo dúvidas e recuperação.
4. **Arquitetura:** explique que busca é estado do catálogo; filme é informação editorial; ofertas são edições por vendedor; carrinho e checkout agrupam as compras por vendedor.
5. **Wireframes:** mostre as cinco telas nos dois dispositivos. Foram produzidos na evolução atual, sem afirmar que vieram antes do site existente.
6. **Identidade:** relacione os cartazes completos e a marca de película ao reconhecimento das capas e à memória do cinema físico. Apresente a ambientação em carvão e vermelho como uma interpretação cinematográfica contemporânea da alt mod, sem afirmar que essas são preferências comprovadas de Camila. Mercado Livre foi referência de funcionamento, sem copiar identidade ou layout.
7. **Alta fidelidade:** mostre componentes e estados coerentes entre telas.
8. **Protótipo:** percorra Home → Busca/Categoria → Produto → Carrinho → Checkout → Confirmação. Compare outra oferta e demonstre o carrinho com dois vendedores. Os campos são exemplos pré-preenchidos.

## Demonstrar o código local

1. No catálogo, combine vendedor e conservação, consulte a ajuda de formatos e abra Frankenstein. Voltar mantém busca/filtros.
2. Na ficha, separe IMDb (nota do filme) de informações comerciais. Compare a oferta oficial VHS de R$ 84,90, a oferta VHS do Sebo Aurora de R$ 79,90 e o DVD do Acervo de Bairro de R$ 89,90. Conservação, parceiros e valores adicionais são exemplos, sem exemplar real.
3. **Escolha da Camila:** seu aparelho é de DVD. Para assistir em casa, selecione o DVD de Frankenstein do Acervo de Bairro, R$ 89,90, conservação “Novo (exemplo)”. Com entrega de R$ 19,90, o total é R$ 109,80. Explique que ela confere compatibilidade, conservação, vendedor e custo completo; não escolhe apenas pelo menor preço. O orçamento não foi quantificado: se o total não couber, pode marcar “Quero ter” e adiar a compra.
4. **Exemplo técnico independente da escolha da persona:** para demonstrar frete de duas origens, use um carrinho separado do exemplo de DVD e adicione Frankenstein oficial (R$ 84,90) e Psicose do Sebo Aurora (R$ 74,90), ambos em VHS. Esses itens não representam edições para Camila assistir no aparelho de DVD. Carrinho: subtotal R$ 159,80. Duas entregas: R$ 39,80; total R$ 199,60. Com retirada oficial: total R$ 179,70.
5. Aumente/reduza quantidade, recarregue e remova um item. Duas ofertas do mesmo filme nunca devem se fundir.
6. No checkout, tente concluir vazio para mostrar erros e foco. Preencha dados fictícios, entrega e endereço.
7. Demonstre PIX, débito e crédito. Em R$ 199,60, três parcelas ficam R$ 66,54 + R$ 66,53 + R$ 66,53.
8. Conclua: confirmação mostra vendedores, itens, frete, total e pagamento, recebe foco e limpa o carrinho. Não houve cobrança ou envio real.
9. Mostre celular, menu, ajuda e retorno do carrinho vazio ao catálogo.

## Justificar decisões pela persona

As falas a seguir são sugestões de justificativa para o apresentador. São hipóteses de design, não depoimentos de Camila nem conclusões de pesquisa.

- “As capas em destaque e os cartazes completos podem ajudar Camila a reconhecer filmes ligados às suas lembranças das locadoras.”
- “A marca de película e a ambientação em carvão e vermelho expressam a proposta de cinema físico com apresentação contemporânea; não presumimos que sejam cores preferidas da persona.”
- “As curadorias oferecem um ponto de partida para uma coleção que está começando.”
- “A ajuda sobre formatos e as informações de conservação apoiam a escolha de uma edição que Camila consiga assistir no aparelho de DVD.”
- “Vendedor identificado e nota IMDb separada das informações comerciais ajudam a distinguir o filme da oferta.”
- “O resumo inclui os fretes por vendedor para que ela conheça o custo completo antes de decidir se pode comprar.”
- “As marcações Tenho, Quero ter e Já assisti distinguem posse, desejo e histórico; permitem planejar uma coleção que cresce aos poucos.”

A história e a relação com o design estão detalhadas nas seções 2 e 7 de [UX-ATIVIDADE.md](UX-ATIVIDADE.md). Nesta revisão, o texto acadêmico foi atualizado; site, wireframes e Figma não foram alterados.

## Explicar a implementação

- `marketplace-core.js`: separa obra e oferta, identifica vendedores, valida itens restaurados, agrupa compras e calcula frete por vendedor.
- `catalog-core.js`: regras editoriais de busca e filtragem, combinadas às regras comerciais.
- `app.js`: renderização, seleção da oferta, navegação, carrinho, formulário e confirmação.
- `checkout-core.js`: pagamento e parcelas em centavos, sem erro de soma.
- `styles.css` e `site-theme.css`: tokens e composição da identidade alt mod.
- `cinefitaCart.v2`: persistência canônica; o carrinho anterior só migra quando a correspondência é segura.

O `CRITERIOS-ATIVIDADE.md` anterior trata da atividade de programação. O material desta atividade de UX/UI está em `UX-ATIVIDADE.md` e nas páginas 07–10 do Figma.
