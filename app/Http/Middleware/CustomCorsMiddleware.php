<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CustomCorsMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Obtener el origen de la aplicación
        $appUrl = config('app.url');
        $allowedOrigins = [
            $appUrl,
            'https://sabidur-adelacolmena-production-5bb8.up.railway.app',
            'http://localhost:3000',
            'http://localhost:8000',
        ];

        $origin = $request->headers->get('Origin');
        $allowOrigin = in_array($origin, $allowedOrigins) ? $origin : $appUrl;

        // Handle preflight OPTIONS request
        if ($request->getMethod() === "OPTIONS") {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $allowOrigin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);

        // Add CORS headers to response
        $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
