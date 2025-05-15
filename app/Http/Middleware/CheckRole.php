<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        if (!auth()->user()->hasRole($role)) {

            return redirect('/')->with('error', 'Anda tidak memiliki akses untuk halaman tersebut.');
        }

        return $next($request);
    }
}
