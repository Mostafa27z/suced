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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('code')->nullable(); // e.g. AI-501
            $table->string('title_ar');
            $table->string('title_en');
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('department')->default('technology'); // technology, business, healthcare, management
            $table->integer('duration_weeks')->default(8);
            $table->integer('duration_hours')->default(32);
            $table->decimal('rating', 3, 2)->default(4.9);
            $table->integer('reviews_count')->default(120);
            $table->integer('passing_score')->default(70);
            $table->boolean('is_published')->default(false);
            $table->text('requirements_ar')->nullable();
            $table->text('requirements_en')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
