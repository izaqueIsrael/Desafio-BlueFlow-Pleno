# Decisões Técnicas e Trade-offs

Documentação das principais decisões arquiteturais e tecnológicas do projeto **BlueFlow**.

---

## Arquitetura do Sistema

### Decisão: Dividir em Microsserviços

**O que foi feito:**
* 4 serviços separados: servico-auth, servico-videos, servico-favoritos, servidor-principal
* Serviços conversam entre si via HTTP/REST
* Servidor principal funciona como portão de entrada único

**Por que essa escolha:**
* Cada serviço cuida de uma coisa específica
* Dá pra aumentar a capacidade de cada serviço separadamente
* Cada um pode ser desenvolvido e atualizado de forma independente

**Prós e contras:**
* **Positivo:** Fácil adicionar coisas novas sem quebrar o que já funciona, se um falhar os outros continuam
* **Negativo:** Comunicação entre serviços é mais lenta, mais difícil de encontrar erros

---

## Tecnologias e Frameworks

### Decisão: Express.js ao invés de Nest.js

**Por que Express:**
* Controle total de como montar a aplicação
* Mais leve e direto ao ponto
* Suficiente para o que o desafio pede

**Prós e contras:**
* **Positivo:** Total liberdade, fácil de aprender
* **Negativo:** Tem que montar tudo na mão

### Decisão: TypeScript em tudo

**Por que TypeScript:**
* Pega erros antes do código rodar
* Código se explica sozinho com os tipos
* Requisito do desafio

---

## Onde os Dados Ficam Salvos

### Decisão: PostgreSQL desde o começo

**O que foi feito:**
- Dois bancos de dados PostgreSQL separados
- blueflow_auth (porta 5432) - guarda usuários e senhas
- blueflow_favoritos (porta 5433) - guarda vídeos favoritados
- Usa biblioteca `pg` pra conectar
- Cada serviço tem seu próprio banco

**Opções de execução:**
- **Docker (recomendado):** `docker-compose up -d` no diretório `backend/`
- **Local:** PostgreSQL instalado diretamente na máquina

**Nota sobre bibliotecas:**
- `pg` é o driver básico de conexão com PostgreSQL
- Necessário pois o desafio pede PostgreSQL como preferência

---

## Segurança e Login

### Decisão: JWT e Hash feitos do zero

**O que foi feito:**
* JWT criado manualmente com HMAC-SHA256
* Codificação Base64Url implementada
* Senha protegida com SHA-256 e sal aleatório de 16 bytes
* Token Bearer enviado no cabeçalho Authorization
* Chave secreta JWT gerada com: `node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"`

**Por que essa escolha:**
* O desafio não permite usar bibliotecas prontas (jsonwebtoken, bcrypt)
* Mostra que entendo como funciona por baixo dos panos

**Importante:** Em produção de verdade é obrigatório usar bcrypt e jsonwebtoken por segurança.

---

## Organização do Código

### Repository + Service Pattern

**Como funciona:**
```
Repository → busca e salva dados (PostgreSQL)
Service → regras de negócio
Controller → recebe e responde requisições HTTP
```

**Por que:**
* Fácil de testar cada parte separada
* Cada camada tem sua responsabilidade clara
* Segue boas práticas de programação

### Factory e Adapter Patterns

**Como funciona:**
* **Factory:** HttpClient criado com configurações específicas para cada serviço
* **Adapter:** YouTubeAdapter traduz dados da API do YouTube pro formato da aplicação

**Por que:**
* Isola a conversão de dados externos
* Fácil trocar implementação de clientes HTTP

---

## Como Testar o Código

### Decisão: Jest para testes

**Estrutura:**
```
tests/
├── unit/           (testa funções e classes isoladas)
└── integration/    (testa serviços trabalhando juntos)
```

**Por que Jest:**
* Funciona direto com TypeScript
* Já vem com tudo que precisa (mocking, coverage)
* Roda testes em paralelo

**Cobertura:** Testes implementados nos serviços de autenticação e validação do frontend

---

## Como os Serviços Conversam

### Decisão: HTTP/REST direto

**O que foi feito:**
* HTTP direto entre serviços
* Dados trafegam em JSON
* Tempo limite configurado

**Prós e contras:**
* **Positivo:** Simples de fazer e debugar
* **Negativo:** Se um serviço cai, pode afetar outros

---

## Tratamento de Erros

**O que foi feito:**
* Middleware de erro centralizado em cada serviço
* Validações nos controllers antes de processar
* Try-catch em todas operações assíncronas
* Mensagens de erro claras pro usuário

---

## O Que Foi Entregue

**Requisitos do desafio cumpridos:**
- TypeScript em todo código (modo strict)
- Microsserviços funcionando
- Testes automatizados configurados
- Padrões de projeto (Repository, Factory, Adapter)
- Sistema de login e proteção de rotas
- Busca na API do YouTube
- Sistema de favoritos por usuário
- Frontend e backend separados

---

## Configuração de Ambiente

### Bancos de Dados

**Docker (recomendado):**
```bash
cd backend/
docker-compose up -d
```
* Cria automaticamente os dois bancos PostgreSQL
* Configurado com portas 5432 e 5433
* Dados persistem em volumes Docker

**Instalação Local:**
* PostgreSQL 15+ instalado na máquina
* Criar manualmente os bancos `blueflow_auth` e `blueflow_favoritos`
* Ajustar portas e credenciais nos arquivos `.env`

### Variáveis de Ambiente

**Arquivos .env.example:**
* Contém dados sensíveis (chaves de API, secrets) já preenchidos
* Normalmente não seria feito por questões de segurança
* Deixado assim para facilitar os testes do avaliador
* **Para usar:** copie o conteúdo do `.env.example` para `.env` em cada serviço

**Arquivos com dados:**
* `backend/servico-auth/.env.example` - JWT_SECRET já configurado
* `backend/servico-videos/.env.example` - YOUTUBE_API_KEY já configurado
* `backend/servico-favoritos/.env.example` - DATABASE_URL configurada
* `backend/servidor-principal/.env.example` - URLs dos serviços

**Importante:** Em produção, esses dados nunca devem estar versionados.

---

## Bibliotecas Adicionais

Além das permitidas (Express, Jest, dotenv), foram usadas:

**pg:** Sem driver é impossível conectar no PostgreSQL (pedido como preferência no desafio)  
**cors:** Frontend e backend em portas diferentes, navegador bloqueia sem CORS  
**swagger-ui-express:** Documentação interativa da API - Docs: http://localhost:3000/api-docs
