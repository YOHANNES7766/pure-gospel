<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // ✅ link to users table
            $table->string('full_name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('member_id')->nullable()->unique();
            $table->string('id_number')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('address')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('church_group')->nullable();
            // ✅ Added "Pending" to avoid truncation error
            $table->enum('status', ['Active', 'Inactive', 'Pending'])->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('members');
    }
};
