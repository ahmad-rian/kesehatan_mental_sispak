<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Symptom extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
    ];

    /**
     * Get symptoms by codes
     */
    public static function getByCodes(array $codes)
    {
        return self::whereIn('code', $codes)->get();
    }

    /**
     * Get symptom by code
     */
    public static function getByCode(string $code)
    {
        return self::where('code', $code)->first();
    }

    /**
     * Get all symptoms ordered by code
     */
    public static function getAllOrdered()
    {
        return self::orderBy('code')->get();
    }

    /**
     * Check if symptom code exists
     */
    public static function codeExists(string $code): bool
    {
        return self::where('code', $code)->exists();
    }
}
