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
        Schema::table('courses', function (Blueprint $table) {
            $table->json('certificate_template')->nullable()->after('thumbnail');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->json('template_data')->nullable()->after('template_version');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn('certificate_template');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropColumn('template_data');
        });
    }
};
