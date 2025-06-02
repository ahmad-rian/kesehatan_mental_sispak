<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('diagnosis_rules', function (Blueprint $table) {
            $table->id();
            $table->string('rule_code', 10)->unique();
            $table->foreignId('mental_disorder_id')->constrained()->onDelete('cascade');
            $table->json('symptom_codes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnosis_rules');
    }
};
