<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\AttendanceController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
|
| ✅ Admin routes are protected by Sanctum and the 'admin' middleware
| Admins can manage members, view dashboards, and handle attendance.
|
*/
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index']);

    // =====================
    // MEMBERS ROUTES
    // =====================
    Route::get('/members/stats', [MemberController::class, 'stats']);
    Route::get('/members', [MemberController::class, 'index']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::get('/members/{id}', [MemberController::class, 'show']);
    Route::put('/members/{id}', [MemberController::class, 'update']);
    Route::delete('/members/{id}', [MemberController::class, 'destroy']);

    // =====================
    // ATTENDANCE ROUTES
    // =====================
    Route::get('/attendance/stats', [AttendanceController::class, 'stats']);
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::get('/attendance/members', [AttendanceController::class, 'getActiveMembers']);
    Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
    Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
    Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);



    // =====================
// VISITORS ROUTES
// =====================
Route::get('/visitors/stats', [VisitorController::class, 'stats']);
Route::get('/visitors', [VisitorController::class, 'index']);
Route::post('/visitors', [VisitorController::class, 'store']);
Route::get('/visitors/{id}', [VisitorController::class, 'show']);
Route::put('/visitors/{id}', [VisitorController::class, 'update']);
Route::delete('/visitors/{id}', [VisitorController::class, 'destroy']);

});

/*
|--------------------------------------------------------------------------
| Local Testing Route (No Auth)
|--------------------------------------------------------------------------
|
| ⚠️ TEMPORARY: allows you to test member creation without token
| Remove this route in production once authentication works.
|
*/
if (app()->environment('local')) {
    Route::post('/members/test-create', [MemberController::class, 'store']);
}
