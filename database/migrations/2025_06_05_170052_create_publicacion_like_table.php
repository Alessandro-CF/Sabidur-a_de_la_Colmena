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
        Schema::create('publicacion_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publicacion_id')->constrained('publicacions')->onDelete('cascade');
            $table->string('user_identifier'); // Una cookie para identificar al usuario sin autenticación
            $table->timestamps();
            
            $table->unique(['publicacion_id', 'user_identifier']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publicacion_like');
    }
};
