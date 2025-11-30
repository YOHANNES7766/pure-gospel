<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController; // We will make this next
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
| Authenticated Routes (Logged In Users)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    // ✅ logout is available to everyone
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Management Routes (Super Admin, Admin, Pastor)
    |--------------------------------------------------------------------------
    | The 'role' middleware allows super_admin automatically.
    | We explicitly add 'admin' and 'pastor'.
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
    | Only the 'super_admin' can access these.
    | Used to promote users to 'admin' or 'pastor'.
    */
    Route::middleware(['role:super_admin'])->prefix('super-admin')->group(function () {
        Route::get('/users', [SuperAdminController::class, 'index']); // List all login accounts
        Route::put('/users/{id}/role', [SuperAdminController::class, 'updateRole']); // Change role
        Route::delete('/users/{id}', [SuperAdminController::class, 'destroy']); // Delete login account
    });

});