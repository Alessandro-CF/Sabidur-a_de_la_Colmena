<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicacionController;
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
    Route::prefix('comunidad')->group(function () {
        // Rutas de publicaciones públicas
        Route::get('/publicaciones', [PublicacionController::class, 'indexApi']);
        Route::get('/publicaciones/{publicacion}', [PublicacionController::class, 'showApi']);
        // Ruta para obtener comentarios de una publicación
        Route::get('/publicaciones/{publicacion}/comentarios', [PublicacionController::class, 'comentariosApi']);
    });

    // --- Rutas protegidas (requieren autenticación Sanctum, solo comunidad) ---
    Route::middleware('auth:sanctum')->prefix('comunidad')->group(function () {
        // Publicaciones
        Route::post('/publicaciones', [PublicacionController::class, 'storeApi']);
        Route::put('/publicaciones/{publicacion}', [PublicacionController::class, 'updateApi']);
        Route::delete('/publicaciones/{publicacion}', [PublicacionController::class, 'destroyApi']);
        Route::post('/publicaciones/{publicacion}/like', [PublicacionController::class, 'likeApi']);
        Route::post('/publicaciones/{publicacion}/guardar', [PublicacionController::class, 'guardarApi']);
        Route::get('/publicaciones/usuario/mis-publicaciones', [PublicacionController::class, 'misPublicacionesApi']);
        Route::get('/publicaciones/usuario/guardados', [PublicacionController::class, 'guardadosApi']);
        
        // Comentarios
        Route::post('/publicaciones/{publicacion}/comentar', [PublicacionController::class, 'comentarApi']);
        Route::delete('/comentarios/{comentario}', [PublicacionController::class, 'eliminarComentarioApi']);

        // Notificaciones
        Route::get('/notificaciones', [PublicacionController::class, 'notificacionesApi']);
        Route::get('/notificaciones/count', [PublicacionController::class, 'contarNotificacionesSinLeerApi']);
        Route::post('/notificaciones/{notificacion}/leer', [PublicacionController::class, 'leerNotificacionApi']);
        Route::post('/notificaciones/leer-todas', [PublicacionController::class, 'leerTodasNotificacionesApi']);
    });
});
