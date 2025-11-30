<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // List of features your system has
        $permissions = [
            // Members
            'view_members',
            'create_members',
            'edit_members',
            'delete_members',
            
            // Finance
            'view_finance',
            'manage_expenses',
            'view_reports',

            // Attendance
            'view_attendance',
            'take_attendance',

            // System
            'manage_users', // Only Super Admin
            'manage_roles', // Only Super Admin
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
    }
}