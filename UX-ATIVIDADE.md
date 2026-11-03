# Cinefita — projeto de UX/UI de marketplace

Entrega acadêmica · 29/10/2026 · versão alt mod

Persona e relação com o design revisadas em 30/10/2026.

## 1. Briefing

**Nome:** Cinefita. **Segmento:** entretenimento, cinema físico e colecionismo.
**Proposta:** reunir edições físicas de filmes oferecidas pela Loja Oficial Cinefita e por lojas e colecionadores parceiros, com comparação de formato, conservação, vendedor, preço e entrega. Catálogo editorial e ofertas são informações distintas: conhecer um filme não significa que há uma edição à venda.
**Público-alvo:** pessoas adultas no Brasil que estão começando a colecionar VHS, DVD e Blu-ray; usam celular e computador, têm orçamento limitado e precisam entender o que estão comprando.
**Objetivo do usuário:** descobrir um filme, compreender o formato, comparar ofertas, escolher um vendedor e concluir uma compra demonstrativa sabendo o custo completo.
**Problema:** informações sobre filmes, exemplares e vendedores costumam se misturar. Um iniciante pode escolher um suporte incompatível, interpretar uma nota do filme como reputação do vendedor ou descobrir o frete somente no final.
**Modelo:** Cinefita opera a plataforma e sua loja oficial. Sebo Aurora e Acervo de Bairro são parceiros fictícios, sem vínculo com empresas reais. Todos os preços, condições, avaliações comerciais e entregas deste exercício são demonstrativos. IMDb é referência editorial separada.
**Referência:** Mercado Livre somente no funcionamento de busca, ofertas e compra; nenhuma reprodução de layout, marca, textos ou elementos gráficos.
**Limites:** protótipo e site estático, sem login, pagamentos reais, painel administrativo ou cadastro público de vendedores.

## 2. Persona principal — hipótese de projeto

**Camila — redescobrindo o prazer de escolher um filme.**

**Nome:** Camila Rodrigues. **Idade:** 27 anos. **Profissão:** assistente administrativa. **Localização:** Curitiba, PR. **Perfil:** colecionadora iniciante motivada pela nostalgia.

### História e contexto

Na infância, Camila frequentava locadoras com a família. Percorrer as prateleiras, escolher pelas capas, levar um filme para casa e reunir todos para assistir faziam parte do programa. Hoje, essas lembranças despertaram a vontade de começar uma pequena coleção e recuperar esse ritual. Ela quer ter por perto histórias com significado e compartilhar novas sessões com pessoas próximas.

Camila possui um aparelho de DVD e ainda está aprendendo sobre formatos, edições e conservação. Pesquisa no celular e usa o computador para revisar as opções antes da compra. Seu orçamento é reduzido: a coleção deve crescer aos poucos, conforme suas possibilidades.

**Frase-síntese fictícia:** “Quero voltar a escolher um filme pela vontade de guardar aquela história comigo.”

### Motivações, objetivos e comportamento

- **Motivações:** recuperar lembranças afetivas das locadoras e das sessões em família; compartilhar o ritual de assistir; construir uma coleção com significado pessoal.
- **Objetivos:** encontrar filmes ligados a essas memórias, descobrir outros clássicos e adquirir edições que consiga assistir no aparelho que possui.
- **Comportamento:** reconhece títulos pelas capas, pesquisa por filme ou gênero, salva interesses e compara ofertas. Lê descrição, conservação e condições de entrega antes de decidir; revisa a compra no computador.
- **Limitações:** orçamento reduzido e pouco conhecimento sobre suportes e condições dos exemplares. O aparelho de DVD é o equipamento disponível para as sessões; não se presume que tenha videocassete ou leitor de Blu-ray.

### Dores e necessidades

| Dor ou dúvida hipotética | Necessidade |
|---|---|
| Reconhece a capa, mas não sabe qual edição escolher | Separar as informações sobre o filme das informações sobre cada oferta |
| Receia comprar um formato incompatível com seu aparelho | Explicação simples de VHS, DVD e Blu-ray, com o suporte identificado na oferta |
| Encontra descrições incompletas ou conservação pouco clara | Saber o que está sendo oferecido e em que condição |
| Não conhece o vendedor e pode confundir a nota do filme com a qualidade da compra | Vendedor identificado e distinção entre IMDb e informações comerciais |
| O frete pode tornar a escolha mais cara do que esperava | Conhecer o custo completo e comparar as entregas por vendedor |
| Ainda não pode adquirir todos os filmes que deseja | Guardar interesses e distinguir os filmes que possui dos que quer ter ou já assistiu |

### Tarefa principal e critério de sucesso

**Quando** uma capa ou um filme me lembra as sessões da infância, **quero** encontrar uma edição compatível, entender sua conservação e comparar o custo completo, **para** começar uma coleção e voltar a compartilhar esse ritual dentro das minhas possibilidades.

Camila considera a escolha bem-sucedida quando encontra uma edição que possa assistir, entende sua conservação, identifica o vendedor e conhece o total com frete antes de comprar. Se o custo não couber no orçamento, pode salvar o filme para depois; concluir a compra não é o único resultado útil.

**Natureza da persona:** proto-persona fictícia, ainda não validada por pesquisa. Nome, dados de perfil, história, comportamentos e frase-síntese são hipóteses de projeto; a frase não é um depoimento de participante. Não foram realizadas entrevistas nem definidos renda exata, orçamento numérico ou resultados de pesquisa. Próxima pesquisa sugerida: observar iniciantes reconhecendo capas, comparando formatos e ofertas e avaliando o custo completo; revisar a hipótese com essas evidências.

## 3. Jornada principal

| Etapa | Ação | Necessidade / dúvida | Dificuldade | Resposta de design |
|---|---|---|---|---|
| Descobrir | Acessar a Home e reconhecer capas | Quais filmes me lembram as sessões em família? Por onde começar? | Acervo amplo | Cartazes completos, curadoria e acesso ao catálogo |
| Encontrar | Buscar ou filtrar | Há edição no meu formato? | Suportes e condições diferentes | Ajuda de formatos, filtros combináveis |
| Comparar | Abrir produto e ofertas | Qual exemplar e vendedor escolher? | Nota do filme confundida com reputação | Blocos editoriais e comerciais distintos |
| Selecionar | Escolher uma oferta | O que exatamente vou receber? | Conservação pouco clara | Formato, conservação e vendedor juntos |
| Revisar | Conferir carrinho | Quem enviará cada item? | Vendedores diferentes | Agrupamento por vendedor |
| Finalizar | Informar dados fictícios e entrega | Quanto vou pagar no total? | Frete por origem | Entrega por vendedor e resumo antes da ação |
| Confirmar | Concluir simulação | A ação funcionou? | Incerteza sobre conclusão | Confirmação com itens, vendedores e total |

Fluxo: Home → Busca/Categoria → Produto/Ofertas → Carrinho → Checkout → Confirmação.
Caminhos de recuperação: limpar filtros sem resultados; voltar à lista com filtros; remover item; voltar ao catálogo no carrinho vazio; corrigir dados mantendo os demais campos.

## 4. Arquitetura da informação

```text
Home
├── Catálogo / Busca / Categorias
│   └── Produto (filme)
│       ├── Informações editoriais / ajuda de formatos
│       ├── Ofertas por vendedor
│       └── Oferta escolhida → Carrinho
├── Coleções editoriais → Catálogo / Produto
├── Pôsteres → Ampliação / Produto
├── Minha coleção → Produto
├── Revitalizar → Serviço Cinefita → Carrinho
└── Carrinho (itens agrupados por vendedor)
    └── Checkout (entrega por vendedor / pagamento)
        └── Confirmação demonstrativa
```

Busca é um estado do catálogo. A ficha pertence ao filme e contém ofertas separadas. Confirmação é um estado do checkout. Cabeçalho, rodapé e links de retorno conectam a navegação.

## 5. Wireframes

Cinco telas em desktop e celular: Home, Busca/Categoria, Produto, Carrinho e Checkout. Desenhos em cinza, com hierarquia, áreas de conteúdo, controles e anotações. Documentam a estrutura proposta durante a evolução deste projeto; não são apresentados como evidência de uma fase anterior ao site já existente.

## 6. Identidade e componentes

Preservar a alt mod: fundo #13161B, superfícies #20262F, texto #F4F1EA, ação #E85B53, apoio #B8BEC8. Manrope nos títulos e leitura; Roboto Mono nos dados. Logo de película e cartazes completos preservados. Tokens canônicos em styles.css, composição em site-theme.css.
Componentes: cabeçalho/busca, navegação, botões, campos/selects nativos, filtros/chips, card editorial com resumo de ofertas, oferta selecionável, vendedor identificado, grupo de carrinho, resumo de entrega/pagamento e confirmação. Estados visíveis de foco, seleção, indisponibilidade, erro e vazio.

## 7. Relação entre persona e design

As relações abaixo são justificativas e hipóteses de design para a versão alt mod. A memória afetiva orienta a proposta de experiência; não é evidência de que Camila prefira cores, tipografia ou animações específicas. O que observar em uma futura avaliação não representa resultado de teste já realizado.

| Necessidade ou motivação da Camila | Relação com o design da alt mod | O que observar em uma futura avaliação |
|---|---|---|
| Reconhecer filmes associados às suas lembranças | Cartazes completos, capas em destaque e identidade com película de cinema | Se identifica um filme pela capa e encontra o caminho para sua ficha |
| Recuperar o clima de uma sessão especial | Ambientação cinematográfica em carvão e vermelho, com apresentação contemporânea | Como percebe a relação entre a ambientação e a proposta de cinema físico, sem presumir preferência visual |
| Encontrar por onde começar a coleção | Curadorias temáticas e acesso claro ao catálogo | Se escolhe um ponto de partida e retoma a exploração sem perder contexto |
| Aprender a escolher uma edição que possa assistir | Ajuda de formatos e informações de suporte e conservação junto às ofertas | Se distingue VHS, DVD e Blu-ray e escolhe uma oferta compatível com seu aparelho de DVD |
| Comprar com segurança e dentro do orçamento | Comparação de vendedores, distinção entre IMDb e informações comerciais e total com frete | Se identifica o vendedor, compreende a conservação e confere o custo completo sem tratar a nota do filme como garantia comercial |
| Construir a coleção gradualmente | Marcações independentes de “Tenho”, “Quero ter” e “Já assisti” | Se consegue salvar um interesse e distinguir desejo, posse e histórico de sessões |

## 8. Cenário de demonstração compartilhado

### Cenário da Camila: escolher uma edição para assistir

Camila abre o Cinefita no celular para procurar um clássico que gostaria de incluir nas próximas sessões. O reconhecimento de uma capa ou a curadoria pode ajudá-la a chegar à ficha; não se pressupõe que tenha assistido a um título específico na infância. Na ficha de Frankenstein, compara as ofertas VHS da Loja Oficial Cinefita e do Sebo Aurora com o DVD do Acervo de Bairro. Como possui um aparelho de DVD, escolhe a oferta em DVD para assistir em casa, mesmo que outra opção tenha preço menor.

O DVD demonstrativo do Acervo de Bairro custa R$ 89,90, com conservação “Novo (exemplo)”; com uma entrega ilustrativa de R$ 19,90, o total é R$ 109,80. Camila confere formato, conservação, vendedor e total antes de decidir. Como seu orçamento não foi quantificado, não se afirma que esse valor cabe nele: se puder comprar, segue para a simulação; caso contrário, marca “Quero ter” e retoma a escolha depois.

### Cenário técnico: demonstrar entregas de dois vendedores

O exemplo a seguir serve para demonstrar o cálculo do marketplace e é independente da escolha de Camila para assistir em DVD. Os itens em VHS não são apresentados como compatíveis com o aparelho dela.

Produto principal: Frankenstein (1931), oferta da Loja Oficial Cinefita, VHS, R$ 84,90. Oferta adicional de parceiro permite comparar o mesmo filme. Segundo item: Psicose, R$ 74,90, parceiro Sebo Aurora. Os valores são referências demonstrativas, não estoque real. Entrega: R$ 19,90 por vendedor; retirada gratuita somente na Loja Oficial. Com Frankenstein e Psicose entregues, subtotal R$ 159,80, frete R$ 39,80, total R$ 199,60. Com retirada oficial, frete R$ 19,90 e total R$ 179,70.

## 9. Critérios de entrega

- Briefing e persona completos, jornada e sitemap representados.
- Cinco wireframes e cinco telas finais por dispositivo, mais confirmação.
- Protótipos com início e fluxo obrigatório conectado.
- Demonstração com dois vendedores; mesma oferta e valores até confirmar.
- Site com filtros, comparação, carrinho, entrega por vendedor e pagamentos simulados.
- Testes de regras, migração, navegação, teclado, reflow, erros e armazenamento.
- Link de visualização para o professor; acesso externo precisa ser conferido em contexto sem a sessão do autor.
