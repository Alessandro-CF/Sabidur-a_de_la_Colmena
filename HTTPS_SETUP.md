# Configuración para resolver Mixed Content en Railway

## Archivos modificados:

### 1. .env
- Cambiado `APP_ENV` a `production`
- Cambiado `APP_DEBUG` a `false`
- Agregado `SESSION_SECURE_COOKIE=true`
- Agregado `SESSION_SAME_SITE=lax`
- Agregado `ASSET_URL` y `MIX_ASSET_URL`

### 2. AppServiceProvider.php
- Agregado forzado de HTTPS en producción
- Configurado proxies de confianza para Railway
- Configurado detección de HTTPS via X-Forwarded-Proto

### 3. ForceHttps.php (nuevo middleware)
- Redirige automáticamente a HTTPS en producción

### 4. TrustProxies.php (nuevo middleware)
- Configura proxies de confianza para Railway

### 5. CustomCorsMiddleware.php
- Actualizado para trabajar con HTTPS
- Agregado soporte para credenciales

### 6. bootstrap/app.php
- Registrado middleware ForceHttps y TrustProxies

## Comandos para desplegar:

```bash
# Limpiar cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Generar cache para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Construir assets
npm run build
```

## Notas importantes:

1. El middleware `ForceHttps` solo funciona en producción
2. Los proxies están configurados para confiar en todos los proxies (Railway)
3. Las cookies de sesión están configuradas como seguras
4. Los assets se servirán desde HTTPS
5. CORS está configurado para permitir el dominio de producción

## Verificación:

Después del despliegue, verificar que:
- Todas las URLs sean HTTPS
- No hay contenido mixto en la consola del navegador
- Las cookies se están enviando correctamente
- Los assets (CSS, JS, imágenes) se cargan desde HTTPS
