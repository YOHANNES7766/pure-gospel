<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Welcome, Admin!',
            'user' => $request->user(),
        ]);
    }
}
