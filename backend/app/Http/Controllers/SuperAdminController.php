<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class SuperAdminController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Existing Features (Unchanged)
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        return response()->json(User::all(['id', 'fullName', 'mobile', 'role', 'member_status']));
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin,pastor,super_admin,visitor'
        ]);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot change your own role'], 403);
        }

        $user->update(['role' => $request->role]);
        $user->syncRoles($request->role);

        return response()->json([
            'message' => "User promoted to {$request->role} successfully",
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot delete a Super Admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User account deleted']);
    }

    public function revokeSessions($id)
    {
        $user = User::findOrFail($id);
        $user->tokens()->delete();
        activity()->causedBy(auth()->user())->performedOn($user)->log('Security: Revoked all user sessions');
        return response()->json(['message' => 'User has been logged out of all devices.']);
    }

    public function forcePasswordReset(Request $request, $id)
    {
        $request->validate(['password' => 'required|min:8']);
        $user = User::findOrFail($id);
        $user->password = $request->password; 
        $user->save();
        $user->tokens()->delete(); 
        activity()->causedBy(auth()->user())->performedOn($user)->log('Security: Forced password reset');
        return response()->json(['message' => 'Password reset successful. User logged out.']);
    }

    /*
    |--------------------------------------------------------------------------
    | ✅ UPDATED: getAuditLogs for Pagination
    |--------------------------------------------------------------------------
    */
    public function getAuditLogs(Request $request) 
    {
        $perPage = $request->get('limit', 10); // Default to 10 logs per page
        $page = $request->get('page', 1);     // Default to page 1

        $logsQuery = Activity::with(['causer:id,fullName', 'subject'])
            ->latest();
            
        // You can add filtering here if needed (e.g., by subject_type, description)
        // For example:
        // if ($request->has('filter_type')) {
        //     $logsQuery->where('subject_type', 'like', '%' . $request->filter_type . '%');
        // }

        $logs = $logsQuery->paginate($perPage, ['*'], 'page', $page);
            
        return response()->json($logs);
    }

public function approveMember($id)
    {
        $user = User::findOrFail($id);
        $user->update(['member_status' => 'Active']);
        return response()->json(['message' => 'Member approved']);
    }

    public function toggleSuspension($id)
    {
        $user = User::findOrFail($id);
        $newStatus = ($user->member_status === 'Suspended') ? 'Active' : 'Suspended';
        $user->update(['member_status' => $newStatus]);
        
        if($newStatus === 'Suspended') $user->tokens()->delete(); // Kick user out

        return response()->json(['message' => "User $newStatus"]);
    }

    
}