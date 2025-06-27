<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Categoria;
use App\Models\DetallePedido;

class Producto extends Model
{
    protected $table = 'productos';
    protected $primaryKey = 'id_producto';

    protected $fillable = ['nombre', 'descripcion', 'precio', 'stock', 'imagen_url', 'id_categoria'];

    protected $appends = ['imagen_url_completa'];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'id_producto');
    }

    /**
     * Obtener la URL completa de la imagen
     */
    public function getImagenUrlCompletaAttribute()
    {
        if ($this->imagen_url) {
            return asset('storage/' . $this->imagen_url);
        }
        return null;
    }

    /**
     * Verificar si el producto tiene imagen
     */
    public function hasImage()
    {
        return !empty($this->imagen_url);
    }
}
