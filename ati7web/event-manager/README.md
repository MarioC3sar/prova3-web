# 📅 Gerenciador de Eventos

Sistema de gerenciamento de eventos desenvolvido com TypeScript, Node.js, Express e MongoDB.

## 🚀 Tecnologias Utilizadas

- **Backend:**

  - TypeScript
  - Node.js
  - Express
  - MongoDB (via Mongoose)
  - CORS
  - dotenv

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (Vanilla)

## 📋 Requisitos

- Node.js (versão 14 ou superior)
- MongoDB instalado e rodando localmente na porta padrão 27017
- npm ou yarn

## 🔧 Instalação

1. **Instale as dependências:**

```bash
npm install
```

2. **Configure o MongoDB:**

   - Certifique-se de que o MongoDB está instalado e rodando
   - O banco de dados "evento" será criado automaticamente na primeira execução

3. **Configure as variáveis de ambiente (opcional):**
   - O arquivo `.env` já está configurado com valores padrão
   - Você pode modificar se necessário

## ▶️ Executando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
```

### Modo de Produção

```bash
npm run build
npm start
```

O servidor estará disponível em: **http://localhost:3000**

## 📚 Funcionalidades

### CRUD Completo de Eventos

1. **Criar Evento (POST /api/events)**

   - Adiciona um novo evento ao sistema
   - Validação de campos obrigatórios

2. **Listar Eventos (GET /api/events)**

   - Lista todos os eventos ordenados por data

3. **Buscar por Título (GET /api/events/search?titulo=...)**

   - Pesquisa eventos por título (case-insensitive)

4. **Buscar por ID (GET /api/events/:id)**

   - Retorna um evento específico

5. **Atualizar Evento (PUT /api/events/:id)**

   - Atualiza informações de um evento existente

6. **Deletar Evento (DELETE /api/events/:id)**
   - Remove um evento do sistema

## 📊 Modelo de Dados

Cada evento contém:

- **título** (String, obrigatório): Nome do evento
- **descrição** (String, opcional): Descrição detalhada
- **data** (Date, obrigatório): Data e hora do evento
- **local** (String, obrigatório): Local do evento
- **valor** (Number, obrigatório): Valor do ingresso/participação

## 🎨 Interface do Usuário

A interface permite:

- ✅ Adicionar novos eventos através de formulário
- ✅ Listar todos os eventos com design responsivo
- ✅ Pesquisar eventos por título
- ✅ Editar eventos existentes
- ✅ Excluir eventos com confirmação
- ✅ Mensagens de sucesso/erro para todas as operações

## 📁 Estrutura do Projeto

```
event-manager/
├── src/
│   ├── config/
│   │   └── database.ts      # Configuração do MongoDB
│   ├── models/
│   │   └── Event.ts         # Modelo Mongoose
│   ├── controllers/
│   │   └── eventController.ts # Lógica de negócio
│   ├── routes/
│   │   └── eventRoutes.ts   # Rotas da API
│   └── index.ts             # Servidor Express
├── public/
│   ├── index.html           # Interface HTML
│   ├── styles.css           # Estilos CSS
│   └── script.js            # Lógica frontend
├── package.json
├── tsconfig.json
└── .env
```

## 🧪 Testando a API

### Exemplos com cURL:

**Criar evento:**

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Show de Rock",
    "descricao": "Festival de rock nacional",
    "data": "2025-12-31T20:00:00",
    "local": "Estádio Municipal",
    "valor": 150.00
  }'
```

**Listar eventos:**

```bash
curl http://localhost:3000/api/events
```

**Buscar por título:**

```bash
curl http://localhost:3000/api/events/search?titulo=rock
```

## ⚠️ Observações

- O MongoDB deve estar rodando antes de iniciar a aplicação
- O servidor roda na porta 3000 (configurável via .env)
- Todas as respostas da API seguem o formato JSON
- Validações são feitas no modelo Mongoose

## 👨‍💻 Desenvolvido por

Mario Cesar
Desenvolvimento Web III - TypeScript com MongoDB
