<?php

namespace App\Http\Controllers;

use App\Models\Publicacion;
use App\Models\Notificacion;
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
                'publicaciones' => [],
                'flash' => session()->get('flash', [])
            ]);
        }
        
        // Verificar si cada publicación ha sido marcada como "me gusta" o "guardado" por el usuario actual
        $userIdentifier = $this->getUserIdentifier();
        
        $publicacionesConEstado = $publicaciones->map(function($pub) use ($userIdentifier) {
            return [
                'id' => $pub->id,
                'titulo' => $pub->titulo,
                'contenido' => Str::limit($pub->contenido, 150),
                'usuario' => $pub->usuario,
                'fecha' => $pub->created_at->format('d/m/Y'),
                'likes' => $pub->likes,
                'liked' => $this->hasLiked($pub->id, $userIdentifier),
                'guardado' => $this->hasGuardado($pub->id, $userIdentifier),
                'imagen' => $pub->imagen ?? '/images/colmena_logo.png'
            ];
        });
        
        return Inertia::render('Comunidad/comunidad', [
            'publicaciones' => $publicacionesConEstado,
            'flash' => session()->get('flash', [])
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
        try {
            $publicacion = Publicacion::findOrFail($publicacionId);
            $userIdentifier = $this->getUserIdentifier();
            
            $yaLeDioLike = $this->hasLiked($publicacionId, $userIdentifier);
            
            if ($yaLeDioLike) {
                // Quitar el like (transacción para asegurar consistencia)
                DB::beginTransaction();
                
                DB::table('publicacion_likes')
                    ->where('publicacion_id', $publicacionId)
                    ->where('user_identifier', $userIdentifier)
                    ->delete();
                    
                $publicacion->decrement('likes');
                
                DB::commit();
                
                return redirect()->back()->with('success', 'Se ha quitado tu "me gusta" de la publicación');
            } else {
                // Dar like (transacción para asegurar consistencia)
                DB::beginTransaction();
                
                DB::table('publicacion_likes')->insert([
                    'publicacion_id' => $publicacionId,
                    'user_identifier' => $userIdentifier,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                
                $publicacion->increment('likes');
                
                // Crear notificación para el creador de la publicación
                // Para simular un sistema real, usamos el identificador del usuario propietario de la publicación
                $ownerIdentifier = $publicacion->user_identifier ?? 'Usuario';
                Notificacion::create([
                    'user_identifier' => $ownerIdentifier, // En un sistema real, sería el ID del dueño de la publicación
                    'titulo' => '¡Nueva interacción!',
                    'mensaje' => 'A alguien le ha gustado tu publicación "' . Str::limit($publicacion->titulo, 30) . '"',
                    'tipo' => 'like',
                    'leida' => false,
                    'enlace' => route('comunidad.publicacion', $publicacionId),
                    'publicacion_id' => $publicacionId
                ]);
                
                DB::commit();
                
                return redirect()->back()->with('success', 'Te ha gustado esta publicación');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error al procesar tu interacción');
        }
    }
    
    /**
     * Guardar una publicación
     */
    public function guardar($publicacionId)
    {
        try {
            $userIdentifier = $this->getUserIdentifier();
            $yaGuardado = $this->hasGuardado($publicacionId, $userIdentifier);
            
            DB::beginTransaction();
            
            if ($yaGuardado) {
                // Quitar de guardados
                DB::table('publicacion_guardados')
                    ->where('publicacion_id', $publicacionId)
                    ->where('user_identifier', $userIdentifier)
                    ->delete();
                
                DB::commit();
                return redirect()->back()->with('success', 'Publicación eliminada de guardados');
            } else {
                // Verificar si la publicación existe antes de guardarla
                $publicacion = Publicacion::findOrFail($publicacionId);
                
                // Guardar
                DB::table('publicacion_guardados')->insert([
                    'publicacion_id' => $publicacionId,
                    'user_identifier' => $userIdentifier,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                
                // Crear notificación
                $ownerIdentifier = $publicacion->user_identifier ?? 'Usuario';
                Notificacion::create([
                    'user_identifier' => $ownerIdentifier, // En un sistema real, sería el ID del dueño de la publicación
                    'titulo' => '¡Publicación guardada!',
                    'mensaje' => 'Alguien ha guardado tu publicación "' . Str::limit($publicacion->titulo, 30) . '"',
                    'tipo' => 'guardado',
                    'leida' => false,
                    'enlace' => route('comunidad.publicacion', $publicacionId),
                    'publicacion_id' => $publicacionId
                ]);
                
                DB::commit();
                return redirect()->back()->with('success', 'Publicación guardada correctamente');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error al guardar la publicación');
        }
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
    
    /**
     * Obtener todas las notificaciones del usuario
     */
    public function notificaciones()
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Obtenemos solo las notificaciones del usuario actual
        $notificaciones = Notificacion::with('publicacion')
            ->where('user_identifier', $userIdentifier)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($notif) {
                return [
                    'id' => $notif->id,
                    'titulo' => $notif->titulo,
                    'mensaje' => $notif->mensaje,
                    'tipo' => $notif->tipo,
                    'leida' => $notif->leida,
                    'enlace' => $notif->enlace,
                    'fecha' => $notif->created_at->diffForHumans(),
                    'fecha_completa' => $notif->created_at->format('d/m/Y H:i'),
                    'publicacion_titulo' => $notif->publicacion ? Str::limit($notif->publicacion->titulo, 30) : null
                ];
            });
        
        return Inertia::render('Comunidad/notificaciones', [
            'notificaciones' => $notificaciones
        ]);
    }
    
    /**
     * Marcar una notificación como leída
     */
    public function leerNotificacion($id)
    {
        try {
            $userIdentifier = $this->getUserIdentifier();
            
            // Verificamos que la notificación pertenezca al usuario actual
            $notificacion = Notificacion::where('id', $id)
                ->where('user_identifier', $userIdentifier)
                ->firstOrFail();
                
            $notificacion->leida = true;
            $notificacion->save();
            
            // Retornamos a la página de notificaciones si no hay enlace
            if (empty($notificacion->enlace)) {
                return redirect()->back()->with('success', 'Notificación marcada como leída');
            }
            
            return redirect($notificacion->enlace)->with('success', 'Notificación marcada como leída');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'No se pudo marcar la notificación como leída');
        }
    }
    
    /**
     * Marcar todas las notificaciones como leídas
     */
    public function leerTodasNotificaciones()
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Marcamos todas las notificaciones del usuario actual como leídas
        DB::table('notificaciones')
            ->where('leida', false)
            ->where('user_identifier', $userIdentifier)
            ->update(['leida' => true, 'updated_at' => now()]);
        
        return redirect()->back()->with('success', 'Todas las notificaciones han sido marcadas como leídas');
    }
    
    /**
     * Contar las notificaciones sin leer
     */
    public function contarNotificacionesSinLeer()
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Filtramos por user_identifier para obtener solo las notificaciones del usuario actual
        $count = Notificacion::where('leida', false)
            ->where('user_identifier', $userIdentifier)
            ->count();
        
        return response()->json([
            'count' => $count,
            'timestamp' => now()->timestamp
        ]);
    }
    
    /**
     * Muestra el formulario para editar una publicación
     */
    public function edit($id)
    {
        $publicacion = Publicacion::findOrFail($id);
        $userIdentifier = $this->getUserIdentifier();
        
        // Verificar si el usuario es el creador de la publicación
        // Como no hay autenticación, usamos el campo usuario para verificar
        // En un sistema real con autenticación, se debería verificar el ID del usuario
        if ($publicacion->usuario !== 'Usuario') {
            return redirect()->route('comunidad.index')->with('error', 'No tienes permiso para editar esta publicación');
        }
        
        return Inertia::render('Comunidad/editarpubli', [
            'publicacion' => [
                'id' => $publicacion->id,
                'titulo' => $publicacion->titulo,
                'contenido' => $publicacion->contenido,
                'imagen' => $publicacion->imagen,
            ]
        ]);
    }
    
    /**
     * Actualiza una publicación en la base de datos
     */
    public function update(Request $request, $id)
    {
        $publicacion = Publicacion::findOrFail($id);
        $userIdentifier = $this->getUserIdentifier();
        
        // Verificar si el usuario es el creador de la publicación
        if ($publicacion->usuario !== 'Usuario') {
            return redirect()->route('comunidad.index')->with('error', 'No tienes permiso para editar esta publicación');
        }
        
        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'imagen' => 'nullable|image|max:2048',
        ]);
        
        // Procesar la imagen si se ha enviado una nueva
        if ($request->hasFile('imagen')) {
            // Eliminar la imagen anterior si existe
            if ($publicacion->imagen && file_exists(public_path($publicacion->imagen))) {
                unlink(public_path($publicacion->imagen));
            }
            
            $imagen = $request->file('imagen');
            $nombreArchivo = time() . '_' . $imagen->getClientOriginalName();
            $imagenPath = '/images/' . $nombreArchivo;
            $imagen->move(public_path('images'), $nombreArchivo);
            
            $publicacion->imagen = $imagenPath;
        }
        
        $publicacion->titulo = $request->titulo;
        $publicacion->contenido = $request->contenido;
        $publicacion->save();
        
        return redirect()->route('comunidad.publicacion', $publicacion->id)
            ->with('success', 'Publicación actualizada correctamente');
    }
    
    /**
     * Elimina una publicación
     */
    public function destroy($id)
    {
        $publicacion = Publicacion::findOrFail($id);
        $userIdentifier = $this->getUserIdentifier();
        
        // Verificar si el usuario es el creador de la publicación
        if ($publicacion->usuario !== 'Usuario') {
            return redirect()->route('comunidad.index')->with('error', 'No tienes permiso para eliminar esta publicación');
        }
        
        // Eliminar la imagen si existe
        if ($publicacion->imagen && file_exists(public_path($publicacion->imagen))) {
            unlink(public_path($publicacion->imagen));
        }
        
        // Eliminar likes y guardados relacionados
        DB::table('publicacion_likes')->where('publicacion_id', $id)->delete();
        DB::table('publicacion_guardados')->where('publicacion_id', $id)->delete();
        
        $publicacion->delete();
        
        return redirect()->route('comunidad.index')
            ->with('success', 'Publicación eliminada correctamente');
    }
    
    /**
     * Obtiene las publicaciones del usuario actual
     */
    public function misPublicaciones()
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Como no hay autenticación, usamos el campo usuario para identificar las publicaciones
        // En un sistema real con autenticación, se buscarían por user_id
        $publicaciones = Publicacion::where('usuario', 'Usuario')
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
                'guardado' => $this->hasGuardado($pub->id, $userIdentifier),
                'imagen' => $pub->imagen ?? '/images/colmena_logo.png'
            ];
        });
        
        return Inertia::render('Comunidad/misPublicaciones', [
            'publicaciones' => $publicacionesConEstado
        ]);
    }
}
