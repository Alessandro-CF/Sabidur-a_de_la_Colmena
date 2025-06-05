<?php

namespace App\Http\Controllers;

use App\Models\Publicacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $publicaciones = Publicacion::orderBy('created_at', 'desc')->get();
        
        // If there are no publications, return an empty array instead of null
        if ($publicaciones->isEmpty()) {
            return Inertia::render('Comunidad/comunidad', [
                'publicaciones' => []
            ]);
        }
        
        // Verificar si cada publicación ha sido marcada como "me gusta" o "guardado" por el usuario actual
        $userIdentifier = $this->getUserIdentifier();
        
        $publicacionesConEstado = $publicaciones->map(function($pub) use ($userIdentifier) {
            return [
                'id' => $pub->id,
                'titulo' => $pub->titulo,
                'contenido' => $pub->contenido,
                'usuario' => $pub->usuario,
                'fecha' => $pub->created_at->format('d/m/Y'),
                'likes' => $pub->likes,
                'liked' => $this->hasLiked($pub->id, $userIdentifier),
                'guardado' => $this->hasGuardado($pub->id, $userIdentifier),
                'imagen' => $pub->imagen ?? '/images/colmena_logo.png'
            ];
        });
        
        return Inertia::render('Comunidad/comunidad', [
            'publicaciones' => $publicacionesConEstado
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Comunidad/crearpubli');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'imagen' => 'nullable|image|max:2048',
        ]);

        $imagenPath = null;
        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreArchivo = time() . '_' . $imagen->getClientOriginalName();
            $imagenPath = '/images/' . $nombreArchivo;
            $imagen->move(public_path('images'), $nombreArchivo);
        }

        Publicacion::create([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'usuario' => 'Usuario', // Nombre de usuario temporal para usuarios no autenticados
            'imagen' => $imagenPath,
        ]);

        return redirect()->route('comunidad.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $publicacion = Publicacion::findOrFail($id);
        $userIdentifier = $this->getUserIdentifier();
        
        $publicacionConEstado = [
            'id' => $publicacion->id,
            'titulo' => $publicacion->titulo,
            'contenido' => $publicacion->contenido,
            'usuario' => $publicacion->usuario,
            'fecha' => $publicacion->created_at->format('d/m/Y'),
            'likes' => $publicacion->likes,
            'liked' => $this->hasLiked($publicacion->id, $userIdentifier),
            'guardado' => $this->hasGuardado($publicacion->id, $userIdentifier),
            'imagen' => $publicacion->imagen ?? '/images/colmena_logo.png'
        ];
        
        return Inertia::render('Comunidad/detallePublicacion', [
            'publicacion' => $publicacionConEstado
        ]);
    }
    
    /**
     * Mostrar publicaciones guardadas
     */
    public function guardados()
    {
        $userIdentifier = $this->getUserIdentifier();
        
        $publicacionIds = DB::table('publicacion_guardados')
            ->where('user_identifier', $userIdentifier)
            ->pluck('publicacion_id')
            ->toArray();
        
        // If the user has no saved publications, return an empty array
        if (empty($publicacionIds)) {
            return Inertia::render('Comunidad/guardado', [
                'publicaciones' => []
            ]);
        }
        
        $publicaciones = Publicacion::whereIn('id', $publicacionIds)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $publicacionesConEstado = $publicaciones->map(function($pub) use ($userIdentifier) {
            return [
                'id' => $pub->id,
                'titulo' => $pub->titulo,
                'contenido' => $pub->contenido,
                'usuario' => $pub->usuario,
                'fecha' => $pub->created_at->format('d/m/Y'),
                'likes' => $pub->likes,
                'liked' => $this->hasLiked($pub->id, $userIdentifier),
                'guardado' => true, // Ya sabemos que está guardado
                'imagen' => $pub->imagen ?? '/images/colmena_logo.png'
            ];
        });
        
        return Inertia::render('Comunidad/guardado', [
            'publicaciones' => $publicacionesConEstado
        ]);
    }
    
    /**
     * Dar like a una publicación
     */
    public function like($publicacionId)
    {
        $publicacion = Publicacion::findOrFail($publicacionId);
        $userIdentifier = $this->getUserIdentifier();
        
        $yaLeDioLike = $this->hasLiked($publicacionId, $userIdentifier);
        
        if ($yaLeDioLike) {
            // Quitar el like
            DB::table('publicacion_likes')
                ->where('publicacion_id', $publicacionId)
                ->where('user_identifier', $userIdentifier)
                ->delete();
                
            $publicacion->decrement('likes');
        } else {
            // Dar like
            DB::table('publicacion_likes')->insert([
                'publicacion_id' => $publicacionId,
                'user_identifier' => $userIdentifier,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            $publicacion->increment('likes');
        }
        
        return redirect()->back();
    }
    
    /**
     * Guardar una publicación
     */
    public function guardar($publicacionId)
    {
        $userIdentifier = $this->getUserIdentifier();
        $yaGuardado = $this->hasGuardado($publicacionId, $userIdentifier);
        
        if ($yaGuardado) {
            // Quitar de guardados
            DB::table('publicacion_guardados')
                ->where('publicacion_id', $publicacionId)
                ->where('user_identifier', $userIdentifier)
                ->delete();
        } else {
            // Guardar
            DB::table('publicacion_guardados')->insert([
                'publicacion_id' => $publicacionId,
                'user_identifier' => $userIdentifier,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
        
        return redirect()->back();
    }

    /**
     * Obtener el identificador del usuario actual
     * Como no hay autenticación, usa cookies para identificar al usuario
     */
    protected function getUserIdentifier()
    {
        $cookieName = 'comunidad_user_id';
        $userId = Cookie::get($cookieName);
        
        if (!$userId) {
            $userId = (string) Str::uuid();
            Cookie::queue($cookieName, $userId, 60 * 24 * 30); // Cookie válida por 30 días
        }
        
        return $userId;
    }
    
    /**
     * Verificar si el usuario actual ha dado like a la publicación
     */
    protected function hasLiked($publicacionId, $userIdentifier)
    {
        return DB::table('publicacion_likes')
            ->where('publicacion_id', $publicacionId)
            ->where('user_identifier', $userIdentifier)
            ->exists();
    }
    
    /**
     * Verificar si el usuario actual ha guardado la publicación
     */
    protected function hasGuardado($publicacionId, $userIdentifier)
    {
        return DB::table('publicacion_guardados')
            ->where('publicacion_id', $publicacionId)
            ->where('user_identifier', $userIdentifier)
            ->exists();
    }
}
