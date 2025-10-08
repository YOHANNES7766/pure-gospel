<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\AttendanceController;

// Public routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Protected admin-only routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index']);
});

// Authenticated routes (for all logged-in users)
Route::middleware(['auth:sanctum'])->group(function () {

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

    // ✅ Must be ABOVE /attendance/{id} to avoid 404 conflict
    Route::get('/attendance/members', [AttendanceController::class, 'getActiveMembers']);

    Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
    Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
    Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);
});
