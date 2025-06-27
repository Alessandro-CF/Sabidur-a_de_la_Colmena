<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Producto;

class CleanOrphanImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:clean {--force : Delete files without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean orphan product images that are not referenced in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Buscando imágenes huérfanas...');

        // Obtener todas las imágenes físicas en el directorio
        $productImagesPath = 'productos';
        $allFiles = Storage::disk('public')->files($productImagesPath);
        
        if (empty($allFiles)) {
            $this->info('✅ No se encontraron archivos en el directorio de productos.');
            return 0;
        }

        // Obtener todas las rutas de imágenes referenciadas en la base de datos
        $referencedImages = Producto::whereNotNull('imagen_url')
            ->pluck('imagen_url')
            ->toArray();

        // Encontrar archivos huérfanos
        $orphanFiles = array_diff($allFiles, $referencedImages);

        if (empty($orphanFiles)) {
            $this->info('✅ No se encontraron imágenes huérfanas.');
            return 0;
        }

        $this->warn("🗑️  Se encontraron " . count($orphanFiles) . " imágenes huérfanas:");

        // Mostrar lista de archivos huérfanos
        foreach ($orphanFiles as $file) {
            $this->line("   • " . $file);
        }

        // Calcular espacio ocupado
        $totalSize = 0;
        foreach ($orphanFiles as $file) {
            $totalSize += Storage::disk('public')->size($file);
        }
        $totalSizeMB = round($totalSize / 1024 / 1024, 2);

        $this->info("📊 Espacio total ocupado: {$totalSizeMB} MB");

        // Confirmar eliminación
        $force = $this->option('force');
        if (!$force) {
            if (!$this->confirm('¿Deseas eliminar estas imágenes huérfanas?')) {
                $this->info('❌ Operación cancelada.');
                return 0;
            }
        }

        // Eliminar archivos
        $deletedCount = 0;
        $errorCount = 0;

        foreach ($orphanFiles as $file) {
            try {
                Storage::disk('public')->delete($file);
                $deletedCount++;
                $this->line("✅ Eliminado: {$file}");
            } catch (\Exception $e) {
                $errorCount++;
                $this->error("❌ Error eliminando {$file}: " . $e->getMessage());
            }
        }

        $this->info("🎉 Limpieza completada:");
        $this->info("   • Archivos eliminados: {$deletedCount}");
        $this->info("   • Errores: {$errorCount}");
        $this->info("   • Espacio liberado: {$totalSizeMB} MB");

        return 0;
    }
}
