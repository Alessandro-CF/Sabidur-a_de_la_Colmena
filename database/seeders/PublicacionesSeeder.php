<?php

namespace Database\Seeders;

use App\Models\Publicacion;
use Illuminate\Database\Seeder;

class PublicacionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publicaciones = [
            [
                'titulo' => 'Cómo prevenir la varroasis en tu colmena',
                'contenido' => 'La varroasis es una enfermedad común en las abejas causada por el ácaro Varroa destructor. Para prevenirla, es importante realizar inspecciones regulares, utilizar fondos sanitarios, aplicar tratamientos orgánicos como el ácido oxálico en momentos adecuados, y mantener colonias fuertes. La detección temprana es crucial para el control efectivo.',
                'usuario' => 'ApicultorPro',
                'likes' => 42,
                'imagen' => '/images/colmena_varroasis.jpg',
                'created_at' => now()->subDays(5)
            ],
            [
                'titulo' => 'Mejores prácticas para la cosecha de miel',
                'contenido' => 'Una buena cosecha de miel depende de varios factores importantes como elegir el momento adecuado (cuando al menos el 80% de las celdas están operculadas), usar el equipo correcto, mantener condiciones higiénicas, y dejar suficientes reservas para la colonia. Recomiendo usar escape de abejas para reducir el estrés en la colmena durante la extracción.',
                'usuario' => 'MielDeLaColmena',
                'likes' => 38,
                'imagen' => '/images/cosecha_miel.jpg',
                'created_at' => now()->subDays(8)
            ],
            [
                'titulo' => 'Equipamiento básico para apicultores principiantes',
                'contenido' => 'Si estás empezando en la apicultura, necesitarás estos elementos básicos: un traje completo de protección, ahumador, palanca para marcos, cepillo de abejas, y guantes especiales. También es fundamental tener colmenas de calidad, preferiblemente tipo Langstroth. No escatimes en el velo protector, pues tu seguridad es lo primero.',
                'usuario' => 'ApiNovato',
                'likes' => 27,
                'imagen' => '/images/equipamiento_apicultor.jpg',
                'created_at' => now()->subDays(10)
            ],
        ];

        foreach ($publicaciones as $publicacion) {
            Publicacion::create($publicacion);
        }
    }
}
