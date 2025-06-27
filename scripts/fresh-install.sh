#!/bin/bash

echo "🚀 Iniciando instalación fresca de la base de datos..."
echo ""

# Confirmar acción
read -p "⚠️  Esto eliminará TODOS los datos y archivos. ¿Continuar? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada."
    exit 1
fi

echo "🗑️  Eliminando todas las imágenes de productos..."
php artisan images:clear-all --force

echo ""
echo "🔄 Ejecutando migrate:fresh..."
php artisan migrate:fresh

echo ""
echo "🌱 Ejecutando seeders..."
php artisan db:seed

echo ""
echo "🧹 Limpiando cachés..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear

echo ""
echo "🎉 ¡Instalación fresca completada!"
echo "✅ Base de datos reiniciada"
echo "✅ Imágenes eliminadas"
echo "✅ Seeders ejecutados"
echo "✅ Cachés limpiados"
