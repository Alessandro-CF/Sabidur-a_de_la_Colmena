<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Categoria_Articulo;

class Articulo extends Model
{
    protected $table = 'articulos';
    protected $primaryKey = 'id_articulo';

    protected $fillable = ['titulo', 'contenido', 'fecha_publicacion', 'estado', 'id_autor', 'id_categoria'];

    public function autor()
    {
        return $this->belongsTo(User::class, 'id_autor');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria_Articulo::class, 'id_categoria');
    }
}
