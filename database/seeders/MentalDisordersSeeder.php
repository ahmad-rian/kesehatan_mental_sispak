<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MentalDisordersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $disorders = [
            [
                'code' => 'P1',
                'name' => 'Gangguan Kecemasan',
                'description' => 'Gangguan yang ditandai dengan perasaan cemas, gelisah, dan khawatir berlebihan yang mengganggu aktivitas sehari-hari.',
                'recommendation' => 'Lakukan teknik relaksasi seperti pernapasan dalam, meditasi, atau yoga. Hindari kafein dan alkohol. Konsultasi dengan psikolog atau psikiater untuk terapi lebih lanjut.',
            ],
            [
                'code' => 'P2',
                'name' => 'Depresi',
                'description' => 'Gangguan mood yang ditandai dengan perasaan sedih berkepanjangan, kehilangan minat pada aktivitas, dan penurunan energi.',
                'recommendation' => 'Jaga pola tidur yang teratur, lakukan aktivitas fisik ringan, dan tetap terhubung dengan keluarga atau teman. Segera konsultasi dengan profesional kesehatan mental.',
            ],
            [
                'code' => 'P3',
                'name' => 'Bipolar',
                'description' => 'Gangguan mood yang ditandai dengan perubahan suasana hati ekstrem antara episode manik (sangat bersemangat) dan depresif.',
                'recommendation' => 'Menjaga rutinitas harian yang stabil, menghindari stres berlebihan, dan sangat penting untuk mendapat pengawasan medis profesional.',
            ],
            [
                'code' => 'P4',
                'name' => 'Skizofrenia',
                'description' => 'Gangguan mental serius yang mempengaruhi cara seseorang berpikir, merasakan, dan berperilaku, termasuk halusinasi dan delusi.',
                'recommendation' => 'Segera mencari bantuan medis profesional. Dukungan keluarga sangat penting. Minum obat sesuai resep dokter dan rutin kontrol.',
            ],
            [
                'code' => 'P5',
                'name' => 'Gangguan Obsessive Compulsive Disorder (OCD)',
                'description' => 'Gangguan yang ditandai dengan pikiran obsesif dan perilaku kompulsif yang berulang-ulang.',
                'recommendation' => 'Terapi perilaku kognitif dapat membantu. Hindari menghindari situasi yang memicu OCD. Konsultasi dengan psikolog untuk terapi eksposur dan pencegahan respon.',
            ],
            [
                'code' => 'P6',
                'name' => 'Post Traumatic Stress Disorder (PTSD)',
                'description' => 'Gangguan yang berkembang setelah mengalami atau menyaksikan peristiwa traumatis.',
                'recommendation' => 'Hindari alkohol dan narkoba. Jaga rutinitas harian yang sehat. Konsultasi dengan terapis untuk terapi trauma seperti EMDR atau terapi perilaku kognitif.',
            ],
            [
                'code' => 'P7',
                'name' => 'Anoreksia',
                'description' => 'Gangguan makan yang ditandai dengan pembatasan makanan berlebihan dan ketakutan terhadap kenaikan berat badan.',
                'recommendation' => 'Segera konsultasi dengan ahli gizi dan psikolog. Dukungan keluarga sangat penting. Makan secara teratur dengan porsi yang sesuai kebutuhan tubuh.',
            ],
            [
                'code' => 'P8',
                'name' => 'Bulimia',
                'description' => 'Gangguan makan yang ditandai dengan makan berlebihan diikuti dengan perilaku kompensasi seperti muntah atau penggunaan obat pencahar.',
                'recommendation' => 'Konsultasi dengan ahli gizi dan psikolog. Jaga pola makan yang teratur dan sehat. Hindari diet ekstrem dan berat badan berfluktuasi.',
            ],
            [
                'code' => 'P9',
                'name' => 'Binge Eating Disorder (BED)',
                'description' => 'Gangguan makan yang ditandai dengan episode makan berlebihan secara berulang tanpa perilaku kompensasi.',
                'recommendation' => 'Konsultasi dengan ahli gizi dan psikolog. Kenali pemicu emosional dari makan berlebihan. Jaga pola makan yang teratur dan seimbang.',
            ],
        ];

        foreach ($disorders as $disorder) {
            DB::table('mental_disorders')->insert(array_merge($disorder, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
