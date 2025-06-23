<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicacionController;
// use App\Http\Controllers\ProductoController;
// use App\Http\Controllers\PedidoController;
// use App\Http\Controllers\DetallePedidoController;
// use App\Http\Controllers\ConsultaController;
// use App\Http\Controllers\CategoriaController;
// use App\Http\Controllers\CategoriaArticuloController;
// use App\Http\Controllers\AsesoriaController;
// use App\Http\Controllers\ArticuloController;
use App\Http\Controllers\ApiTokenController;

// --- Rutas API versionadas ---
Route::prefix('v1')->group(function () {
    // --- Autenticación y gestión de tokens (solo si usas tokens para comunidad) ---
    Route::post('/tokens/create', [ApiTokenController::class, 'token']);
    Route::middleware('auth:sanctum')->prefix('tokens')->group(function () {
        Route::delete('/revoke-all', [ApiTokenController::class, 'revokeTokens']);
        Route::delete('/revoke/{tokenId}', [ApiTokenController::class, 'revokeToken']);
    });

    // --- Usuario autenticado ---
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });

    // --- Rutas públicas (comunidad) ---
    // Productos
    // Route::get('/productos', [ProductoController::class, 'indexApi']);
    // Route::get('/productos/{producto}', [ProductoController::class, 'showApi']);
    // Categorías
    // Route::get('/categorias', [CategoriaController::class, 'indexApi']);
    // Route::get('/categorias/{categoria}', [CategoriaController::class, 'showApi']);

    // Publicaciones (comunidad)
    Route::get('/publicaciones', [PublicacionController::class, 'indexApi']);
    Route::get('/publicaciones/{publicacion}', [PublicacionController::class, 'showApi']);

    // --- Rutas protegidas (requieren autenticación Sanctum, solo comunidad) ---
    Route::middleware('auth:sanctum')->group(function () {
        // Publicaciones (comunidad)
        Route::post('/publicaciones', [PublicacionController::class, 'storeApi']);
        Route::put('/publicaciones/{publicacion}', [PublicacionController::class, 'updateApi']);
        Route::delete('/publicaciones/{publicacion}', [PublicacionController::class, 'destroyApi']);
        Route::post('/publicaciones/{publicacion}/like', [PublicacionController::class, 'likeApi']);
        Route::post('/publicaciones/{publicacion}/guardar', [PublicacionController::class, 'guardarApi']);
        Route::get('/publicaciones/usuario/mis-publicaciones', [PublicacionController::class, 'misPublicacionesApi']);
        Route::get('/publicaciones/usuario/guardados', [PublicacionController::class, 'guardadosApi']);

        // Notificaciones (comunidad)
        Route::get('/notificaciones', [PublicacionController::class, 'notificacionesApi']);
        Route::get('/notificaciones/count', [PublicacionController::class, 'contarNotificacionesSinLeerApi']);
        Route::post('/notificaciones/{notificacion}/leer', [PublicacionController::class, 'leerNotificacionApi']);
        Route::post('/notificaciones/leer-todas', [PublicacionController::class, 'leerTodasNotificacionesApi']);

        // Pedidos y detalle-pedidos
        // Route::apiResource('pedidos', PedidoController::class);
        // Route::apiResource('detalle-pedidos', DetallePedidoController::class);

        // Consultas y asesorías
        // Route::apiResource('consultas', ConsultaController::class);
        // Route::apiResource('asesorias', AsesoriaController::class);

        // Artículos y categorías de artículos
        // Route::apiResource('articulos', ArticuloController::class);
        // Route::apiResource('categoria-articulos', CategoriaArticuloController::class);
    });
});