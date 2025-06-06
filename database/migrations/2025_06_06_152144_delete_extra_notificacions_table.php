<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Esta migración reemplaza la anterior para eliminar la tabla notificacions duplicada
        if (Schema::hasTable('notificacions')) {
            Schema::dropIfExists('notificacions');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No necesitamos recrear esta tabla ya que es una duplicación
    }
};
