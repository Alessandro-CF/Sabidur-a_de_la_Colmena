<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado
        if (Auth::guard('api')->check()) {
            $user = Auth::guard('api')->user();
            
            // Verificar si el usuario está inactivo
            if ($user->estado !== 'activo') {
                // Invalidar el token JWT
                try {
                    JWTAuth::invalidate(JWTAuth::getToken());
                } catch (\Exception $e) {
                    // Manejar error silenciosamente
                }
                
                return response()->json([
                    'success' => false,
                    'message' => 'Tu cuenta ha sido desactivada. Contacta al administrador para reactivarla.'
                ], 403);
            }
        }
        
        return $next($request);
    }
}
