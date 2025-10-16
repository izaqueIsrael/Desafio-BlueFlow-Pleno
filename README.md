# 🎬 BlueFlow - Gerenciador de Vídeos do YouTube

Sistema completo de gerenciamento de vídeos do YouTube com arquitetura de microsserviços.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Obter YouTube API Key](#-como-obter-youtube-api-key)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Testando a Aplicação](#-testando-a-aplicação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **BlueFlow** é uma aplicação web moderna que permite aos usuários:

- 🔐 **Autenticar-se** com segurança usando JWT
- 🔍 **Buscar vídeos** do YouTube por palavras-chave
- 📺 **Ver vídeos em alta** direto da API oficial do YouTube
- ⭐ **Favoritar vídeos** e gerenciar sua coleção pessoal
- 📱 **Interface responsiva** que funciona em qualquer dispositivo

O projeto foi desenvolvido seguindo os **princípios SOLID**, **Clean Architecture** e utiliza diversos **Design Patterns** como Repository, Strategy e Adapter.

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Registro de novos usuários
- Login com email e senha
- Tokens JWT com expiração de 24 horas
- Proteção de rotas privadas

### 📹 Vídeos
- Busca personalizada de vídeos do YouTube
- Listagem de vídeos em alta (trending)
- Paginação de resultados
- Cache inteligente para economizar chamadas à API

### ⭐ Favoritos
- Adicionar vídeos aos favoritos
- Remover vídeos dos favoritos
- Ver lista completa de favoritos
- Cada usuário tem sua própria lista

---

## 🛠️ Tecnologias

### Backend
- **NestJS** - Framework Node.js moderno e escalável
- **TypeScript** - JavaScript com tipagem estática
- **PostgreSQL** - Banco de dados relacional (3 instâncias isoladas)
- **TypeORM** - ORM para TypeScript/JavaScript
- **JWT** - Autenticação via tokens
- **Bcrypt** - Hash seguro de senhas
- **Jest** - Framework de testes

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **Sonner** - Sistema de notificações toast
- **Axios** - Cliente HTTP

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

---

## 🏗️ Arquitetura

O projeto utiliza **arquitetura de microsserviços**, com 3 serviços independentes:

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js)                  │
│         http://localhost:3000               │
└──────┬──────────┬──────────┬────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Auth    │ │  Videos  │ │Favorites │
│ Service  │ │ Service  │ │ Service  │
│ :3001    │ │ :3002    │ │ :3003    │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Auth DB  │ │Videos DB │ │Favorites │
│ :5432    │ │ :5433    │ │   DB     │
│          │ │          │ │ :5434    │
└──────────┘ └──────────┘ └──────────┘
```

### Comunicação entre Serviços

- Frontend se comunica com cada microsserviço via **REST API**
- `videos-service` e `favorites-service` validam tokens com `auth-service`
- Cada serviço tem seu próprio banco de dados PostgreSQL isolado

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (vem com o Node.js)
- **Docker** e **Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/downloads))
- **YouTube API Key** (veja como obter abaixo)

### Verificar Instalações

```bash
# Verificar versão do Node.js
node --version
# Deve retornar: v18.x.x ou superior

# Verificar versão do npm
npm --version
# Deve retornar: 9.x.x ou superior

# Verificar Docker
docker --version
# Deve retornar: Docker version 20.x.x ou superior

# Verificar Docker Compose
docker-compose --version
# Deve retornar: docker-compose version 1.29.x ou superior
```

---

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
# Clone o repositório
git clone https://github.com/jmgrd98/Desafio-BlueFlow-Pleno.git

# Entre na pasta do projeto
cd Desafio-BlueFlow-Pleno
```

### 2. Iniciar os Bancos de Dados

```bash
# Inicie os 3 bancos PostgreSQL com Docker Compose
docker-compose up -d

# Verificar se os containers estão rodando
docker ps

# Você deve ver 3 containers:
# - auth-db (porta 5432)
# - videos-db (porta 5433)
# - favorites-db (porta 5434)
```

### 3. Instalar Dependências dos Microsserviços

#### Auth Service

```bash
cd backend/auth-service
npm install
cd ../..
```

#### Videos Service

```bash
cd backend/videos-service
npm install
cd ../..
```

#### Favorites Service

```bash
cd backend/favorites-service
npm install
cd ../..
```

#### Frontend

```bash
cd frontend
npm install
cd ..
```

---

## ⚙️ Configuração

Você precisa criar arquivos `.env` para cada serviço com as configurações necessárias.

### 1. Auth Service

```bash
# Criar arquivo .env
cd backend/auth-service
nano .env
```

Cole o seguinte conteúdo:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth_pass
DB_DATABASE=auth_db
JWT_SECRET=sua-chave-secreta-super-segura-aqui-mude-em-producao
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Troque `JWT_SECRET` por uma chave aleatória e segura em produção!

### 2. Videos Service

```bash
# Criar arquivo .env
cd backend/videos-service
nano .env
```

Cole o seguinte conteúdo:

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=videos_user
DB_PASSWORD=videos_pass
DB_DATABASE=videos_db
YOUTUBE_API_KEY=SUA_CHAVE_DA_API_DO_YOUTUBE_AQUI
AUTH_SERVICE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

**⚠️ CRÍTICO:** Você PRECISA adicionar sua `YOUTUBE_API_KEY`! Veja como obter abaixo.

### 3. Favorites Service

```bash
# Criar arquivo .env
cd backend/favorites-service
nano .env
```

Cole o seguinte conteúdo:

```env
PORT=3003
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=favorites_user
DB_PASSWORD=favorites_pass
DB_DATABASE=favorites_db
AUTH_SERVICE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend

```bash
# Criar arquivo .env.local
cd frontend
nano .env.local
```

Cole o seguinte conteúdo:

```env
NEXT_PUBLIC_AUTH_API_URL=http://localhost:3001
NEXT_PUBLIC_VIDEOS_API_URL=http://localhost:3002
NEXT_PUBLIC_FAVORITES_API_URL=http://localhost:3003
```

---

## 🔑 Como Obter YouTube API Key

A aplicação utiliza a **YouTube Data API v3** para buscar vídeos. É **OBRIGATÓRIO** ter uma API Key.

### Passo a Passo Completo

#### 1. Acesse o Google Cloud Console

Abra seu navegador e vá para: [https://console.cloud.google.com](https://console.cloud.google.com)

#### 2. Crie um Novo Projeto

1. Clique no seletor de projetos no topo da página
2. Clique em **"NOVO PROJETO"**
3. Nome do projeto: `BlueFlow` (ou qualquer nome)
4. Clique em **"CRIAR"**
5. Aguarde alguns segundos
6. Selecione o projeto criado

#### 3. Ative a YouTube Data API v3

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Na busca, digite: `YouTube Data API v3`
3. Clique no resultado **"YouTube Data API v3"**
4. Clique em **"ATIVAR"**
5. Aguarde a ativação (alguns segundos)

#### 4. Crie a API Key

1. Vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"CRIAR CREDENCIAIS"**
3. Selecione **"Chave de API"**
4. Uma janela popup aparecerá com sua chave! 🎉
5. **COPIE A CHAVE** e guarde em local seguro

Exemplo de chave: `AIzaSyB1234567890abcdefghijklmnopqrstuvw`

#### 5. (Opcional) Restrinja a API Key

Para maior segurança:

1. Clique em **"EDITAR CHAVE DE API"**
2. Em **"Restrições de API"**, selecione **"Restringir chave"**
3. Marque apenas: **"YouTube Data API v3"**
4. Clique em **"SALVAR"**

#### 6. Adicione no .env do Videos Service

```bash
# backend/videos-service/.env
YOUTUBE_API_KEY=SUA_CHAVE_AQUI
```

### ⚠️ Importante sobre a API

- **Quota diária gratuita:** 10.000 unidades/dia
- **Custo de uma busca:** ~100 unidades
- **Total de buscas por dia:** ~100 buscas gratuitas
- **Reset da quota:** Meia-noite (horário PST)

Se exceder o limite, você verá o erro: `quotaExceeded`

---

## 🎮 Executando a Aplicação

Você precisa abrir **4 terminais diferentes**, um para cada serviço.

### Terminal 1 - Auth Service

```bash
cd backend/auth-service
npm run start:dev
```

✅ Aguarde até ver: `🚀 Auth Service running on port 3001`

### Terminal 2 - Videos Service

```bash
cd backend/videos-service
npm run start:dev
```

✅ Aguarde até ver: `🎥 Videos Service running on port 3002`

### Terminal 3 - Favorites Service

```bash
cd backend/favorites-service
npm run start:dev
```

✅ Aguarde até ver: `⭐ Favorites Service running on port 3003`

### Terminal 4 - Frontend

```bash
cd frontend
npm run dev
```

✅ Aguarde até ver: `Ready on http://localhost:3000`

### ✅ Pronto!

Acesse a aplicação em: **http://localhost:3000**

---

## 🧪 Testando a Aplicação

### 1. Criar uma Conta

1. Acesse: http://localhost:3000
2. Clique em **"Sign up"** (Criar conta)
3. Preencha:
   - Nome: `Seu Nome`
   - Email: `seu@email.com`
   - Senha: `senha123` (mínimo 6 caracteres)
4. Clique em **"Create Account"**

### 2. Fazer Login

1. Após o registro, você será redirecionado automaticamente
2. Ou vá para: http://localhost:3000/login
3. Entre com seu email e senha

### 3. Buscar Vídeos

1. No dashboard, use a barra de busca
2. Digite algo como: `javascript tutorial`
3. Clique em **"Search"**
4. Veja os resultados!

### 4. Favoritar Vídeos

1. Clique no ❤️ (coração) em qualquer vídeo
2. O coração ficará vermelho ✅
3. Vá na aba **"Favorites"** para ver seus favoritos

### 5. Ver Vídeo no YouTube

Clique na thumbnail ou título de qualquer vídeo para abrir no YouTube.

---

## 🧪 Executar Testes Automatizados

```bash
# Auth Service
cd backend/auth-service
npm run test

# Com coverage
npm run test:cov

# Videos Service
cd backend/videos-service
npm run test
npm run test:cov

# Favorites Service
cd backend/favorites-service
npm run test
npm run test:cov
```

**Cobertura de testes:** > 80% em todos os serviços

---

## 📁 Estrutura do Projeto

```
Desafio-BlueFlow-Pleno/
│
├── backend/
│   ├── auth-service/              # Microsserviço de Autenticação
│   │   ├── src/
│   │   │   ├── domain/           # Entidades (User)
│   │   │   ├── application/      # Casos de uso, DTOs, Services
│   │   │   ├── infrastructure/   # Repositories, Guards, Adapters
│   │   │   ├── presentation/     # Controllers
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/                 # Testes unitários
│   │   ├── .env                  # Configurações (não versionado)
│   │   └── package.json
│   │
│   ├── videos-service/            # Microsserviço de Vídeos
│   │   ├── src/
│   │   │   ├── domain/           # Entidades (VideoCache)
│   │   │   ├── application/      # Services, DTOs
│   │   │   ├── infrastructure/   # YouTube Adapter, Repositories
│   │   │   ├── presentation/     # Controllers
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── .env
│   │   └── package.json
│   │
│   └── favorites-service/         # Microsserviço de Favoritos
│       ├── src/
│       │   ├── domain/           # Entidades (Favorite)
│       │   ├── application/      # Services, DTOs
│       │   ├── infrastructure/   # Repositories
│       │   ├── presentation/     # Controllers
│       │   └── main.ts
│       ├── test/
│       ├── .env
│       └── package.json
│
├── frontend/                      # Aplicação Next.js
│   ├── app/                      # App Router
│   │   ├── login/               # Página de login
│   │   ├── register/            # Página de registro
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # Componentes React
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   ├── navbar.tsx
│   │   └── video-card.tsx
│   ├── contexts/                 # Context API
│   │   └── auth-context.tsx
│   ├── lib/                      # Utilitários
│   │   └── api-client.ts
│   ├── .env.local               # Configurações (não versionado)
│   └── package.json
│
├── docker-compose.yml             # Configuração dos bancos
├── README.md                      # Este arquivo
└── .gitignore
```

---

## 📡 API Endpoints

### Auth Service (http://localhost:3001)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Registrar novo usuário | ❌ |
| POST | `/auth/login` | Fazer login | ❌ |
| GET | `/auth/profile` | Obter perfil do usuário | ✅ |
| GET | `/auth/validate` | Validar token JWT | ✅ |

### Videos Service (http://localhost:3002)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/videos/search?query=termo` | Buscar vídeos | ✅ |
| GET | `/videos/trending` | Vídeos em alta | ✅ |
| GET | `/videos/:id` | Detalhes de um vídeo | ✅ |

### Favorites Service (http://localhost:3003)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/favorites` | Listar favoritos do usuário | ✅ |
| POST | `/favorites` | Adicionar aos favoritos | ✅ |
| DELETE | `/favorites/:videoId` | Remover dos favoritos | ✅ |
| GET | `/favorites/check/:videoId` | Verificar se é favorito | ✅ |

### Exemplos de Uso com cURL

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "name": "Teste User"
  }'

# 2. Login (copie o accessToken da resposta)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'

# 3. Buscar vídeos (substitua YOUR_TOKEN)
curl -X GET "http://localhost:3002/videos/search?query=javascript" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Ver favoritos
curl -X GET http://localhost:3003/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Troubleshooting

### Problema: Porta já está em uso

```bash
# Erro: EADDRINUSE: address already in use :::3001

# Solução: Matar o processo na porta
sudo kill -9 $(sudo lsof -t -i:3001)

# Para todas as portas:
sudo kill -9 $(sudo lsof -t -i:3001)
sudo kill -9 $(sudo lsof -t -i:3002)
sudo kill -9 $(sudo lsof -t -i:3003)
sudo kill -9 $(sudo lsof -t -i:3000)
```

### Problema: Erro ao conectar no banco de dados

```bash
# Erro: Connection refused 127.0.0.1:5432

# Solução: Reiniciar containers Docker
docker-compose down
docker-compose up -d

# Aguarde 10 segundos
sleep 10

# Reinicie os serviços
```

### Problema: YouTube API - 403 Forbidden

```bash
# Erro: quotaExceeded ou API key not valid

# Soluções:
1. Verifique se a YOUTUBE_API_KEY está correta no .env
2. Confirme que a YouTube Data API v3 está ativada
3. Aguarde o reset da quota (meia-noite PST)
4. Crie outra API Key em outro projeto
```

### Problema: 401 Unauthorized nas requisições

```bash
# Erro: Invalid token

# Soluções:
1. Faça login novamente para obter novo token
2. Verifique se o token não expirou (24h de validade)
3. Certifique-se que JWT_SECRET é o mesmo em todos os .env
4. Verifique se AUTH_SERVICE_URL está correto nos outros serviços
```

### Problema: Frontend não carrega

```bash
# Erro: Failed to fetch

# Soluções:
1. Verifique se todos os serviços backend estão rodando
2. Confirme as URLs no .env.local do frontend
3. Limpe o cache: rm -rf frontend/.next
4. Reinstale: cd frontend && npm install
```

### Problema: Módulo não encontrado

```bash
# Erro: Cannot find module

# Solução: Reinstalar dependências
cd backend/auth-service
rm -rf node_modules package-lock.json
npm install

# Repita para cada serviço
```

---

## 🎨 Design Patterns Utilizados

1. **Repository Pattern** - Abstração de acesso a dados
2. **Strategy Pattern** - Diferentes estratégias de hash (Bcrypt) e token (JWT)
3. **Adapter Pattern** - Adaptador para YouTube API
4. **Factory Pattern** - Criação de entidades
5. **Dependency Injection** - Inversão de controle (NestJS)
6. **Guard Pattern** - Proteção de rotas

---

## 🔒 Segurança

- ✅ Senhas hasheadas com **Bcrypt** (10 salt rounds)
- ✅ Autenticação **JWT** com expiração de 24 horas
- ✅ **Guards** para proteção de rotas privadas
- ✅ Validação de entrada com **class-validator**
- ✅ **CORS** configurado para permitir apenas frontend
- ✅ Variáveis sensíveis em arquivos **.env** (não versionados)
- ✅ Comunicação autenticada entre microsserviços

---

## 📝 Scripts Úteis

```bash
# Parar TODOS os processos Node
pkill -9 node

# Ver processos rodando nas portas
sudo lsof -i :3001
sudo lsof -i :3002
sudo lsof -i :3003

# Ver logs do Docker
docker-compose logs -f

# Resetar TUDO (bancos de dados)
docker-compose down -v
docker-compose up -d

# Rebuild de um serviço
cd backend/auth-service
rm -rf dist
npm run build
npm run start:dev
```

---

## 👨‍💻 Autor

**João Matheus Gervásio Rodrigues Dantas**

- GitHub: [@jmgrd98](https://github.com/jmgrd98)
- LinkedIn: [João Dantas](https://linkedin.com/in/seu-perfil)

---

## 📄 Licença

Este projeto foi desenvolvido para o desafio técnico BlueFlow.

---

## 🆘 Precisa de Ajuda?

Se você encontrou algum problema ou tem dúvidas:

1. 📖 Leia a seção de [Troubleshooting](#-troubleshooting)
2. 🔍 Verifique se seguiu todos os passos da [Instalação](#-instalação)
3. 🐛 Abra uma [Issue no GitHub](https://github.com/jmgrd98/Desafio-BlueFlow-Pleno/issues)

---

⭐ **Se você gostou do projeto, deixe uma estrela no repositório!**

🚀 **Desenvolvido com dedicação para o desafio BlueFlow**