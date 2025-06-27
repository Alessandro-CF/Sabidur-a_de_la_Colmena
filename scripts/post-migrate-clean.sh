#!/bin/bash

# Script para limpiar automáticamente después de migrate:fresh
# Uso: ./scripts/post-migrate-clean.sh

echo "🧹 Post-migrate cleanup iniciado..."
echo ""

# Verificar si hay imágenes huérfanas
echo "🔍 Verificando imágenes huérfanas..."
php artisan images:clean --force

echo ""
echo "🧹 Limpiando cachés del sistema..."
php artisan cache:clear > /dev/null 2>&1
php artisan config:clear > /dev/null 2>&1
php artisan route:clear > /dev/null 2>&1

echo ""
echo "✅ Cleanup completado!"
echo "   - Imágenes huérfanas eliminadas"
echo "   - Cachés limpiados"
