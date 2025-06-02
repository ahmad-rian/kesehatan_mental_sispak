<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentalDisorder extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'recommendation',
    ];

    public function diagnosisRules()
    {
        return $this->hasMany(DiagnosisRule::class);
    }

    public function userDiagnoses()
    {
        return $this->hasMany(UserDiagnosis::class);
    }

    /**
     * Get disorder by code
     */
    public static function getByCode(string $code)
    {
        return self::where('code', $code)->first();
    }

    /**
     * Get all disorders with their rules
     */
    public static function getAllWithRules()
    {
        return self::with('diagnosisRules')->get();
    }
}
