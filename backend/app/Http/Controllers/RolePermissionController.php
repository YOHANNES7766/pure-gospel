<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    /**
     * Get all Roles with their assigned permissions
     */
    public function index()
    {
        // We show all roles so Super Admin can see the system structure
        // The Frontend will handle "locking" the super_admin card
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    /**
     * Get list of ALL available features (Permissions)
     */
    public function getAllPermissions()
    {
        return response()->json(Permission::all());
    }

    /**
     * Create a new Custom Role
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name|max:255',
            'permissions' => 'array' // ['view_finance', 'edit_posts']
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);

        if (!empty($request->permissions)) {
            $role->syncPermissions($request->permissions);
        }

        // ✅ LOGGING
        activity()
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->log("Created new role: {$request->name}");

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions')
        ], 201);
    }

    /**
     * Update permissions for an existing role
     */
    public function update(Request $request, $id)
    {
        // Use findOrFail for standard 404 response if missing
        $role = Role::findOrFail($id);

        // Security: Prevent editing Super Admin permissions
        // This ensures no one can accidentally break the root access
        if ($role->name === 'super_admin') {
            return response()->json(['message' => 'System Critical: Cannot modify Super Admin permissions'], 403);
        }

        $request->validate([
            'permissions' => 'required|array'
        ]);

        $role->syncPermissions($request->permissions);

        // ✅ LOGGING
        activity()
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->log("Updated permissions for role: {$role->name}");

        return response()->json([
            'message' => 'Permissions updated successfully',
            'role' => $role->load('permissions')
        ]);
    }

    /**
     * Delete a custom role
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        // Security: Protect Critical Roles
        $protectedRoles = ['super_admin', 'admin', 'pastor'];

        if (in_array($role->name, $protectedRoles)) {
            return response()->json(['message' => 'Action Denied: Cannot delete system core roles'], 403);
        }

        $roleName = $role->name; // Save name for log before deleting
        $role->delete();

        // ✅ LOGGING
        activity()
            ->causedBy(auth()->user())
            ->log("Deleted role: {$roleName}");

        return response()->json(['message' => 'Role deleted successfully']);
    }
}