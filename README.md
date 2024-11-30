# Magazine Matheus

## O que é

Magazine Matheus é um ecommerce com foco em vendas variadas, A ideia é que o sistema tenha suporte para qualquer produto que esteja detro da ideia de venda para pessoa fisica. Ainda somado a tudo isso, a ideia é colocar um sistema de recomendacoes baseado em comprar e pesquisas.

## Como Rodar

- configurar o certificado
    - A primeira coisa que voce deve fazer é ir ate a pasta /cert
    - Voce deve criar uma coisa dos dois aquivos
    - Renomeie a copia de `magazinematheus.dev.crt.exemple` para `magazinematheus.dev.crt`
    - Renomeie a copia de `magazinematheus.dev.key.exemple` para `magazinematheus.dev.key`
- Configurar o .env
    - No diretorio do projeto existe um arquivo chamado `.env.exemple`
    - Voce deve criar uma copia dele e renomear para `.env`
- É necessario ter o `docker` e `docker compose` instalado na sua maquina para continuar
    - Rode esse comando pela primeira vez, ele já tem o build incluido

        ```shell
        docker compose up --build --no-attach db
        ```

    - Depois de rodar a primeira vez, caso voce tenha que rodar outras vezes, voce ja pode usar esse comando para ter um log mais limpo

        ```shell
        docker compose up --no-attach db
        ```

- para povoar o banco voce pode ir na url `https://127.0.0.1:3000/seeder`

## Tecnologias

- express
    É um, web application framework, para Node.js. A escolha dele é justificada pelo sua popularidade e conhecimento dos desenvolvedores do projeto.
- pug
    É um, Template engine, para aquivos html. Usado para facilitar a criacao de paginas no font-end. O motivo da escolha é por causa da capacidade de trabalhar em bloco. Usa a extencao .pug.
- tailwind
    É um css framework, facilita a criação do front-end. Quando iniciado ele percore todas as views em busca de class css, ele cria um arquivo `src/public`, e salva todas as class que foram usadas. Ele disponibiliza elas na rota `/styles.css` da propria aplicação.
- mongodb
    Usado como banco de dados, NoSQL, Estavamos com curiosidade de usar um banco por documentos. Se mostrou muito flexivel, facil, rapido e atendeu todas as nossas necessidade de maneira supreendentemente facil.
- passport
    Usado para criar e autentificar a sessao do usuario. Foi usado em `src/routes/authentication.js`.
- serve-favicon
    Basicamente carrega o favicon no caminho padrão para a maioria dos navegadores. Caminho para o favicon `src/views/static/favicon/favicon.ico`.
- concurrently
    Foi usado apenas na parte dev, é interesante para fazer o tailwind ficar assistindo as views, permite que ele processe o css quando um .pug for atualizado. O script em que ele foi usado esta no arquivo `package.json`, segue o script `"dev": "concurrently \"npm run build:css\" \"nodemon ./src/server.js\""`

## Para trabalhos futuros

Alguns dos trabalhos possiveis seriam.

- Melhorias no sistema de recomendação.
- A parte de vendas nao realiza vendas realmente.
- Sistema de calculo de frete.
- Sistema de acompanhamento de compras.
