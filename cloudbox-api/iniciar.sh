#!/bin/bash
# =========================================================
# CloudBox — Iniciar API con PM2
# =========================================================

echo "── Instalando dependencias ───────────────────────────"
npm install

echo "── Iniciando API con PM2 ─────────────────────────────"
pm2 start server.js --name cloudbox-api

echo "── Guardando configuración PM2 ───────────────────────"
pm2 save
pm2 startup

echo "── Configurando Nginx ────────────────────────────────"
sudo cp nginx.conf /etc/nginx/sites-available/cloudbox
sudo ln -sf /etc/nginx/sites-available/cloudbox /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ CloudBox API corriendo"
pm2 status
