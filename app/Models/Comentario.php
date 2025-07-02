<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comentario extends Model
{
    use HasFactory;
    
    protected $table = 'comentarios';
    
    protected $fillable = [
        'publicacion_id',
        'user_identifier',
        'contenido',
        'usuario'
    ];
    
    /**
     * Obtiene la publicación relacionada con este comentario
     */
    public function publicacion(): BelongsTo
    {
        return $this->belongsTo(Publicacion::class);
    }
}
