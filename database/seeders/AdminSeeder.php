<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan role admin ada
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->command->error('Admin role not found. Make sure RoleSeeder runs first.');
            return;
        }

        // Data admin
        $adminData = [
            'name' => 'Ahmad Rian Syaifullah',
            'email' => 'ahmad.ritonga@mhs.unsoed.ac.id',
            'password' => Hash::make('password123'), // Ganti dengan password yang diinginkan
            'role_id' => $adminRole->id,
            'email_verified_at' => now(),
            'provider' => 'email',
        ];

        // Cek apakah admin sudah ada
        $existingUser = User::where('email', $adminData['email'])->first();

        if ($existingUser) {
            // Update existing user to admin role
            $existingUser->update([
                'role_id' => $adminRole->id,
            ]);
            $this->command->info('Existing user promoted to admin: ' . $adminData['email']);
        } else {
            // Buat admin baru
            User::create($adminData);
            $this->command->info('Admin user created successfully: ' . $adminData['email']);
            $this->command->line('Password: password123');
        }
    }
}
