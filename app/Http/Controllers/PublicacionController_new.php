<?php

namespace App\Http\Controllers;

use App\Models\Publicacion;
use App\Models\Notificacion;
use App\Models\Comentario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

/**
 * Controlador de Publicaciones
 * 
 * Gestiona todas las funcionalidades relacionadas con publicaciones, likes, guardados,
 * comentarios y notificaciones de la plataforma de comunidad.
 * 
 * Arquitectura:
 * - Web (Inertia.js): Métodos que devuelven vistas Inertia para renderizar en el frontend
 * - API REST: Endpoints para consumo desde aplicaciones móviles u otros clientes
 * 
 * Identificación de usuarios:
 * - Sistema basado en cookies para usuarios no autenticados
 * - Integración con Auth para usuarios autenticados cuando esté disponible
 * 
 * Funcionalidades principales:
 * - CRUD completo de publicaciones
 * - Sistema de likes y guardados
 * - Sistema de comentarios
 * - Sistema de notificaciones en tiempo real
 * - Gestión de imágenes a través de URLs
 * 
 * Rutas API disponibles:
 * - GET    /api/v1/comunidad/publicaciones               - Lista todas las publicaciones
 * - GET    /api/v1/comunidad/publicaciones/{id}          - Muestra una publicación específica
 * - POST   /api/v1/comunidad/publicaciones               - Crea una nueva publicación
 * - PUT    /api/v1/comunidad/publicaciones/{id}          - Actualiza una publicación
 * - DELETE /api/v1/comunidad/publicaciones/{id}          - Elimina una publicación
 * - POST   /api/v1/comunidad/publicaciones/{id}/like     - Da o quita like a una publicación
 * - POST   /api/v1/comunidad/publicaciones/{id}/guardar  - Guarda o quita de guardados una publicación
 * - GET    /api/v1/comunidad/publicaciones/usuario/mis-publicaciones - Publicaciones del usuario
 * - GET    /api/v1/comunidad/publicaciones/usuario/guardados        - Publicaciones guardadas
 * - GET    /api/v1/comunidad/publicaciones/{id}/comentarios         - Comentarios de publicación
 * - POST   /api/v1/comunidad/publicaciones/{id}/comentar            - Añade un comentario
 * - DELETE /api/v1/comunidad/comentarios/{id}                       - Elimina un comentario
 * - GET    /api/v1/comunidad/notificaciones                         - Lista notificaciones
 * - GET    /api/v1/comunidad/notificaciones/count                   - Cuenta notificaciones no leídas
 * - POST   /api/v1/comunidad/notificaciones/{id}/leer               - Marca notificación como leída
 * - POST   /api/v1/comunidad/notificaciones/leer-todas              - Marca todas como leídas
 */
class PublicacionController_new extends Controller
{
    /**************************************
     * HELPERS Y MÉTODOS COMUNES
     **************************************/

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

    /**************************************
     * CRUD DE PUBLICACIONES (WEB)
     **************************************/

    /**
     * Muestra el listado de publicaciones
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
     * Muestra el formulario para crear una publicación
     */
    public function create()
    {
        return Inertia::render('Comunidad/crearpubli');
    }

    /**
     * Almacena una nueva publicación
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'imagen_url' => 'nullable|url|max:500', // Cambiado a URL en lugar de archivo
        ]);

        // Usamos directamente la URL proporcionada en lugar de subir un archivo
        $imagenPath = $request->imagen_url;

        Publicacion::create([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'usuario' => 'Usuario', // Nombre de usuario temporal para usuarios no autenticados
            'imagen' => $imagenPath,
        ]);

        return redirect()->route('comunidad.index');
    }

    /**
     * Muestra una publicación específica
     */
    public function show(string $id)
    {
        $publicacion = Publicacion::findOrFail($id);
        $userIdentifier = $this->getUserIdentifier();
        
        // Obtener los comentarios de la publicación
        $comentarios = Comentario::where('publicacion_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($comentario) use ($userIdentifier) {
                return [
                    'id' => $comentario->id,
                    'contenido' => $comentario->contenido,
                    'usuario' => $comentario->usuario,
                    'fecha' => $comentario->created_at->format('d/m/Y H:i'),
                    'fecha_relativa' => $comentario->created_at->diffForHumans(),
                    'es_propietario' => $comentario->user_identifier === $userIdentifier
                ];
            });
        
        $publicacionConEstado = [
            'id' => $publicacion->id,
            'titulo' => $publicacion->titulo,
            'contenido' => $publicacion->contenido,
            'usuario' => $publicacion->usuario,
            'fecha' => $publicacion->created_at->format('d/m/Y'),
            'likes' => $publicacion->likes,
            'liked' => $this->hasLiked($publicacion->id, $userIdentifier),
            'guardado' => $this->hasGuardado($publicacion->id, $userIdentifier),
            'imagen' => $publicacion->imagen ?? '/images/colmena_logo.png',
            'comentarios_count' => $comentarios->count()
        ];
        
        return Inertia::render('Comunidad/detallePublicacion', [
            'publicacion' => $publicacionConEstado,
            'comentarios' => $comentarios,
            'flash' => session()->get('flash', [])
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
                'imagen' => $publicacion->imagen, // Se pasará como imagen_url en el frontend
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
            'imagen_url' => 'nullable|url|max:500', // Cambiado a URL en lugar de archivo
        ]);
        
        // Usar la URL de imagen proporcionada
        if ($request->filled('imagen_url')) {
            $publicacion->imagen = $request->imagen_url;
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

    /**************************************
     * FUNCIONALIDADES DE INTERACCIÓN (WEB)
     **************************************/
    
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

    /**************************************
     * SISTEMA DE COMENTARIOS (WEB)
     **************************************/
    
    /**
     * Añadir un comentario a una publicación
     */
    public function comentar(Request $request, $publicacionId)
    {
        $request->validate([
            'contenido' => 'required|string|max:500',
        ]);
        
        try {
            $publicacion = Publicacion::findOrFail($publicacionId);
            $userIdentifier = $this->getUserIdentifier();
            
            // Crear el comentario
            $comentario = Comentario::create([
                'publicacion_id' => $publicacionId,
                'user_identifier' => $userIdentifier,
                'contenido' => $request->contenido,
                'usuario' => 'Usuario', // Para usuarios no autenticados
            ]);
            
            // Crear notificación para el dueño de la publicación
            $ownerIdentifier = $publicacion->user_identifier ?? 'Usuario';
            if ($ownerIdentifier !== $userIdentifier) { // No notificar al mismo usuario
                Notificacion::create([
                    'user_identifier' => $ownerIdentifier,
                    'titulo' => '¡Nuevo comentario!',
                    'mensaje' => 'Alguien ha comentado en tu publicación "' . Str::limit($publicacion->titulo, 30) . '"',
                    'tipo' => 'comentario',
                    'leida' => false,
                    'enlace' => route('comunidad.publicacion', $publicacionId),
                    'publicacion_id' => $publicacionId
                ]);
            }
            
            return redirect()->back()->with('success', 'Comentario añadido correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocurrió un error al añadir el comentario');
        }
    }
    
    /**
     * Eliminar un comentario
     */
    public function eliminarComentario($id)
    {
        try {
            $comentario = Comentario::findOrFail($id);
            $userIdentifier = $this->getUserIdentifier();
            
            // Verificar si el usuario es el creador del comentario
            if ($comentario->user_identifier !== $userIdentifier) {
                return redirect()->back()->with('error', 'No tienes permiso para eliminar este comentario');
            }
            
            $comentario->delete();
            
            return redirect()->back()->with('success', 'Comentario eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Ocurrió un error al eliminar el comentario');
        }
    }

    /**************************************
     * SISTEMA DE NOTIFICACIONES (WEB)
     **************************************/
    
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

    /**************************************
     * API REST - PUBLICACIONES
     **************************************/

    /**
     * Get all publications for API
     * 
     * @route GET /api/v1/comunidad/publicaciones
     * @return JsonResponse Lista de publicaciones con estados de interacción del usuario actual
     */
    public function indexApi(): JsonResponse
    {
        $publicaciones = Publicacion::orderBy('created_at', 'desc')->get();
        
        if ($publicaciones->isEmpty()) {
            return response()->json(['data' => [], 'message' => 'No hay publicaciones disponibles'], 200);
        }
        
        $userIdentifier = $this->getUserIdentifier();
        
        $publicacionesConEstado = $publicaciones->map(function($pub) use ($userIdentifier) {
            // Contar comentarios
            $comentariosCount = Comentario::where('publicacion_id', $pub->id)->count();
            
            return [
                'id' => $pub->id,
                'titulo' => $pub->titulo,
                'contenido' => Str::limit($pub->contenido, 150),
                'usuario' => $pub->usuario,
                'fecha' => $pub->created_at->format('d/m/Y'),
                'likes' => $pub->getAttribute('likes'), // Use getAttribute to access the column
                'liked' => $this->hasLiked($pub->id, $userIdentifier),
                'guardado' => $this->hasGuardado($pub->id, $userIdentifier),
                'imagen' => $pub->imagen ?? '/images/colmena_logo.png',
                'comentarios_count' => $comentariosCount
            ];
        });
        
        return response()->json(['data' => $publicacionesConEstado, 'message' => 'Publicaciones obtenidas con éxito'], 200);
    }

    /**
     * Get a specific publication for API
     * 
     * @route GET /api/v1/comunidad/publicaciones/{publicacion}
     * @param Publicacion $publicacion La publicación a mostrar (inyección de modelo)
     * @return JsonResponse Detalles completos de la publicación incluyendo comentarios
     */
    public function showApi(Publicacion $publicacion): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Obtener comentarios
        $comentarios = Comentario::where('publicacion_id', $publicacion->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($comentario) use ($userIdentifier) {
                return [
                    'id' => $comentario->id,
                    'contenido' => $comentario->contenido,
                    'usuario' => $comentario->usuario,
                    'fecha' => $comentario->created_at->format('d/m/Y H:i'),
                    'fecha_relativa' => $comentario->created_at->diffForHumans(),
                    'es_propietario' => $comentario->user_identifier === $userIdentifier
                ];
            });
        
        $publicacionConEstado = [
            'id' => $publicacion->id,
            'titulo' => $publicacion->titulo,
            'contenido' => $publicacion->contenido,
            'usuario' => $publicacion->usuario,
            'fecha' => $publicacion->created_at->format('d/m/Y'),
            'likes' => $publicacion->getAttribute('likes'), // Use getAttribute to access the column
            'liked' => $this->hasLiked($publicacion->id, $userIdentifier),
            'guardado' => $this->hasGuardado($publicacion->id, $userIdentifier),
            'imagen' => $publicacion->imagen ?? '/images/colmena_logo.png',
            'comentarios' => $comentarios,
            'comentarios_count' => $comentarios->count()
        ];
        
        return response()->json(['data' => $publicacionConEstado, 'message' => 'Publicación obtenida con éxito'], 200);
    }

    /**
     * Store a new publication via API
     * 
     * @route POST /api/v1/comunidad/publicaciones
     * @param Request $request Datos de la nueva publicación (titulo, contenido, imagen_url)
     * @return JsonResponse La publicación creada con código 201
     */
    public function storeApi(Request $request): JsonResponse
    {
        $request->validate([
            'titulo' => 'required|max:255',
            'contenido' => 'required',
            'imagen_url' => 'nullable|url|max:500', // Agregado validación para URL de imagen
        ]);
        
        // Usar create con array para evitar conflictos con la relación likes()
        $publicacion = Publicacion::create([
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'usuario' => Auth::check() ? Auth::user()->name : 'Usuario API',
            'likes' => 0,
            'imagen' => $request->filled('imagen_url') ? $request->imagen_url : null,
        ]);
        
        return response()->json([
            'data' => $publicacion,
            'message' => 'Publicación creada con éxito'
        ], 201);
    }

    /**
     * Update a publication via API
     * 
     * @route PUT /api/v1/comunidad/publicaciones/{publicacion}
     * @param Request $request Datos actualizados (titulo, contenido, imagen_url)
     * @param Publicacion $publicacion La publicación a actualizar
     * @return JsonResponse La publicación actualizada con código 200
     */
    public function updateApi(Request $request, Publicacion $publicacion): JsonResponse
    {
        $request->validate([
            'titulo' => 'required|max:255',
            'contenido' => 'required',
            'imagen_url' => 'nullable|url|max:500', // Agregado validación para URL de imagen
        ]);
        
        // Verificar si el usuario actual es dueño de la publicación
        if (Auth::check() && $publicacion->usuario !== Auth::user()->name) {
            return response()->json([
                'message' => 'No tienes permiso para editar esta publicación'
            ], 403);
        }
        
        $publicacion->titulo = $request->titulo;
        $publicacion->contenido = $request->contenido;
        
        // Actualizar la imagen con la URL proporcionada
        if ($request->filled('imagen_url')) {
            $publicacion->imagen = $request->imagen_url;
        }
        
        $publicacion->save();
        
        return response()->json([
            'data' => $publicacion,
            'message' => 'Publicación actualizada con éxito'
        ], 200);
    }

    /**
     * Delete a publication via API
     * 
     * @route DELETE /api/v1/comunidad/publicaciones/{publicacion}
     * @param Publicacion $publicacion La publicación a eliminar
     * @return JsonResponse Mensaje de confirmación con código 200
     */
    public function destroyApi(Publicacion $publicacion): JsonResponse
    {
        // Verificar si el usuario actual es dueño de la publicación
        if (Auth::check() && $publicacion->usuario !== Auth::user()->name) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar esta publicación'
            ], 403);
        }
        
        // Eliminar imagen si existe
        if ($publicacion->imagen && $publicacion->imagen != '/images/colmena_logo.png') {
            $imagenPath = public_path(str_replace('/images/', 'images/', $publicacion->imagen));
            if (file_exists($imagenPath)) {
                unlink($imagenPath);
            }
        }
        
        $publicacion->delete();
        
        return response()->json([
            'message' => 'Publicación eliminada con éxito'
        ], 200);
    }

    /**
     * Get user's publications via API
     * 
     * @route GET /api/v1/comunidad/publicaciones/usuario/mis-publicaciones
     * @return JsonResponse Lista de publicaciones creadas por el usuario actual
     */
    public function misPublicacionesApi(): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Si hay autenticación, usamos el usuario autenticado
        if (Auth::check()) {
            $publicaciones = Publicacion::where('usuario', Auth::user()->name)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // Si no hay autenticación, usamos el identificador de cookie
            $publicaciones = Publicacion::where('usuario', 'Usuario')
                ->orderBy('created_at', 'desc')
                ->get();
        }
            
        $publicacionesConEstado = $publicaciones->map(function($pub) use ($userIdentifier) {
            return [
                'id' => $pub->id,
                'titulo' => $pub->titulo,
                'contenido' => $pub->contenido,
                'usuario' => $pub->usuario,
                'fecha' => $pub->created_at->format('d/m/Y'),
                'likes' => $pub->getAttribute('likes'), // Use getAttribute to access the column
                'liked' => $this->hasLiked($pub->id, $userIdentifier),
                'guardado' => $this->hasGuardado($pub->id, $userIdentifier),
                'imagen' => $pub->imagen ?? '/images/colmena_logo.png'
            ];
        });
        
        return response()->json([
            'data' => $publicacionesConEstado,
            'message' => 'Mis publicaciones obtenidas con éxito'
        ], 200);
    }

    /**************************************
     * API REST - INTERACCIONES
     **************************************/

    /**
     * Like a publication via API
     * 
     * @route POST /api/v1/comunidad/publicaciones/{publicacion}/like
     * @param Publicacion $publicacion La publicación a la que dar/quitar like
     * @return JsonResponse Estado actual del like y contador actualizado
     */
    public function likeApi(Publicacion $publicacion): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Verificar si ya dio like
        if (!$this->hasLiked($publicacion->id, $userIdentifier)) {
            // Incrementar contador de likes
            // Access likes as attribute, not as relation
            $likesCount = $publicacion->getAttribute('likes') ?? 0;
            $publicacion->setAttribute('likes', $likesCount + 1);
            $publicacion->save();
            
            // Guardar like en la tabla
            DB::table('publicacion_likes')->insert([
                'publicacion_id' => $publicacion->id,
                'user_identifier' => $userIdentifier,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // Crear notificación
            $notificacion = new Notificacion();
            $notificacion->tipo = 'like';
            $notificacion->mensaje = 'A alguien le gustó tu publicación "' . Str::limit($publicacion->titulo, 30) . '"';
            $notificacion->link = '/comunidad/publicacion/' . $publicacion->id;
            $notificacion->leida = false;
            $notificacion->save();
            
            return response()->json([
                'liked' => true,
                'likes' => $publicacion->getAttribute('likes'),
                'message' => 'Like agregado con éxito'
            ], 200);
        } else {
            // Ya dio like, entonces quitar like
            // Access likes as attribute, not as relation
            $likesCount = $publicacion->getAttribute('likes') ?? 0;
            $publicacion->setAttribute('likes', max(0, $likesCount - 1)); // Prevent negative likes
            $publicacion->save();
            
            // Eliminar like de la tabla
            DB::table('publicacion_likes')
                ->where('publicacion_id', $publicacion->id)
                ->where('user_identifier', $userIdentifier)
                ->delete();
            
            return response()->json([
                'liked' => false,
                'likes' => $publicacion->getAttribute('likes'),
                'message' => 'Like removido con éxito'
            ], 200);
        }
    }

    /**
     * Save a publication via API
     * 
     * @route POST /api/v1/comunidad/publicaciones/{publicacion}/guardar
     * @param Publicacion $publicacion La publicación a guardar/quitar de guardados
     * @return JsonResponse Estado actual del guardado
     */
    public function guardarApi(Publicacion $publicacion): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Verificar si ya está guardado
        if (!$this->hasGuardado($publicacion->id, $userIdentifier)) {
            // Guardar en la tabla de guardados
            DB::table('publicacion_guardados')->insert([
                'publicacion_id' => $publicacion->id,
                'user_identifier' => $userIdentifier,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'guardado' => true,
                'message' => 'Publicación guardada con éxito'
            ], 200);
        } else {
            // Ya está guardado, entonces quitar de guardados
            DB::table('publicacion_guardados')
                ->where('publicacion_id', $publicacion->id)
                ->where('user_identifier', $userIdentifier)
                ->delete();
            
            return response()->json([
                'guardado' => false,
                'message' => 'Publicación removida de guardados con éxito'
            ], 200);
        }
    }

    /**
     * Get user's saved publications via API
     * 
     * @route GET /api/v1/comunidad/publicaciones/usuario/guardados
     * @return JsonResponse Lista de publicaciones guardadas por el usuario actual
     */
    public function guardadosApi(): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Obtener IDs de publicaciones guardadas
        $guardadosIds = DB::table('publicacion_guardados')
            ->where('user_identifier', $userIdentifier)
            ->pluck('publicacion_id');
            
        // Obtener las publicaciones guardadas
        $publicaciones = Publicacion::whereIn('id', $guardadosIds)
            ->orderBy('created_at', 'desc')
            ->get();
            
        $publicacionesConEstado = $publicaciones->map(function($pub) use ($userIdentifier) {
            return [
                'id' => $pub->id,
                'titulo' => $pub->titulo,
                'contenido' => $pub->contenido,
                'usuario' => $pub->usuario,
                'fecha' => $pub->created_at->format('d/m/Y'),
                'likes' => $pub->getAttribute('likes'), // Use getAttribute to access the column
                'liked' => $this->hasLiked($pub->id, $userIdentifier),
                'guardado' => $this->hasGuardado($pub->id, $userIdentifier),
                'imagen' => $pub->imagen ?? '/images/colmena_logo.png'
            ];
        });
        
        return response()->json([
            'data' => $publicacionesConEstado,
            'message' => 'Publicaciones guardadas obtenidas con éxito'
        ], 200);
    }

    /**************************************
     * API REST - COMENTARIOS
     **************************************/
    
    /**
     * Add a comment to a publication via API
     * 
     * @route POST /api/v1/comunidad/publicaciones/{publicacion}/comentar
     * @param Request $request Contenido del comentario
     * @param Publicacion $publicacion La publicación a comentar
     * @return JsonResponse El comentario creado con código 201
     */
    public function comentarApi(Request $request, Publicacion $publicacion): JsonResponse
    {
        $request->validate([
            'contenido' => 'required|string|max:500',
        ]);
        
        $userIdentifier = $this->getUserIdentifier();
        $nombreUsuario = Auth::check() ? Auth::user()->name : 'Usuario API';
        
        try {
            // Crear el comentario
            $comentario = Comentario::create([
                'publicacion_id' => $publicacion->id,
                'user_identifier' => $userIdentifier,
                'contenido' => $request->contenido,
                'usuario' => $nombreUsuario,
            ]);
            
            // Crear notificación para el dueño de la publicación
            $ownerIdentifier = $publicacion->user_identifier ?? 'Usuario';
            if ($ownerIdentifier !== $userIdentifier) { // No notificar al mismo usuario
                Notificacion::create([
                    'user_identifier' => $ownerIdentifier,
                    'titulo' => '¡Nuevo comentario!',
                    'mensaje' => 'Alguien ha comentado en tu publicación "' . Str::limit($publicacion->titulo, 30) . '"',
                    'tipo' => 'comentario',
                    'leida' => false,
                    'enlace' => route('comunidad.publicacion', $publicacion->id),
                    'publicacion_id' => $publicacion->id
                ]);
            }
            
            return response()->json([
                'data' => [
                    'id' => $comentario->id,
                    'contenido' => $comentario->contenido,
                    'usuario' => $comentario->usuario,
                    'fecha' => $comentario->created_at->format('d/m/Y H:i'),
                    'fecha_relativa' => $comentario->created_at->diffForHumans(),
                ],
                'message' => 'Comentario añadido con éxito'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al añadir el comentario: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get comments for a publication via API
     * 
     * @route GET /api/v1/comunidad/publicaciones/{publicacion}/comentarios
     * @param Publicacion $publicacion La publicación cuyos comentarios se quieren obtener
     * @return JsonResponse Lista de comentarios de la publicación
     */
    public function comentariosApi(Publicacion $publicacion): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        $comentarios = Comentario::where('publicacion_id', $publicacion->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($comentario) use ($userIdentifier) {
                return [
                    'id' => $comentario->id,
                    'contenido' => $comentario->contenido,
                    'usuario' => $comentario->usuario,
                    'fecha' => $comentario->created_at->format('d/m/Y H:i'),
                    'fecha_relativa' => $comentario->created_at->diffForHumans(),
                    'es_propietario' => $comentario->user_identifier === $userIdentifier
                ];
            });
        
        return response()->json([
            'data' => $comentarios,
            'message' => 'Comentarios obtenidos con éxito'
        ], 200);
    }
    
    /**
     * Delete a comment via API
     * 
     * @route DELETE /api/v1/comunidad/comentarios/{comentario}
     * @param Comentario $comentario El comentario a eliminar
     * @return JsonResponse Mensaje de confirmación con código 200
     */
    public function eliminarComentarioApi(Comentario $comentario): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Verificar si el usuario es el creador del comentario
        if ($comentario->user_identifier !== $userIdentifier) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar este comentario'
            ], 403);
        }
        
        try {
            $comentario->delete();
            
            return response()->json([
                'message' => 'Comentario eliminado con éxito'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el comentario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**************************************
     * API REST - NOTIFICACIONES
     **************************************/

    /**
     * Get notifications via API
     * 
     * @route GET /api/v1/comunidad/notificaciones
     * @return JsonResponse Lista de notificaciones del usuario actual
     */
    public function notificacionesApi(): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Filtrar por user_identifier para obtener solo las notificaciones del usuario actual
        $notificaciones = Notificacion::where('user_identifier', $userIdentifier)
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
                    'publicacion_id' => $notif->publicacion_id
                ];
            });
        
        return response()->json([
            'data' => $notificaciones,
            'message' => 'Notificaciones obtenidas con éxito'
        ], 200);
    }

    /**
     * Count unread notifications via API
     * 
     * @route GET /api/v1/comunidad/notificaciones/count
     * @return JsonResponse Número de notificaciones sin leer
     */
    public function contarNotificacionesSinLeerApi(): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Filtrar por user_identifier para obtener solo las notificaciones del usuario actual
        $count = Notificacion::where('leida', false)
            ->where('user_identifier', $userIdentifier)
            ->count();
        
        return response()->json([
            'count' => $count,
            'message' => 'Conteo de notificaciones sin leer obtenido con éxito'
        ], 200);
    }

    /**
     * Mark notification as read via API
     * 
     * @route PUT /api/v1/comunidad/notificaciones/{notificacion}
     * @param Notificacion $notificacion La notificación a marcar como leída
     * @return JsonResponse Mensaje de confirmación
     */
    public function leerNotificacionApi(Notificacion $notificacion): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        // Verificar si la notificación pertenece al usuario actual
        if ($notificacion->user_identifier !== $userIdentifier) {
            return response()->json([
                'message' => 'No tienes permiso para marcar esta notificación como leída'
            ], 403);
        }
        
        $notificacion->leida = true;
        $notificacion->save();
        
        return response()->json([
            'message' => 'Notificación marcada como leída'
        ], 200);
    }

    /**
     * Mark all notifications as read via API
     * 
     * @route PUT /api/v1/comunidad/notificaciones/leer-todas
     * @return JsonResponse Mensaje de confirmación
     */
    public function leerTodasNotificacionesApi(): JsonResponse
    {
        $userIdentifier = $this->getUserIdentifier();
        
        Notificacion::where('leida', false)
            ->where('user_identifier', $userIdentifier)
            ->update(['leida' => true]);
        
        return response()->json([
            'message' => 'Todas las notificaciones marcadas como leídas'
        ], 200);
    }
}
