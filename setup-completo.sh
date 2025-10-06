#!/bin/bash

# Script COMPLETO para criar o projeto com TODOS os arquivos
# Execute: bash setup-completo.sh

set -e

PROJECT_NAME="portal-cadastro-empresas"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Criando projeto COMPLETO ${PROJECT_NAME}...${NC}\n"

# Verificar se já existe
if [ -d "$PROJECT_NAME" ]; then
    echo -e "${YELLOW}⚠️  Diretório ${PROJECT_NAME} já existe!${NC}"
    read -p "Deseja sobrescrever? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
    rm -rf $PROJECT_NAME
fi

# Criar estrutura
mkdir -p ${PROJECT_NAME}/{backend/src/companies/{entities,dto},frontend/{app,components,lib}}
cd ${PROJECT_NAME}

echo -e "${YELLOW}📁 Estrutura criada!${NC}\n"

# ==================== DOCKER COMPOSE ====================
echo -e "${BLUE}🐳 Criando docker-compose.yml...${NC}"
cat > docker-compose.yml << 'DOCKERCOMPOSE'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: portal_db
    environment:
      POSTGRES_DB: portal_empresas
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - portal_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: portal_backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: admin
      DATABASE_PASSWORD: admin123
      DATABASE_NAME: portal_empresas
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - portal_network
    command: npm run start:dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: portal_frontend
    ports:
      - "8080:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - portal_network
    command: npm run dev

volumes:
  postgres_data:

networks:
  portal_network:
    driver: bridge
DOCKERCOMPOSE

# ==================== MAKEFILE ====================
cat > Makefile << 'MAKEFILE'
.PHONY: help up down logs clean restart install

help:
	@echo "Comandos disponíveis:"
	@echo "  make up       - Iniciar containers"
	@echo "  make down     - Parar containers"
	@echo "  make logs     - Ver logs"
	@echo "  make clean    - Limpar tudo"
	@echo "  make restart  - Reiniciar"
	@echo "  make install  - Instalar dependências"

up:
	docker-compose up --build

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	rm -rf backend/node_modules frontend/node_modules

restart: down up

install:
	cd backend && npm install
	cd frontend && npm install
MAKEFILE

# ==================== README ====================
cat > README.md << 'README'
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

## 📄 Licença

Projeto desenvolvido para fins educacionais.
README

echo -e "${GREEN}✅ Arquivos principais criados!${NC}\n"

# ==================== BACKEND ====================
echo -e "${BLUE}📦 Configurando Backend...${NC}"
cd backend

# Package.json
cat > package.json << 'PACKAGEJSON'
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Portal de Cadastro de Empresas - Backend",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.1.16",
    "@nestjs/typeorm": "^10.0.1",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
PACKAGEJSON

# Dockerfile
cat > Dockerfile << 'DOCKERFILE'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
DOCKERFILE

# .env
cat > .env << 'ENVFILE'
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=admin123
DATABASE_NAME=portal_empresas
PORT=3000
ENVFILE

# .gitignore
cat > .gitignore << 'GITIGNORE'
node_modules/
dist/
.env
.env.local
.DS_Store
Thumbs.db
GITIGNORE

# tsconfig.json
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false
  }
}
TSCONFIG

# nest-cli.json
cat > nest-cli.json << 'NESTCLI'
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
NESTCLI

echo -e "${YELLOW}📥 Baixando dependências do backend (pode demorar)...${NC}"
npm install --silent

echo -e "${GREEN}✅ Backend configurado!${NC}\n"

cd ..

# ==================== FRONTEND ====================
echo -e "${BLUE}📦 Configurando Frontend...${NC}"
cd frontend

# Package.json básico
cat > package.json << 'PACKAGEJSON'
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.300.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-checkbox": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.0"
  }
}
PACKAGEJSON

# Dockerfile
cat > Dockerfile << 'DOCKERFILE'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
DOCKERFILE

# .env.local
cat > .env.local << 'ENVLOCAL'
NEXT_PUBLIC_API_URL=http://localhost:3000
ENVLOCAL

# next.config.js
cat > next.config.js << 'NEXTCONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = nextConfig;
NEXTCONFIG

# .gitignore
cat > .gitignore << 'GITIGNORE'
node_modules/
.next/
out/
build/
.env*.local
.DS_Store
Thumbs.db
.vercel
GITIGNORE

# tailwind.config.ts
cat > tailwind.config.ts << 'TAILWIND'
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
TAILWIND

# components.json (shadcn config)
cat > components.json << 'COMPONENTS'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
COMPONENTS

# globals.css
mkdir -p app
cat > app/globals.css << 'GLOBALS'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
GLOBALS

# tsconfig.json
cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSCONFIG

echo -e "${YELLOW}📥 Baixando dependências do frontend (pode demorar)...${NC}"
npm install --silent

echo -e "${GREEN}✅ Frontend configurado!${NC}\n"

cd ..

# ==================== FINALIZAÇÃO ====================
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ PROJETO CRIADO COM SUCESSO!                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📂 Localização: $(pwd)${NC}"
echo ""
echo -e "${YELLOW}⚠️  ATENÇÃO: Você ainda precisa copiar os arquivos de código!${NC}"
echo ""
echo -e "${BLUE}📝 Próximos passos:${NC}"
echo ""
echo "1. Copie os arquivos TypeScript/React dos artifacts"
echo "2. Execute: ${GREEN}docker-compose up --build${NC}"
echo ""
echo -e "${BLUE}🌐 URLs após iniciar:${NC}"
echo "   Frontend: ${GREEN}http://localhost:8080${NC}"
echo "   Backend:  ${GREEN}http://localhost:3000${NC}"
echo "   Swagger:  ${GREEN}http://localhost:3000/api/docs${NC}"
echo ""
echo -e "${YELLOW}💡 Use 'make help' para ver comandos disponíveis${NC}"
echo ""
