# 🧹 Gestión de Imágenes - Guía de Limpieza

Este documento explica cómo limpiar automáticamente las imágenes tras ejecutar `migrate:fresh` u otras operaciones de base de datos.

## 🚀 Comandos Rápidos

### Opciones Automáticas (Recomendadas)

```bash
# Migrate:fresh con limpieza automática
npm run fresh-clean
# O directamente:
php artisan migrate:fresh-clean

# Con seeders incluidos
npm run fresh-seed
# O directamente:
php artisan migrate:fresh-clean --seed

# Sin confirmación (útil en scripts CI/CD)
php artisan migrate:fresh-clean --seed --force
```

### Limpieza Manual

```bash
# Solo limpiar imágenes huérfanas (seguro)
npm run clean-images
php artisan images:clean

# Limpiar TODAS las imágenes (desarrollo)
npm run clear-all-images
php artisan images:clear-all

# Cleanup después de migrate:fresh manual
npm run post-clean
./scripts/post-migrate-clean.sh
```

## 📋 Escenarios Comunes

### 1. Desarrollo Diario
```bash
# Cuando quieres resetear todo para testing
npm run fresh-seed
```

### 2. Después de cambios en migraciones
```bash
# Si ya hiciste migrate:fresh manualmente
npm run post-clean
```

### 3. Limpieza de storage ocupado
```bash
# Solo eliminar imágenes no utilizadas
npm run clean-images
```

### 4. Reset completo (desarrollo)
```bash
# Eliminar todo y empezar limpio
npm run fresh
```

## 🛠️ Comandos Artisan Detallados

### `php artisan images:clean`
- **Propósito**: Elimina solo imágenes huérfanas (no referenciadas en BD)
- **Seguridad**: ✅ Seguro - no elimina imágenes en uso
- **Uso**: Limpieza regular de mantenimiento

### `php artisan images:clear-all`
- **Propósito**: Elimina TODAS las imágenes de productos
- **Seguridad**: ⚠️ Destructivo - solo para desarrollo
- **Uso**: Reset completo del storage

### `php artisan migrate:fresh-clean`
- **Propósito**: migrate:fresh + limpieza automática
- **Ventajas**: Todo en un comando
- **Opciones**: `--seed`, `--force`

## 🔄 Flujo de Trabajo Recomendado

### Para Desarrollo
1. **Cambios frecuentes**: `npm run fresh-seed`
2. **Solo BD**: `php artisan migrate:fresh --seed && npm run post-clean`
3. **Limpieza periódica**: `npm run clean-images`

### Para Testing
```bash
# Setup completo
npm run fresh-seed

# Entre tests (si es necesario)
npm run clean-images
```

### Para CI/CD
```bash
# Sin confirmaciones
php artisan migrate:fresh-clean --seed --force
```

## 📊 Información de Storage

Los comandos muestran información útil:
- Número de archivos encontrados
- Espacio liberado
- Tiempo de ejecución
- Confirmaciones de seguridad

## ⚡ Scripts Bash Disponibles

### `./scripts/fresh-install.sh`
- Reset completo interactivo
- Incluye confirmación de seguridad
- Recomendado para setup inicial

### `./scripts/post-migrate-clean.sh`
- Limpieza rápida post-migrate
- Solo imágenes huérfanas
- Silencioso y eficiente

## 🚨 Advertencias de Seguridad

⚠️ **IMPORTANTE**: 
- `images:clear-all` elimina TODO
- Siempre usar `--force` con cuidado
- En producción, usar solo `images:clean`
- Hacer backup antes de reset completo

## 🎯 Mejores Prácticas

1. **Desarrollo**: Usar comandos automáticos (`fresh-clean`)
2. **Mantenimiento**: Ejecutar `clean-images` semanalmente
3. **Producción**: Solo `images:clean` con supervisión
4. **CI/CD**: Usar flags `--force` en pipelines
5. **Testing**: Combinar con seeders para datos consistentes

## 🐛 Troubleshooting

### Error: "No such file or directory"
```bash
# Verificar que el storage esté linkeado
php artisan storage:link
```

### Imágenes no se eliminan
```bash
# Verificar permisos
ls -la storage/app/public/products/
```

### Script no ejecutable
```bash
chmod +x scripts/*.sh
```

---

💡 **Tip**: Agrega estos comandos a tu workflow diario para mantener el storage limpio automáticamente.
