<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Make sure the user is logged in and has "admin" role
        if (auth()->check() && auth()->user()->role === 'admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
    }
}
