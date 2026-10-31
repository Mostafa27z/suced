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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('student')->after('email'); // admin, teacher, student
            $table->string('national_id')->nullable()->after('role');
            $table->string('phone')->nullable()->after('national_id');
            $table->string('avatar')->nullable()->after('phone');
            $table->string('locale')->default('en')->after('avatar');
            $table->boolean('is_active')->default(true)->after('locale');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'national_id', 'phone', 'avatar', 'locale', 'is_active']);
        });
    }
};
