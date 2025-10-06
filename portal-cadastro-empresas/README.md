# 🏢 Portal de Cadastro de Empresas

Sistema completo para cadastro e gestão de empresas usando NestJS, Next.js, shadcn/ui e PostgreSQL.

## 🚀 Início Rápido

### Opção 1: Com Docker (Recomendado)

\`\`\`bash
cd portal-cadastro-empresas
docker-compose up --build
\`\`\`

### Opção 2: Desenvolvimento Local

\`\`\`bash

# Terminal 1 - Database

docker run --name portal_db \\
-e POSTGRES_DB=portal_empresas \\
-e POSTGRES_USER=admin \\
-e POSTGRES_PASSWORD=admin123 \\
-p 5432:5432 -d postgres:15-alpine

# Terminal 2 - Backend

cd backend && npm install && npm run start:dev

# Terminal 3 - Frontend

cd frontend && npm install && npm run dev
\`\`\`

## 🌐 Acessar Aplicação

- **Frontend**: http://localhost:8080 (Docker) ou http://localhost:3000 (Local)
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **PostgreSQL**: localhost:5432

## 🛠️ Tecnologias

### Backend

- NestJS
- TypeORM
- PostgreSQL
- Swagger
- Docker

### Frontend

- Next.js 14
- shadcn/ui
- Tailwind CSS
- React Hook Form
- Zod
- Axios

## 📝 Funcionalidades

✅ Cadastro de empresas (Jurídica, Física, Estrangeira)
✅ Validação de CNPJ/CPF
✅ Upload de documentos
✅ Aprovação/Reprovação de empresas
✅ Listagem e gestão
✅ Interface moderna e responsiva
