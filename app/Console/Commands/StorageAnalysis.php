<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Producto;

class StorageAnalysis extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:analyze';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Analyze product storage usage and show statistics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('📊 Analizando uso de storage de productos...');
        $this->newLine();

        // Obtener estadísticas del disco
        $this->showDiskStats();
        $this->newLine();

        // Analizar imágenes
        $this->analyzeImages();
        $this->newLine();

        // Mostrar productos sin imagen
        $this->showProductsWithoutImages();
        $this->newLine();

        // Recomendaciones
        $this->showRecommendations();

        return 0;
    }

    private function showDiskStats()
    {
        $this->line('<fg=blue>💾 Estadísticas del Disco</>');
        $this->line('─────────────────────────');

        $storagePath = storage_path('app/public/productos');
        
        if (!is_dir($storagePath)) {
            $this->warn('❌ Directorio de productos no existe: ' . $storagePath);
            return;
        }

        $totalSize = $this->getDirectorySize($storagePath);
        $fileCount = $this->countFiles($storagePath);

        $this->line("📂 Directorio: {$storagePath}");
        $this->line("📁 Total archivos: {$fileCount}");
        $this->line("💽 Espacio usado: " . $this->formatBytes($totalSize));
    }

    private function analyzeImages()
    {
        $this->line('<fg=blue>🖼️  Análisis de Imágenes</>');
        $this->line('─────────────────────────');

        // Obtener todas las imágenes del storage
        $allImages = Storage::disk('public')->files('productos');
        $totalImages = count($allImages);

        // Obtener imágenes referenciadas en BD
        $referencedImages = Producto::whereNotNull('imagen_url')
            ->pluck('imagen_url')
            ->map(function($imagen) {
                // Si la imagen ya incluye el directorio, la devolvemos tal como está
                // Si no, agregamos el directorio 'productos/'
                return str_starts_with($imagen, 'productos/') ? $imagen : 'productos/' . $imagen;
            })
            ->toArray();

        $referencedCount = count($referencedImages);
        $orphanCount = $totalImages - $referencedCount;
        $brokenReferences = $referencedCount - $totalImages;

        $this->line("🖼️  Total imágenes en storage: {$totalImages}");
        $this->line("✅ Imágenes en uso: {$referencedCount}");
        
        if ($orphanCount > 0) {
            $this->line("🗑️  Imágenes huérfanas: {$orphanCount}");
            $this->warn("⚠️  Hay {$orphanCount} imágenes que pueden eliminarse");
        } elseif ($orphanCount < 0) {
            $this->line("❌ Referencias rotas: " . abs($orphanCount));
            $this->warn("⚠️  Hay " . abs($orphanCount) . " productos que referencian imágenes inexistentes");
        } else {
            $this->info("✨ Todas las imágenes están en uso");
        }
    }

    private function showProductsWithoutImages()
    {
        $this->line('<fg=blue>📦 Productos sin Imagen</>');
        $this->line('─────────────────────────');

        $productsWithoutImage = Producto::whereNull('imagen_url')->count();
        $totalProducts = Producto::count();
        
        $this->line("📦 Total productos: {$totalProducts}");
        $this->line("🖼️  Con imagen: " . ($totalProducts - $productsWithoutImage));
        $this->line("❌ Sin imagen: {$productsWithoutImage}");

        if ($productsWithoutImage > 0) {
            $percentage = round(($productsWithoutImage / $totalProducts) * 100, 2);
            $this->warn("📊 {$percentage}% de productos no tienen imagen");
        }
    }

    private function showRecommendations()
    {
        $this->line('<fg=blue>💡 Recomendaciones</>');
        $this->line('──────────────────');

        $totalImages = count(Storage::disk('public')->files('productos'));
        $referencedCount = Producto::whereNotNull('imagen_url')->count();
        $orphanCount = $totalImages - $referencedCount;
        
        if ($orphanCount > 0) {
            $this->warn("🧹 Ejecuta: php artisan images:clean");
        } elseif ($orphanCount < 0) {
            $this->warn("🔧 Ejecuta: npm run fresh-seed (para corregir referencias rotas)");
        }

        $productsWithoutImage = Producto::whereNull('imagen_url')->count();
        if ($productsWithoutImage > 0) {
            $this->info("📸 Considera agregar imágenes a {$productsWithoutImage} productos");
        }

        $this->info("📋 Comandos útiles:");
        $this->line("  • php artisan images:clean     - Limpiar huérfanas");
        $this->line("  • php artisan images:clear-all - Eliminar todas");
        $this->line("  • npm run fresh-seed           - Reset completo");
    }

    private function getDirectorySize($directory)
    {
        $size = 0;
        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
            $size += $file->getSize();
        }
        return $size;
    }

    private function countFiles($directory)
    {
        $count = 0;
        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
            if ($file->isFile()) {
                $count++;
            }
        }
        return $count;
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
