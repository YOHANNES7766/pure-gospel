<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when not authenticated.
     */
    protected function redirectTo($request): ?string
    {
        // Prevent Laravel from redirecting to /login — just return null
        if (! $request->expectsJson()) {
            return null;
        }

        return null;
    }

    /**
     * Override unauthenticated API response
     */
    protected function unauthenticated($request, array $guards)
    {
        abort(response()->json([
            'message' => 'Unauthenticated. Please log in.'
        ], 401));
    }
}
