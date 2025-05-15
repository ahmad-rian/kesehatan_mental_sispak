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
        'email_verified_at', // Tambahkan ini
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

    // Perbaiki method hasRole dengan safe checking
    public function hasRole($role)
    {
        return $this->role && $this->role->name === $role;
    }

    // Check if user is admin
    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    // Method untuk mendapatkan avatar URL
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            // Jika sudah full URL (dari Google), return as is
            if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
                return $this->avatar;
            }
            // Jika local file, tambahkan storage path
            return asset('storage/' . $this->avatar);
        }
        return null;
    }
}
