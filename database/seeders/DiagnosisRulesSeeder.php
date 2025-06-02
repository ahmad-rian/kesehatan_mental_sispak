<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DiagnosisRulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rules = [
            [
                'rule_code' => 'R1',
                'mental_disorder_id' => 1,
                'symptom_codes' => json_encode(['G1', 'G2', 'G3', 'G4', 'G5', 'G6'])
            ],
            [
                'rule_code' => 'R2',
                'mental_disorder_id' => 2,
                'symptom_codes' => json_encode(['G1', 'G3', 'G7', 'G8', 'G9', 'G10', 'G11'])
            ],
            [
                'rule_code' => 'R3',
                'mental_disorder_id' => 3,
                'symptom_codes' => json_encode(['G1', 'G3', 'G7', 'G8', 'G9', 'G11', 'G12', 'G13', 'G14'])
            ],
            [
                'rule_code' => 'R4',
                'mental_disorder_id' => 4,
                'symptom_codes' => json_encode(['G1', 'G2', 'G3', 'G15', 'G16', 'G17', 'G18'])
            ],
            [
                'rule_code' => 'R5',
                'mental_disorder_id' => 5,
                'symptom_codes' => json_encode(['G1', 'G19', 'G20'])
            ],
            [
                'rule_code' => 'R6',
                'mental_disorder_id' => 6,
                'symptom_codes' => json_encode(['G1', 'G3', 'G4', 'G13', 'G14', 'G20', 'G21'])
            ],
            [
                'rule_code' => 'R7',
                'mental_disorder_id' => 7,
                'symptom_codes' => json_encode(['G1', 'G3', 'G7', 'G22', 'G23', 'G24'])
            ],
            [
                'rule_code' => 'R8',
                'mental_disorder_id' => 8,
                'symptom_codes' => json_encode(['G1', 'G3', 'G7', 'G22', 'G23', 'G24', 'G25', 'G26'])
            ],
            [
                'rule_code' => 'R9',
                'mental_disorder_id' => 9,
                'symptom_codes' => json_encode(['G1', 'G3', 'G7', 'G22', 'G23', 'G24', 'G25', 'G27'])
            ]
        ];

        foreach ($rules as $rule) {
            DB::table('diagnosis_rules')->insert(array_merge($rule, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
