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
}
