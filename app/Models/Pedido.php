<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\DetallePedido;

class Pedido extends Model
{
    protected $table = 'pedidos';
    protected $primaryKey = 'id_pedido';

    protected $fillable = ['id_usuario', 'fecha_pedido', 'estado'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'id_pedido');
    }
}
