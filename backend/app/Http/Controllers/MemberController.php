<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    // List all members
    public function index()
    {
        return response()->json(Member::all());
    }

    // Store new member
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'   => 'required|string|max:255',
            'phone'       => 'nullable|string|max:20',
            'email'       => 'nullable|email|unique:members,email',
            'member_id'   => 'nullable|string|unique:members,member_id',
            'id_number'   => 'nullable|string|max:50',
            'birth_date'  => 'nullable|date',
            'address'     => 'nullable|string|max:255',
            'gender'      => 'nullable|in:male,female',
            'church_group'=> 'nullable|string|max:50',
            'status'      => 'nullable|in:Active,Inactive',
        ]);

        $member = Member::create($validated);
        return response()->json($member, 201);
    }

    // Show single member
    public function show($id)
    {
        $member = Member::findOrFail($id);
        return response()->json($member);
    }

    // Update member
    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);

        $validated = $request->validate([
            'full_name'   => 'sometimes|required|string|max:255',
            'phone'       => 'nullable|string|max:20',
            'email'       => 'nullable|email|unique:members,email,' . $id,
            'member_id'   => 'nullable|string|unique:members,member_id,' . $id,
            'id_number'   => 'nullable|string|max:50',
            'birth_date'  => 'nullable|date',
            'address'     => 'nullable|string|max:255',
            'gender'      => 'nullable|in:male,female',
            'church_group'=> 'nullable|string|max:50',
            'status'      => 'nullable|in:Active,Inactive',
        ]);

        $member->update($validated);
        return response()->json($member);
    }

    // Delete member
    public function destroy($id)
    {
        $member = Member::findOrFail($id);
        $member->delete();
        return response()->json(['message' => 'Member deleted successfully']);
    }

    // Stats endpoint - feeds frontend dashboard
    public function stats()
    {
        return response()->json([
            ["label" => "Active Members", "value" => Member::where('status', 'Active')->count(), "color" => "bg-green-600"],
            ["label" => "Inactive Members", "value" => Member::where('status', 'Inactive')->count(), "color" => "bg-red-600"],
            ["label" => "Men", "value" => Member::where('church_group', 'Men')->count(), "color" => "bg-blue-600"],
            ["label" => "Women", "value" => Member::where('church_group', 'Women')->count(), "color" => "bg-pink-600"],
            ["label" => "Youth Men", "value" => Member::where('church_group', 'Youth Men')->count(), "color" => "bg-indigo-600"],
            ["label" => "Youth Ladies", "value" => Member::where('church_group', 'Youth Ladies')->count(), "color" => "bg-purple-600"],
        ]);
    }
}
