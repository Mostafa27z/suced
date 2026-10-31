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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('public_code', 64)->unique();
            $table->string('certificate_number', 64)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('student_name');
            $table->string('course_title_en');
            $table->string('course_title_ar');
            $table->decimal('score_percentage', 5, 2);
            $table->date('issue_date');
            $table->boolean('is_revoked')->default(false);
            $table->text('revocation_reason')->nullable();
            $table->string('template_version')->default('v1');
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
