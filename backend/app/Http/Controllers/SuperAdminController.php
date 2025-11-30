<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    // List all users in the system
    public function index()
    {
        // Don't show the password hash
        return response()->json(User::all(['id', 'fullName', 'mobile', 'role', 'member_status']));
    }

    // Change a user's role (e.g., Promote User to Pastor)
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin,pastor,super_admin,visitor'
        ]);

        $user = User::findOrFail($id);

        // Optional: Prevent Super Admin from demoting themselves
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot change your own role'], 403);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => "User promoted to {$request->role} successfully",
            'user' => $user
        ]);
    }

    // Delete a user system-wide
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot delete a Super Admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User account deleted']);
    }
}