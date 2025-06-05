<?php

use App\Http\Controllers\ProfileController;
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


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

use App\Http\Controllers\PublicacionController;

// Rutas de Comunidad (sin autenticación)
Route::prefix('comunidad')->name('comunidad.')->group(function () {
    // Rutas principales usando el controlador
    Route::get('/', [PublicacionController::class, 'index'])->name('index');
    Route::get('/crear', [PublicacionController::class, 'create'])->name('crear-publicacion');
    Route::post('/publicar', [PublicacionController::class, 'store'])->name('store');
    Route::get('/publicacion/{publicacion}', [PublicacionController::class, 'show'])->name('publicacion');
    Route::get('/guardado', [PublicacionController::class, 'guardados'])->name('guardados');
    
    // Mantener algunas rutas con renderizado simple
    Route::get('/publicaciones', function () {
        return Inertia::render('Comunidad/pubicaciones');
    })->name('publicaciones');
    
    Route::get('/notificaciones', function () {
        return Inertia::render('Comunidad/notificaciones');
    })->name('notificaciones');
    
    Route::get('/mis-publicaciones', function () {
        return Inertia::render('Comunidad/pubicaciones');
    })->name('mis-publicaciones');
    
    // Acciones de publicaciones
    Route::post('/like/{publicacion}', [PublicacionController::class, 'like'])->name('like');
    Route::post('/guardar/{publicacion}', [PublicacionController::class, 'guardar'])->name('guardar');
});

require __DIR__.'/auth.php';

// Rutas de recursos para los controladores existentes
Route::resource('productos', App\Http\Controllers\ProductoController::class);
Route::resource('pedidos', App\Http\Controllers\PedidoController::class);
Route::resource('detalle-pedidos', App\Http\Controllers\DetallePedidoController::class);
Route::resource('consultas', App\Http\Controllers\ConsultaController::class);
Route::resource('categorias', App\Http\Controllers\CategoriaController::class);
Route::resource('categoria-articulos', App\Http\Controllers\CategoriaArticuloController::class);
Route::resource('asesorias', App\Http\Controllers\AsesoriaController::class);
Route::resource('articulos', App\Http\Controllers\ArticuloController::class);
