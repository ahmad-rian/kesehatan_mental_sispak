<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([

            RoleSeeder::class,
            AllowedEmailSeeder::class,
            AdminSeeder::class,


            MentalDisordersSeeder::class,
            SymptomsSeeder::class,
            DiagnosisRulesSeeder::class,
        ]);

        $this->command->info('All seeders completed successfully!');
        $this->command->line('');
        $this->command->info('Mental Health Expert System Data:');
        $this->command->line('- Mental Disorders: 9 disorders (P1-P9)');
        $this->command->line('- Symptoms: 27 symptoms (G1-G27)');
        $this->command->line('- Diagnosis Rules: 10 rules with multiple paths');
        $this->command->line('');
        $this->command->info('System is ready for use!');
    }
}
