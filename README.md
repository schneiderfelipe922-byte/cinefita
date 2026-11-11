# Cinefita — marketplace · versão alt mod

Marketplace demonstrativo de cinema físico, feito com HTML, CSS e JavaScript. Reúne a Loja Oficial Cinefita e dois parceiros fictícios, reunindo 80 obras editoriais lançadas até 2005, todas com preço demonstrativo, e ofertas adicionais para comparação. Possui 12 coleções editoriais, revista com oito artigos, galeria, serviços, coleção pessoal e simulação de compra com entregas por vendedor. A área Empresa permite criar anúncios apenas neste navegador. A interface cinematográfica usa a identidade Cinefita, carvão e vermelho, cartazes completos e fundo de aurora em movimento.

## Protótipo Figma — 03/11/2026

[Desktop atualizado](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=141-8987) · [Celular atualizado](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=141-1986) · [Empresa desktop](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=140-2947) · [Empresa celular](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=140-5119)

Páginas 11 e 12 registram a versão anterior ao recorte de 2005: 174 telas e estados em cada versão, incluindo 100 fichas, 12 coleções, oito guias completos, serviços, vendedores, ajuda, ferramentas pessoais e o fluxo Empresa. A página 13 reúne os 100 cartazes. Use Apresentar na Home ou na entrada Empresa para iniciar um dos dois fluxos de cada página. São camadas editáveis e componentes; os exemplos do protótipo são pré-preenchidos. A digitação, o armazenamento local, a exportação e a publicação demonstrativa continuam sendo capacidades do site. Os registros de validação e os pontos de entrada estão em figma-expansion-manifest.json. As páginas 07–10 abaixo descrevem a entrega anterior preservada.

## Entrega de UX/UI e marketplace

[Briefing, persona, jornada e decisões](UX-ATIVIDADE.md) · [Roteiro da apresentação](APRESENTACAO.md)

[Figma: documentação UX](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=89-788) · [Wireframes](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=89-824) · [Marketplace desktop](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=90-2652) · [Marketplace celular](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT?node-id=91-793)

As páginas 07–10 contêm a entrega atual. Use Apresentar na Home de cada fluxo para iniciar o protótipo. O arquivo foi aberto sem login em 29/10/2026, confirmando visualização pelo link. Estados do protótipo são pré-preenchidos; o site permite interação e cálculo locais.

**A implementação atual está na branch `versao-alt-mod`.** O GitHub Pages publica os arquivos da raiz dessa branch. A atualização inclui marketplace, área Empresa demonstrativa, revista, serviços e o catálogo de 80 obras com cartazes.

## Executar e verificar

```sh
python3 -m http.server 8000
```

Abra http://localhost:8000. Não há build ou dependências para executar o site.

```sh
node --test tests/*.test.cjs
CINEFITA_URL=http://127.0.0.1:8000/ node tests/marketplace-browser.cjs
```

Os testes de navegador exigem Playwright e Chromium; `CINEFITA_PLAYWRIGHT`, `CINEFITA_CHROMIUM` e `CINEFITA_REPORT_DIR` permitem indicar as instalações e a pasta das evidências. As regressões existentes continuam em `tests/browser-check.cjs` e `tests/checkout-browser.cjs`. Resultados e limites em VALIDACAO.md.

## Site e versão principal

[Abrir a Cinefita online](https://schneiderfelipe922-byte.github.io/cinefita/)

A branch padrão do repositório e a origem do GitHub Pages são `versao-alt-mod`, usando os arquivos da raiz. O marcador `.nojekyll` mantém a publicação como site estático. A loja é demonstrativa: não processa pagamentos ou pedidos reais. Carrinho e coleção são locais ao navegador/origem; dados salvos no localhost não são transferidos para o domínio público.

## Área Empresa e expansão local — novembro de 2026

Abra `empresa.html` ou use **Entrar / Venda na Cinefita**. Escolha **Entrar como empresa de demonstração**, crie um anúncio, selecione uma obra e edição (ou cadastre novas), informe conservação, preço, estoque e fotos, revise e publique. Rascunhos e anúncios pausados não aparecem nas ofertas públicas da demonstração. Estoque zero não permite compra. Filmes novos da empresa são identificados como não verificados.

A publicação é somente local: não é autenticação, não publica na internet, não gera cobrança, não envia arquivos nem sincroniza dispositivos. O modo Empresa usa sessionStorage; obras, edições, perfil e ofertas com fotos usam IndexedDB (`cinefita-enterprise`, versão 1). A coleção mantém suas marcações originais e usa `cinefitaPersonalExtras.v1` para listas, notas, datas e histórico. Não use informações sensíveis em textos livres. Todos os dados pertencem ao perfil do navegador e podem ser apagados ao limpar o armazenamento.

- `revista.html`: oito guias e caminhos editoriais ligados aos filmes.
- `servicos.html`: três pacotes existentes e cinco serviços sob avaliação, com solicitação simulada.
- `vendedores.html`, `sobre.html`, `ajuda.html`: apresentação e funcionamento da demonstração.
- `colecao.html`: listas, notas, data de visualização, exportação/importação JSON com prévia e histórico de simulações.
- `assets/editorial/SOURCES.md`: fontes das 48 novas obras. Os 48 novos filmes possuem cartazes locais, com fontes em `assets/posters/expansion/sources.json`. A arte neutra permanece como alternativa para obras cadastradas pela empresa.

Carregamento: dados legados → expansão editorial → IndexedDB → `app.js` e módulos de interface. `expansion-bootstrap.js` aguarda os registros locais antes de montar o marketplace. Os testes de navegador aguardam `html[data-ready="true"]`.

```sh
node --test tests/*.test.cjs
CINEFITA_URL=http://127.0.0.1:8000/ node tests/enterprise-browser.cjs
CINEFITA_URL=http://127.0.0.1:8000/ node tests/enterprise-checkout.cjs
```

O teste empresarial usa as mesmas variáveis `CINEFITA_PLAYWRIGHT`, `CINEFITA_CHROMIUM` e `CINEFITA_REPORT_DIR` dos demais testes. Continua sem dependências de build ou serviços externos para executar o site.

## Usar a loja

1. Explore a inicial ou o catálogo. Combine busca com gênero, oferta física, formato, vendedor, conservação, década, direção, país e ordenação.
2. Abra um filme, compare as ofertas e escolha um vendedor antes de adicionar ao carrinho. Altere a quantidade, remova itens ou continue para a compra.
3. Use nome/e-mail fictícios. Escolha entrega para cada vendedor, com frete ilustrativo de R$ 19,90 por origem. A retirada gratuita está disponível somente para a Loja Oficial. Serviços de revitalização são presenciais.
4. Escolha PIX, débito à vista ou crédito em 1 a 12 parcelas sem juros. Resumo e confirmação acompanham a seleção; as parcelas sempre somam o total exato.
5. Conclua a simulação. O carrinho é limpo, e a confirmação recebe foco. Não há cobrança, transferência, dados bancários ou envio de pedido real.

As 40 obras elegíveis que já tinham preço mantêm seus valores. As outras 40 recebem uma oferta ilustrativa de DVD a R$ 59,90. A área Empresa aceita obras lançadas até 2005. A coleção pessoal oferece Tenho, Quero ter e Já assisti, de forma independente. Carrinho e marcações ficam no localStorage do navegador, sem sincronização entre dispositivos. Dados do formulário não são enviados nem persistidos. O som da marca é opcional e iniciado pelo botão “Ouvir logo”. Aurora, destaques e objetos respeitam pausa e movimento reduzido; a navegação dos destaques é manual.

## Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `index.html`, `catalogo.html`, `filme.html` | Inicial, catálogo e fichas de produtos. |
| `colecoes.html`, `colecao.html`, `posters.html` | Curadoria, coleção pessoal e galeria. |
| `revitalizar.html`, `carrinho.html`, `compra.html` | Serviço demonstrativo, carrinho e finalização. |
| `styles.css`, `site-theme.css` | Tokens, componentes, responsividade, layout moderno e aurora. |
| `app.js`, `collection-ui.js` | Renderização, eventos, validação, carrinho, filtros e diálogos. |
| `marketplace-core.js` | Ofertas/vendedores, filtros comerciais, migração do carrinho e frete/totais por vendedor. |
| `checkout-core.js` | Métodos de pagamento e cálculo em centavos. |
| `catalog-core.js`, `personal-collection.js` | Busca/filtros e persistência das marcações. |
| `site-motion.js` | Fusão dos destaques, pausa, visibilidade, redução de movimento e inclinação do cartaz. |
| `data.js` e complementos | Obras, sinopses, metadados e preços de referência. |

## Créditos

[Figma da versão alternativa](https://www.figma.com/design/N34bU1flCiA7QCoKcwAxRT/versao-alt-mod?node-id=43-2)
