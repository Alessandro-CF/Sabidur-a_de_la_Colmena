<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ProductController;

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
        // Dashboard administrativo
        Route::prefix('dashboard')->group(function () {
            Route::get('stats', [DashboardController::class, 'getStats']);
            Route::get('users', [DashboardController::class, 'getUsers']);
            Route::get('products', [DashboardController::class, 'getProducts']);
            Route::get('articles', [DashboardController::class, 'getArticles']);
            Route::put('users/{id}', [DashboardController::class, 'updateUser']);
            Route::delete('users/{id}', [DashboardController::class, 'deleteUser']);
        });

        // Gestión de productos (Admin)
        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'index']);
            Route::post('/', [ProductController::class, 'store']);
            Route::get('/statistics', [ProductController::class, 'statistics']);
            Route::post('/bulk-update', [ProductController::class, 'bulkUpdate']);
            Route::get('/{id}', [ProductController::class, 'show']);
            Route::put('/{id}', [ProductController::class, 'update']);
            Route::post('/{id}', [ProductController::class, 'update']); // Para method spoofing con FormData
            Route::delete('/{id}', [ProductController::class, 'destroy']);
            Route::patch('/{id}/stock', [ProductController::class, 'updateStock']);
        });
    });
    
    // Rutas para admin y moderator
    Route::middleware('role:admin,moderator')->group(function () {
        // Aquí irán rutas de moderación
    });
    
    // Aquí irán tus otros controladores de API
    // Route::apiResource('productos', App\Http\Controllers\Api\V1\ProductosController::class);
});
