<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Registrar aliases de middleware
        $middleware->alias([
            'jwt.auth' => \App\Http\Middleware\JWTAuthenticate::class,
            'jwt.refresh' => \App\Http\Middleware\JWTRefreshToken::class,
            'cors' => \Illuminate\Http\Middleware\HandleCors::class,
            'custom.cors' => \App\Http\Middleware\CustomCorsMiddleware::class,
            'api.throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'isAdmin' => \App\Http\Middleware\IsAdmin::class,
        ]);

        // Middleware global para API
        $middleware->api(prepend: [
            'custom.cors',
        ]);
        
        $middleware->api(append: [
            'api.throttle:60,1',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
