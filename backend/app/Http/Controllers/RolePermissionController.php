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
        // Return roles hidden from normal view if needed, but usually show all except maybe super_admin
        $roles = Role::with('permissions')->where('name', '!=', 'super_admin')->get();
        return response()->json($roles);
    }

    /**
     * Get list of ALL available features (Permissions)
     * This fills the checkboxes on the frontend
     */
    public function getAllPermissions()
    {
        return response()->json(Permission::all());
    }

    /**
     * Create a new Custom Role (e.g., "Media Team")
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name|max:255',
            'permissions' => 'array' // Array of permission names ['view_finance', 'edit_posts']
        ]);

        // Create the role
        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);

        // Assign permissions if sent
        if (!empty($request->permissions)) {
            $role->syncPermissions($request->permissions);
        }

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
        $role = Role::findById($id);

        // Security: Prevent editing Super Admin
        if ($role->name === 'super_admin') {
            return response()->json(['message' => 'Cannot edit Super Admin permissions'], 403);
        }

        $request->validate([
            'permissions' => 'required|array'
        ]);

        // Sync (Overwrite) permissions
        $role->syncPermissions($request->permissions);

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
        $role = Role::findById($id);

        if (in_array($role->name, ['super_admin', 'admin', 'pastor'])) {
            return response()->json(['message' => 'Cannot delete system core roles'], 403);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }
}