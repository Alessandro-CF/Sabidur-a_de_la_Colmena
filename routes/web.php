<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal
Route::get('/', function () {
    return Inertia::render('Home/Home');
})->name('home');

// Página de bienvenida original (cambiada a /welcome)
Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

use App\Http\Controllers\PublicacionController;

// Rutas de Comunidad (sin autenticación)
Route::prefix('comunidad')->name('comunidad.')->group(function () {
    // Rutas principales usando el controlador
    Route::get('/', [PublicacionController::class, 'index'])->name('index');
    Route::get('/crear', [PublicacionController::class, 'create'])->name('crear-publicacion');
    Route::post('/store', [PublicacionController::class, 'store'])->name('store');
    Route::get('/publicacion/{publicacion}', [PublicacionController::class, 'show'])->name('publicacion');
    Route::get('/guardados', [PublicacionController::class, 'guardados'])->name('guardados');

    // Rutas para editar y eliminar publicaciones
    Route::get('/editar/{publicacion}', [PublicacionController::class, 'edit'])->name('editar');
    Route::post('/update/{publicacion}', [PublicacionController::class, 'update'])->name('update');
    Route::delete('/eliminar/{publicacion}', [PublicacionController::class, 'destroy'])->name('eliminar');

    // Rutas para mis publicaciones
    Route::get('/mis-publicaciones', [PublicacionController::class, 'misPublicaciones'])->name('mis-publicaciones');

    // Mantener algunas rutas con renderizado simple
    Route::get('/publicaciones', function () {
        return Inertia::render('Comunidad/publicaciones');
    })->name('publicaciones');

    // Rutas de notificaciones
    Route::get('/notificaciones', [PublicacionController::class, 'notificaciones'])->name('notificaciones');
    Route::post('/notificaciones/leer/{notificacion}', [PublicacionController::class, 'leerNotificacion'])->name('leer-notificacion');
    Route::post('/notificaciones/leer-todas', [PublicacionController::class, 'leerTodasNotificaciones'])->name('leer-todas-notificaciones');

    // API para obtener número de notificaciones sin leer
    Route::get('/api/notificaciones/count', [PublicacionController::class, 'contarNotificacionesSinLeer']);

    // Acciones de publicaciones
    Route::post('/like/{publicacion}', [PublicacionController::class, 'like'])->name('like');
    Route::post('/guardar/{publicacion}', [PublicacionController::class, 'guardar'])->name('guardar');
});
