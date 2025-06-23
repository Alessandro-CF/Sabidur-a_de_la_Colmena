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
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->string('user_identifier'); // Identificador de usuario (cookie)
            $table->string('titulo');
            $table->text('mensaje');
            $table->string('tipo'); // like, guardado, comentario, etc.
            $table->boolean('leida')->default(false);
            $table->string('enlace')->nullable(); // Enlace a la página relacionada
            $table->foreignId('publicacion_id')->nullable()->constrained('publicacions')->onDelete('cascade');
            $table->timestamps();
            
            // Índice para búsquedas rápidas
            $table->index('user_identifier');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
