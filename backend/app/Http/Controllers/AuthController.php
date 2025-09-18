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
            'memberStatus' => 'required|in:yes,no',
        ]);

        $user = User::create([
            'name' => $validated['fullName'],
            'mobile' => $validated['mobile'] ?? null,
            'password' => Hash::make($validated['password']),
            'interests' => $validated['interests'] ?? [],
            'member_status' => $validated['memberStatus'],
        ]);

        return response()->json([
            'message' => 'Signup successful',
            'user' => $user,
        ], 201);
    }
}
