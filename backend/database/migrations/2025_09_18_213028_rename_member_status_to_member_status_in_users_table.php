<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'member_status')) {
            DB::statement("
                ALTER TABLE `users`
                CHANGE `member_status` `member_status`
                ENUM('yes','no') NOT NULL DEFAULT 'no'
            ");
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'member_status')) {
            DB::statement("
                ALTER TABLE `users`
                CHANGE `member_status` `member_status`
                ENUM('yes','no') NOT NULL DEFAULT 'no'
            ");
        }
    }
};
