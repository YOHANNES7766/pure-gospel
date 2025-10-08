<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendance = Attendance::with('member')->latest()->get();
        return response()->json($attendance);
    }

    /**
     * Store attendance for selected members.
     * Automatically marks others as absent for the same date/fellowship.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fellowship_type' => 'required|string',
            'date' => 'required|date',
            'present_member_ids' => 'array', // IDs of members marked Present
        ]);

        $date = $validated['date'];
        $fellowshipType = $validated['fellowship_type'];
        $presentIds = $validated['present_member_ids'] ?? [];

        DB::transaction(function () use ($date, $fellowshipType, $presentIds) {
            // Remove any previous attendance records for that date & fellowship
            Attendance::where('date', $date)
                ->where('fellowship_type', $fellowshipType)
                ->delete();

            // Fetch all active members
            $members = Member::where('status', 'Active')->get();

            foreach ($members as $member) {
                Attendance::create([
                    'member_id' => $member->id,
                    'fellowship_type' => $fellowshipType,
                    'member_category' => $member->member_category ?? 'Regular',
                    'attendance_category' => in_array($member->id, $presentIds) ? 'On Time' : 'Absent',
                    'status' => in_array($member->id, $presentIds) ? 'Present' : 'Absent',
                    'date' => $date,
                ]);
            }
        });

        return response()->json(['message' => 'Attendance recorded successfully.'], 201);
    }

    public function show($id)
    {
        $attendance = Attendance::with('member')->findOrFail($id);
        return response()->json($attendance);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->update($request->all());
        return response()->json($attendance);
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return response()->json(null, 204);
    }

    public function stats()
    {
        $total = Attendance::count();
        $present = Attendance::where('status', 'Present')->count();
        $absent = Attendance::where('status', 'Absent')->count();

        // Group by fellowship type (Sunday, Midweek, etc.)
        $byFellowship = Attendance::select('fellowship_type')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('fellowship_type')
            ->get();

        // Group by member category (Regular, Visitor, etc.)
        $byCategory = Attendance::select('member_category')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('member_category')
            ->get();

        return response()->json([
            'summary' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
            ],
            'byFellowship' => $byFellowship,
            'byCategory' => $byCategory,
        ]);
    }

    /**
     * Fetch all active members for attendance recording
     */
public function getActiveMembers()
{
    $members = \App\Models\Member::where('status', 'Active')
        ->select('id', 'full_name', 'member_id', 'church_group', 'member_category')
        ->orderBy('full_name')
        ->get();

    return response()->json($members);
}


}
