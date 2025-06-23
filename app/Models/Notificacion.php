<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;
    
    protected $table = 'notificaciones';
    
    protected $fillable = [
        'user_identifier',
        'titulo',
        'mensaje',
        'tipo',
        'leida',
        'enlace',
        'publicacion_id'
    ];
    
    protected $casts = [
        'leida' => 'boolean',
    ];
    
    /**
     * Obtiene la publicación relacionada con esta notificación
     */
    public function publicacion()
    {
        return $this->belongsTo(Publicacion::class);
    }
}
