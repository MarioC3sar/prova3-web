# Início Rápido

## Opção 1: Script Automatizado

```bash
./start.sh
```

Este script irá:

1. Verificar e iniciar o MongoDB
2. Instalar dependências
3. Compilar o TypeScript
4. Popular o banco com mesas
5. Iniciar o servidor

## Opção 2: Passo a Passo Manual

### 1. Certifique-se de que o MongoDB está rodando

```bash
# Linux
sudo systemctl start mongod
sudo systemctl status mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Compile o TypeScript

```bash
npm run build
```

### 4. Popule o banco de dados

```bash
npm run seed
```

### 5. Inicie o servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Ou modo produção
npm start
```

### 6. Acesse o sistema

Abra seu navegador em: **http://localhost:3000**

## Testando o Sistema

### Criar uma Reserva via API

```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCliente": "Maria Silva",
    "contatoCliente": "(11) 98765-4321",
    "numeroMesa": 5,
    "quantidadePessoas": 4,
    "dataHora": "2025-12-07T20:00:00",
    "duracao": 120,
    "observacoes": "Jantar de aniversário"
  }'
```

### Listar Todas as Reservas

```bash
curl http://localhost:3000/api/reservas
```

### Ver Status das Mesas

```bash
curl http://localhost:3000/api/reservas/status-mesas
```

## Problemas Comuns

### MongoDB não conecta

Verifique se o MongoDB está instalado e rodando:

```bash
mongod --version
sudo systemctl status mongod
```

### Porta 3000 já está em uso

Edite o arquivo `.env` e altere a porta:

```
PORT=3001
```

### Erro "Cannot find module"

Compile novamente o projeto:

```bash
npm run build
```

## Estrutura das Mesas Criadas

O comando `npm run seed` cria 20 mesas:

- **Salão**: Mesas 1-10 (capacidades variadas: 2-8 pessoas)
- **Varanda**: Mesas 11-16 (capacidades variadas: 2-6 pessoas)
- **Área Interna**: Mesas 17-20 (capacidades variadas: 2-8 pessoas)

## Logs

Os logs do sistema são salvos em: `logs/reservas.log`

Para visualizar os logs em tempo real:

```bash
tail -f logs/reservas.log
```
