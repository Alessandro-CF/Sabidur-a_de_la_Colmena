<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@sabiduria.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'estado' => 'activo',
        ]);

        User::create([
            'name' => 'Alessandro',
            'email' => 'aguilaxzc@gmail.com',
            'password' => Hash::make('petizaesfea12'),
            'role' => 'admin',
            'estado' => 'activo',
        ]);

        // Crear usuario moderador
        User::create([
            'name' => 'Moderador',
            'email' => 'moderator@sabiduria.com',
            'password' => Hash::make('password123'),
            'role' => 'moderator',
            'estado' => 'activo',
        ]);

        // Crear usuario normal
        User::create([
            'name' => 'Usuario Normal',
            'email' => 'user@sabiduria.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'estado' => 'activo',
        ]);

        // Crear algunos usuarios adicionales para pruebas
        User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'estado' => 'activo',
        ]);

        User::create([
            'name' => 'María González',
            'email' => 'maria@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'estado' => 'inactivo', // Usuario inactivo para pruebas
        ]);

        User::create([
            'name' => 'Carlos Rodríguez',
            'email' => 'carlos@example.com',
            'password' => Hash::make('password123'),
            'role' => 'moderator',
            'estado' => 'activo',
        ]);
    }
}
