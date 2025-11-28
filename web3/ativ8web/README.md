# 🏢 Sistema Corporativo de Controle de Ordens de Serviço

Sistema completo de gerenciamento de ordens de serviço desenvolvido com TypeScript, Express e MongoDB. Ideal para empresas que precisam gerenciar solicitações internas de manutenção, suporte técnico ou atendimento operacional.

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
   - O banco de dados "service_orders" será criado automaticamente na primeira execução

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

### CRUD Completo de Ordens de Serviço

1. **Criar Ordem de Serviço (POST /api/service-orders)**

   - Adiciona uma nova ordem ao sistema
   - Validação de campos obrigatórios
   - Data de abertura gerada automaticamente

2. **Listar Ordens (GET /api/service-orders)**

   - Lista todas as ordens ordenadas por data de abertura (mais recentes primeiro)
   - Filtros opcionais: status, prioridade, setorSolicitante

3. **Buscar por Título (GET /api/service-orders/search?titulo=...)**

   - Pesquisa ordens por título (case-insensitive)

4. **Buscar por ID (GET /api/service-orders/:id)**

   - Retorna uma ordem específica

5. **Atualizar Ordem Completa (PUT /api/service-orders/:id)**

   - Atualiza informações completas de uma ordem existente

6. **Atualizar Apenas Status (PATCH /api/service-orders/:id/status)**

   - Atualiza apenas o status da ordem (aberta → em andamento → concluída)

7. **Deletar Ordem (DELETE /api/service-orders/:id)**
   - Remove uma ordem do sistema

## 📊 Modelo de Dados

Cada ordem de serviço contém:

- **título** (String, obrigatório): Título da ordem de serviço
- **descrição** (String, obrigatório): Descrição detalhada do serviço
- **dataAbertura** (Date, gerada automaticamente): Data de criação da ordem
- **status** (String, obrigatório): "aberta", "em andamento" ou "concluída" (padrão: "aberta")
- **prioridade** (String, obrigatório): "baixa", "média" ou "alta"
- **responsável** (String, opcional): Nome do responsável pela execução
- **setorSolicitante** (String, obrigatório): Setor que solicitou o serviço
- **prazoEstimado** (Date, opcional): Prazo estimado para conclusão
- **valorServico** (Decimal, obrigatório): Valor monetário do serviço (mínimo: 0)

## 🎨 Interface do Usuário

A interface permite:

- ✅ Adicionar novas ordens de serviço através de formulário
- ✅ Listar todas as ordens com design responsivo
- ✅ Filtrar por status, prioridade e setor
- ✅ Pesquisar ordens por título
- ✅ Editar ordens existentes
- ✅ Atualizar status rapidamente
- ✅ Excluir ordens com confirmação
- ✅ Mensagens de sucesso/erro para todas as operações

## 📁 Estrutura do Projeto

```
service-order-system/
├── src/
│   ├── config/
│   │   └── database.ts              # Configuração do MongoDB
│   ├── models/
│   │   └── Event.ts                 # Modelo ServiceOrder
│   ├── controllers/
│   │   └── eventController.ts       # Lógica de negócio
│   ├── routes/
│   │   └── eventRoutes.ts           # Rotas da API
│   └── index.ts                     # Servidor Express
├── public/
│   ├── index.html                   # Interface HTML
│   ├── styles.css                   # Estilos CSS
│   └── script.js                    # Lógica frontend
├── package.json
├── tsconfig.json
└── .env
```

## 🧪 Testando a API

### Exemplos com cURL:

**Criar ordem de serviço:**

```bash
curl -X POST http://localhost:3000/api/service-orders \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Manutenção do ar-condicionado",
    "descricao": "Ar-condicionado da sala 301 não está funcionando",
    "prioridade": "alta",
    "setorSolicitante": "TI",
    "responsavel": "João Silva",
    "prazoEstimado": "2025-12-01T18:00:00",
    "valorServico": 350.50
  }'
```

**Listar todas as ordens:**

```bash
curl http://localhost:3000/api/service-orders
```

**Filtrar por status:**

```bash
curl http://localhost:3000/api/service-orders?status=aberta
```

**Filtrar por prioridade:**

```bash
curl http://localhost:3000/api/service-orders?prioridade=alta
```

**Buscar por título:**

```bash
curl http://localhost:3000/api/service-orders/search?titulo=manutenção
```

**Atualizar status:**

```bash
curl -X PATCH http://localhost:3000/api/service-orders/ID_DA_ORDEM/status \
  -H "Content-Type: application/json" \
  -d '{"status": "em andamento"}'
```

## 🔒 Validações Implementadas

- Campos obrigatórios validados no modelo Mongoose
- Status aceita apenas: "aberta", "em andamento", "concluída"
- Prioridade aceita apenas: "baixa", "média", "alta"
- Valor do serviço deve ser >= 0
- Mensagens de erro descritivas e em português

## 📈 Cenários de Uso Corporativo

Este sistema é ideal para:

- **Empresas de médio e grande porte** que necessitam controlar solicitações internas
- **Departamentos de facilities** para gestão de manutenção predial
- **Equipes de TI** para gerenciar tickets de suporte técnico
- **Gestão operacional** de serviços diversos
- **Controle de SLA** e priorização de demandas
- **Acompanhamento de custos** por serviço realizado

## ⚠️ Observações

- O MongoDB deve estar rodando antes de iniciar a aplicação
- O servidor roda na porta 3000 (configurável via .env)
- Todas as respostas da API seguem o formato JSON padronizado
- Validações são feitas em dois níveis: Mongoose e Controller
- Sistema modular e extensível para futuras funcionalidades

## 👨‍💻 Desenvolvido por

Mario Cesar  
Desenvolvimento Web III - TypeScript com MongoDB
