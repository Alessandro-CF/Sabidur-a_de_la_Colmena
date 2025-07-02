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
        Schema::create('comentarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publicacion_id')->constrained('publicacions')->onDelete('cascade');
            $table->string('user_identifier'); // Identificador de usuario (cookie)
            $table->text('contenido');
            $table->string('usuario'); // Nombre de usuario (para mostrar)
            $table->timestamps();
            
            // Índice para búsquedas rápidas
            $table->index('publicacion_id');
            $table->index('user_identifier');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
