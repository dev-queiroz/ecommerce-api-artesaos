# API de E-commerce para Artesãos

API RESTful desenvolvida para gerenciar produtos de um único artesão, permitindo o cadastro e listagem de produtos com imagens. Construída com **TypeScript**, **Express**, e **Supabase**, a API é leve, funcional, e otimizada para freelancing, utilizando apenas ferramentas 100% gratuitas.

## Visão Geral

Esta API é projetada para um único proprietário (artesão) que deseja gerenciar seu catálogo de produtos em um e-commerce. Atualmente, suporta:
- Listagem de produtos com URLs de imagens.
- Cadastro de produtos com upload de imagens.
- Armazenamento de imagens no Supabase Storage.
- Banco de dados PostgreSQL via Supabase.

**Tecnologias Utilizadas**:
- **TypeScript**: Para tipagem forte e código robusto.
- **Express**: Framework para criar a API.
- **Supabase**: Banco de dados PostgreSQL e armazenamento de arquivos.
- **Multer**: Para upload de imagens.
- **GitHub**: Versionamento, issues, e futura integração com CI/CD.
- **Render**: Hospedagem gratuita (a ser configurada).

**Status Atual**:
- Endpoints implementados: `GET /produtos` e `POST /produtos`.
- Suporte a upload de imagens no bucket `produtos-imagens`.
- Estrutura do projeto pronta para expansão (testes, documentação Swagger, CI/CD).

## Como Configurar

Siga os passos abaixo para configurar e executar a API localmente.

### Pré-requisitos
- **Node.js** (v18 ou superior): `node -v`
- **npm** (v8 ou superior): `npm -v`
- **Git**: `git --version`
- Conta gratuita no **Supabase** (https://supabase.com)
- **Insomnia** ou similar para testar endpoints
- Editor de código (recomendado: **WebStorm**)

### Passos de Configuração
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/<seu-usuario>/ecommerce-api-artesaos.git
   cd ecommerce-api-artesaos
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
    - Crie um arquivo `.env` na raiz do projeto:
      ```env
      PORT=3000
      SUPABASE_URL=<sua-url-supabase>
      SUPABASE_KEY=<sua-chave-anon-supabase>
      ```
    - No Supabase, vá em **Settings** > **API** para copiar a **URL** e a **Anon Key**.

4. **Configure o Supabase**:
    - Crie um projeto no Supabase (ex.: `ecommerce-artesaos`).
    - Crie a tabela `produtos` no **Table Editor**:
        - Colunas:
            - `id` (int8, primary key, auto-increment)
            - `nome` (varchar)
            - `preco` (float8)
            - `estoque` (int8)
            - `imagem_url` (varchar, opcional)
    - Crie um bucket público no **Storage** chamado `produtos-imagens`.
    - Adicione uma política de upload público no bucket:
        - **Storage** > **Policies** > **New Policy** > **For Uploads** > Selecione `INSERT` sem condições.

5. **Inicie o servidor**:
   ```bash
   npm start
   ```
    - O servidor rodará em `http://localhost:3000`.

## Endpoints

### GET /produtos
Lista todos os produtos cadastrados, incluindo URLs de imagens.

- **URL**: `/produtos`
- **Método**: GET
- **Resposta de Sucesso** (200):
  ```json
  [
    {
      "id": 1,
      "nome": "Anel Artesanal",
      "preco": 40,
      "estoque": 6,
      "imagem_url": "https://<seu-projeto>.supabase.co/storage/v1/object/public/produtos-imagens/<nome-arquivo>"
    }
  ]
  ```
- **Resposta de Erro** (500):
  ```json
  { "error": "Erro ao listar produtos" }
  ```

### POST /produtos
Cria um novo produto com upload de imagem.

- **URL**: `/produtos`
- **Método**: POST
- **Formato**: Multipart Form
- **Campos**:
    - `nome` (string, obrigatório)
    - `preco` (number, obrigatório)
    - `estoque` (number, obrigatório)
    - `imagem` (arquivo, obrigatório, apenas JPEG ou PNG, máx. 5MB)
- **Resposta de Sucesso** (201):
  ```json
  {
    "id": 2,
    "nome": "Brinco Artesanal",
    "preco": 25,
    "estoque": 8,
    "imagem_url": "https://<seu-projeto>.supabase.co/storage/v1/object/public/produtos-imagens/<nome-arquivo>"
  }
  ```
- **Resposta de Erro** (400 ou 500):
  ```json
  { "error": "Campos obrigatórios: nome, preco, estoque" }
  ```
  ```json
  { "error": "Erro ao fazer upload da imagem: <detalhe>" }
  ```

## Como Testar

1. **Usando Insomnia**:
    - **GET /produtos**:
        - Crie uma requisição GET para `http://localhost:3000/produtos`.
        - Verifique a lista de produtos.
    - **POST /produtos**:
        - Crie uma requisição POST para `http://localhost:3000/produtos`.
        - Selecione **Multipart Form**.
        - Adicione os campos `nome`, `preco`, `estoque`, e um arquivo `imagem` (.jpg ou .png).
        - Envie e verifique a resposta.

2. **No Supabase**:
    - Confirme que os produtos aparecem na tabela `produtos`.
    - Verifique as imagens no bucket `produtos-imagens`.

## Estrutura do Projeto

```plaintext
ecommerce-api-artesaos/
├── src/
│   ├── controllers/
│   │   └── produtos.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
```

- **src/controllers/produtos.ts**: Lógica dos endpoints `GET /produtos` e `POST /produtos`.
- **src/index.ts**: Configuração do servidor Express.
- **.env**: Variáveis de ambiente (não versionado).
- **.gitignore**: Ignora `node_modules`, `.env`, e `dist`.
- **tsconfig.json**: Configuração do TypeScript.

## Próximos Passos

- [ ] Adicionar testes unitários com Jest para os endpoints `GET /produtos` e `POST /produtos`.
- [ ] Configurar documentação interativa com Swagger/OpenAPI.
- [ ] Implementar endpoints para carrinho e pedidos.
- [ ] Configurar CI/CD com GitHub Actions e deploy no Render.
- [ ] Criar uma Wiki no GitHub com guias de contribuição e documentação detalhada.

## Contribuindo
Veja o [Guia de Contribuição](https://github.comdev-queiroz/ecommerce-api-artesaos/wiki/Guia-de-Contribui%C3%A7%C3%A3o) na Wiki para detalhes.

Veja a **Wiki** do repositório (a ser criada) para mais detalhes.

## Problemas Conhecidos

- Upload de imagens pode falhar se:
    - O bucket `produtos-imagens` não estiver público.
    - As permissões de upload não estiverem configuradas.
    - A chave Supabase estiver incorreta no `.env`.
- Solução: Verifique as configurações no Supabase e teste uploads manuais no painel.

## Recursos Gratuitos

- **Supabase**: Banco de dados e armazenamento (https://supabase.com)
- **Render**: Hospedagem (https://render.com)
- **GitHub**: Versionamento e CI/CD (https://github.com)
- **Multer**: Upload de arquivos (https://github.com/expressjs/multer)
- **FreeCodeCamp**: Tutoriais de TypeScript e Express (https://freecodecamp.org)
- **MDN Web Docs**: Referência de JavaScript/TypeScript (https://developer.mozilla.org)

## Licença

Este projeto está licenciado sob a **MIT License** (veja o arquivo [`LICENSE`](LICENSE)).