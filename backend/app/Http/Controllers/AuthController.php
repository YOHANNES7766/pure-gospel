<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Signup new user
    public function signup(Request $request)
    {
        $validated = $request->validate([
            'fullName'      => 'required|string|max:255',
            'mobile'        => 'nullable|string|max:20|unique:users,mobile',
            'password'      => 'required|string|min:6',
            'interests'     => 'nullable|array',
            'member_status' => 'required|in:yes,no',
        ]);

        $user = User::create([
            'fullName'      => $validated['fullName'],
            'mobile'        => $validated['mobile'] ?? null,
            'password'      => Hash::make($validated['password']),
            'interests'     => $validated['interests'] ?? [],
            'member_status' => $validated['member_status'],
            'role'          => 'user', // default role
        ]);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Signup successful',
            'user'    => [
                'id'           => $user->id,
                'fullName'     => $user->fullName,
                'mobile'       => $user->mobile,
                'role'         => $user->role,
                'memberStatus' => $user->member_status,
                'interests'    => $user->interests,
            ],
            'token'   => $token,
        ], 201);
    }

    // Login existing user
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

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => [
                'id'           => $user->id,
                'fullName'     => $user->fullName,
                'mobile'       => $user->mobile,
                'role'         => $user->role,
                'memberStatus' => $user->member_status,
                'interests'    => $user->interests,
            ],
            'token' => $token,
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
