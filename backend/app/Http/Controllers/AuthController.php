<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register (Signup) a new user
     */
    public function signup(Request $request)
    {
        $validated = $request->validate([
            'fullName'      => 'required|string|max:255',
            'mobile'        => 'required|string|max:20|unique:users,mobile',
            'password'      => 'required|string|min:6',
            'interests'     => 'nullable|array',
            'member_status' => 'required|in:yes,no',
        ]);

        // ✅ Create new user with hashed password
        $user = User::create([
            'fullName'      => $validated['fullName'],
            'mobile'        => $validated['mobile'],
            'password'      => Hash::make($validated['password']),
            'interests'     => $validated['interests'] ?? [],
            'member_status' => $validated['member_status'],
            'role'          => 'user', // default role
        ]);

        // ✅ Always create a Member record for every user
        Member::create([
            'user_id'   => $user->id,
            'full_name' => $user->fullName,
            'phone'     => $user->mobile,
            'status'    => $user->member_status === 'yes' ? 'Active' : 'Pending',
        ]);

        // ✅ Create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Signup successful',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ], 201);
    }

    /**
     * Login existing user
     */
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

        // Delete old tokens (optional)
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => $this->formatUser($user),
            'token'   => $token,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Helper: format user response
     */
    private function formatUser(User $user): array
    {
        return [
            'id'           => $user->id,
            'fullName'     => $user->fullName,
            'mobile'       => $user->mobile,
            'role'         => $user->role,
            'memberStatus' => $user->member_status,
            'interests'    => $user->interests,
        ];
    }
}
