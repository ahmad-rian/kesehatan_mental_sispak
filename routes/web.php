<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ExpertSystemController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\MentalDisorderController;
use App\Http\Controllers\Admin\SymptomController;
use App\Http\Controllers\Admin\DiagnosisRuleController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('consultation')->name('consultation.')->group(function () {
        Route::get('/', [ExpertSystemController::class, 'index'])->name('index');
        Route::post('/start', [ExpertSystemController::class, 'startConsultation'])->name('start');
        Route::get('/{consultation}/question', [ExpertSystemController::class, 'showQuestion'])->name('question');
        Route::post('/{consultation}/answer', [ExpertSystemController::class, 'processAnswer'])->name('answer');
        Route::get('/{consultation}/result', [ExpertSystemController::class, 'showResult'])->name('result');
        Route::post('/{consultation}/abandon', [ExpertSystemController::class, 'abandonConsultation'])->name('abandon');
        Route::post('/{consultation}/force-complete', [ExpertSystemController::class, 'forceCompleteConsultation'])->name('force-complete');
        Route::get('/resume', [ExpertSystemController::class, 'resumeConsultation'])->name('resume');
        Route::get('/history', [ExpertSystemController::class, 'history'])->name('history');

        Route::get('/{consultation}/progress', [ExpertSystemController::class, 'getConsultationProgress'])->name('progress');
        Route::get('/{consultation}/summary', [ExpertSystemController::class, 'getConsultationSummary'])->name('summary');
        Route::get('/{consultation}/debug', [ExpertSystemController::class, 'debugConsultation'])->name('debug');
    });

    Route::prefix('api/expert-system')->name('api.expert-system.')->group(function () {
        Route::post('/quick-diagnosis', [ExpertSystemController::class, 'quickDiagnosis'])->name('quick-diagnosis');
        Route::get('/symptoms', [ExpertSystemController::class, 'getSymptoms'])->name('symptoms');
        Route::post('/validate-symptoms', [ExpertSystemController::class, 'validateSymptoms'])->name('validate-symptoms');
        Route::post('/next-questions', [ExpertSystemController::class, 'getNextQuestions'])->name('next-questions');
        Route::get('/user-stats', [ExpertSystemController::class, 'getUserStats'])->name('user-stats');
        Route::get('/consultations', [ExpertSystemController::class, 'getConsultationsApi'])->name('consultations');
    });

    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::resource('mental-disorders', MentalDisorderController::class)->parameters([
            'mental-disorders' => 'mentalDisorder'
        ]);

        Route::resource('symptoms', SymptomController::class);

        Route::resource('diagnosis-rules', DiagnosisRuleController::class)->parameters([
            'diagnosis-rules' => 'diagnosisRule'
        ]);
        Route::post('diagnosis-rules/{diagnosisRule}/test', [DiagnosisRuleController::class, 'test'])->name('diagnosis-rules.test');
        Route::post('diagnosis-rules/bulk-update', [DiagnosisRuleController::class, 'bulkUpdate'])->name('diagnosis-rules.bulk-update');

        Route::get('user-diagnoses', [AdminDashboardController::class, 'userDiagnoses'])->name('user-diagnoses.index');
        Route::get('user-diagnoses/{userDiagnosis}', [AdminDashboardController::class, 'showUserDiagnosis'])->name('user-diagnoses.show');

        Route::get('consultations', [AdminDashboardController::class, 'consultations'])->name('consultations.index');
        Route::get('consultations/{consultation}', [AdminDashboardController::class, 'showConsultation'])->name('consultations.show');

        Route::get('users', [AdminDashboardController::class, 'users'])->name('users.index');
        Route::get('users/{user}', [AdminDashboardController::class, 'showUser'])->name('users.show');

        Route::get('reports', [AdminDashboardController::class, 'reports'])->name('reports.index');
        Route::post('export', [AdminDashboardController::class, 'export'])->name('export');

        Route::get('settings', [AdminDashboardController::class, 'settings'])->name('settings.index');

        Route::get('test-system', [AdminDashboardController::class, 'testSystem'])->name('test-system.index');
        Route::post('test-system/run', [AdminDashboardController::class, 'runTest'])->name('test-system.run');

        Route::prefix('api')->name('api.')->group(function () {
            Route::get('mental-disorders', [MentalDisorderController::class, 'api'])->name('mental-disorders');
            Route::get('symptoms', [SymptomController::class, 'api'])->name('symptoms');
            Route::get('symptoms/by-category', [SymptomController::class, 'byCategory'])->name('symptoms.by-category');
            Route::get('diagnosis-rules', [DiagnosisRuleController::class, 'api'])->name('diagnosis-rules');
            Route::get('diagnosis-rules/disorder/{disorder}', [DiagnosisRuleController::class, 'byDisorder'])->name('diagnosis-rules.by-disorder');
        });
    });

    Route::middleware(['role:user'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');
    });

    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Dashboard');
    })->name('dashboard.redirect');
});

Route::prefix('api/public')->name('api.public.')->group(function () {
    Route::get('symptoms/categories', [SymptomController::class, 'byCategory'])->name('symptoms.categories');
    Route::get('mental-disorders', [MentalDisorderController::class, 'api'])->name('mental-disorders');

    Route::get('health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
            'system' => 'Mental Health Expert System',
            'version' => '1.0.0'
        ]);
    })->name('health');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::fallback(function () {
    return Inertia::render('Errors/404');
});
