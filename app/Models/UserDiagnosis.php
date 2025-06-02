<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDiagnosis extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'symptoms_reported',
        'mental_disorder_id',
        'recommendation',
        'confidence_level',
    ];

    protected $casts = [
        'symptoms_reported' => 'array',
        'confidence_level' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mentalDisorder()
    {
        return $this->belongsTo(MentalDisorder::class);
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'final_diagnosis_id');
    }

    /**
     * Get diagnosis with full details
     */
    public function getFullDetailsAttribute()
    {
        return [
            'id' => $this->id,
            'user' => $this->user->only(['id', 'name', 'email']),
            'symptoms_reported' => $this->symptoms_reported,
            'symptoms_details' => Symptom::getByCodes($this->symptoms_reported ?? []),
            'mental_disorder' => $this->mentalDisorder,
            'recommendation' => $this->recommendation,
            'confidence_level' => $this->confidence_level,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get user's latest diagnosis
     */
    public static function getLatestForUser(int $userId)
    {
        return self::where('user_id', $userId)
            ->with(['mentalDisorder'])
            ->latest()
            ->first();
    }

    /**
     * Get user's diagnosis history
     */
    public static function getHistoryForUser(int $userId)
    {
        return self::where('user_id', $userId)
            ->with(['mentalDisorder'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Check if diagnosis has high confidence
     */
    public function hasHighConfidence(): bool
    {
        return $this->confidence_level >= 80;
    }

    /**
     * Check if diagnosis has medium confidence
     */
    public function hasMediumConfidence(): bool
    {
        return $this->confidence_level >= 60 && $this->confidence_level < 80;
    }

    /**
     * Check if diagnosis has low confidence
     */
    public function hasLowConfidence(): bool
    {
        return $this->confidence_level < 60;
    }

    /**
     * Get confidence level description
     */
    public function getConfidenceLevelDescriptionAttribute(): string
    {
        if ($this->hasHighConfidence()) {
            return 'Tinggi';
        } elseif ($this->hasMediumConfidence()) {
            return 'Sedang';
        } else {
            return 'Rendah';
        }
    }
}
