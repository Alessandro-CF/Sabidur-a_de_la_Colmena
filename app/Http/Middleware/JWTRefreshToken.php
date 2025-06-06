<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class JWTRefreshToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Try to authenticate with the token
            $user = JWTAuth::parseToken()->authenticate();
            
            if ($user) {
                return $next($request);
            }
            
        } catch (TokenExpiredException $e) {
            try {
                // Token expired, try to refresh it
                $newToken = JWTAuth::refresh();
                
                // Set the new token in the response header
                $response = $next($request);
                $response->headers->set('Authorization', 'Bearer ' . $newToken);
                
                return $response;
                
            } catch (JWTException $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo refrescar el token'
                ], 401);
            }
            
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token no válido'
            ], 401);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de autenticación'
            ], 500);
        }

        return response()->json([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ], 404);
    }
}
