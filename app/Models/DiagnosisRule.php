<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosisRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'rule_code',
        'mental_disorder_id',
        'symptom_codes',
    ];

    protected $casts = [
        'symptom_codes' => 'array',
    ];

    public function mentalDisorder()
    {
        return $this->belongsTo(MentalDisorder::class);
    }

    /**
     * Check if provided symptoms match this rule
     * Untuk pohon keputusan: minimal 70% gejala harus cocok
     */
    public function matchesSymptoms(array $userSymptoms): bool
    {
        $confidence = $this->calculateConfidence($userSymptoms);
        return $confidence >= 70; // Minimal 70% confidence untuk match
    }

    /**
     * Calculate confidence level based on symptom match
     * Confidence = (matched symptoms / required symptoms) * 100
     * Dengan bonus untuk exact match
     */
    public function calculateConfidence(array $userSymptoms): float
    {
        $requiredSymptoms = $this->symptom_codes;
        $matchedSymptoms = array_intersect($requiredSymptoms, $userSymptoms);

        if (empty($requiredSymptoms)) {
            return 0;
        }

        $baseConfidence = (count($matchedSymptoms) / count($requiredSymptoms)) * 100;

        // Bonus untuk exact match atau lebih
        if (count($matchedSymptoms) >= count($requiredSymptoms)) {
            $baseConfidence = min(100, $baseConfidence + 10);
        }

        return round($baseConfidence, 2);
    }

    /**
     * Check if this is a core/critical path for the disorder
     * Path dengan kode 'A' dianggap sebagai path utama
     */
    public function isCriticalPath(): bool
    {
        return str_ends_with($this->rule_code, 'A');
    }

    /**
     * Get path priority (A=primary, B=secondary, etc.)
     */
    public function getPathPriority(): int
    {
        $lastChar = substr($this->rule_code, -1);
        return ord($lastChar) - ord('A') + 1; // A=1, B=2, C=3, etc.
    }

    /**
     * Get missing symptoms for this rule
     */
    public function getMissingSymptoms(array $userSymptoms): array
    {
        return array_diff($this->symptom_codes, $userSymptoms);
    }

    /**
     * Get matched symptoms for this rule
     */
    public function getMatchedSymptoms(array $userSymptoms): array
    {
        return array_intersect($this->symptom_codes, $userSymptoms);
    }

    /**
     * Get rule by code
     */
    public static function getByCode(string $code)
    {
        return self::where('rule_code', $code)->first();
    }

    /**
     * Get all rules with their disorders
     */
    public static function getAllWithDisorders()
    {
        return self::with('mentalDisorder')->get();
    }
}
