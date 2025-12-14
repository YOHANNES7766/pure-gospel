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
     * Update permissions OR rename an existing role
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        // Security: Prevent editing Super Admin
        if ($role->name === 'super_admin') {
            return response()->json(['message' => 'System Critical: Cannot modify Super Admin'], 403);
        }

        // 1. Validation
        // Changed 'permissions' to 'sometimes' so you can rename without sending permissions
        $request->validate([
            'name' => 'sometimes|required|string|unique:roles,name,' . $role->id,
            'permissions' => 'sometimes|array' 
        ]);

        // 2. Update Name (if provided)
        if ($request->has('name') && $request->name !== $role->name) {
            $oldName = $role->name;
            $role->name = $request->name;
            $role->save();
            
            activity()
                ->causedBy(auth()->user())
                ->performedOn($role)
                ->log("Renamed role from '$oldName' to '{$request->name}'");
        }

        // 3. Sync Permissions (if provided)
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
            
            activity()
                ->causedBy(auth()->user())
                ->performedOn($role)
                ->log("Updated permissions for role: {$role->name}");
        }

        return response()->json([
            'message' => 'Role updated successfully',
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