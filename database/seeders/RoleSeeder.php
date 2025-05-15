<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('roles')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');


        $roles = [
            [
                'id' => 1,
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'System administrator with full access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'user',
                'display_name' => 'User',
                'description' => 'Regular system user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('roles')->insert($roles);

        // Reset auto increment counter
        DB::statement('ALTER TABLE roles AUTO_INCREMENT = 3');

        $this->command->info('Roles seeded successfully');
    }
}
