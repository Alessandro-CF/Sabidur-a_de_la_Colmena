<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

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
        // Aquí irán rutas de administración
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome to admin dashboard'
            ]);
        });
        
        // Ejemplo: gestión de usuarios (solo admin)
        Route::get('/admin/users', function () {
            return response()->json([
                'success' => true,
                'users' => \App\Models\User::all()
            ]);
        });
    });
    
    // Rutas para admin y moderator usando el middleware role
    Route::middleware('role:admin,moderator')->group(function () {
        // Aquí irán rutas de moderación
        Route::get('/moderation/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome to moderation dashboard'
            ]);
        });
    });
    
    // Aquí irán tus otros controladores de API
    // Route::apiResource('productos', App\Http\Controllers\Api\V1\ProductosController::class);
});
