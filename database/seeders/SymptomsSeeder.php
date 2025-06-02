<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SymptomsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $symptoms = [
            ['code' => 'G1', 'description' => 'Rasa Gelisah atau Tegang berlebihan'],
            ['code' => 'G2', 'description' => 'Ketegangan pada fisik'],
            ['code' => 'G3', 'description' => 'Kesulitan berkonsentrasi'],
            ['code' => 'G4', 'description' => 'Gangguan Tidur'],
            ['code' => 'G5', 'description' => 'Kelelahan Berlebihan'],
            ['code' => 'G6', 'description' => 'Ketakutan yang irasional'],
            ['code' => 'G7', 'description' => 'Kehilangan Nafsu Makan'],
            ['code' => 'G8', 'description' => 'Kesulitan membuat keputusan'],
            ['code' => 'G9', 'description' => 'Merasa diri tidak berguna, putus asa'],
            ['code' => 'G10', 'description' => 'Sedih dan murung berkelanjutan'],
            ['code' => 'G11', 'description' => 'Kehilangan semangat dan energi'],
            ['code' => 'G12', 'description' => 'Merasa bersemangat berlebihan'],
            ['code' => 'G13', 'description' => 'Sensitif dan mudah tersinggung'],
            ['code' => 'G14', 'description' => 'Mood Swing dengan cepat'],
            ['code' => 'G15', 'description' => 'Delusi, memiliki keyakinan yang salah'],
            ['code' => 'G16', 'description' => 'Halusinasi, Merasa melihat, mendengar, atau menyentuh hal-hal yang tidak dirasakan oleh orang lain, seperti bisikan, suara-suara, dan lain sebagainya.'],
            ['code' => 'G17', 'description' => 'Berbicara kacau dan sulit dimengerti'],
            ['code' => 'G18', 'description' => 'Paranoid, rasa curiga berlebih'],
            ['code' => 'G19', 'description' => 'Melakukan sesuatu berulang ulang karena kecemasan'],
            ['code' => 'G20', 'description' => 'Ingatan masa lalu yang muncul berulang-ulang'],
            ['code' => 'G21', 'description' => 'Memiliki trauma pada hal yang berhubungan dengan sebuah peristiwa'],
            ['code' => 'G22', 'description' => 'Tidak mau makan meskipun lapar'],
            ['code' => 'G23', 'description' => 'Penurunan Berat Badan'],
            ['code' => 'G24', 'description' => 'Berolahraga secara berlebihan'],
            ['code' => 'G25', 'description' => 'Makan berlebihan'],
            ['code' => 'G26', 'description' => 'Sering pergi ke kamar mandi setelah makan'],
            ['code' => 'G27', 'description' => 'Merasa depresi setelah makan'],
        ];

        foreach ($symptoms as $symptom) {
            DB::table('symptoms')->insert(array_merge($symptom, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
