#!/bin/bash

echo "🚀 Iniciando Sistema de Reservas de Mesa"
echo ""

# Verifica se o MongoDB está rodando
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB não está rodando!"
    echo "   Iniciando MongoDB..."
    
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
        echo "✅ MongoDB iniciado via systemctl"
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
        echo "✅ MongoDB iniciado via brew"
    else
        echo "❌ Por favor, inicie o MongoDB manualmente"
        exit 1
    fi
else
    echo "✅ MongoDB já está rodando"
fi

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "🔨 Compilando TypeScript..."
npm run build

echo ""
echo "🌱 Populando banco de dados com mesas..."
npm run seed

echo ""
echo "🎉 Tudo pronto! Iniciando servidor..."
echo "   Acesse: http://localhost:3000"
echo ""

npm run dev
