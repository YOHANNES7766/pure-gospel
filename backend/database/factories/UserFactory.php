<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'fullName' => $this->faker->name(),
            'mobile' => $this->faker->unique()->phoneNumber(),
            'password' => Hash::make('password123'), // default password
            'interests' => json_encode([
                'General Church Updates/Newsletter',
                'Youth Group',
            ]),
            'member_status' => $this->faker->randomElement(['yes', 'no']),
            'role' => 'user',
        ];
    }
}
