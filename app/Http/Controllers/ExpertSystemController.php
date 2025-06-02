<?php

namespace App\Http\Controllers;

use App\Services\BackwardChainingService;
use App\Models\Consultation;
use App\Models\UserDiagnosis;
use App\Models\Symptom;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;

class ExpertSystemController extends Controller
{
    public function __construct(
        private BackwardChainingService $expertService
    ) {}

    public function index()
    {
        try {
            $user = auth()->user();
            $activeConsultation = $user->activeConsultation;
            $latestDiagnosis = $user->latestDiagnosis;

            return Inertia::render('Consultation/Index', [
                'active_consultation' => $activeConsultation,
                'latest_diagnosis' => $latestDiagnosis ? $latestDiagnosis->load('mentalDisorder') : null,
                'has_history' => $user->diagnoses()->exists(),
            ]);
        } catch (Exception $e) {
            Log::error('Error in consultation index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Consultation/Index', [
                'error' => 'Terjadi kesalahan saat memuat halaman konsultasi'
            ]);
        }
    }

    public function startConsultation()
    {
        try {
            DB::beginTransaction();

            $consultation = $this->expertService->startConsultation(auth()->id());

            DB::commit();

            Log::info('Consultation started successfully', [
                'consultation_id' => $consultation->id,
                'user_id' => auth()->id()
            ]);

            return redirect()->route('consultation.question', $consultation->id);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error starting consultation', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('consultation.index')
                ->withErrors(['error' => 'Gagal memulai konsultasi. Silakan coba lagi.']);
        }
    }

    public function showQuestion(Consultation $consultation)
    {
        try {
            if ($consultation->user_id !== auth()->id()) {
                abort(403, 'Akses ditolak ke konsultasi ini');
            }

            if (!$consultation->isActive()) {
                Log::info('Redirecting to result - consultation not active', [
                    'consultation_id' => $consultation->id,
                    'status' => $consultation->status
                ]);
                return redirect()->route('consultation.result', $consultation->id);
            }

            $reportedSymptoms = $consultation->getReportedSymptoms();
            $nextQuestions = $this->expertService->getNextQuestions($reportedSymptoms, 1, $consultation);

            if (empty($nextQuestions)) {
                Log::info('No more questions available, completing consultation', [
                    'consultation_id' => $consultation->id,
                    'reported_symptoms_count' => count($reportedSymptoms)
                ]);

                return $this->processAnswer($consultation, new Request(['action' => 'complete']));
            }

            $totalQuestions = $consultation->getTotalQuestionsAsked();
            $progress = $consultation->getProgressPercentage();
            $flowValidation = $consultation->validateFlow();

            if (!$flowValidation['is_valid']) {
                Log::warning('Consultation flow validation errors', [
                    'consultation_id' => $consultation->id,
                    'errors' => $flowValidation['errors'],
                    'duplicate_count' => $flowValidation['duplicate_count']
                ]);
            }

            return Inertia::render('Consultation/Question', [
                'consultation' => $consultation,
                'current_symptoms' => $reportedSymptoms,
                'current_symptoms_details' => Symptom::getByCodes($reportedSymptoms),
                'next_question' => $nextQuestions[0],
                'progress' => $progress,
                'total_questions' => $totalQuestions,
                'consultation_stats' => $consultation->getStatistics(),
                'debug_info' => [
                    'asked_symptoms' => $consultation->getAskedSymptoms(),
                    'flow_validation' => $flowValidation,
                    'efficiency_metrics' => $consultation->getEfficiencyMetrics(),
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error showing question', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('consultation.index')
                ->withErrors(['error' => 'Terjadi kesalahan saat memuat pertanyaan. Silakan mulai konsultasi baru.']);
        }
    }

    public function processAnswer(Consultation $consultation, Request $request)
    {
        try {
            if ($consultation->user_id !== auth()->id()) {
                abort(403, 'Akses ditolak ke konsultasi ini');
            }

            if (!$consultation->isActive()) {
                Log::warning('Attempted to process answer on inactive consultation', [
                    'consultation_id' => $consultation->id,
                    'status' => $consultation->status
                ]);
                return redirect()->route('consultation.result', $consultation->id);
            }

            DB::beginTransaction();

            Log::info('Processing consultation answer with enhanced validation', [
                'consultation_id' => $consultation->id,
                'request_data' => $request->all(),
                'current_symptoms_count' => count($consultation->getReportedSymptoms())
            ]);

            $stepData = $this->prepareStepData($request, $consultation);

            if (empty($stepData)) {
                Log::warning('No valid step data prepared', [
                    'request_data' => $request->all(),
                    'consultation_id' => $consultation->id
                ]);

                DB::rollBack();
                return back()->withErrors(['error' => 'Data tidak valid untuk diproses.']);
            }

            try {
                $result = $this->expertService->processConsultationStep($consultation->id, $stepData);

                Log::info('Step processing result with enhanced handling', [
                    'consultation_id' => $consultation->id,
                    'status' => $result['status'],
                    'completion_reason' => $result['completion_reason'] ?? null,
                    'has_diagnosis' => isset($result['diagnosis']),
                    'diagnosis_status' => $result['diagnosis']['status'] ?? null
                ]);

                DB::commit();

                if ($result['status'] === 'completed') {
                    if (!isset($result['diagnosis']) || !($result['diagnosis']['has_output'] ?? true)) {
                        Log::warning('Completed consultation without proper diagnosis, generating fallback', [
                            'consultation_id' => $consultation->id
                        ]);

                        $currentSymptoms = $consultation->getReportedSymptomsWithSeverity();
                        $result['diagnosis'] = $this->expertService->diagnose($currentSymptoms, $consultation->user_id);
                    }

                    return redirect()->route('consultation.result', $consultation->id);
                }

                return redirect()->route('consultation.question', $consultation->id);
            } catch (\Exception $serviceException) {
                Log::error('Service error in processConsultationStep', [
                    'consultation_id' => $consultation->id,
                    'service_error' => $serviceException->getMessage(),
                    'step_data' => $stepData
                ]);

                DB::rollBack();

                return $this->handleServiceError($consultation, $serviceException);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error processing consultation step', [
                'error' => $e->getMessage(),
                'consultation_id' => $consultation->id,
                'request_data' => $request->all()
            ]);

            return back()->withErrors(['error' => 'Terjadi kesalahan saat memproses jawaban. Silakan coba lagi.']);
        }
    }

    private function prepareStepData(Request $request, Consultation $consultation): array
    {
        $stepData = [];

        if ($request->has('symptom_severity')) {
            $request->validate([
                'symptom_code' => 'required|string|exists:symptoms,code',
                'symptom_severity' => 'required|in:none,mild,moderate,severe',
                'symptom_weight' => 'nullable|numeric|min:0|max:3',
                'question' => 'required|string',
                'rule_code' => 'nullable|string',
                'priority' => 'nullable|numeric',
                'category' => 'nullable|string'
            ]);

            $symptomCode = $request->symptom_code;

            if ($consultation->hasAskedSymptom($symptomCode)) {
                Log::warning('Duplicate symptom question detected', [
                    'consultation_id' => $consultation->id,
                    'symptom_code' => $symptomCode
                ]);
                return [];
            }

            $stepData = [
                'type' => 'symptom_question',
                'symptom_code' => $symptomCode,
                'question' => $request->question,
                'symptom_severity' => $request->symptom_severity,
                'symptom_weight' => $request->symptom_weight ?? 0,
                'rule_code' => $request->rule_code,
                'priority' => $request->priority ?? 0,
                'category' => $request->category ?? 'unknown',
            ];
        } elseif ($request->has('symptom_answer')) {
            $request->validate([
                'symptom_code' => 'required|string|exists:symptoms,code',
                'symptom_answer' => 'required|in:yes,no',
                'question' => 'required|string'
            ]);

            $symptomCode = $request->symptom_code;

            if ($consultation->hasAskedSymptom($symptomCode)) {
                return [];
            }

            $severity = $request->symptom_answer === 'yes' ? 'moderate' : 'none';

            $stepData = [
                'type' => 'symptom_question',
                'symptom_code' => $symptomCode,
                'question' => $request->question,
                'symptom_severity' => $severity,
                'symptom_weight' => $severity === 'moderate' ? 1.5 : 0,
                'rule_code' => $request->rule_code ?? 'LEGACY',
                'priority' => $request->priority ?? 0,
                'category' => $request->category ?? 'unknown',
            ];
        } elseif ($request->has('selected_symptoms')) {
            $request->validate([
                'selected_symptoms' => 'required|array',
                'selected_symptoms.*' => 'exists:symptoms,code'
            ]);

            $selectedSymptoms = $request->selected_symptoms;
            $alreadyAsked = $consultation->getAskedSymptoms();
            $newSymptoms = array_diff($selectedSymptoms, $alreadyAsked);

            foreach ($newSymptoms as $symptomCode) {
                $consultation->addStep([
                    'type' => 'symptom_selection',
                    'symptom_code' => $symptomCode,
                    'selected' => true,
                    'symptom_severity' => 'moderate',
                ]);
            }

            if (!empty($newSymptoms)) {
                $stepData = [
                    'type' => 'bulk_selection',
                    'selected_symptoms' => $newSymptoms,
                    'count' => count($newSymptoms)
                ];
            }
        } elseif ($request->has('action') && $request->action === 'complete') {
            $stepData = [
                'type' => 'force_complete',
                'reason' => 'No more strategic questions available',
                'total_questions_asked' => $consultation->getTotalQuestionsAsked(),
                'symptoms_found' => count($consultation->getReportedSymptoms()),
            ];

            Log::info('Force completion triggered', $stepData);
        }

        return $stepData;
    }

    private function handleServiceError(Consultation $consultation, Exception $exception): \Illuminate\Http\RedirectResponse
    {
        try {
            $currentSymptoms = $consultation->getReportedSymptomsWithSeverity();

            if (!empty($currentSymptoms)) {
                $emergencyDiagnosis = $this->expertService->diagnose($currentSymptoms, $consultation->user_id);

                $consultation->complete(null);

                Log::info('Emergency diagnosis created due to service error', [
                    'consultation_id' => $consultation->id,
                    'emergency_diagnosis' => $emergencyDiagnosis['status']
                ]);

                return redirect()->route('consultation.result', $consultation->id)
                    ->with('warning', 'Terjadi kesalahan dalam pemrosesan, namun hasil analisis tetap tersedia.');
            }
        } catch (Exception $e) {
            Log::error('Failed to create emergency diagnosis', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage()
            ]);
        }

        return back()->withErrors(['error' => 'Terjadi kesalahan dalam pemrosesan: ' . $exception->getMessage()]);
    }

    public function showResult(Consultation $consultation)
    {
        try {
            if ($consultation->user_id !== auth()->id()) {
                abort(403, 'Akses ditolak ke konsultasi ini');
            }

            $summary = $this->expertService->getConsultationSummary($consultation->id);

            Log::info('Consultation Summary Debug', [
                'consultation_id' => $consultation->id,
                'has_final_diagnosis' => !empty($summary['final_diagnosis']),
                'has_recommendations' => !empty($summary['recommendations']),
                'has_general_recommendations' => !empty($summary['general_recommendations']),
                'symptoms_count' => count($summary['reported_symptoms']),
            ]);

            if (!$summary['recommendations'] && !$summary['general_recommendations']) {
                Log::warning('No recommendations found, generating default ones', [
                    'consultation_id' => $consultation->id,
                    'symptoms' => $summary['reported_symptoms']
                ]);

                $summary['general_recommendations'] = $this->expertService->getGeneralRecommendations($summary['reported_symptoms']);
            }

            if (empty($summary['recommendations']) && empty($summary['general_recommendations'])) {
                $summary['general_recommendations'] = [
                    'immediate' => [
                        'Prioritaskan istirahat yang cukup dan self-care',
                        'Bicarakan perasaan dengan orang yang dipercaya'
                    ],
                    'lifestyle' => [
                        'Jaga pola tidur yang teratur (7-8 jam per malam)',
                        'Lakukan aktivitas fisik ringan secara teratur',
                        'Praktikkan teknik relaksasi seperti meditasi atau pernapasan dalam'
                    ],
                    'professional' => [
                        'Pertimbangkan untuk konsultasi dengan profesional kesehatan mental',
                        'Jangan ragu untuk mencari bantuan jika diperlukan'
                    ]
                ];
            }

            return Inertia::render('Consultation/Result', [
                'consultation' => $consultation,
                'summary' => $summary,
            ]);
        } catch (Exception $e) {
            Log::error('Error showing consultation result', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('consultation.index')
                ->withErrors(['error' => 'Terjadi kesalahan saat memuat hasil konsultasi.']);
        }
    }

    public function quickDiagnosis(Request $request)
    {
        try {
            $request->validate([
                'symptoms' => 'required|array|min:1',
                'symptoms.*' => 'string',
            ]);

            $symptomsWithSeverity = [];
            foreach ($request->symptoms as $symptom) {
                if (is_array($symptom) && isset($symptom['code']) && isset($symptom['severity'])) {
                    $symptomsWithSeverity[$symptom['code']] = $symptom['severity'];
                } else {
                    $symptomsWithSeverity[$symptom] = 'moderate';
                }
            }

            $validation = $this->expertService->validateSymptoms(array_keys($symptomsWithSeverity));

            if (!$validation['is_valid']) {
                return response()->json([
                    'error' => 'Invalid symptoms provided',
                    'details' => $validation
                ], 400);
            }

            $result = $this->expertService->diagnose($symptomsWithSeverity, auth()->id());

            return response()->json([
                'diagnosis_result' => $result,
                'recommendations' => $this->expertService->getGeneralRecommendations(array_keys($symptomsWithSeverity)),
                'has_output' => $result['has_output'] ?? true,
            ]);
        } catch (Exception $e) {
            Log::error('Error in quick diagnosis', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat melakukan diagnosis cepat'
            ], 500);
        }
    }

    public function history()
    {
        try {
            $history = $this->expertService->getUserDiagnosisHistory(auth()->id());
            $consultations = auth()->user()->consultations()
                ->with('finalDiagnosis.mentalDisorder')
                ->latest()
                ->paginate(10);

            return Inertia::render('Consultation/History', [
                'diagnosis_history' => $history,
                'consultations' => $consultations,
            ]);
        } catch (Exception $e) {
            Log::error('Error showing consultation history', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return Inertia::render('Consultation/History', [
                'diagnosis_history' => [],
                'consultations' => collect([]),
                'error' => 'Terjadi kesalahan saat memuat riwayat konsultasi'
            ]);
        }
    }

    public function getSymptoms()
    {
        try {
            $categories = $this->expertService->getSymptomCategories();

            return response()->json([
                'categories' => $categories,
                'all_symptoms' => Symptom::orderBy('code')->get(),
            ]);
        } catch (Exception $e) {
            Log::error('Error getting symptoms', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat memuat data gejala'
            ], 500);
        }
    }

    public function validateSymptoms(Request $request)
    {
        try {
            $request->validate([
                'symptoms' => 'required|array',
                'symptoms.*' => 'string',
            ]);

            $validation = $this->expertService->validateSymptoms($request->symptoms);

            return response()->json($validation);
        } catch (Exception $e) {
            Log::error('Error validating symptoms', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat validasi gejala'
            ], 500);
        }
    }

    public function getNextQuestions(Request $request)
    {
        try {
            $request->validate([
                'current_symptoms' => 'array',
                'current_symptoms.*' => 'exists:symptoms,code',
                'max_questions' => 'integer|min:1|max:10',
                'consultation_id' => 'integer|exists:consultations,id',
            ]);

            $currentSymptoms = $request->current_symptoms ?? [];
            $maxQuestions = $request->max_questions ?? 5;

            $consultation = null;
            if ($request->consultation_id) {
                $consultation = Consultation::find($request->consultation_id);
                if ($consultation && $consultation->user_id !== auth()->id()) {
                    abort(403);
                }
            }

            $questions = $this->expertService->getNextQuestions($currentSymptoms, $maxQuestions, $consultation);

            return response()->json([
                'questions' => $questions,
                'current_symptoms_count' => count($currentSymptoms),
                'asked_symptoms_count' => $consultation ? count($consultation->getAskedSymptoms()) : 0,
                'consultation_stats' => $consultation ? $consultation->getStatistics() : null,
            ]);
        } catch (Exception $e) {
            Log::error('Error getting next questions', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat memuat pertanyaan berikutnya'
            ], 500);
        }
    }

    public function abandonConsultation(Consultation $consultation)
    {
        try {
            if ($consultation->user_id !== auth()->id()) {
                abort(403);
            }

            DB::beginTransaction();

            $consultation->abandon();

            DB::commit();

            Log::info('Consultation abandoned', [
                'consultation_id' => $consultation->id,
                'user_id' => auth()->id()
            ]);

            return redirect()
                ->route('consultation.index')
                ->with('info', 'Konsultasi telah dibatalkan.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error abandoning consultation', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors(['error' => 'Gagal membatalkan konsultasi.']);
        }
    }

    public function resumeConsultation()
    {
        try {
            $activeConsultation = auth()->user()->activeConsultation;

            if (!$activeConsultation) {
                return redirect()
                    ->route('consultation.index')
                    ->withErrors(['error' => 'Tidak ada konsultasi aktif untuk dilanjutkan.']);
            }

            return redirect()->route('consultation.question', $activeConsultation->id);
        } catch (Exception $e) {
            Log::error('Error resuming consultation', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return redirect()
                ->route('consultation.index')
                ->withErrors(['error' => 'Gagal melanjutkan konsultasi.']);
        }
    }

    public function getUserStats()
    {
        try {
            $user = auth()->user();

            return response()->json([
                'total_consultations' => $user->consultations()->count(),
                'completed_consultations' => $user->consultations()->completed()->count(),
                'total_diagnoses' => $user->diagnoses()->count(),
                'latest_diagnosis' => $user->latestDiagnosis?->load('mentalDisorder'),
                'has_active_consultation' => $user->hasActiveConsultation(),
            ]);
        } catch (Exception $e) {
            Log::error('Error getting user stats', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat memuat statistik pengguna'
            ], 500);
        }
    }

    public function getConsultationProgress(Consultation $consultation)
    {
        try {
            if ($consultation->user_id !== auth()->id()) {
                abort(403);
            }

            $reportedSymptoms = $consultation->getReportedSymptoms();
            $askedSymptoms = $consultation->getAskedSymptoms();

            $allQuestions = $this->expertService->getNextQuestions($reportedSymptoms, 20, $consultation);
            $strategicQuestions = array_filter($allQuestions, function ($q) {
                return isset($q['rule_code']) && $q['rule_code'] !== 'SCREEN' && $q['priority'] > 50;
            });

            return response()->json([
                'progress' => $consultation->getProgressPercentage(),
                'statistics' => $consultation->getStatistics(),
                'efficiency_metrics' => $consultation->getEfficiencyMetrics(),
                'strategic_questions_remaining' => count($strategicQuestions),
                'total_questions_available' => count($allQuestions),
                'symptoms_found' => count($reportedSymptoms),
                'symptoms_asked' => count($askedSymptoms),
                'flow_validation' => $consultation->validateFlow(),
            ]);
        } catch (Exception $e) {
            Log::error('Error getting consultation progress', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat memuat progress konsultasi'
            ], 500);
        }
    }

    public function debugConsultation(Consultation $consultation)
    {
        try {
            if ($consultation->user_id !== auth()->id()) {
                abort(403);
            }

            if (!app()->environment('local')) {
                abort(404);
            }

            return response()->json([
                'consultation_flow' => $consultation->consultation_flow,
                'reported_symptoms' => $consultation->getReportedSymptoms(),
                'asked_symptoms' => $consultation->getAskedSymptoms(),
                'flow_validation' => $consultation->validateFlow(),
                'statistics' => $consultation->getStatistics(),
                'efficiency_metrics' => $consultation->getEfficiencyMetrics(),
                'recent_steps' => $consultation->getRecentSteps(10),
            ]);
        } catch (Exception $e) {
            Log::error('Error debugging consultation', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat debug konsultasi'
            ], 500);
        }
    }

    public function healthCheck()
    {
        try {
            $checks = [
                'database' => false,
                'symptoms_count' => 0,
                'disorders_count' => 0,
                'rules_count' => 0
            ];

            $checks['symptoms_count'] = Symptom::count();
            $checks['disorders_count'] = \App\Models\MentalDisorder::count();
            $checks['rules_count'] = \App\Models\DiagnosisRule::count();
            $checks['database'] = true;

            $healthy = $checks['database'] &&
                $checks['symptoms_count'] > 0 &&
                $checks['disorders_count'] > 0 &&
                $checks['rules_count'] > 0;

            return response()->json([
                'status' => $healthy ? 'healthy' : 'unhealthy',
                'checks' => $checks,
                'timestamp' => now()->toISOString()
            ], $healthy ? 200 : 503);
        } catch (Exception $e) {
            Log::error('Health check failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'unhealthy',
                'error' => 'Health check failed',
                'timestamp' => now()->toISOString()
            ], 503);
        }
    }

    public function forceComplete(Consultation $consultation)
    {
        try {
            if ($consultation->user_id !== auth()->id()) {
                abort(403);
            }

            if (!$consultation->isActive()) {
                return redirect()->route('consultation.result', $consultation->id);
            }

            DB::beginTransaction();

            $currentSymptoms = $consultation->getReportedSymptomsWithSeverity();
            $diagnosisResult = $this->expertService->diagnose($currentSymptoms, $consultation->user_id);

            $consultation->complete($diagnosisResult['user_diagnosis_id'] ?? null);

            DB::commit();

            Log::info('Consultation force completed', [
                'consultation_id' => $consultation->id,
                'diagnosis_status' => $diagnosisResult['status'],
                'has_output' => $diagnosisResult['has_output'] ?? false
            ]);

            return redirect()->route('consultation.result', $consultation->id)
                ->with('info', 'Konsultasi telah diselesaikan dengan data yang tersedia.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error force completing consultation', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors(['error' => 'Gagal menyelesaikan konsultasi.']);
        }
    }
}
