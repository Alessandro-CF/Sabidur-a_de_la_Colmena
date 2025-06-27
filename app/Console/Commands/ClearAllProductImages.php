<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ClearAllProductImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:clear-all {--force : Delete all files without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete ALL product images from storage (useful for development)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->warn('⚠️  ADVERTENCIA: Este comando eliminará TODAS las imágenes de productos.');

        $productImagesPath = 'productos';
        $allFiles = Storage::disk('public')->files($productImagesPath);

        if (empty($allFiles)) {
            $this->info('✅ No hay archivos para eliminar.');
            return 0;
        }

        $this->info("📁 Se encontraron " . count($allFiles) . " archivos:");
        foreach ($allFiles as $file) {
            $this->line("   • " . $file);
        }

        // Calcular espacio total
        $totalSize = 0;
        foreach ($allFiles as $file) {
            $totalSize += Storage::disk('public')->size($file);
        }
        $totalSizeMB = round($totalSize / 1024 / 1024, 2);
        $this->info("📊 Espacio total: {$totalSizeMB} MB");

        // Confirmar eliminación
        $force = $this->option('force');
        if (!$force) {
            $this->warn('🚨 Esta acción es IRREVERSIBLE.');
            if (!$this->confirm('¿Estás seguro de que quieres eliminar TODAS las imágenes?')) {
                $this->info('❌ Operación cancelada.');
                return 0;
            }
        }

        // Eliminar todos los archivos
        $deletedCount = 0;
        $errorCount = 0;

        foreach ($allFiles as $file) {
            try {
                Storage::disk('public')->delete($file);
                $deletedCount++;
                $this->line("✅ Eliminado: {$file}");
            } catch (\Exception $e) {
                $errorCount++;
                $this->error("❌ Error eliminando {$file}: " . $e->getMessage());
            }
        }

        $this->info("🎉 Eliminación completada:");
        $this->info("   • Archivos eliminados: {$deletedCount}");
        $this->info("   • Errores: {$errorCount}");
        $this->info("   • Espacio liberado: {$totalSizeMB} MB");

        return 0;
    }
}
