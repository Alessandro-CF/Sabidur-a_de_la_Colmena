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
        ]);

        // Crear usuario moderador
        User::create([
            'name' => 'Moderador',
            'email' => 'moderator@sabiduria.com',
            'password' => Hash::make('password123'),
            'role' => 'moderator',
        ]);

        // Crear usuario normal
        User::create([
            'name' => 'Usuario Normal',
            'email' => 'user@sabiduria.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);
    }
}
