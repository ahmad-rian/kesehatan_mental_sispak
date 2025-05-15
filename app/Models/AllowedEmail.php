<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllowedEmail extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'description',
    ];

    /**
     * Check if an email is allowed to be admin
     */
    public static function isAllowed($email)
    {
        return self::where('email', $email)->exists();
    }

    /**
     * Get all allowed admin emails
     */
    public static function getAllowedEmails()
    {
        return self::pluck('email')->toArray();
    }
}
