<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'Miel',
                'descripcion' => 'Mieles naturales de diferentes tipos de flores y regiones, producidas por nuestras abejas de manera artesanal y sostenible.'
            ],
            [
                'nombre' => 'Propóleo',
                'descripcion' => 'Productos elaborados con propóleo natural, conocido por sus propiedades antibacterianas y medicinales.'
            ],
            [
                'nombre' => 'Cera de Abeja',
                'descripcion' => 'Cera de abeja pura para uso cosmético, artesanal y medicinal, extraída de manera natural y sin procesos químicos.'
            ],
            [
                'nombre' => 'Polen',
                'descripcion' => 'Polen de abeja fresco y deshidratado, rico en proteínas, vitaminas y minerales esenciales para la salud.'
            ],
            [
                'nombre' => 'Jalea Real',
                'descripcion' => 'Jalea real fresca y liofilizada, un superalimento natural con propiedades nutritivas excepcionales.'
            ],
            [
                'nombre' => 'Productos Cosméticos',
                'descripcion' => 'Línea de cosméticos naturales elaborados con miel, cera de abeja y otros productos de la colmena.'
            ],
            [
                'nombre' => 'Apiterapia',
                'descripcion' => 'Productos especializados para tratamientos de apiterapia y medicina alternativa con productos de la colmena.'
            ],
            [
                'nombre' => 'Equipos de Apicultura',
                'descripcion' => 'Herramientas, equipos y accesorios para la práctica de la apicultura y manejo de colmenas.'
            ]
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}
