<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;

class SuperAdmin
{
    public function handle(Request $request, \Closure $next)
    {
        if ($request->user()?->isSuperAdmin()) {
            return $next($request);
        }
        abort(403, 'Unauthorized action.');
    }
}
