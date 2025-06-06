<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal - Home con el sistema de la colmena
Route::get('/', function () {
    return Inertia::render('Home/Home');
});

// Rutas de autenticación JWT
Route::get('/login', function () {
    return Inertia::render('Auth/JWTLogin');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/JWTRegister');
})->name('register');

// Rutas de perfil de usuario
Route::get('/perfil', function () {
    return Inertia::render('Profile/Profile');
})->name('profile');

Route::get('/configuracion', function () {
    return Inertia::render('Profile/Settings');
})->name('settings');

// Página de bienvenida de Laravel (puede mantenerse para desarrollo)
Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
