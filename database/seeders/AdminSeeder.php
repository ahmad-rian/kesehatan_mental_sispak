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

        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->command->error('Admin role not found. Make sure RoleSeeder runs first.');
            return;
        }


        $adminEmails = [
            'ahmad.ritonga@mhs.unsoed.ac.id',
            'wikelaela22@gmail.com',
            'muthiakhanza33@gmail.com',
            'zia14148@gmail.com',
            'abhiramarizqi@gmail.com',
        ];

        foreach ($adminEmails as $email) {
            $adminData = [
                'name' => 'Admin',
                'email' => $email,
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'provider' => 'email',
            ];

            $existingUser = User::where('email', $email)->first();

            if ($existingUser) {
                $existingUser->update([
                    'role_id' => $adminRole->id,
                ]);
                $this->command->info('Existing user promoted to admin: ' . $email);
            } else {
                User::create($adminData);
                $this->command->info('Admin user created successfully: ' . $email);
                $this->command->line('Password: password123');
            }
        }
    }
}
