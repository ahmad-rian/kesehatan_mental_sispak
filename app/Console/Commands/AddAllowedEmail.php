<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Role;
use App\Models\AllowedEmail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class AddAllowedEmail extends Command
{
    protected $signature = 'admin:allow-email {email} {--create-user : Create admin user immediately}';
    protected $description = 'Add email to admin whitelist';

    public function handle()
    {
        $email = $this->argument('email');
        $createUser = $this->option('create-user');

        // Validasi email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error("Invalid email format: {$email}");
            return 1;
        }

        // Tambah ke whitelist
        $allowedEmail = AllowedEmail::firstOrCreate(['email' => $email]);

        if ($allowedEmail->wasRecentlyCreated) {
            $this->info("Email {$email} added to admin whitelist");
        } else {
            $this->warn("Email {$email} already in admin whitelist");
        }

        // Opsi untuk langsung buat user admin
        if ($createUser) {
            $existingUser = User::where('email', $email)->first();

            if ($existingUser) {
                if ($existingUser->hasRole('admin')) {
                    $this->warn("User with email {$email} already exists as admin");
                } else {
                    // Update existing user to admin
                    $adminRole = Role::where('name', 'admin')->first();
                    $existingUser->update(['role_id' => $adminRole->id]);
                    $this->info("Existing user {$email} promoted to admin");
                }
            } else {
                // Buat user baru
                $name = $this->ask("Enter full name for {$email}");
                $password = $this->secret("Enter password (optional, will be auto-generated if empty)");

                if (empty($password)) {
                    $password = str()->random(12);
                    $this->info("Auto-generated password: {$password}");
                }

                $adminRole = Role::where('name', 'admin')->first();

                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make($password),
                    'role_id' => $adminRole->id,
                    'email_verified_at' => now(),
                ]);

                $this->info("Admin user created successfully");
                $this->line("Email: {$user->email}");
                $this->line("Name: {$user->name}");
                $this->line("Password: {$password}");
            }
        }

        return 0;
    }
}
