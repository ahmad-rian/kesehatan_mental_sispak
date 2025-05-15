<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\AllowedEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::with('role')
                ->where('email', $googleUser->email)
                ->orWhere('google_id', $googleUser->id)
                ->first();

            if ($user) {
                $updateData = [];
                if (!$user->google_id) {
                    $updateData['google_id'] = $googleUser->id;
                }
                if (!$user->avatar || $user->avatar !== $googleUser->avatar) {
                    $updateData['avatar'] = $googleUser->avatar;
                }
                if (!empty($updateData)) {
                    $updateData['provider'] = 'google';
                    $user->update($updateData);
                    $user = $user->fresh('role');
                }

                Auth::login($user);
            } else {
                $isAllowedAdmin = AllowedEmail::where('email', $googleUser->email)->exists();

                if ($isAllowedAdmin) {
                    $userRole = Role::where('name', 'admin')->first();
                } else {
                    $userRole = Role::where('name', 'user')->first();
                }

                if (!$userRole) {
                    $userRole = Role::firstOrCreate(
                        ['name' => 'user'],
                        ['display_name' => 'User', 'description' => 'Regular user']
                    );
                }

                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'provider' => 'google',
                    'role_id' => $userRole->id,
                    'email_verified_at' => now(),
                ]);

                $user->load('role');

                Auth::login($user);
            }

            if ($user->hasRole('admin')) {
                return redirect()->intended('/admin/dashboard');
            } else {
                return redirect('/')->with('info', 'Login berhasil! Anda telah masuk sebagai user.');
            }
        } catch (Exception $e) {
            \Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Something went wrong with Google authentication. Please try again.');
        }
    }
}
