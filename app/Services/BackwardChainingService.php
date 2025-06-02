<?php

namespace App\Services;

use App\Models\DiagnosisRule;
use App\Models\MentalDisorder;
use App\Models\Symptom;
use App\Models\UserDiagnosis;
use App\Models\Consultation;
use Illuminate\Support\Facades\Log;

class BackwardChainingService
{
    private const MIN_QUESTIONS_BEFORE_COMPLETION = 6;
    private const MAX_QUESTIONS_LIMIT = 12;
    private const MIN_CONFIDENCE_FOR_DIAGNOSIS = 35;
    private const ABSOLUTE_MIN_CONFIDENCE = 15;
    private const EARLY_COMPLETION_CONFIDENCE = 80;

    private const SEVERITY_WEIGHTS = [
        'none' => 0,
        'mild' => 0.8,
        'moderate' => 1.6,
        'severe' => 2.5
    ];

    private const BASE_CONFIDENCE_MODIFIERS = [
        'perfect_match' => 25,
        'high_match' => 18,
        'moderate_match' => 12,
        'low_match' => 8,
        'minimal_match' => 5
    ];

    private $ruleDecisionTree = [
        'G1' => [
            'is_root' => true,
            'priority' => 100,
            'branches' => [
                'yes' => ['G19', 'G3', 'G8'],
                'no' => ['G8', 'G9']
            ]
        ],
        'G19' => [
            'priority' => 90,
            'branches' => [
                'yes' => ['G20'],
                'no' => ['G3']
            ]
        ],
        'G20' => [
            'priority' => 85,
            'branches' => [
                'yes' => ['G21'],
                'no' => ['G4']
            ]
        ],
        'G21' => [
            'priority' => 80,
            'leads_to' => 'P6'
        ],
        'G3' => [
            'priority' => 75,
            'branches' => [
                'yes' => ['G4', 'G15', 'G7'],
                'no' => ['G2']
            ]
        ],
        'G4' => [
            'priority' => 70,
            'branches' => [
                'yes' => ['G5', 'G13'],
                'no' => ['G15']
            ]
        ],
        'G5' => [
            'priority' => 65,
            'branches' => [
                'yes' => ['G6'],
                'no' => ['G13']
            ]
        ],
        'G6' => [
            'priority' => 60,
            'leads_to' => 'P1'
        ],
        'G13' => [
            'priority' => 65,
            'branches' => [
                'yes' => ['G14'],
                'no' => ['G20']
            ]
        ],
        'G14' => [
            'priority' => 60,
            'leads_to' => 'P3'
        ],
        'G15' => [
            'priority' => 80,
            'branches' => [
                'yes' => ['G16'],
                'no' => ['G7']
            ]
        ],
        'G16' => [
            'priority' => 85,
            'branches' => [
                'yes' => ['G17'],
                'no' => ['G18']
            ]
        ],
        'G17' => [
            'priority' => 80,
            'leads_to' => 'P4'
        ],
        'G18' => [
            'priority' => 75,
            'leads_to' => 'P4'
        ],
        'G7' => [
            'priority' => 70,
            'branches' => [
                'yes' => ['G22', 'G8'],
                'no' => ['G8']
            ]
        ],
        'G22' => [
            'priority' => 65,
            'branches' => [
                'yes' => ['G23'],
                'no' => ['G25']
            ]
        ],
        'G23' => [
            'priority' => 60,
            'branches' => [
                'yes' => ['G24'],
                'no' => ['G25']
            ]
        ],
        'G24' => [
            'priority' => 55,
            'leads_to' => 'P7'
        ],
        'G25' => [
            'priority' => 60,
            'branches' => [
                'yes' => ['G26', 'G27'],
                'no' => ['G27']
            ]
        ],
        'G26' => [
            'priority' => 55,
            'leads_to' => 'P8'
        ],
        'G27' => [
            'priority' => 55,
            'leads_to' => 'P9'
        ],
        'G8' => [
            'priority' => 75,
            'branches' => [
                'yes' => ['G9'],
                'no' => ['G2']
            ]
        ],
        'G9' => [
            'priority' => 80,
            'branches' => [
                'yes' => ['G10', 'G11'],
                'no' => ['G11']
            ]
        ],
        'G10' => [
            'priority' => 70,
            'branches' => [
                'yes' => ['G11'],
                'no' => ['G12']
            ]
        ],
        'G11' => [
            'priority' => 65,
            'branches' => [
                'yes' => ['G12'],
                'no' => ['G2']
            ]
        ],
        'G12' => [
            'priority' => 60,
            'leads_to' => 'P2'
        ],
        'G2' => [
            'priority' => 50,
            'leads_to' => 'P1'
        ]
    ];

    public function diagnose(array $userSymptoms, int $userId): array
    {
        if (empty($userSymptoms)) {
            return [
                'status' => 'no_symptoms',
                'diagnosis' => null,
                'all_possibilities' => [],
                'user_diagnosis_id' => null,
                'message' => 'Tidak ada gejala yang dilaporkan.',
                'confidence_note' => 'Diperlukan informasi gejala untuk melakukan diagnosis',
                'has_output' => false
            ];
        }

        $possibleDiagnoses = [];
        $rules = DiagnosisRule::with('mentalDisorder')->get();

        foreach ($rules as $rule) {
            $confidence = $this->calculateEnhancedRuleConfidence($rule, $userSymptoms);

            if ($confidence >= self::ABSOLUTE_MIN_CONFIDENCE) {
                $possibleDiagnoses[] = [
                    'mental_disorder' => $rule->mentalDisorder,
                    'rule' => $rule,
                    'confidence' => $confidence,
                    'matched_symptoms' => $this->getMatchedSymptomsWithSeverity($rule, $userSymptoms),
                    'required_symptoms' => $rule->symptom_codes,
                    'missing_symptoms' => $rule->getMissingSymptoms(array_keys($userSymptoms)),
                    'path_type' => $rule->isCriticalPath() ? 'primary' : 'secondary',
                    'match_quality' => $this->getMatchQuality($rule, $userSymptoms),
                ];
            }
        }

        if (empty($possibleDiagnoses)) {
            $possibleDiagnoses = $this->generateFallbackDiagnoses($rules, $userSymptoms);
        }

        if (empty($possibleDiagnoses)) {
            $possibleDiagnoses = $this->generateMinimalDiagnoses($rules, $userSymptoms);
        }

        usort($possibleDiagnoses, function ($a, $b) {
            return $b['confidence'] <=> $a['confidence'];
        });

        $bestDiagnosis = !empty($possibleDiagnoses) ? $possibleDiagnoses[0] : null;

        if ($bestDiagnosis && $bestDiagnosis['confidence'] >= self::MIN_CONFIDENCE_FOR_DIAGNOSIS && $userId > 0) {
            $userDiagnosis = UserDiagnosis::create([
                'user_id' => $userId,
                'symptoms_reported' => array_keys($userSymptoms),
                'mental_disorder_id' => $bestDiagnosis['mental_disorder']->id,
                'recommendation' => $bestDiagnosis['mental_disorder']->recommendation,
                'confidence_level' => $bestDiagnosis['confidence'],
            ]);

            return [
                'status' => 'high_confidence',
                'diagnosis' => $bestDiagnosis,
                'all_possibilities' => $possibleDiagnoses,
                'user_diagnosis_id' => $userDiagnosis->id,
                'message' => 'Diagnosis berhasil dibuat dengan confidence ' . round($bestDiagnosis['confidence'], 1) . '%',
                'confidence_note' => $this->getConfidenceNote($bestDiagnosis['confidence']),
                'has_output' => true
            ];
        }

        if ($bestDiagnosis) {
            $status = $this->determineStatus($bestDiagnosis['confidence']);

            return [
                'status' => $status,
                'diagnosis' => $bestDiagnosis,
                'all_possibilities' => $possibleDiagnoses,
                'user_diagnosis_id' => null,
                'message' => "Hasil analisis: {$bestDiagnosis['mental_disorder']->name} dengan confidence " . round($bestDiagnosis['confidence'], 1) . "%",
                'confidence_note' => $this->getConfidenceNote($bestDiagnosis['confidence']),
                'recommendation_level' => $this->getRecommendationLevel($bestDiagnosis['confidence']),
                'has_output' => true
            ];
        }

        $emergencyDiagnosis = $this->createEmergencyDiagnosis($userSymptoms);
        return [
            'status' => 'exploratory',
            'diagnosis' => $emergencyDiagnosis,
            'all_possibilities' => [$emergencyDiagnosis],
            'user_diagnosis_id' => null,
            'message' => 'Analisis berdasarkan gejala yang tersedia.',
            'confidence_note' => 'Analisis eksploratori dengan data terbatas',
            'suggestion' => 'Disarankan konsultasi lebih lanjut dengan profesional',
            'has_output' => true
        ];
    }

    private function calculateEnhancedRuleConfidence(DiagnosisRule $rule, array $userSymptomsWithSeverity): float
    {
        $requiredSymptoms = $rule->symptom_codes;
        $userSymptomCodes = array_keys($userSymptomsWithSeverity);

        $matchedSymptoms = array_intersect($requiredSymptoms, $userSymptomCodes);
        $matchPercentage = count($requiredSymptoms) > 0 ?
            (count($matchedSymptoms) / count($requiredSymptoms)) * 100 : 0;

        $totalPossibleWeight = count($requiredSymptoms) * 2.5;
        $actualWeight = 0;

        foreach ($requiredSymptoms as $symptom) {
            if (isset($userSymptomsWithSeverity[$symptom])) {
                $severity = $userSymptomsWithSeverity[$symptom];
                $actualWeight += self::SEVERITY_WEIGHTS[$severity] ?? 0;
            }
        }

        $severityScore = $totalPossibleWeight > 0 ?
            ($actualWeight / $totalPossibleWeight) * 100 : 0;

        $baseConfidence = ($matchPercentage * 0.6) + ($severityScore * 0.4);

        $matchQuality = $this->getMatchQuality($rule, $userSymptomsWithSeverity);
        $bonus = self::BASE_CONFIDENCE_MODIFIERS[$matchQuality] ?? 0;

        if (count($matchedSymptoms) === count($requiredSymptoms)) {
            $bonus += 15;
        }

        if (count($matchedSymptoms) > 0) {
            $partialBonus = min(12, count($matchedSymptoms) * 3);
            $bonus += $partialBonus;
        }

        $finalConfidence = $baseConfidence + $bonus;

        return min(100, max(0, round($finalConfidence, 2)));
    }

    private function getMatchQuality(DiagnosisRule $rule, array $userSymptomsWithSeverity): string
    {
        $requiredSymptoms = $rule->symptom_codes;
        $userSymptomCodes = array_keys($userSymptomsWithSeverity);
        $matchedSymptoms = array_intersect($requiredSymptoms, $userSymptomCodes);

        $matchRatio = count($requiredSymptoms) > 0 ?
            count($matchedSymptoms) / count($requiredSymptoms) : 0;

        if ($matchRatio >= 0.9) return 'perfect_match';
        if ($matchRatio >= 0.7) return 'high_match';
        if ($matchRatio >= 0.4) return 'moderate_match';
        if ($matchRatio > 0) return 'low_match';
        return 'minimal_match';
    }

    private function generateFallbackDiagnoses($rules, array $userSymptoms): array
    {
        $fallbackDiagnoses = [];

        foreach ($rules as $rule) {
            $confidence = $this->calculateMinimalConfidence($rule, $userSymptoms);

            if ($confidence > 0) {
                $fallbackDiagnoses[] = [
                    'mental_disorder' => $rule->mentalDisorder,
                    'rule' => $rule,
                    'confidence' => $confidence,
                    'matched_symptoms' => $this->getMatchedSymptomsWithSeverity($rule, $userSymptoms),
                    'required_symptoms' => $rule->symptom_codes,
                    'missing_symptoms' => $rule->getMissingSymptoms(array_keys($userSymptoms)),
                    'path_type' => 'exploratory',
                    'match_quality' => 'minimal_match',
                ];
            }
        }

        return $fallbackDiagnoses;
    }

    private function generateMinimalDiagnoses($rules, array $userSymptoms): array
    {
        $userSymptomCodes = array_keys($userSymptoms);
        $minimalDiagnoses = [];

        if (empty($userSymptomCodes)) {
            return $minimalDiagnoses;
        }

        foreach ($rules as $rule) {
            $hasAnyMatch = !empty(array_intersect($rule->symptom_codes, $userSymptomCodes));

            if ($hasAnyMatch) {
                $confidence = 10 + (count(array_intersect($rule->symptom_codes, $userSymptomCodes)) * 5);

                $minimalDiagnoses[] = [
                    'mental_disorder' => $rule->mentalDisorder,
                    'rule' => $rule,
                    'confidence' => min(30, $confidence),
                    'matched_symptoms' => $this->getMatchedSymptomsWithSeverity($rule, $userSymptoms),
                    'required_symptoms' => $rule->symptom_codes,
                    'missing_symptoms' => $rule->getMissingSymptoms($userSymptomCodes),
                    'path_type' => 'minimal',
                    'match_quality' => 'minimal_match',
                ];
            }
        }

        if (empty($minimalDiagnoses) && !empty($userSymptomCodes)) {
            $defaultRule = $rules->first();
            if ($defaultRule) {
                $minimalDiagnoses[] = [
                    'mental_disorder' => $defaultRule->mentalDisorder,
                    'rule' => $defaultRule,
                    'confidence' => 15,
                    'matched_symptoms' => [],
                    'required_symptoms' => $defaultRule->symptom_codes,
                    'missing_symptoms' => $defaultRule->symptom_codes,
                    'path_type' => 'default',
                    'match_quality' => 'no_match',
                ];
            }
        }

        return $minimalDiagnoses;
    }

    private function createEmergencyDiagnosis(array $userSymptoms): array
    {
        $userSymptomCodes = array_keys($userSymptoms);
        $generalDisorder = MentalDisorder::first();

        return [
            'mental_disorder' => $generalDisorder ?: (object)[
                'id' => 0,
                'name' => 'Analisis Umum',
                'code' => 'GENERAL',
                'description' => 'Analisis berdasarkan gejala yang dilaporkan',
                'recommendation' => 'Konsultasi dengan profesional kesehatan mental'
            ],
            'rule' => (object)[
                'rule_code' => 'EMERGENCY',
                'symptom_codes' => $userSymptomCodes
            ],
            'confidence' => 10,
            'matched_symptoms' => $userSymptoms,
            'required_symptoms' => $userSymptomCodes,
            'missing_symptoms' => [],
            'path_type' => 'emergency',
            'match_quality' => 'emergency',
        ];
    }

    private function calculateMinimalConfidence(DiagnosisRule $rule, array $userSymptoms): float
    {
        $requiredSymptoms = $rule->symptom_codes;
        $userSymptomCodes = array_keys($userSymptoms);
        $matchedSymptoms = array_intersect($requiredSymptoms, $userSymptomCodes);

        if (empty($matchedSymptoms)) {
            return 0;
        }

        $baseConfidence = (count($matchedSymptoms) / count($requiredSymptoms)) * 25;
        $bonus = min(15, count($matchedSymptoms) * 4);

        return round($baseConfidence + $bonus, 2);
    }

    private function determineStatus(float $confidence): string
    {
        if ($confidence >= 70) return 'high_confidence';
        if ($confidence >= 50) return 'medium_confidence';
        if ($confidence >= 30) return 'low_confidence';
        if ($confidence >= 15) return 'exploratory';
        return 'minimal';
    }

    private function getConfidenceNote(float $confidence): string
    {
        if ($confidence >= 80) {
            return 'Diagnosis dengan tingkat kepercayaan tinggi berdasarkan gejala yang dilaporkan';
        } elseif ($confidence >= 60) {
            return 'Diagnosis dengan tingkat kepercayaan sedang, disarankan verifikasi lebih lanjut';
        } elseif ($confidence >= 40) {
            return 'Diagnosis dengan tingkat kepercayaan rendah, diperlukan evaluasi tambahan';
        } elseif ($confidence >= 20) {
            return 'Kemungkinan diagnosis berdasarkan gejala terbatas, sangat disarankan konsultasi profesional';
        }
        return 'Analisis exploratory berdasarkan data minimal yang tersedia';
    }

    private function getRecommendationLevel(float $confidence): string
    {
        if ($confidence >= 70) return 'strong';
        if ($confidence >= 50) return 'moderate';
        if ($confidence >= 30) return 'cautious';
        return 'exploratory';
    }

    public function startConsultation(int $userId): Consultation
    {
        Consultation::where('user_id', $userId)
            ->where('status', 'in_progress')
            ->update(['status' => 'abandoned']);

        return Consultation::create([
            'user_id' => $userId,
            'consultation_flow' => [],
            'status' => 'in_progress',
        ]);
    }

    public function processConsultationStep(int $consultationId, array $stepData): array
    {
        $consultation = Consultation::findOrFail($consultationId);

        if (!$consultation->isActive()) {
            throw new \Exception('Konsultasi tidak aktif');
        }

        Log::info('Processing consultation step with severity', [
            'consultation_id' => $consultationId,
            'step_data' => $stepData,
            'current_symptoms_before' => $consultation->getReportedSymptomsWithSeverity()
        ]);

        $consultation->addStep($stepData);

        $reportedSymptomsWithSeverity = $consultation->getReportedSymptomsWithSeverity();
        $totalQuestions = $consultation->getTotalQuestionsAsked();

        Log::info('Symptoms after step processing with severity', [
            'consultation_id' => $consultationId,
            'reported_symptoms_with_severity' => $reportedSymptomsWithSeverity,
            'total_questions' => $totalQuestions
        ]);

        $shouldComplete = $this->shouldCompleteConsultation($consultation, $reportedSymptomsWithSeverity, $totalQuestions);

        Log::info('Completion check result', [
            'consultation_id' => $consultationId,
            'should_complete' => $shouldComplete['should_complete'],
            'reason' => $shouldComplete['reason']
        ]);

        if ($shouldComplete['should_complete']) {
            try {
                $diagnosisResult = $this->diagnose($reportedSymptomsWithSeverity, $consultation->user_id);

                Log::info('Diagnosis result', [
                    'consultation_id' => $consultationId,
                    'diagnosis_status' => $diagnosisResult['status'],
                    'has_output' => $diagnosisResult['has_output'] ?? false,
                    'user_diagnosis_id' => $diagnosisResult['user_diagnosis_id'] ?? null
                ]);

                $consultation->complete($diagnosisResult['user_diagnosis_id'] ?? null);

                return [
                    'status' => 'completed',
                    'diagnosis' => $diagnosisResult,
                    'consultation' => $consultation,
                    'completion_reason' => $shouldComplete['reason'],
                    'next_action' => 'show_result'
                ];
            } catch (\Exception $e) {
                Log::error('Error during diagnosis', [
                    'consultation_id' => $consultationId,
                    'error' => $e->getMessage(),
                    'symptoms' => $reportedSymptomsWithSeverity
                ]);
                throw $e;
            }
        }

        return [
            'status' => 'continuing',
            'consultation' => $consultation,
            'current_symptoms' => array_keys($reportedSymptomsWithSeverity),
            'total_questions' => $totalQuestions,
            'next_action' => 'ask_question'
        ];
    }

    public function getNextQuestions(array $currentSymptoms = [], int $maxQuestions = 5, ?Consultation $consultation = null): array
    {
        $alreadyAskedSymptoms = $this->getAlreadyAskedSymptoms($consultation);
        $allSymptoms = Symptom::all()->keyBy('code');

        Log::info('Getting next questions', [
            'current_symptoms' => $currentSymptoms,
            'already_asked' => $alreadyAskedSymptoms,
            'total_questions_asked' => $consultation ? $consultation->getTotalQuestionsAsked() : 0
        ]);

        $symptomsWithSeverity = $consultation ? $consultation->getReportedSymptomsWithSeverity() : [];

        $perfectMatch = $this->checkForPerfectRuleMatchWithSeverity($symptomsWithSeverity);
        if ($perfectMatch) {
            Log::info('Perfect rule match found, no more questions needed', [
                'rule' => $perfectMatch['rule']->rule_code,
                'disorder' => $perfectMatch['disorder'],
                'confidence' => $perfectMatch['confidence']
            ]);
            return [];
        }

        $nextQuestion = $this->getNextQuestionByDecisionTree($currentSymptoms, $alreadyAskedSymptoms, $consultation);

        if (!$nextQuestion || !isset($allSymptoms[$nextQuestion])) {
            Log::warning('No valid next question found', [
                'suggested_question' => $nextQuestion,
                'current_symptoms' => $currentSymptoms,
                'already_asked' => $alreadyAskedSymptoms,
                'best_confidence' => $this->getBestCurrentConfidenceWithSeverity($symptomsWithSeverity)
            ]);
            return [];
        }

        $symptom = $allSymptoms[$nextQuestion];
        $questionData = $this->ruleDecisionTree[$nextQuestion] ?? [];

        $result = [[
            'code' => $nextQuestion,
            'description' => $symptom->description,
            'priority' => $questionData['priority'] ?? 50,
            'potential_disorder' => $this->getPotentialDisorderForSymptom($nextQuestion),
            'rule_code' => $this->getRuleCodeForSymptom($nextQuestion),
            'current_confidence' => $this->getCurrentConfidenceWithSeverity($symptomsWithSeverity, $nextQuestion),
            'category' => $this->getSymptomCategory($nextQuestion),
            'type' => 'rule_based'
        ]];

        Log::info('Generated next question', [
            'question' => $result[0],
            'current_confidence' => $this->getBestCurrentConfidenceWithSeverity($symptomsWithSeverity)
        ]);

        return $result;
    }

    private function checkForPerfectRuleMatchWithSeverity(array $reportedSymptomsWithSeverity): ?array
    {
        if (empty($reportedSymptomsWithSeverity)) {
            return null;
        }

        Log::info('Checking for perfect rule match with severity', [
            'reported_symptoms_with_severity' => $reportedSymptomsWithSeverity
        ]);

        $rules = DiagnosisRule::with('mentalDisorder')->get();

        foreach ($rules as $rule) {
            $requiredSymptoms = $rule->symptom_codes;
            $userSymptomCodes = array_keys($reportedSymptomsWithSeverity);

            Log::debug('Checking rule with severity', [
                'rule_code' => $rule->rule_code,
                'required_symptoms' => $requiredSymptoms,
                'user_symptom_codes' => $userSymptomCodes
            ]);

            $missingSymptoms = array_diff($requiredSymptoms, $userSymptomCodes);

            if (empty($missingSymptoms)) {
                $confidence = $this->calculateEnhancedRuleConfidence($rule, $reportedSymptomsWithSeverity);

                if ($confidence >= 75) {
                    Log::info('Perfect rule match found with high confidence!', [
                        'rule_code' => $rule->rule_code,
                        'disorder' => $rule->mentalDisorder->name,
                        'confidence' => $confidence
                    ]);

                    return [
                        'rule' => $rule,
                        'disorder' => $rule->mentalDisorder->name,
                        'confidence' => $confidence,
                        'matched_symptoms' => $requiredSymptoms
                    ];
                }
            }
        }

        Log::info('No perfect rule match found with high confidence');
        return null;
    }

    private function getBestCurrentConfidenceWithSeverity(array $symptomsWithSeverity): float
    {
        if (empty($symptomsWithSeverity)) {
            return 0;
        }

        $rules = DiagnosisRule::all();
        $maxConfidence = 0;

        foreach ($rules as $rule) {
            $confidence = $this->calculateEnhancedRuleConfidence($rule, $symptomsWithSeverity);
            $maxConfidence = max($maxConfidence, $confidence);
        }

        return $maxConfidence;
    }

    private function getCurrentConfidenceWithSeverity(array $currentSymptomsWithSeverity, string $nextSymptom): float
    {
        $testSymptoms = $currentSymptomsWithSeverity;
        $testSymptoms[$nextSymptom] = 'moderate';

        return $this->getBestCurrentConfidenceWithSeverity($testSymptoms);
    }

    private function getNextQuestionByDecisionTree(array $currentSymptoms, array $alreadyAskedSymptoms, ?Consultation $consultation): ?string
    {
        $symptomsWithSeverity = $consultation ? $consultation->getReportedSymptomsWithSeverity() : [];

        $perfectMatch = $this->checkForPerfectRuleMatchWithSeverity($symptomsWithSeverity);
        if ($perfectMatch) {
            Log::info('Perfect rule match found, should complete consultation', [
                'rule' => $perfectMatch['rule']->rule_code,
                'disorder' => $perfectMatch['disorder'],
                'symptoms' => $currentSymptoms
            ]);
            return null;
        }

        if (empty($currentSymptoms) && !in_array('G1', $alreadyAskedSymptoms)) {
            return 'G1';
        }

        $lastAnsweredSymptom = $this->getLastAnsweredSymptom($consultation);
        $lastSeverity = $this->getLastSeverity($consultation);

        if ($lastAnsweredSymptom && isset($this->ruleDecisionTree[$lastAnsweredSymptom])) {
            $ruleData = $this->ruleDecisionTree[$lastAnsweredSymptom];

            if (isset($ruleData['leads_to']) && $lastSeverity !== 'none') {
                $nextSymptom = $this->findMissingSymptomForDisorder($ruleData['leads_to'], $currentSymptoms, $alreadyAskedSymptoms);
                if ($nextSymptom) {
                    return $nextSymptom;
                }
            }

            if (isset($ruleData['branches'])) {
                $branch = ($lastSeverity !== 'none') ? 'yes' : 'no';
                if (isset($ruleData['branches'][$branch])) {
                    foreach ($ruleData['branches'][$branch] as $nextSymptom) {
                        if (!in_array($nextSymptom, $alreadyAskedSymptoms)) {
                            return $nextSymptom;
                        }
                    }
                }
            }
        }

        $sortedSymptoms = $this->ruleDecisionTree;
        uasort($sortedSymptoms, function ($a, $b) {
            return ($b['priority'] ?? 0) <=> ($a['priority'] ?? 0);
        });

        foreach ($sortedSymptoms as $symptom => $data) {
            if (!in_array($symptom, $alreadyAskedSymptoms)) {
                return $symptom;
            }
        }

        return null;
    }

    private function getLastSeverity(?Consultation $consultation): ?string
    {
        if (!$consultation || !$consultation->consultation_flow) {
            return null;
        }

        $flow = array_reverse($consultation->consultation_flow);
        foreach ($flow as $step) {
            if (isset($step['type']) && $step['type'] === 'symptom_question' && isset($step['symptom_severity'])) {
                return $step['symptom_severity'];
            }
        }

        return null;
    }

    private function shouldCompleteConsultation(Consultation $consultation, array $reportedSymptomsWithSeverity, int $totalQuestions): array
    {
        Log::info('Evaluating consultation completion with enhanced logic', [
            'consultation_id' => $consultation->id,
            'reported_symptoms_with_severity' => $reportedSymptomsWithSeverity,
            'total_questions' => $totalQuestions
        ]);

        $bestConfidence = $this->getBestCurrentConfidenceWithSeverity($reportedSymptomsWithSeverity);

        if ($bestConfidence >= self::EARLY_COMPLETION_CONFIDENCE && $totalQuestions >= self::MIN_QUESTIONS_BEFORE_COMPLETION) {
            return [
                'should_complete' => true,
                'reason' => "Early completion due to high confidence ({$bestConfidence}%)"
            ];
        }

        $perfectMatch = $this->checkForPerfectRuleMatchWithSeverity($reportedSymptomsWithSeverity);
        if ($perfectMatch && $perfectMatch['confidence'] >= 70) {
            return [
                'should_complete' => true,
                'reason' => "Perfect rule match for {$perfectMatch['disorder']} with {$perfectMatch['confidence']}% confidence"
            ];
        }

        if ($totalQuestions >= self::MAX_QUESTIONS_LIMIT) {
            return [
                'should_complete' => true,
                'reason' => 'Maximum questions limit reached'
            ];
        }

        if ($bestConfidence >= self::MIN_CONFIDENCE_FOR_DIAGNOSIS && $totalQuestions >= self::MIN_QUESTIONS_BEFORE_COMPLETION) {
            return [
                'should_complete' => true,
                'reason' => "Sufficient confidence achieved ({$bestConfidence}%)"
            ];
        }

        if ($totalQuestions >= 6 && $bestConfidence >= 20) {
            return [
                'should_complete' => true,
                'reason' => "Sufficient data collected for analysis (confidence: {$bestConfidence}%)"
            ];
        }

        if ($totalQuestions >= 8 && count($reportedSymptomsWithSeverity) >= 2) {
            return [
                'should_complete' => true,
                'reason' => "Adequate symptom data collected"
            ];
        }

        $nextQuestion = $this->getNextQuestionByDecisionTree(
            array_keys($reportedSymptomsWithSeverity),
            $this->getAlreadyAskedSymptoms($consultation),
            $consultation
        );

        if (!$nextQuestion && $totalQuestions >= self::MIN_QUESTIONS_BEFORE_COMPLETION) {
            return [
                'should_complete' => true,
                'reason' => 'No more relevant questions available'
            ];
        }

        if (count($reportedSymptomsWithSeverity) > 0 && $totalQuestions >= 10) {
            return [
                'should_complete' => true,
                'reason' => 'Comprehensive consultation completed'
            ];
        }

        if ($totalQuestions >= 5 && $bestConfidence < 15 && count($reportedSymptomsWithSeverity) == 0) {
            return [
                'should_complete' => true,
                'reason' => 'No significant symptoms detected after sufficient questioning'
            ];
        }

        return [
            'should_complete' => false,
            'reason' => 'Continue consultation for better accuracy'
        ];
    }

    private function getAlreadyAskedSymptoms(?Consultation $consultation): array
    {
        if (!$consultation || !$consultation->consultation_flow) {
            return [];
        }

        $askedSymptoms = [];
        foreach ($consultation->consultation_flow as $step) {
            if (isset($step['symptom_code']) && !empty($step['symptom_code'])) {
                $askedSymptoms[] = $step['symptom_code'];
            }
        }

        return array_unique($askedSymptoms);
    }

    private function getLastAnsweredSymptom(?Consultation $consultation): ?string
    {
        if (!$consultation || !$consultation->consultation_flow) {
            return null;
        }

        $flow = array_reverse($consultation->consultation_flow);
        foreach ($flow as $step) {
            if (isset($step['type']) && $step['type'] === 'symptom_question' && isset($step['symptom_code'])) {
                return $step['symptom_code'];
            }
        }

        return null;
    }

    private function findMissingSymptomForDisorder(string $disorderCode, array $currentSymptoms, array $alreadyAskedSymptoms): ?string
    {
        $disorder = MentalDisorder::where('code', $disorderCode)->first();
        if (!$disorder) {
            return null;
        }

        $rules = $disorder->diagnosisRules;
        foreach ($rules as $rule) {
            $missingSymptoms = array_diff($rule->symptom_codes, $currentSymptoms, $alreadyAskedSymptoms);
            if (!empty($missingSymptoms)) {
                return array_values($missingSymptoms)[0];
            }
        }

        return null;
    }

    private function getPotentialDisorderForSymptom(string $symptomCode): string
    {
        $rule = DiagnosisRule::whereJsonContains('symptom_codes', $symptomCode)->with('mentalDisorder')->first();
        return $rule ? $rule->mentalDisorder->name : 'General Assessment';
    }

    private function getRuleCodeForSymptom(string $symptomCode): string
    {
        $rule = DiagnosisRule::whereJsonContains('symptom_codes', $symptomCode)->first();
        return $rule ? $rule->rule_code : 'DECISION_TREE';
    }

    private function getMatchedSymptomsWithSeverity(DiagnosisRule $rule, array $userSymptomsWithSeverity): array
    {
        $matched = [];
        foreach ($rule->symptom_codes as $symptom) {
            if (isset($userSymptomsWithSeverity[$symptom])) {
                $matched[$symptom] = $userSymptomsWithSeverity[$symptom];
            }
        }
        return $matched;
    }

    public function getConsultationSummary(int $consultationId): array
    {
        $consultation = Consultation::with(['user', 'finalDiagnosis.mentalDisorder'])->findOrFail($consultationId);
        $reportedSymptoms = $consultation->getReportedSymptoms();
        $totalQuestions = $consultation->getTotalQuestionsAsked();

        $recommendations = null;
        if ($consultation->finalDiagnosis) {
            $recommendations = $consultation->finalDiagnosis->recommendation;
        }

        $generalRecommendations = $this->getGeneralRecommendations($reportedSymptoms);

        return [
            'consultation' => $consultation,
            'reported_symptoms' => $reportedSymptoms,
            'symptoms_details' => Symptom::getByCodes($reportedSymptoms),
            'total_questions' => $totalQuestions,
            'progress' => 100,
            'final_diagnosis' => $consultation->finalDiagnosis,
            'recommendations' => $recommendations,
            'general_recommendations' => $generalRecommendations,
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
                'confidence_level' => $diagnosis->confidence_level,
                'confidence_description' => $diagnosis->confidence_level_description,
                'recommendation' => $diagnosis->recommendation,
                'created_at' => $diagnosis->created_at,
                'created_at_human' => $diagnosis->created_at->diffForHumans(),
            ];
        })->toArray();
    }

    public function getSymptomCategories(): array
    {
        return [
            'mood_emotional' => [
                'title' => 'Gejala Mood dan Emosional',
                'description' => 'Gejala yang berkaitan dengan perasaan dan suasana hati',
                'symptoms' => Symptom::getByCodes(['G1', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G27']),
                'priority' => 1
            ],
            'cognitive' => [
                'title' => 'Gejala Kognitif dan Persepsi',
                'description' => 'Gejala yang berkaitan dengan pemikiran dan persepsi',
                'symptoms' => Symptom::getByCodes(['G3', 'G8', 'G15', 'G16', 'G17', 'G18']),
                'priority' => 2
            ],
            'physical' => [
                'title' => 'Gejala Fisik',
                'description' => 'Gejala yang berkaitan dengan kondisi tubuh',
                'symptoms' => Symptom::getByCodes(['G2', 'G4', 'G5', 'G6', 'G7', 'G23', 'G24']),
                'priority' => 3
            ],
            'behavioral' => [
                'title' => 'Gejala Perilaku',
                'description' => 'Gejala yang berkaitan dengan perilaku dan kebiasaan',
                'symptoms' => Symptom::getByCodes(['G19', 'G22', 'G25', 'G26']),
                'priority' => 4
            ],
            'trauma_related' => [
                'title' => 'Gejala Terkait Trauma',
                'description' => 'Gejala yang berkaitan dengan pengalaman traumatis',
                'symptoms' => Symptom::getByCodes(['G20', 'G21']),
                'priority' => 5
            ]
        ];
    }

    public function validateSymptoms(array $symptoms): array
    {
        $validSymptoms = Symptom::whereIn('code', $symptoms)->pluck('code')->toArray();
        $invalidSymptoms = array_diff($symptoms, $validSymptoms);

        return [
            'valid' => $validSymptoms,
            'invalid' => $invalidSymptoms,
            'is_valid' => empty($invalidSymptoms),
            'count' => count($validSymptoms),
            'message' => empty($invalidSymptoms)
                ? 'Semua gejala valid'
                : 'Ditemukan gejala yang tidak valid: ' . implode(', ', $invalidSymptoms)
        ];
    }

    public function getGeneralRecommendations(array $symptoms): array
    {
        $recommendations = [
            'immediate' => [],
            'lifestyle' => [],
            'professional' => [],
            'emergency' => []
        ];

        if (array_intersect($symptoms, ['G16', 'G15', 'G17'])) {
            $recommendations['emergency'][] = 'Segera cari bantuan medis profesional - gejala psikotik memerlukan penanganan segera';
            $recommendations['professional'][] = 'Konsultasi dengan psikiater sesegera mungkin';
        }

        if (array_intersect($symptoms, ['G9', 'G10'])) {
            $recommendations['immediate'][] = 'Hindari menyendiri, tetap terhubung dengan keluarga atau teman terdekat';
            $recommendations['immediate'][] = 'Hubungi hotline kesehatan mental jika merasa putus asa';
            $recommendations['professional'][] = 'Konsultasi dengan psikolog atau konselor untuk evaluasi lebih lanjut';
        }

        if (in_array('G18', $symptoms)) {
            $recommendations['immediate'][] = 'Cari lingkungan yang aman dan tenang';
            $recommendations['professional'][] = 'Konsultasi dengan profesional kesehatan mental';
        }

        if (array_intersect($symptoms, ['G4', 'G5'])) {
            $recommendations['lifestyle'][] = 'Jaga pola tidur yang teratur (7-8 jam per malam)';
            $recommendations['lifestyle'][] = 'Buat rutinitas harian yang konsisten';
        }

        if (array_intersect($symptoms, ['G1', 'G2', 'G6'])) {
            $recommendations['lifestyle'][] = 'Lakukan teknik relaksasi seperti pernapasan dalam, meditasi, atau yoga';
            $recommendations['lifestyle'][] = 'Hindari kafein dan alkohol berlebihan';
            $recommendations['lifestyle'][] = 'Olahraga ringan secara teratur';
        }

        if (array_intersect($symptoms, ['G7', 'G22', 'G23'])) {
            $recommendations['lifestyle'][] = 'Pastikan asupan nutrisi yang cukup dan seimbang';
            $recommendations['professional'][] = 'Konsultasi dengan ahli gizi dan psikolog';
        }

        if (array_intersect($symptoms, ['G20', 'G21'])) {
            $recommendations['immediate'][] = 'Hindari pemicu yang dapat mengingatkan pada trauma';
            $recommendations['professional'][] = 'Pertimbangkan terapi trauma seperti EMDR atau CBT';
        }

        if (array_intersect($symptoms, ['G25', 'G26', 'G27'])) {
            $recommendations['lifestyle'][] = 'Jaga pola makan yang teratur dan sehat';
            $recommendations['professional'][] = 'Konsultasi dengan ahli gizi dan psikolog spesialis gangguan makan';
        }

        if (!empty($symptoms)) {
            if (empty($recommendations['lifestyle'])) {
                $recommendations['lifestyle'][] = 'Jaga kesehatan fisik dengan olahraga teratur';
                $recommendations['lifestyle'][] = 'Lakukan aktivitas yang menyenangkan dan bermanfaat';
            }
            if (empty($recommendations['professional'])) {
                $recommendations['professional'][] = 'Pertimbangkan untuk konsultasi dengan profesional kesehatan mental';
            }
            if (empty($recommendations['immediate'])) {
                $recommendations['immediate'][] = 'Prioritaskan istirahat yang cukup dan self-care';
                $recommendations['immediate'][] = 'Bicarakan perasaan dengan orang yang dipercaya';
            }
        }

        return $recommendations;
    }

    private function getSymptomCategory(string $symptomCode): string
    {
        $categories = [
            'mood_emotional' => ['G1', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G27'],
            'cognitive' => ['G3', 'G8', 'G15', 'G16', 'G17', 'G18'],
            'physical' => ['G2', 'G4', 'G5', 'G6', 'G7', 'G23', 'G24'],
            'behavioral' => ['G19', 'G22', 'G25', 'G26'],
            'trauma_related' => ['G20', 'G21']
        ];

        foreach ($categories as $category => $symptoms) {
            if (in_array($symptomCode, $symptoms)) {
                return $category;
            }
        }

        return 'other';
    }

    public function getSystemStatistics(): array
    {
        return [
            'total_diagnoses' => UserDiagnosis::count(),
            'total_consultations' => Consultation::count(),
            'completed_consultations' => Consultation::completed()->count(),
            'active_consultations' => Consultation::inProgress()->count(),
            'average_confidence' => UserDiagnosis::avg('confidence_level') ?? 0,
            'most_common_disorder' => $this->getMostCommonDisorder(),
            'most_reported_symptoms' => $this->getMostReportedSymptoms(),
            'diagnosis_by_confidence' => $this->getDiagnosisByConfidenceLevel(),
        ];
    }

    private function getMostCommonDisorder(): ?array
    {
        $result = UserDiagnosis::with('mentalDisorder')
            ->selectRaw('mental_disorder_id, COUNT(*) as count')
            ->groupBy('mental_disorder_id')
            ->orderByDesc('count')
            ->first();

        return $result ? [
            'disorder' => $result->mentalDisorder,
            'count' => $result->count
        ] : null;
    }

    private function getMostReportedSymptoms(): array
    {
        $allDiagnoses = UserDiagnosis::all();
        $symptomCount = [];

        foreach ($allDiagnoses as $diagnosis) {
            foreach ($diagnosis->symptoms_reported ?? [] as $symptom) {
                $symptomCount[$symptom] = ($symptomCount[$symptom] ?? 0) + 1;
            }
        }

        arsort($symptomCount);
        $topSymptoms = array_slice($symptomCount, 0, 5, true);

        return array_map(function ($code, $count) {
            $symptom = Symptom::getByCode($code);
            return [
                'code' => $code,
                'description' => $symptom ? $symptom->description : 'Unknown',
                'count' => $count
            ];
        }, array_keys($topSymptoms), $topSymptoms);
    }

    private function getDiagnosisByConfidenceLevel(): array
    {
        return [
            'high' => UserDiagnosis::where('confidence_level', '>=', 70)->count(),
            'medium' => UserDiagnosis::whereBetween('confidence_level', [50, 69.99])->count(),
            'low' => UserDiagnosis::where('confidence_level', '<', 50)->count(),
        ];
    }
}
