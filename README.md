
# Faturas Backend

Este projeto é uma API backend para gerenciar faturas utilizando **Fastify**, **Prisma ORM** e um banco de dados **PostgreSQL** hospedado via **Render**.

## Tecnologias Utilizadas

- **Fastify**: Framework web para Node.js
- **Prisma ORM**: ORM para interação com o banco de dados PostgreSQL
- **PostgreSQL**: Banco de dados relacional
- **Fastify Multipart**: Para fazer upload de arquivos
- **Node.js**: Plataforma para execução do backend

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/ULYBR/faturas-backend.git
   cd faturas-backend
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/faturas?schema=public
   PORT=3000
   ```

   - **`DATABASE_URL`**: URL de conexão com o banco de dados. No ambiente local, pode ser o PostgreSQL rodando com Docker. No Render, será configurado automaticamente.
   - **`PORT`**: A porta que o Fastify irá escutar. Para o Render, isso será configurado automaticamente.

4. **Rodando as migrações do Prisma**:
   Para rodar as migrações e configurar o banco de dados:

   ```bash
   npx prisma migrate deploy
   ```

5. **Rodar o servidor localmente**:
   Para rodar a API localmente em desenvolvimento:

   ```bash
   npm run dev
   ```

## Scripts

- **`npm run dev`**: Inicia o servidor localmente no modo de desenvolvimento (usando `ts-node`).
- **`npm run build`**: Compila o código TypeScript para JavaScript.
- **`npm run start`**: Inicia o servidor após o build.
- **`npx prisma migrate deploy`**: Aplica as migrações no banco de dados.

## Coleção do Postman

Você pode importar a coleção do Postman para testar os endpoints da API.

1. Baixe a coleção do Postman [aqui](/Faturas_Backend_Postman_Collection.json).
2. Abra o **Postman** e importe a coleção:
   - Clique em **Import** > **Upload Files** e selecione o arquivo `.json` da coleção.
   - A coleção irá aparecer no seu Postman.

## Endpoints

### 1. **Obter faturas por cliente**

- **URL**: `/faturas/cliente/:numCliente`
- **Método**: `GET`
- **Descrição**: Retorna todas as faturas para um cliente específico.
- **Parâmetros**:
  - `numCliente`: Número do cliente.
- **Exemplo de Requisição**:
  ```http
  GET /faturas/cliente/12345
  ```

### 2. **Upload de faturas**

- **URL**: `/faturas/upload`
- **Método**: `POST`
- **Descrição**: Faz upload de um arquivo de faturas.
- **Exemplo de Requisição**:
  ```http
  POST /faturas/upload
  ```

### 3. **Obter faturas por mês de referência**

- **URL**: `/faturas/mes`
- **Método**: `GET`
- **Descrição**: Retorna todas as faturas para um mês de referência específico.
- **Parâmetros**:
  - `mesReferencia`: Mês de referência no formato `MMM/YYYY` (exemplo: `JAN/2023`).
- **Exemplo de Requisição**:
  ```http
  GET /faturas/mes/?mesReferencia=JAN/2023
  ```

## Testar a API no Render

A API está disponível no ambiente de produção hospedado no **Render**. Você pode acessar os endpoints através do seguinte link:

[https://teste-lumi.onrender.com](https://teste-lumi.onrender.com)

## Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE).
