<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicacionLike extends Model
{
    protected $table = 'publicacion_likes';
    
    protected $fillable = [
        'publicacion_id',
        'user_identifier',
    ];
    
    /**
     * Obtiene la publicación relacionada con este like
     */
    public function publicacion(): BelongsTo
    {
        return $this->belongsTo(Publicacion::class);
    }
}
