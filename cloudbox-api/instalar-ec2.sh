#!/bin/bash
# =========================================================
# CloudBox — Instalación en EC2 Ubuntu Server
# Ejecutar con: bash instalar-ec2.sh
# =========================================================

echo "── Actualizando sistema ──────────────────────────────"
sudo apt update && sudo apt upgrade -y

echo "── Instalando Node.js 20 ─────────────────────────────"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "── Instalando PM2 (mantiene el servidor corriendo) ───"
sudo npm install -g pm2

echo "── Instalando Nginx ──────────────────────────────────"
sudo apt install -y nginx

echo "── Versiones instaladas ──────────────────────────────"
node -v
npm -v
pm2 -v
nginx -v

echo "✅ Instalación completa"
