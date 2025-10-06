<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['mobile' => '0965548360'],
            [
                'fullName' => 'Super Admin',
                'password' => 'admin123', // ✅ plain text — will be hashed by model
                'role' => 'admin',
                'member_status' => 'yes',
            ]
        );
    }
}
