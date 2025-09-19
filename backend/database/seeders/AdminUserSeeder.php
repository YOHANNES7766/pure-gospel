<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['mobile' => '0912345678'], // use "mobile" as unique identifier
            [
                'fullName' => 'Super Admin', // ✅ fixed: use fullName
                'mobile' => '0912345678',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'member_status' => 'yes', // optional default
            ]
        );
    }
}
