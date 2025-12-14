<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        // Return departments with the count of members
        return response()->json(Department::withCount('users')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:departments,name']);
        
        $dept = Department::create($request->all());

        activity()->causedBy(auth()->user())->performedOn($dept)->log("Created department: {$dept->name}");

        return response()->json($dept, 201);
    }

    public function destroy($id)
    {
        $dept = Department::findOrFail($id);
        $name = $dept->name;
        $dept->delete();

        activity()->causedBy(auth()->user())->log("Deleted department: {$name}");
        return response()->json(['message' => 'Deleted']);
    }

    // Assign a user to a department
    public function assignMember(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'department_id' => 'required|exists:departments,id',
            'role' => 'string' // 'Leader', 'Member'
        ]);

        $user = User::findOrFail($request->user_id);
        
        // Sync without detaching (allows being in multiple depts)
        $user->departments()->syncWithoutDetaching([
            $request->department_id => ['role_in_dept' => $request->role ?? 'member']
        ]);

        activity()->causedBy(auth()->user())->performedOn($user)
            ->log("Assigned user to department ID {$request->department_id}");

        return response()->json(['message' => 'Member assigned to department']);
    }
}