<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Asesoria extends Model
{
    protected $table = 'asesorias';
    protected $primaryKey = 'id_asesoria';

    protected $fillable = ['id_usuario', 'tipo', 'fecha_programada', 'estado', 'descripcion'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}
