<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id_usuario';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'estado',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'estado' => 'string',
        ];
    }

    public function articulos()
    {
        return $this->hasMany(Articulo::class, 'id_autor');
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'id_usuario');
    }

    public function consultas()
    {
        return $this->hasMany(Consulta::class, 'id_usuario');
    }

    public function asesorias()
    {
        return $this->hasMany(Asesoria::class, 'id_usuario');
    }

     /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'name' => $this->name,
            'estado' => $this->estado,
        ];
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is moderator
     */
    public function isModerator()
    {
        return $this->role === 'moderator';
    }

    /**
     * Check if user is active
     */
    public function isActive()
    {
        return $this->estado === 'activo';
    }

    /**
     * Check if user is inactive
     */
    public function isInactive()
    {
        return $this->estado === 'inactivo';
    }

    /**
     * Activate user
     */
    public function activate()
    {
        $this->update(['estado' => 'activo']);
    }

    /**
     * Deactivate user
     */
    public function deactivate()
    {
        $this->update(['estado' => 'inactivo']);
    }

    /**
     * Toggle user status
     */
    public function toggleStatus()
    {
        $newStatus = $this->isActive() ? 'inactivo' : 'activo';
        $this->update(['estado' => $newStatus]);
        return $newStatus;
    }

    /**
     * Scope to get only active users
     */
    public function scopeActive($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope to get only inactive users
     */
    public function scopeInactive($query)
    {
        return $query->where('estado', 'inactivo');
    }
}
