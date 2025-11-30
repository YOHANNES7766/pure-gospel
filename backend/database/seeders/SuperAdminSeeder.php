<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Member;

class SuperAdminSeeder extends Seeder
{
    public function run()
    {
        // Check if exists to avoid duplicates
        if (!User::where('mobile', '0911000000')->exists()) {
            
            $user = User::create([
                'fullName'      => 'Main Super Admin',
                'mobile'        => '0911000000', // Login ID
                'password'      => 'password123', // Will be hashed by model
                'role'          => 'super_admin', // <--- IMPORTANT
                'member_status' => 'yes',
            ]);

            // Create linked member profile
            Member::create([
                'user_id'   => $user->id,
                'full_name' => $user->fullName,
                'phone'     => $user->mobile,
                'status'    => 'Active',
            ]);
        }
    }
}