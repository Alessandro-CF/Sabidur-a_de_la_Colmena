<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Consulta extends Model
{
    
    protected $table = 'consultas';
    protected $primaryKey = 'id_consulta';

    protected $fillable = ['id_usuario', 'tema', 'descripcion', 'fecha_envio', 'estado'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    
}
