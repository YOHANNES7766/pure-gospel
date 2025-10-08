<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->string('fellowship_type')->nullable(); // e.g., sunday, youth
            $table->string('member_category')->nullable(); // e.g., regular, visitor
            $table->string('attendance_category')->nullable(); // e.g., on time, late
            $table->enum('status', ['Present', 'Absent'])->default('Present');
            $table->date('date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
