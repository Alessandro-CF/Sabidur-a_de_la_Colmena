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
        Schema::create('articulos', function (Blueprint $table) {
            $table->id('id_articulo');
            $table->string('titulo');
            $table->longText('contenido');
            $table->timestamp('fecha_publicación')->useCurrent();
            $table->enum('estado', ['pendiente', 'publicado'])->default('pendiente');
            $table->unsignedBigInteger('id_autor');
            $table->unsignedBigInteger('id_categoria');
            $table->foreign('id_autor')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->foreign('id_categoria')->references('id_categoria')->on('categoria_articulos')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articulos');
    }
};
