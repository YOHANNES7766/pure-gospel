<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'mobile' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'interests' => 'nullable|array',
            'member_status' => 'required|in:yes,no',
        ]);

        $user = User::create([
            'fullName' => $validated['fullName'],
            'mobile' => $validated['mobile'] ?? null,
            'password' => Hash::make($validated['password']),
            'interests' => $validated['interests'] ?? [],
            'member_status' => $validated['member_status'],
        ]);

        return response()->json([
            'message' => 'Signup successful',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'mobile'   => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('mobile', $validated['mobile'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Generate token (requires Sanctum or Passport)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }
}
