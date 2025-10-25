<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// ✅ Import exception classes BEFORE anything else
use Throwable;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use App\Http\Middleware\IsAdmin;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Enable CORS globally
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        // ✅ Register custom middleware aliases
        $middleware->alias([
            'admin' => IsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

        // ✅ Validation error handling
        $exceptions->render(function (ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // ✅ Authentication error handling
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Unauthenticated',
                ], 401);
            }
        });

        // ✅ Access denied handling
        $exceptions->render(function (AccessDeniedHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'You do not have permission to perform this action',
                ], 403);
            }
        });

        // ✅ Not found handling
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Resource not found',
                ], 404);
            }
        });

        // ✅ Fallback (catch-all)
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                $status = 500;
                if ($e instanceof HttpExceptionInterface) {
                    $status = $e->getStatusCode();
                }

                return response()->json([
                    'message' => $e->getMessage() ?: 'Something went wrong on the server',
                    'exception' => class_basename($e),
                ], $status);
            }
        });
    })
    ->create();
