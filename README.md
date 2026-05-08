<h1 align="center">Refund API</h1>

<p align="center">
	Backend da aplicação de reembolso desenvolvido com Node.js + Express + TypeScript.
</p>

<p align="center">
	Projeto criado durante o curso Fullstack da Rocketseat, com melhorias e decisões adicionais implementadas por <strong>Lucas Moura</strong>.
</p>

## Sobre o projeto

A **Refund API** é o backend de um sistema de solicitação e gestão de reembolsos, com autenticação JWT, autorização por perfil de usuário e fluxo completo de criação, visualização e gerenciamento de solicitações de reembolso com upload de comprovantes.

### Funcionalidades principais

- Autenticação com JWT
- Autorização baseada em perfil de usuário (`employee` e `manager`)
- Cadastro e login de usuários
- CRUD de solicitações de reembolso
- Upload de comprovantes de reembolso
- Categorização de reembolsos
- Validação com Zod
- Tratamento centralizado de erros
- Persistência com Prisma ORM e PostgreSQL

## Stack utilizada

- Node.js 20+
- Express 5.2.1
- TypeScript
- Prisma 7 (ORM)
- PostgreSQL
- JWT (autenticação)
- Bcrypt (criptografia de senha)
- Multer (upload de arquivos)
- Zod (validação de schema)
- Docker & Docker Compose

## Estrutura de pastas

```text
src/
	configs/          # Configurações (autenticação, upload, etc)
	controllers/      # Lógica dos endpoints
	database/         # Instâncias do Prisma
	generated/        # Tipos gerados do Prisma
	middlewares/      # Middlewares (autenticação, autorização, tratamento de erros)
	providers/        # Serviços de terceiros (armazenamento em disco)
	routes/           # Definição de rotas
	types/            # Tipos TypeScript customizados
	utils/            # Utilitários (classe AppError)
prisma/
	migrations/       # Histórico de migrações do banco
	schema.prisma     # Schema do banco de dados
```

## Modelos de dados

### User

- `id` (UUID)
- `name` (String)
- `email` (String única)
- `password` (String)
- `role` (UserRole: `employee` | `manager`)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Refunds

- `id` (UUID)
- `name` (String)
- `amount` (Float)
- `category` (Category: `food` | `others` | `services` | `transport` | `accommodation`)
- `fileKey` (String)
- `originalFilename` (String opcional)
- `userId` (FK)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Como rodar o projeto

### Pré-requisitos

- Node.js 20+ (recomendado)
- npm
- PostgreSQL (ou usar Docker)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=refund_db
JWT_SECRET=sua_chave_jwt_secreta
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/refund_db
```

Você pode usar `.env-example` como referência.

### 3. Setup do banco de dados

```bash
# Executar migrações
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio para gerenciar dados
npx prisma studio
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3333`

### 5. Rodando com Docker

Se preferir usar Docker:

```bash
docker-compose up
```

## Endpoints principais

### Autenticação

- `POST /sessions` - Login
- `POST /users` - Registrar novo usuário

### Solicitações de Reembolso

- `GET /refunds` - Listar reembolsos (com filtros)
- `GET /refunds/:id` - Obter detalhes de um reembolso
- `POST /refunds` - Criar nova solicitação
- `DELETE /refunds/:id` - Deletar solicitação

### Upload

- `POST /uploads` - Fazer upload de comprovante

## Frontend (cliente)

- Repositório: **LINK_DO_REPOSITORIO_FRONTEND**

## Melhorias implementadas

Além da base do curso, foram aplicadas melhorias como:

- Validação robusta com Zod
- Tratamento centralizado de erros com classe AppError
- Autorização por perfil de usuário
- Upload seguro de arquivos
- Tipagem completa com TypeScript
- Arquitetura em camadas (Controllers, Services, Routes)

## Autor

**Lucas Moura**

- GitHub: (https://github.com/keewonf)
- LinkedIn: (https://www.linkedin.com/in/lucas-moura-261356268/)

## Créditos

Projeto desenvolvido no contexto do curso Fullstack da **Rocketseat**, com adaptações e evoluções próprias.
