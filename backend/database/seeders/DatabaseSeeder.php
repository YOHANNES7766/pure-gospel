<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Call Admin user seeder
      //  $this->call(AdminUserSeeder::class);

        // Generate 10 demo users with factory
       // User::factory(10)->create();
    }
}
