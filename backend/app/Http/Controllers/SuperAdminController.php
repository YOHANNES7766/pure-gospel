<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity; // ✅ Import for Audit Logs

class SuperAdminController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Existing Features
    |--------------------------------------------------------------------------
    */

    // List all users
    public function index()
    {
        return response()->json(User::all(['id', 'fullName', 'mobile', 'role', 'member_status']));
    }

    // Promote/Demote User
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin,pastor,super_admin,visitor'
        ]);

        $user = User::findOrFail($id);

        // Prevent Super Admin from demoting themselves
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot change your own role'], 403);
        }

        // 1. Update the local 'role' column
        $user->update(['role' => $request->role]);

        // 2. Sync with Spatie Permissions (Crucial for the permission system to work)
        // This ensures the user actually gets the permissions associated with the role
        $user->syncRoles($request->role);

        return response()->json([
            'message' => "User promoted to {$request->role} successfully",
            'user' => $user
        ]);
    }

    // Delete User
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot delete a Super Admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User account deleted']);
    }

    /*
    |--------------------------------------------------------------------------
    | ✅ NEW: Security & Authority Features
    |--------------------------------------------------------------------------
    */

    /**
     * Kicks the user out of all devices (Mobile & Web).
     * Useful if a phone is stolen or an account is compromised.
     */
    public function revokeSessions($id)
    {
        $user = User::findOrFail($id);
        
        // Deletes all Sanctum tokens from the database
        $user->tokens()->delete();

        // Manually log this security action
        activity()
           ->causedBy(auth()->user())
           ->performedOn($user)
           ->log('Security: Revoked all user sessions');

        return response()->json(['message' => 'User has been logged out of all devices.']);
    }

    /**
     * Forces a password reset for a specific user.
     * Automatically revokes old sessions so they must log in with the new password.
     */
    public function forcePasswordReset(Request $request, $id)
    {
        $request->validate(['password' => 'required|min:8']);
        
        $user = User::findOrFail($id);
        
        // Your User model mutator automatically hashes this
        $user->password = $request->password; 
        $user->save();
        
        // Revoke tokens so they are forced to login with new password
        $user->tokens()->delete(); 

        // Log the event
        activity()
           ->causedBy(auth()->user())
           ->performedOn($user)
           ->log('Security: Forced password reset');

        return response()->json(['message' => 'Password reset successful. User logged out.']);
    }

    /**
     * Retrieve the system audit logs.
     * Shows who did what, when.
     */
    public function getAuditLogs() 
    {
        // Fetch latest 50 logs including the person who performed the action ('causer')
        $logs = Activity::with('causer:id,fullName') // Only get ID and Name of the admin
            ->latest()
            ->limit(50)
            ->get();
            
        return response()->json($logs);
    }
}