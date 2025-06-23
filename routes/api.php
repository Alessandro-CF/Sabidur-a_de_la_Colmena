<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;


use App\Http\Controllers\API\V1\CategoriaController;
use App\Http\Controllers\API\V1\ProductoController;

Route::prefix('v1')->group(function () {

    // Rutas de productos
    Route::apiResource('productos', ProductoController::class);
    Route::apiResource('categorias', CategoriaController::class);


});

// Rutas de autenticación
Route::prefix('v1/auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('jwt.auth');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('jwt.auth');
    Route::get('me', [AuthController::class, 'me'])->middleware('jwt.auth');
    
    // Rutas de gestión de perfil
    Route::put('profile', [AuthController::class, 'updateProfile'])->middleware('jwt.auth');
    Route::put('change-password', [AuthController::class, 'changePassword'])->middleware('jwt.auth');
    Route::delete('account', [AuthController::class, 'deleteAccount'])->middleware('jwt.auth');
});

// Rutas protegidas
Route::middleware('jwt.auth')->prefix('v1')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });
    
    // Rutas solo para admin
    Route::middleware('isAdmin')->group(function () {
        // Aquí irán rutas de administración específicas
    });
    
    // Rutas para admin y moderator
    Route::middleware('role:admin,moderator')->group(function () {
        // Aquí irán rutas de moderación
    });
    
    // Aquí irán tus otros controladores de API
    // Route::apiResource('productos', App\Http\Controllers\Api\V1\ProductosController::class);
});
