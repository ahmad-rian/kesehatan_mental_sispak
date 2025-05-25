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
        Schema::create('gejala', function (Blueprint $table) {
            $table->id();
            $table->string('gejala');
            $table->timestamps();
        });

        Schema::create('penyakit', function (Blueprint $table) {
            $table->id();
            $table->string('penyakit');
            $table->timestamps();
        });

        Schema::create('aturan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gejala_id')->constrained('gejala')->onDelete('cascade');
            $table->foreignId('penyakit_id')->constrained('penyakit')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('diagnosa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gejala_id')->constrained('gejala')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        }); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnosa');
        Schema::dropIfExists('aturan');
        Schema::dropIfExists('penyakit');
        Schema::dropIfExists('gejala');
    }


};
