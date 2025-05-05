<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Articulo;

class CategoriaArticulo extends Model
{
    protected $table = 'categoria_articulos';
    protected $primaryKey = 'id_categoria';

    protected $fillable = ['nombre', 'descripcion'];

    public function articulos()
    {
        return $this->hasMany(Articulo::class, 'id_categoria');
    }
}
