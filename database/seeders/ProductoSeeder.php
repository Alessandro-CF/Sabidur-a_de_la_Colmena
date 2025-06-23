<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\Categoria;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener las categorías por nombre para usar sus IDs
        $miel = Categoria::where('nombre', 'Miel')->first();
        $propoleo = Categoria::where('nombre', 'Propóleo')->first();
        $cera = Categoria::where('nombre', 'Cera de Abeja')->first();
        $polen = Categoria::where('nombre', 'Polen')->first();
        $jaleaReal = Categoria::where('nombre', 'Jalea Real')->first();
        $cosmeticos = Categoria::where('nombre', 'Productos Cosméticos')->first();
        $apiterapia = Categoria::where('nombre', 'Apiterapia')->first();
        $equipos = Categoria::where('nombre', 'Equipos de Apicultura')->first();

        $productos = [
            // Productos de Miel
            [
                'nombre' => 'Miel de Flores Silvestres 500g',
                'descripcion' => 'Miel multifloral recolectada de diversas flores silvestres. Sabor suave y aromático, ideal para el consumo diario.',
                'precio' => 25.99,
                'stock' => 50,
                'imagen_url' => 'miel-flores-silvestres.jpg',
                'id_categoria' => $miel->id_categoria
            ],
            [
                'nombre' => 'Miel de Eucalipto 750g',
                'descripcion' => 'Miel monofloral de eucalipto con propiedades expectorantes y antisépticas. Ideal para problemas respiratorios.',
                'precio' => 32.50,
                'stock' => 30,
                'imagen_url' => 'miel-eucalipto.jpg',
                'id_categoria' => $miel->id_categoria
            ],
            [
                'nombre' => 'Miel de Acacia 250g',
                'descripcion' => 'Miel de acacia de color claro y sabor delicado. Perfecta para endulzar bebidas y postres.',
                'precio' => 18.75,
                'stock' => 40,
                'imagen_url' => 'miel-acacia.jpg',
                'id_categoria' => $miel->id_categoria
            ],
            [
                'nombre' => 'Miel de Manuka Premium 250g',
                'descripcion' => 'Miel de manuka importada con alto factor UMF. Reconocida por sus propiedades antibacterianas excepcionales.',
                'precio' => 89.99,
                'stock' => 15,
                'imagen_url' => 'miel-manuka.jpg',
                'id_categoria' => $miel->id_categoria
            ],

            // Productos de Propóleo
            [
                'nombre' => 'Extracto de Propóleo 30ml',
                'descripcion' => 'Extracto concentrado de propóleo en solución alcohólica. Fortalece el sistema inmunológico.',
                'precio' => 15.50,
                'stock' => 60,
                'imagen_url' => 'extracto-propoleo.jpg',
                'id_categoria' => $propoleo->id_categoria
            ],
            [
                'nombre' => 'Cápsulas de Propóleo 60 unidades',
                'descripcion' => 'Cápsulas de propóleo puro para fortalecer las defensas naturales del organismo.',
                'precio' => 28.90,
                'stock' => 35,
                'imagen_url' => 'capsulas-propoleo.jpg',
                'id_categoria' => $propoleo->id_categoria
            ],
            [
                'nombre' => 'Spray de Propóleo para Garganta',
                'descripcion' => 'Spray bucal con propóleo y miel para aliviar molestias de garganta y fortalecer la mucosa.',
                'precio' => 12.75,
                'stock' => 45,
                'imagen_url' => 'spray-propoleo.jpg',
                'id_categoria' => $propoleo->id_categoria
            ],

            // Productos de Cera de Abeja
            [
                'nombre' => 'Cera de Abeja Virgen 100g',
                'descripcion' => 'Cera de abeja pura sin procesar, ideal para cosméticos caseros y productos artesanales.',
                'precio' => 12.00,
                'stock' => 80,
                'imagen_url' => 'cera-virgen.jpg',
                'id_categoria' => $cera->id_categoria
            ],
            [
                'nombre' => 'Velas de Cera de Abeja Set x3',
                'descripcion' => 'Set de 3 velas aromáticas elaboradas con cera de abeja pura. Quema limpia y duradera.',
                'precio' => 22.50,
                'stock' => 25,
                'imagen_url' => 'velas-cera.jpg',
                'id_categoria' => $cera->id_categoria
            ],
            [
                'nombre' => 'Bálsamo Labial de Cera de Abeja',
                'descripcion' => 'Bálsamo labial natural con cera de abeja, miel y aceites esenciales. Hidrata y protege los labios.',
                'precio' => 8.50,
                'stock' => 90,
                'imagen_url' => 'balsamo-labial.jpg',
                'id_categoria' => $cera->id_categoria
            ],

            // Productos de Polen
            [
                'nombre' => 'Polen de Abeja Granulado 250g',
                'descripcion' => 'Polen de abeja fresco granulado, rico en proteínas, vitaminas y aminoácidos esenciales.',
                'precio' => 24.99,
                'stock' => 40,
                'imagen_url' => 'polen-granulado.jpg',
                'id_categoria' => $polen->id_categoria
            ],
            [
                'nombre' => 'Cápsulas de Polen 90 unidades',
                'descripcion' => 'Cápsulas de polen de abeja para complementar la dieta con nutrientes naturales.',
                'precio' => 19.75,
                'stock' => 50,
                'imagen_url' => 'capsulas-polen.jpg',
                'id_categoria' => $polen->id_categoria
            ],

            // Productos de Jalea Real
            [
                'nombre' => 'Jalea Real Fresca 20g',
                'descripcion' => 'Jalea real fresca pura, el alimento de las abejas reinas. Potente revitalizante natural.',
                'precio' => 45.00,
                'stock' => 20,
                'imagen_url' => 'jalea-real-fresca.jpg',
                'id_categoria' => $jaleaReal->id_categoria
            ],
            [
                'nombre' => 'Ampollas de Jalea Real x10',
                'descripcion' => 'Ampollas bebibles de jalea real con vitaminas. Energía y vitalidad en formato práctico.',
                'precio' => 35.50,
                'stock' => 30,
                'imagen_url' => 'ampollas-jalea.jpg',
                'id_categoria' => $jaleaReal->id_categoria
            ],

            // Productos Cosméticos
            [
                'nombre' => 'Crema Facial con Miel y Propóleo',
                'descripcion' => 'Crema facial hidratante y regeneradora con miel, propóleo y aceites naturales.',
                'precio' => 28.90,
                'stock' => 35,
                'imagen_url' => 'crema-facial.jpg',
                'id_categoria' => $cosmeticos->id_categoria
            ],
            [
                'nombre' => 'Jabón Artesanal de Miel y Avena',
                'descripcion' => 'Jabón natural elaborado con miel pura y avena. Suaviza e hidrata la piel naturalmente.',
                'precio' => 9.50,
                'stock' => 70,
                'imagen_url' => 'jabon-miel.jpg',
                'id_categoria' => $cosmeticos->id_categoria
            ],
            [
                'nombre' => 'Mascarilla Facial de Propóleo',
                'descripcion' => 'Mascarilla purificante y cicatrizante con propóleo para pieles con impurezas.',
                'precio' => 16.75,
                'stock' => 40,
                'imagen_url' => 'mascarilla-propoleo.jpg',
                'id_categoria' => $cosmeticos->id_categoria
            ],

            // Productos de Apiterapia
            [
                'nombre' => 'Kit Completo de Apiterapia',
                'descripcion' => 'Kit completo con miel, propóleo, polen y jalea real para tratamientos de apiterapia.',
                'precio' => 95.00,
                'stock' => 10,
                'imagen_url' => 'kit-apiterapia.jpg',
                'id_categoria' => $apiterapia->id_categoria
            ],
            [
                'nombre' => 'Ungüento de Propóleo Cicatrizante',
                'descripcion' => 'Ungüento tópico con alta concentración de propóleo para heridas y cicatrización.',
                'precio' => 18.50,
                'stock' => 25,
                'imagen_url' => 'unguento-propoleo.jpg',
                'id_categoria' => $apiterapia->id_categoria
            ],

            // Equipos de Apicultura
            [
                'nombre' => 'Ahumador de Apicultura Profesional',
                'descripcion' => 'Ahumador de acero inoxidable con fuelle de cuero para manejo seguro de colmenas.',
                'precio' => 45.00,
                'stock' => 15,
                'imagen_url' => 'ahumador.jpg',
                'id_categoria' => $equipos->id_categoria
            ],
            [
                'nombre' => 'Traje de Apicultura Completo',
                'descripcion' => 'Traje profesional de apicultura con careta integrada, guantes y botas. Talla L.',
                'precio' => 120.00,
                'stock' => 8,
                'imagen_url' => 'traje-apicultura.jpg',
                'id_categoria' => $equipos->id_categoria
            ],
            [
                'nombre' => 'Palanca Multiuso para Colmenas',
                'descripcion' => 'Herramienta multiuso para apertura de colmenas, separación de cuadros y limpieza.',
                'precio' => 18.75,
                'stock' => 30,
                'imagen_url' => 'palanca-colmena.jpg',
                'id_categoria' => $equipos->id_categoria
            ]
        ];

        foreach ($productos as $producto) {
            Producto::create($producto);
        }
    }
}
