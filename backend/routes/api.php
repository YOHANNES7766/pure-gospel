<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController; 
use App\Http\Controllers\RolePermissionController; 
use App\Http\Controllers\MemberController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\VisitorController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Shared Management Routes (Admin & Pastor)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:admin,pastor'])->group(function () {
        // Members
        Route::get('/members/stats', [MemberController::class, 'stats']);
        Route::apiResource('members', MemberController::class);

        // Attendance
        Route::get('/attendance/stats', [AttendanceController::class, 'stats']);
        Route::get('/attendance/members', [AttendanceController::class, 'getActiveMembers']);
        Route::apiResource('attendance', AttendanceController::class);

        // Visitors
        Route::get('/visitors/stats', [VisitorController::class, 'stats']);
        Route::apiResource('visitors', VisitorController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | SUPER ADMIN Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:super_admin'])->prefix('super-admin')->group(function () {
        
        // 1. User Account Management
        Route::get('/users', [SuperAdminController::class, 'index']);
        Route::post('/users', [SuperAdminController::class, 'store']);
        Route::put('/users/{id}/role', [SuperAdminController::class, 'updateRole']);
        Route::delete('/users/{id}', [SuperAdminController::class, 'destroy']);

        // 2. Role & Permission Management (✅ NEW)
        Route::get('/roles', [RolePermissionController::class, 'index']); // List roles
        Route::post('/roles', [RolePermissionController::class, 'store']); // Create "Treasurer"
        Route::get('/permissions', [RolePermissionController::class, 'getAllPermissions']); // Get "view_finance" checkboxes
        Route::put('/roles/{id}', [RolePermissionController::class, 'update']); // Update permissions
        Route::delete('/roles/{id}', [RolePermissionController::class, 'destroy']); // Delete role
        

          // 3. System Audit (Moved INSIDE the protection group)
        Route::get('/audit-logs', [SuperAdminController::class, 'getAuditLogs']); // Audit Logs

        
        
    });

    

});