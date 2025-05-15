<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('login')->with('info', 'Registration is currently disabled. Please login with your existing account.');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('login')->with('error', 'Registration is not allowed. Please contact administrator if you need access.');
    }
}
