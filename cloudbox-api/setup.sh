#!/bin/bash
# =========================================================
# CloudBox API — Script de instalación para EC2 Ubuntu
# Ejecutar: bash setup.sh
# =========================================================

echo "── Actualizando sistema ─────────────────────────────"
sudo apt update && sudo apt upgrade -y

echo "── Instalando Node.js 20 ────────────────────────────"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "── Versión de Node.js instalada ─────────────────────"
node --version
npm --version

echo "── Instalando PM2 (proceso en segundo plano) ────────"
sudo npm install -g pm2

echo "── Instalando dependencias del proyecto ─────────────"
npm install

echo "── Configurando variables de entorno ────────────────"
if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "IMPORTANTE: Edita el archivo .env con tus datos reales:"
  echo "  nano .env"
  echo ""
fi

echo "── Configurando PM2 para arranque automático ────────"
pm2 startup
pm2 start server.js --name cloudbox-api
pm2 save

echo ""
echo "✅ CloudBox API instalada correctamente"
echo "   Endpoint: http://$(curl -s ifconfig.me):3000"
echo ""
echo "Comandos útiles:"
echo "  pm2 logs cloudbox-api   → ver logs"
echo "  pm2 restart cloudbox-api → reiniciar"
echo "  pm2 stop cloudbox-api    → detener"
