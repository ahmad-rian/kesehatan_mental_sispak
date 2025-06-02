<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'consultation_flow',
        'status',
        'final_diagnosis_id',
        'abandoned_at',
        'completed_at',
    ];

    protected $casts = [
        'consultation_flow' => 'array',
        'abandoned_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_ABANDONED = 'abandoned';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function finalDiagnosis()
    {
        return $this->belongsTo(UserDiagnosis::class, 'final_diagnosis_id');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', self::STATUS_IN_PROGRESS);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeAbandoned($query)
    {
        return $query->where('status', self::STATUS_ABANDONED);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_IN_PROGRESS);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public static function getActiveForUser(int $userId)
    {
        return self::where('user_id', $userId)
            ->inProgress()
            ->latest()
            ->first();
    }

    public static function startNew(int $userId): self
    {
        self::where('user_id', $userId)
            ->inProgress()
            ->update(['status' => self::STATUS_ABANDONED]);

        return self::create([
            'user_id' => $userId,
            'consultation_flow' => [],
            'status' => self::STATUS_IN_PROGRESS,
        ]);
    }

    public function addStep(array $step): void
    {
        $flow = $this->consultation_flow ?? [];
        $step['step_number'] = count($flow) + 1;
        $step['created_at'] = now()->toISOString();
        $flow[] = array_merge($step, ['timestamp' => now()->toISOString()]);

        $this->update(['consultation_flow' => $flow]);
    }

    public function complete(?int $diagnosisId = null): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'final_diagnosis_id' => $diagnosisId,
            'completed_at' => now(),
        ]);
    }

    public function abandon(string $reason = 'User abandoned consultation'): void
    {
        $this->addStep([
            'type' => 'abandonment',
            'reason' => $reason,
            'questions_asked' => $this->getTotalQuestionsAsked(),
            'symptoms_found' => count($this->getReportedSymptoms()),
        ]);

        $this->update([
            'status' => self::STATUS_ABANDONED,
            'abandoned_at' => now(),
        ]);
    }

    public function getProgressPercentage(): float
    {
        if ($this->status === self::STATUS_COMPLETED) {
            return 100.0;
        }

        $totalQuestions = count($this->consultation_flow ?? []);
        $reportedSymptoms = $this->getReportedSymptoms();

        $progress = 0;

        $questionProgress = min(80, ($totalQuestions / 20) * 40);
        $progress += $questionProgress;

        $symptomProgress = min(30, (count($reportedSymptoms) / 8) * 30);
        $progress += $symptomProgress;

        $estimatedStrategicAsked = max(0, $totalQuestions - 5);
        $strategicProgress = min(30, ($estimatedStrategicAsked / 15) * 30);
        $progress += $strategicProgress;

        return min(95, max(5, $progress));
    }

    /**
     * Get reported symptoms (binary - only symptoms with severity != 'none')
     */
    public function getReportedSymptoms(): array
    {
        $symptoms = [];
        $flow = $this->consultation_flow ?? [];

        foreach ($flow as $step) {
            if (
                isset($step['type']) && $step['type'] === 'symptom_question' &&
                isset($step['symptom_code'])
            ) {
                // Support both old format (answer: true/false) and new format (symptom_severity)
                if (isset($step['symptom_severity'])) {
                    // New severity format
                    if ($step['symptom_severity'] !== 'none') {
                        $symptoms[] = $step['symptom_code'];
                    }
                } elseif (isset($step['answer']) && $step['answer'] === true) {
                    // Old binary format for backward compatibility
                    $symptoms[] = $step['symptom_code'];
                }
            }
        }

        return array_unique($symptoms);
    }

    /**
     * Get reported symptoms with their severity levels
     */
    public function getReportedSymptomsWithSeverity(): array
    {
        $symptomsWithSeverity = [];
        $flow = $this->consultation_flow ?? [];

        foreach ($flow as $step) {
            if (
                isset($step['type']) && $step['type'] === 'symptom_question' &&
                isset($step['symptom_code'])
            ) {
                if (isset($step['symptom_severity'])) {
                    // New severity format
                    if ($step['symptom_severity'] !== 'none') {
                        $symptomsWithSeverity[$step['symptom_code']] = $step['symptom_severity'];
                    }
                } elseif (isset($step['answer']) && $step['answer'] === true) {
                    // Old binary format - assume moderate severity for backward compatibility
                    $symptomsWithSeverity[$step['symptom_code']] = 'moderate';
                }
            }
        }

        return $symptomsWithSeverity;
    }

    public function getAskedSymptoms(): array
    {
        $askedSymptoms = [];
        $flow = $this->consultation_flow ?? [];

        foreach ($flow as $step) {
            if (isset($step['symptom_code']) && !empty($step['symptom_code'])) {
                $askedSymptoms[] = $step['symptom_code'];
            }

            if (isset($step['selected_symptoms']) && is_array($step['selected_symptoms'])) {
                $askedSymptoms = array_merge($askedSymptoms, $step['selected_symptoms']);
            }
        }

        return array_unique($askedSymptoms);
    }

    public function hasAskedSymptom(string $symptomCode): bool
    {
        return in_array($symptomCode, $this->getAskedSymptoms());
    }

    public function hasReportedSymptom(string $symptomCode): bool
    {
        return in_array($symptomCode, $this->getReportedSymptoms());
    }

    public function getTotalQuestionsAsked(): int
    {
        $flow = $this->consultation_flow ?? [];
        $questionCount = 0;

        foreach ($flow as $step) {
            if (isset($step['type']) && $step['type'] === 'symptom_question') {
                $questionCount++;
            }
        }

        return $questionCount;
    }

    public function getStrategicQuestionsAsked(): int
    {
        $flow = $this->consultation_flow ?? [];
        $strategicCount = 0;

        foreach ($flow as $step) {
            if (
                isset($step['type']) && $step['type'] === 'symptom_question' &&
                isset($step['rule_code']) && $step['rule_code'] !== 'SCREEN'
            ) {
                $strategicCount++;
            }
        }

        return $strategicCount;
    }

    public function getCategoriesExplored(): array
    {
        $askedSymptoms = $this->getAskedSymptoms();
        $categories = [];

        $categoryMap = [
            'mood_emotional' => ['G1', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G27'],
            'cognitive' => ['G3', 'G8', 'G15', 'G16', 'G17', 'G18'],
            'physical' => ['G2', 'G4', 'G5', 'G6', 'G7', 'G23', 'G24'],
            'behavioral' => ['G19', 'G22', 'G25', 'G26'],
            'trauma_related' => ['G20', 'G21']
        ];

        foreach ($categoryMap as $category => $symptoms) {
            if (array_intersect($askedSymptoms, $symptoms)) {
                $categories[] = $category;
            }
        }

        return $categories;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_IN_PROGRESS;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isAbandoned(): bool
    {
        return $this->status === self::STATUS_ABANDONED;
    }

    public function getStatistics(): array
    {
        $reportedSymptoms = $this->getReportedSymptoms();
        $askedSymptoms = $this->getAskedSymptoms();
        $totalQuestions = $this->getTotalQuestionsAsked();
        $strategicQuestions = $this->getStrategicQuestionsAsked();
        $screeningQuestions = $totalQuestions - $strategicQuestions;

        return [
            'total_questions' => $totalQuestions,
            'strategic_questions' => $strategicQuestions,
            'screening_questions' => $screeningQuestions,
            'symptoms_found' => count($reportedSymptoms),
            'symptoms_explored' => count($askedSymptoms),
            'categories_explored' => count($this->getCategoriesExplored()),
            'progress' => $this->getProgressPercentage(),
            'status' => $this->status,
            'coverage_percentage' => count($askedSymptoms) > 0
                ? round((count($reportedSymptoms) / count($askedSymptoms)) * 100, 1)
                : 0,
        ];
    }

    public function validateFlow(): array
    {
        $errors = [];
        $askedSymptoms = [];
        $flow = $this->consultation_flow ?? [];

        foreach ($flow as $index => $step) {
            if (isset($step['symptom_code'])) {
                if (in_array($step['symptom_code'], $askedSymptoms)) {
                    $errors[] = "Duplicate symptom question at step {$index}: {$step['symptom_code']}";
                }
                $askedSymptoms[] = $step['symptom_code'];
            }

            if (!isset($step['type'])) {
                $errors[] = "Missing step type at step {$index}";
            }
        }

        return [
            'is_valid' => empty($errors),
            'errors' => $errors,
            'duplicate_count' => count($askedSymptoms) - count(array_unique($askedSymptoms)),
            'total_steps' => count($flow),
        ];
    }

    public function getEfficiencyMetrics(): array
    {
        $reportedSymptoms = $this->getReportedSymptoms();
        $totalQuestions = $this->getTotalQuestionsAsked();

        return [
            'efficiency_ratio' => $totalQuestions > 0
                ? round(count($reportedSymptoms) / $totalQuestions, 2)
                : 0,
            'questions_per_symptom' => count($reportedSymptoms) > 0
                ? round($totalQuestions / count($reportedSymptoms), 1)
                : 0,
            'completion_rate' => $this->isCompleted() ? 100 : $this->getProgressPercentage(),
        ];
    }

    public function getConsultationDuration(): ?int
    {
        if ($this->isCompleted() && $this->completed_at) {
            return $this->created_at->diffInMinutes($this->completed_at);
        }

        if ($this->isAbandoned() && $this->abandoned_at) {
            return $this->created_at->diffInMinutes($this->abandoned_at);
        }

        if ($this->isActive()) {
            return $this->created_at->diffInMinutes(now());
        }

        return null;
    }

    public function getRecentSteps(int $limit = 5): array
    {
        $flow = $this->consultation_flow ?? [];
        return array_slice($flow, -$limit);
    }

    public function getStepsByType(string $type): array
    {
        $flow = $this->consultation_flow ?? [];
        return array_filter($flow, fn($step) => ($step['type'] ?? '') === $type);
    }

    public function getStatusTextAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_IN_PROGRESS => 'Berlangsung',
            self::STATUS_COMPLETED => 'Selesai',
            self::STATUS_ABANDONED => 'Dibatalkan',
            default => 'Tidak Diketahui',
        };
    }

    public function getDurationTextAttribute(): string
    {
        $duration = $this->getConsultationDuration();

        if (!$duration) return 'Tidak tersedia';

        if ($duration < 60) {
            return "{$duration} menit";
        } else {
            $hours = floor($duration / 60);
            $minutes = $duration % 60;
            return "{$hours} jam {$minutes} menit";
        }
    }

    public function getEnhancedStatistics(): array
    {
        $basic = $this->getStatistics();

        return array_merge($basic, [
            'duration_minutes' => $this->getConsultationDuration(),
            'duration_text' => $this->getDurationTextAttribute(),
            'status_text' => $this->getStatusTextAttribute(),
            'created_at' => $this->created_at,
            'last_activity' => $this->updated_at,
            'completed_at' => $this->completed_at,
            'abandoned_at' => $this->abandoned_at,
        ]);
    }

    /**
     * Get severity level for a specific symptom
     */
    public function getSymptomSeverity(string $symptomCode): ?string
    {
        $symptomsWithSeverity = $this->getReportedSymptomsWithSeverity();
        return $symptomsWithSeverity[$symptomCode] ?? null;
    }

    /**
     * Get weighted score based on severity levels
     */
    public function getWeightedSymptomScore(): float
    {
        $symptomsWithSeverity = $this->getReportedSymptomsWithSeverity();
        $weights = [
            'none' => 0,
            'mild' => 1,
            'moderate' => 2,
            'severe' => 3
        ];

        $totalScore = 0;
        foreach ($symptomsWithSeverity as $symptom => $severity) {
            $totalScore += $weights[$severity] ?? 0;
        }

        return $totalScore;
    }
}
