<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Reset Permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Create Permissions
        $permissions = [
            'view_dashboard', 'manage_users', 'manage_roles',
            'view_members', 'create_members', 'edit_members', 'delete_members',
            'view_finance', 'manage_expenses', 'view_reports',
            'view_attendance', 'take_attendance',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // 3. Create Roles
        $roleSuperAdmin = Role::findOrCreate('super_admin', 'web');
        $roleAdmin = Role::findOrCreate('admin', 'web');
        $rolePastor = Role::findOrCreate('pastor', 'web');
        
        $roleSuperAdmin->givePermissionTo(Permission::all());
        $roleAdmin->givePermissionTo(['view_dashboard', 'manage_users', 'view_members', 'create_members', 'view_attendance']);
        
        // 4. Create Departments
        Department::firstOrCreate(['name' => 'Choir'], ['description' => 'Worship Team']);
        Department::firstOrCreate(['name' => 'Media'], ['description' => 'Technical Team']);

        // ---------------------------------------------------------
        // 5. ✅ YOUR ADMIN (0965548360) - Redirects to /admin
        // ---------------------------------------------------------
        $myAdmin = User::updateOrCreate(
            ['mobile' => '0965548360'], 
            [
                'fullName' => 'My Admin Account',
                'password' => 'admin123',
                'role' => 'admin', 
                'member_status' => 'Active',
            ]
        );
        $myAdmin->assignRole($roleAdmin);

        // ---------------------------------------------------------
        // 6. ✅ SYSTEM SUPER ADMIN (0911000000) - Redirects to /super-admin
        // ---------------------------------------------------------
        // I changed firstOrCreate -> updateOrCreate to FORCE the password update
        $superAdmin = User::updateOrCreate(
            ['mobile' => '0911000000'],
            [
                'fullName' => 'System Super Admin',
                'password' => 'password123', // ✅ Forces this password
                'role' => 'super_admin',     // ✅ Forces this role
                'member_status' => 'Active',
            ]
        );
        $superAdmin->assignRole($roleSuperAdmin);

        echo "---------------------------------------\n";
        echo "✅ Database Updated! \n";
        echo "1️⃣  Admin Login:       0965548360 (Pass: admin123) -> /admin \n";
        echo "2️⃣  Super Admin Login: 0911000000 (Pass: password123) -> /super-admin \n";
        echo "---------------------------------------\n";
    }
}