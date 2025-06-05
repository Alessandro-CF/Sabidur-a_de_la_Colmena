<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Publicacion extends Model
{
    use HasFactory;
    
    protected $table = 'publicacions';
    
    protected $fillable = [
        'titulo',
        'contenido',
        'usuario',
        'imagen',
        'likes'
    ];
    
    /**
     * Obtiene los likes de esta publicación
     */
    public function likes(): HasMany
    {
        return $this->hasMany(PublicacionLike::class);
    }
    
    /**
     * Obtiene los guardados de esta publicación
     */
    public function guardados(): HasMany
    {
        return $this->hasMany(PublicacionGuardado::class);
    }
}
