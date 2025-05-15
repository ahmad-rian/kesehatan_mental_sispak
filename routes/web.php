<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\GoogleController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::middleware(['auth', 'verified'])->group(function () {


    Route::middleware(['role:admin'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('admin/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('admin.dashboard');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
