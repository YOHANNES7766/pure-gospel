<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\IsAdmin;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Enable CORS globally
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        // ✅ Register custom middleware aliases
        $middleware->alias([
            'admin' => IsAdmin::class, // use 'admin' alias in routes
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
