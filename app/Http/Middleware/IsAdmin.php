<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado
        if (!auth('api')->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Authentication required'
            ], 401);
        }

        $user = auth('api')->user();
        
        // Verificar si el usuario es administrador
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden - Admin access required'
            ], 403);
        }

        return $next($request);
    }
}
