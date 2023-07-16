# Game Collection - React/TypeScript/MUI5

Esta é a minha versão do projeto de uma coleção de jogos para a segunda etapa do processo seletivo.

## Web page
![Web page](public/page-web2.png)

Essa é a página inicial da aplicação, onde contém o campo de pesquisa,  o filtro por gênero, o ícone para realizar a autenticação e os cards contendo os ícones de avaliação (com as notas já avaliadas por outros usuários) e o ícone para favoritar um jogo. Neste caso, a página exibida é de quando o usuário não está logado, ao logar são exibidos os filtros como jogos favoritos do usuário e ordenação por avaliação.

## Auth page
![Auth page](public/page-auth.png)     

Essa é a página de autenticação via firebase, com um visual compacto e responsivo, que alterna entre login e cadastro se mantendo na mesma rota.

## Mobile page
![Mobile page](public/page-mobile2.png)

Essa é a página mobile da aplicação, com um visual mais compacto contendo as mesmas funções da página Web, com algumas mudanças no visual do filtro de gênero e com a adição de um menu lateral.

## Visão geral

Bom, foi um projeto interessante de se desenvolver (e bem divertido), me possibilitou aprender diversas coisas novas e reforçar um conhecimento que já possuia.

Para a segunda etapa, fiz algumas mudanças visuais para adaptar os novos requisitos que foram solicitados e também para implementar algumas ideias que surgiram sem fugir do escopo dos requisitos. Uma das principais mudanças que havia pensado desde a primeira etapa era sobre o filtro por gênero que é por um conjunto de RadioButtons na página Web, mas que para a página Mobile não se encaixava tão bem, então acredito que uma forma de trazer mais beleza pra dispositivos menores foi alterar para um Select ao se tratar dessa filtragem nesses dispositivos.

Além disso, era necessário acrescentar informações na tela, então para deixar mais contextualizado para o usuário, criei um menu, agora adicionando informações como um nome e uma logo para a página, para mais, em dispositivos mobile, foi adicionado um menu lateral para funções extras do menu, tentado deixar mais compacto e o menos poluído possível para o usuário.

No demais, foi criada uma nova página para a autenticação do usuário com o firebase, além das funções de filtragem por avaliação (seguindo a ordenação sugerida, primeiro os itens ordenados e depois os itens sem avaliação) e por jogos favoritos do usuário.

Por fim, a animação CSS escolhida para favoritar um jogo foi pensando no contexto da ação, então eu criei uma animação que simula o batimento cardíaco sempre que um jogo é favoritado.

## Sugestões futuras para mim

- Acredito que algo que talvez eu fizesse diferente fosse usar o NextJS para a segunda etapa para facilitar, porém não foi algo que trouxe muita complicação, seria apenas um facilitador. Mas como o projeto inicialmente já estava hospedado no github pages (que infelizmente não suporta o Next) e era necessário usar o mesmo link, então optei por não fazer a migração.

## Considerações finais

Espero que tenham gostado do projeto e agradeço pela oportunidade de participar do processo seletivo.
