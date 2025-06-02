<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'provider',
        'role_id',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Relasi untuk mental health system
    public function diagnoses()
    {
        return $this->hasMany(UserDiagnosis::class);
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    public function latestDiagnosis()
    {
        return $this->hasOne(UserDiagnosis::class)->latest();
    }

    public function activeConsultation()
    {
        return $this->hasOne(Consultation::class)
            ->where('status', Consultation::STATUS_IN_PROGRESS)
            ->latest();
    }

    // Method yang sudah ada sebelumnya
    public function hasRole($role)
    {
        return $this->role && $this->role->name === $role;
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
                return $this->avatar;
            }
            return asset('storage/' . $this->avatar);
        }
        return null;
    }

    // Method baru untuk mental health
    public function hasActiveDiagnosis(): bool
    {
        return $this->latestDiagnosis()->exists();
    }

    public function hasActiveConsultation(): bool
    {
        return $this->activeConsultation()->exists();
    }

    public function getDiagnosisHistory()
    {
        return $this->diagnoses()
            ->with('mentalDisorder')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getConsultationHistory()
    {
        return $this->consultations()
            ->with('finalDiagnosis.mentalDisorder')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
