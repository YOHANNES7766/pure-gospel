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
    Schema::table('members', function (Blueprint $table) {
        $table->string('member_category')->nullable()->after('church_group');
    });
}

public function down(): void
{
    Schema::table('members', function (Blueprint $table) {
        $table->dropColumn('member_category');
    });
}

};
