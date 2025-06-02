<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BackwardChainingService;
use App\Models\User;
use App\Models\UserDiagnosis;
use App\Models\Consultation;
use App\Models\MentalDisorder;
use App\Models\Symptom;
use App\Models\DiagnosisRule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AdminDashboardController extends Controller
{
    public function __construct(
        private BackwardChainingService $expertService
    ) {}

    public function index()
    {
        $stats = $this->expertService->getSystemStatistics();
        $recentActivity = $this->getRecentActivity();
        $chartData = $this->getChartData();

        return Inertia::render('Admin/dashboard', [
            'stats' => $stats,
            'recent_activity' => $recentActivity,
            'chart_data' => $chartData,
            'system_health' => $this->getSystemHealth(),
        ]);
    }

    public function testSystem()
    {
        $allSymptoms = Symptom::orderBy('code')->get();
        $testCases = $this->generateTestCases();

        return Inertia::render('Admin/TestSystem/Index', [
            'symptoms' => $allSymptoms,
            'test_cases' => $testCases,
            'symptom_categories' => $this->expertService->getSymptomCategories(),
        ]);
    }

    public function runTest(Request $request)
    {
        try {
            $request->validate([
                'test_symptoms' => 'required|array|min:1',
                'test_symptoms.*' => 'string',
            ]);

            $testSymptoms = $request->test_symptoms;

            $validation = $this->expertService->validateSymptoms($testSymptoms);

            if (!$validation['is_valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid symptoms detected: ' . implode(', ', $validation['invalid']),
                    'validation' => $validation
                ], 422);
            }

            $testUserId = 0;

            $diagnosisResult = $this->expertService->diagnose($testSymptoms, $testUserId);
            $recommendations = $this->expertService->getGeneralRecommendations($testSymptoms);
            $nextQuestions = $this->expertService->getNextQuestions($testSymptoms);

            $symptomsDetails = Symptom::getByCodes($testSymptoms);

            Log::info('Test diagnosis completed', [
                'symptoms' => $testSymptoms,
                'diagnosis_status' => $diagnosisResult['status'],
                'confidence' => $diagnosisResult['diagnosis']['confidence'] ?? 0
            ]);

            return response()->json([
                'success' => true,
                'test_symptoms' => $testSymptoms,
                'symptoms_details' => $symptomsDetails,
                'diagnosis_result' => $diagnosisResult,
                'recommendations' => $recommendations,
                'validation' => $validation,
                'suggested_questions' => $nextQuestions,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Test diagnosis error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi error saat menjalankan test: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    public function userDiagnoses()
    {
        $diagnoses = UserDiagnosis::with(['user', 'mentalDisorder'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/UserDiagnoses/Index', [
            'diagnoses' => $diagnoses,
            'filters' => [
                'confidence_levels' => [
                    'high' => 'Tinggi (≥80%)',
                    'medium' => 'Sedang (60-79%)',
                    'low' => 'Rendah (<60%)'
                ],
                'disorders' => MentalDisorder::orderBy('name')->get(['id', 'name', 'code']),
            ],
        ]);
    }

    public function showUserDiagnosis(UserDiagnosis $userDiagnosis)
    {
        $userDiagnosis->load(['user', 'mentalDisorder', 'consultations']);

        return Inertia::render('Admin/UserDiagnoses/Show', [
            'diagnosis' => $userDiagnosis,
            'symptoms_details' => Symptom::getByCodes($userDiagnosis->symptoms_reported ?? []),
        ]);
    }

    public function consultations()
    {
        $consultations = Consultation::with(['user', 'finalDiagnosis.mentalDisorder'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Consultations/Index', [
            'consultations' => $consultations,
            'status_options' => [
                'in_progress' => 'Sedang Berlangsung',
                'completed' => 'Selesai',
                'abandoned' => 'Dibatalkan'
            ],
        ]);
    }

    public function showConsultation(Consultation $consultation)
    {
        try {
            $consultation->load([
                'user',
                'finalDiagnosis.mentalDisorder'
            ]);

            if (!$consultation->user && $consultation->user_id) {
                $user = User::find($consultation->user_id);
                if ($user) {
                    $consultation->setRelation('user', $user);
                }
            }

            $summary = $this->getConsultationSummary($consultation->id);

            if ($consultation->user) {
                $summary['user'] = [
                    'id' => $consultation->user->id,
                    'name' => $consultation->user->name,
                    'email' => $consultation->user->email
                ];
            }

            return Inertia::render('Admin/Consultations/Show', [
                'consultation' => $consultation,
                'summary' => $summary,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading consultation', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage()
            ]);

            return Inertia::render('Admin/Consultations/Show', [
                'consultation' => $consultation,
                'summary' => [],
                'error' => 'Error loading consultation data'
            ]);
        }
    }

    public function users()
    {
        $users = User::with(['role', 'latestDiagnosis.mentalDisorder'])
            ->withCount(['diagnoses', 'consultations'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function showUser(User $user)
    {
        $user->load(['role', 'diagnoses.mentalDisorder', 'consultations.finalDiagnosis.mentalDisorder']);

        $diagnosisHistory = $this->getUserDiagnosisHistory($user->id);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'diagnosis_history' => $diagnosisHistory,
            'consultation_summary' => [
                'total' => $user->consultations->count(),
                'completed' => $user->consultations->where('status', 'completed')->count(),
                'in_progress' => $user->consultations->where('status', 'in_progress')->count(),
                'abandoned' => $user->consultations->where('status', 'abandoned')->count(),
            ],
        ]);
    }

    public function reports()
    {
        $reportData = [
            'diagnosis_trends' => $this->getDiagnosisTrends(),
            'disorder_distribution' => $this->getDisorderDistribution(),
            'symptom_frequency' => $this->getSymptomFrequency(),
            'confidence_analysis' => $this->getConfidenceAnalysis(),
            'user_engagement' => $this->getUserEngagement(),
        ];

        return Inertia::render('Admin/Reports/Index', [
            'report_data' => $reportData,
        ]);
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings/Index', [
            'system_info' => [
                'total_disorders' => MentalDisorder::count(),
                'total_symptoms' => Symptom::count(),
                'total_rules' => DiagnosisRule::count(),
                'database_size' => $this->getDatabaseSize(),
            ],
            'performance_metrics' => $this->getPerformanceMetrics(),
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:diagnoses,consultations,users,symptoms,rules',
            'format' => 'required|in:csv,excel,pdf',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        return response()->json([
            'message' => 'Export functionality will be implemented based on requirements',
            'requested' => $request->all(),
        ]);
    }

    private function getRecentActivity()
    {
        $recentDiagnoses = UserDiagnosis::with(['user', 'mentalDisorder'])
            ->latest()
            ->take(5)
            ->get();

        $recentConsultations = Consultation::with(['user'])
            ->latest()
            ->take(5)
            ->get();

        return [
            'diagnoses' => $recentDiagnoses,
            'consultations' => $recentConsultations,
        ];
    }

    private function getChartData()
    {
        $last7Days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $last7Days->push([
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('M j'),
                'diagnoses' => UserDiagnosis::whereDate('created_at', $date)->count(),
                'consultations' => Consultation::whereDate('created_at', $date)->count(),
            ]);
        }

        return [
            'daily_activity' => $last7Days,
            'disorder_breakdown' => $this->getDisorderBreakdown(),
            'confidence_distribution' => $this->getConfidenceDistribution(),
        ];
    }

    private function getSystemHealth()
    {
        $totalRules = DiagnosisRule::count();
        $totalSymptoms = Symptom::count();
        $totalDisorders = MentalDisorder::count();

        $averageConfidence = UserDiagnosis::avg('confidence_level');
        $averageConfidence = $averageConfidence ? (float) $averageConfidence : 0.0;

        return [
            'rules_coverage' => $totalRules > 0 ? 100.0 : 0.0,
            'symptom_utilization' => (float) $this->getSymptomUtilization(),
            'average_confidence' => $averageConfidence,
            'completion_rate' => (float) $this->getConsultationCompletionRate(),
            'status' => 'healthy',
        ];
    }

    private function getDiagnosisTrends()
    {
        $last30Days = collect();
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $last30Days->push([
                'date' => $date->format('Y-m-d'),
                'count' => UserDiagnosis::whereDate('created_at', $date)->count(),
            ]);
        }

        return $last30Days;
    }

    private function getDisorderDistribution()
    {
        return UserDiagnosis::selectRaw('mental_disorder_id, COUNT(*) as count')
            ->with('mentalDisorder:id,name,code')
            ->groupBy('mental_disorder_id')
            ->orderByDesc('count')
            ->get();
    }

    private function getSymptomFrequency()
    {
        $allDiagnoses = UserDiagnosis::all();
        $symptomCount = [];

        foreach ($allDiagnoses as $diagnosis) {
            foreach ($diagnosis->symptoms_reported ?? [] as $symptom) {
                $symptomCount[$symptom] = ($symptomCount[$symptom] ?? 0) + 1;
            }
        }

        arsort($symptomCount);

        return collect($symptomCount)->take(10)->map(function ($count, $code) {
            $symptom = Symptom::getByCode($code);
            return [
                'code' => $code,
                'description' => $symptom ? $symptom->description : 'Unknown',
                'count' => $count,
            ];
        })->values();
    }

    private function getConfidenceAnalysis()
    {
        $averageConfidence = UserDiagnosis::avg('confidence_level');
        $averageConfidence = $averageConfidence ? (float) $averageConfidence : 0.0;

        $totalCount = UserDiagnosis::count();
        $medianConfidence = 0.0;

        if ($totalCount > 0) {
            $medianResult = UserDiagnosis::orderBy('confidence_level')
                ->skip(intval($totalCount / 2))
                ->first();
            $medianConfidence = $medianResult ? (float) $medianResult->confidence_level : 0.0;
        }

        return [
            'average' => $averageConfidence,
            'median' => $medianConfidence,
            'distribution' => [
                'high' => UserDiagnosis::where('confidence_level', '>=', 80)->count(),
                'medium' => UserDiagnosis::whereBetween('confidence_level', [60, 79.99])->count(),
                'low' => UserDiagnosis::where('confidence_level', '<', 60)->count(),
            ],
        ];
    }

    private function getUserEngagement()
    {
        $totalUsers = User::count();
        $activeUsers = User::whereHas('consultations', function ($q) {
            $q->where('created_at', '>=', Carbon::now()->subDays(30));
        })->count();

        $returningUsers = User::has('consultations', '>', 1)->count();
        $totalConsultations = Consultation::count();

        return [
            'total_users' => $totalUsers,
            'active_users' => $activeUsers,
            'returning_users' => $returningUsers,
            'average_consultations_per_user' => $totalUsers > 0 ? (float) ($totalConsultations / $totalUsers) : 0.0,
        ];
    }

    private function getDisorderBreakdown()
    {
        return UserDiagnosis::selectRaw('mental_disorder_id, COUNT(*) as count')
            ->with('mentalDisorder:id,name')
            ->groupBy('mental_disorder_id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->mentalDisorder->name ?? 'Unknown',
                    'count' => (int) $item->count,
                ];
            });
    }

    private function getConfidenceDistribution()
    {
        return [
            ['range' => '80-100%', 'count' => UserDiagnosis::where('confidence_level', '>=', 80)->count()],
            ['range' => '60-79%', 'count' => UserDiagnosis::whereBetween('confidence_level', [60, 79.99])->count()],
            ['range' => '40-59%', 'count' => UserDiagnosis::whereBetween('confidence_level', [40, 59.99])->count()],
            ['range' => '<40%', 'count' => UserDiagnosis::where('confidence_level', '<', 40)->count()],
        ];
    }

    private function getSymptomUtilization()
    {
        $totalSymptoms = Symptom::count();
        $usedSymptoms = DiagnosisRule::get()
            ->pluck('symptom_codes')
            ->flatten()
            ->unique()
            ->count();

        return $totalSymptoms > 0 ? ($usedSymptoms / $totalSymptoms) * 100 : 0.0;
    }

    private function getConsultationCompletionRate()
    {
        $total = Consultation::count();
        $completed = Consultation::where('status', 'completed')->count();

        return $total > 0 ? ($completed / $total) * 100 : 0.0;
    }

    private function getDatabaseSize()
    {
        return [
            'diagnoses' => UserDiagnosis::count(),
            'consultations' => Consultation::count(),
            'users' => User::count(),
            'symptoms' => Symptom::count(),
            'disorders' => MentalDisorder::count(),
            'rules' => DiagnosisRule::count(),
        ];
    }

    private function getPerformanceMetrics()
    {
        return [
            'average_consultation_time' => '8.5 minutes',
            'system_uptime' => '99.9%',
            'response_time' => '< 100ms',
            'accuracy_rate' => '87%',
        ];
    }

    private function generateTestCases()
    {
        return [
            [
                'name' => 'Gangguan Kecemasan - Basic Test',
                'symptoms' => ['G1', 'G2', 'G3'],
                'expected_disorder' => 'Gangguan Kecemasan',
            ],
            [
                'name' => 'Depresi - Core Symptoms',
                'symptoms' => ['G9', 'G10', 'G11'],
                'expected_disorder' => 'Depresi',
            ],
            [
                'name' => 'Bipolar - Mood Swings',
                'symptoms' => ['G12', 'G13', 'G14'],
                'expected_disorder' => 'Bipolar',
            ],
            [
                'name' => 'Skizofrenia - Psychotic Symptoms',
                'symptoms' => ['G15', 'G16', 'G17'],
                'expected_disorder' => 'Skizofrenia',
            ],
            [
                'name' => 'OCD - Compulsive Behavior',
                'symptoms' => ['G1', 'G19'],
                'expected_disorder' => 'Gangguan Obsessive Compulsive Disorder (OCD)',
            ],
            [
                'name' => 'PTSD - Trauma Related',
                'symptoms' => ['G20', 'G21'],
                'expected_disorder' => 'Post Traumatic Stress Disorder (PTSD)',
            ],
            [
                'name' => 'Eating Disorder - Mixed',
                'symptoms' => ['G22', 'G23', 'G25'],
                'expected_disorder' => 'Multiple possibilities',
            ],
        ];
    }

    public function getUserDiagnosisHistory(int $userId): array
    {
        $diagnoses = UserDiagnosis::where('user_id', $userId)
            ->with('mentalDisorder')
            ->orderBy('created_at', 'desc')
            ->get();

        return $diagnoses->map(function ($diagnosis) {
            return [
                'id' => $diagnosis->id,
                'mental_disorder' => $diagnosis->mentalDisorder,
                'symptoms_reported' => $diagnosis->symptoms_reported,
                'symptoms_details' => Symptom::getByCodes($diagnosis->symptoms_reported ?? []),
                'confidence_level' => (float) $diagnosis->confidence_level,
                'confidence_description' => $diagnosis->confidence_level_description,
                'recommendation' => $diagnosis->recommendation,
                'created_at' => $diagnosis->created_at,
                'created_at_human' => $diagnosis->created_at->diffForHumans(),
            ];
        })->toArray();
    }

    public function getConsultationSummary(int $consultationId): array
    {
        try {
            $consultation = Consultation::with(['user', 'finalDiagnosis.mentalDisorder'])->findOrFail($consultationId);
            $reportedSymptoms = $consultation->getReportedSymptoms();

            return [
                'consultation' => $consultation,
                'reported_symptoms' => $reportedSymptoms,
                'symptoms_details' => Symptom::getByCodes($reportedSymptoms),
                'total_questions' => count($consultation->consultation_flow ?? []),
                'progress' => (float) $consultation->getProgressPercentage(),
                'final_diagnosis' => $consultation->finalDiagnosis,
                'recommendations' => $consultation->finalDiagnosis
                    ? $consultation->finalDiagnosis->recommendation
                    : $this->expertService->getGeneralRecommendations($reportedSymptoms)
            ];
        } catch (\Exception $e) {
            Log::error('Error getting consultation summary', [
                'consultation_id' => $consultationId,
                'error' => $e->getMessage()
            ]);

            return [
                'consultation' => null,
                'reported_symptoms' => [],
                'symptoms_details' => [],
                'total_questions' => 0,
                'progress' => 0.0,
                'final_diagnosis' => null,
                'recommendations' => null
            ];
        }
    }
}
