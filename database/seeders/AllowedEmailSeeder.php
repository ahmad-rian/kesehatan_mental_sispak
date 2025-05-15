<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllowedEmailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama jika ada
        DB::table('allowed_emails')->truncate();

        $allowedEmails = [
            [
                'email' => 'ahmad.ritonga@mhs.unsoed.ac.id',
                'description' => 'Admin user - Ahmad Rian Syaifullah',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ];

        DB::table('allowed_emails')->insert($allowedEmails);

        $this->command->info('Allowed emails seeded successfully');
        $this->command->info('Admin emails: ' . collect($allowedEmails)->pluck('email')->implode(', '));
    }
}
