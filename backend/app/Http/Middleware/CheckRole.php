<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Use syntax: middleware('role:admin,pastor')
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // ✅ 1. SUPER ADMIN overrides everything
        // If the user is a super_admin, let them pass immediately.
        if ($request->user()->role === 'super_admin') {
            return $next($request);
        }

        // ✅ 2. Check against allowed roles for this specific route
        // Example: if route allows ['admin', 'pastor'] and user is 'user', fail.
        if (in_array($request->user()->role, $roles)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Access denied. You do not have permission.'
        ], 403);
    }
}