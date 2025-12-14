<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Member;      // ✅ Ensure Member model is imported
use App\Models\Department;  // ✅ Ensure Department model is imported
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Reset Cached Roles/Permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Create Permissions (The building blocks)
        $permissions = [
            'view_dashboard',
            'manage_users',
            'manage_roles',
            'view_members',
            'create_members',
            'edit_members',
            'delete_members',
            'view_finance',
            'manage_expenses',
            'view_reports',
            'view_attendance',
            'take_attendance',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // 3. Create Roles (Spatie)
        $roleSuperAdmin = Role::findOrCreate('super_admin', 'web');
        $roleAdmin = Role::findOrCreate('admin', 'web');
        $rolePastor = Role::findOrCreate('pastor', 'web');
        $roleUser = Role::findOrCreate('user', 'web');
        $roleMedia = Role::findOrCreate('media_team', 'web');
        $roleFinance = Role::findOrCreate('finance_team', 'web');

        // 4. Assign Permissions to Roles
        // Super Admin gets everything by default in Gate logic, but explicit assignment is safe
        $roleSuperAdmin->givePermissionTo(Permission::all());
        
        // Admin gets most things except maybe deleting roles
        $roleAdmin->givePermissionTo(['view_dashboard', 'manage_users', 'view_members', 'create_members', 'view_attendance']);
        
        // Pastor
        $rolePastor->givePermissionTo(['view_dashboard', 'view_members', 'view_attendance', 'take_attendance']);

        // 5. Create Departments (For your new feature)
        $choir = Department::create(['name' => 'Choir', 'description' => 'Worship Team']);
        $media = Department::create(['name' => 'Media', 'description' => 'Technical Team']);
        $ushering = Department::create(['name' => 'Ushering', 'description' => 'Protocol']);

        // 6. Create THE SUPER ADMIN USER
        // We check if it exists first to prevent errors
        $superAdmin = User::firstOrCreate(
            ['mobile' => '0911000000'], // Login ID
            [
                'fullName' => 'Main Super Admin',
                'password' => 'password123', // Will be hashed by your User model mutator
                'role' => 'super_admin', // Native Column
                'member_status' => 'Active', // or 'yes' based on your schema
            ]
        );

        // ✅ IMPORTANT: Assign Spatie Role
        $superAdmin->assignRole($roleSuperAdmin);

        // Optional: Create a Member profile linked to Super Admin
        Member::firstOrCreate(
            ['user_id' => $superAdmin->id],
            [
                'full_name' => $superAdmin->fullName,
                'phone' => $superAdmin->mobile,
                'status' => 'Active',
                'member_category' => 'Member' 
            ]
        );

        // 7. Create a Dummy Pastor for testing
        $pastorUser = User::create([
            'fullName' => 'Pastor John',
            'mobile' => '0922000000',
            'password' => 'password123',
            'role' => 'pastor',
            'member_status' => 'Active',
        ]);
        $pastorUser->assignRole($rolePastor);
        
        // Assign Pastor to Choir Department (Leader)
        $pastorUser->departments()->attach($choir->id, ['role_in_dept' => 'Leader']);

        // 8. Create a Dummy Admin for testing
        $adminUser = User::create([
            'fullName' => 'Admin Sara',
            'mobile' => '0933000000',
            'password' => 'password123',
            'role' => 'admin',
            'member_status' => 'Yes',
        ]);
        $adminUser->assignRole($roleAdmin);

        echo "---------------------------------------\n";
        echo "✅ Database Seeded Successfully! \n";
        echo "👤 Login: 0911000000 \n";
        echo "🔑 Pass:  password123 \n";
        echo "---------------------------------------\n";
    }
}