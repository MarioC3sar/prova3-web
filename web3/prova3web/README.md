# 🍽️ Sistema de Reservas de Mesa - Restaurante

Sistema completo para gerenciamento de reservas de mesas em restaurante, desenvolvido com TypeScript, Express, MongoDB e frontend responsivo.

## 📋 Sobre o Projeto

Este sistema foi desenvolvido como parte da Prova 3 de Desenvolvimento Web III e implementa todas as funcionalidades requisitadas:

- ✅ CRUD completo de reservas e mesas
- ✅ Validações de regras de negócio
- ✅ Mapa visual das mesas com status em tempo real
- ✅ Interface intuitiva e responsiva
- ✅ Sistema de logs
- ✅ Atualização automática de status

## 🚀 Tecnologias Utilizadas

### Backend

- **TypeScript** - Linguagem de programação
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

### Frontend

- **HTML5/CSS3** - Estrutura e estilização
- **JavaScript** - Interatividade
- **Design Responsivo** - Adaptável a diferentes dispositivos

## 📦 Requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (versão 5 ou superior)
- npm ou yarn

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/MarioC3sar/service-order.git
cd prova3web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

O arquivo `.env` já está configurado com:

```env
MONGODB_URI=mongodb://localhost:27017/reserva
PORT=3000
```

### 4. Inicie o MongoDB

Certifique-se de que o MongoDB está rodando:

```bash
# Linux/Mac
sudo systemctl start mongod

# Windows
net start MongoDB

# Ou use o MongoDB Compass
```

### 5. Popule o banco de dados com mesas

```bash
npm run seed
```

Este comando criará 20 mesas no banco de dados:

- 10 mesas no salão
- 6 mesas na varanda
- 4 mesas na área interna

### 6. Inicie o servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Ou build + start
npm run build
npm start
```

### 7. Acesse o sistema

Abra seu navegador em: **http://localhost:3000**

## 🎯 Funcionalidades

### 📊 Mapa Visual de Mesas

- Visualização em tempo real do status de todas as mesas
- Cores indicativas:
  - 🟢 **Verde** - Mesa disponível
  - 🟡 **Amarelo** - Mesa reservada
  - 🔴 **Vermelho** - Mesa ocupada
- Filtros por localização (Salão, Varanda, Área Interna)
- Clique na mesa para ver detalhes ou fazer reserva

### 📝 Gestão de Reservas

#### Criar Reserva

- Formulário completo com validações
- Campos: nome, contato, mesa, pessoas, data/hora, duração, observações
- Validações automáticas:
  - Antecedência mínima de 1 hora
  - Capacidade da mesa
  - Conflito de horários
  - Mesa disponível

#### Listar Reservas

- Visualização de todas as reservas
- Filtros por cliente e status
- Informações detalhadas de cada reserva
- Status visual com cores

#### Editar Reserva

- Modificação de dados da reserva
- Revalidação de regras de negócio
- Verificação de conflitos

#### Cancelar/Excluir Reserva

- Cancelamento marca como "cancelado"
- Exclusão remove permanentemente
- Confirmação antes das ações

### 🔐 Regras de Negócio Implementadas

1. ✅ **Horário de Funcionamento**: Restaurante funciona das 12h às 23h - reservas só podem ser feitas dentro deste período
2. ✅ **Conflito de Horários**: Não permite duas reservas para a mesma mesa no mesmo horário
3. ✅ **Duração Padrão**: 1h30 (90 minutos) configurável
4. ✅ **Antecedência Mínima**: Reservas devem ser feitas com pelo menos 1 hora de antecedência
5. ✅ **Status Automático**: Atualização baseada no horário atual
   - `reservado` - Agendada para o futuro
   - `ocupado` - Horário atual da reserva
   - `finalizado` - Horário já passou
   - `cancelado` - Cancelada pelo usuário
6. ✅ **Validação de Capacidade**: Mesa deve comportar o número de pessoas da reserva
7. ✅ **Validação de Término**: A reserva deve terminar até às 23h (considerando a duração)

### 📊 Sistema de Logs

Todos os eventos importantes são registrados em `logs/reservas.log`:

- Criação de reservas
- Atualizações
- Cancelamentos
- Exclusões
- Erros

## 🗂️ Estrutura do Projeto

```
prova3web/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuração MongoDB
│   ├── controllers/
│   │   ├── mesaController.ts    # Lógica de mesas
│   │   └── reservaController.ts # Lógica de reservas
│   ├── models/
│   │   ├── Mesa.ts              # Schema de Mesa
│   │   └── Reserva.ts           # Schema de Reserva
│   ├── routes/
│   │   ├── mesaRoutes.ts        # Rotas de mesas
│   │   └── reservaRoutes.ts     # Rotas de reservas
│   ├── utils/
│   │   └── logger.ts            # Sistema de logs
│   ├── seed.ts                  # Popular banco de dados
│   └── server.ts                # Servidor Express
├── public/
│   ├── index.html               # Interface do usuário
│   ├── styles.css               # Estilos
│   └── script.js                # Lógica frontend
├── logs/                        # Logs do sistema
├── .env                         # Variáveis de ambiente
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Mesas

```
GET    /api/mesas           - Listar todas as mesas
GET    /api/mesas/:id       - Obter mesa específica
POST   /api/mesas           - Criar nova mesa
PUT    /api/mesas/:id       - Atualizar mesa
DELETE /api/mesas/:id       - Deletar mesa
```

### Reservas

```
GET    /api/reservas                - Listar reservas (com filtros)
GET    /api/reservas/status-mesas   - Obter status de todas as mesas
GET    /api/reservas/:id            - Obter reserva específica
POST   /api/reservas                - Criar nova reserva
PUT    /api/reservas/:id            - Atualizar reserva
PATCH  /api/reservas/:id/cancelar   - Cancelar reserva
DELETE /api/reservas/:id            - Deletar reserva
```

### Exemplos de Uso

#### Criar Reserva

```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCliente": "João Silva",
    "contatoCliente": "(11) 98765-4321",
    "numeroMesa": 3,
    "quantidadePessoas": 4,
    "dataHora": "2025-12-06T19:00:00",
    "duracao": 90,
    "observacoes": "Aniversário"
  }'
```

#### Listar Reservas com Filtros

```bash
# Por cliente
curl "http://localhost:3000/api/reservas?cliente=João"

# Por status
curl "http://localhost:3000/api/reservas?status=reservado"

# Por mesa
curl "http://localhost:3000/api/reservas?mesa=3"

# Por data
curl "http://localhost:3000/api/reservas?data=2025-12-06"
```

## 🎨 Interface do Usuário

### Características

- Design moderno e responsivo
- Cores visuais para diferentes status
- Animações suaves
- Feedback visual para todas as ações
- Modal para detalhes e edição
- Atualização automática do mapa de mesas

### Responsividade

- Desktop: Layout de duas colunas
- Tablet/Mobile: Layout empilhado
- Elementos adaptáveis ao tamanho da tela

## 🧪 Testes

Para testar o sistema:

1. Acesse http://localhost:3000
2. Observe o mapa de mesas (inicialmente todas disponíveis)
3. Crie uma reserva para daqui a 2 horas
4. Veja a mesa ficar amarela (reservada)
5. Crie outra reserva para o horário atual
6. Veja a mesa ficar vermelha (ocupada)
7. Teste os filtros e edições

## 📝 Modelo de Dados

### Mesa

```typescript
{
  numero: number,          // Número único da mesa
  capacidade: number,      // Quantidade de pessoas
  localizacao: string      // 'salão' | 'varanda' | 'área interna'
}
```

### Reserva

```typescript
{
  nomeCliente: string,
  contatoCliente: string,
  numeroMesa: number,
  quantidadePessoas: number,
  dataHora: Date,
  observacoes?: string,
  status: string,          // 'reservado' | 'ocupado' | 'finalizado' | 'cancelado'
  duracao: number          // em minutos (padrão: 90)
}
```

## 🐛 Troubleshooting

### MongoDB não conecta

```bash
# Verifique se o MongoDB está rodando
sudo systemctl status mongod

# Ou reinicie o serviço
sudo systemctl restart mongod
```

### Porta 3000 já em uso

```bash
# Altere a porta no arquivo .env
PORT=3001
```

### Erro ao criar reserva

- Verifique se o horário é pelo menos 1 hora no futuro
- Confirme se a mesa tem capacidade suficiente
- Verifique conflitos de horário

## 👥 Autores

- **Mário César** - [GitHub](https://github.com/MarioC3sar)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da disciplina de Desenvolvimento Web III.

## 🙏 Agradecimentos

- Professor da disciplina Desenvolvimento Web III
- Colegas de turma
- Comunidade Open Source

---

**Desenvolvido com ❤️ para a Prova 3 de Desenvolvimento Web III**
