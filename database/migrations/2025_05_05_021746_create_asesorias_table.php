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
        Schema::create('asesorias', function (Blueprint $table) {
            $table->id('id_asesoria');
            $table->unsignedBigInteger('id_usuario');
            $table->enum('tipo', ['individual', 'grupal']);
            $table->timestamp('fecha_programada');
            $table->enum('estado', ['solicitada', 'aceptada', 'finalizada'])->default('solicitada');
            $table->text('descripcion')->nullable();
            $table->foreign('id_usuario')->references('id_usuario')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asesorias');
    }
};
