<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VisitorController extends Controller
{
    public function index()
    {
        $visits = Visitor::with(['member', 'pastor'])->latest()->get();
        return response()->json($visits, 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'member_id' => 'required|exists:members,id',
                'pastor_id' => 'required|exists:users,id',
                'visit_date' => 'required|date',
                'visit_status' => 'required|in:Visited,Not Visited',
                'remarks' => 'nullable|string',
            ]);

            $visitor = Visitor::create($validated);

            // Optionally mark the member as visited or not
            $member = Member::find($validated['member_id']);
            if ($member) {
                $member->status = $validated['visit_status'] === 'Visited' ? 'Active' : 'Inactive';
                $member->save();
            }

            return response()->json([
                'message' => 'Visitor record added successfully',
                'data' => $visitor->load(['member', 'pastor']),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    public function show($id)
    {
        $visit = Visitor::with(['member', 'pastor'])->find($id);

        if (!$visit) {
            return response()->json(['message' => 'Visitor record not found'], 404);
        }

        return response()->json($visit, 200);
    }

    public function update(Request $request, $id)
    {
        $visitor = Visitor::find($id);

        if (!$visitor) {
            return response()->json(['message' => 'Visitor record not found'], 404);
        }

        $validated = $request->validate([
            'visit_status' => 'nullable|in:Visited,Not Visited',
            'remarks' => 'nullable|string',
        ]);

        $visitor->update($validated);

        return response()->json([
            'message' => 'Visitor record updated successfully',
            'data' => $visitor,
        ], 200);
    }

    public function destroy($id)
    {
        $visitor = Visitor::find($id);

        if (!$visitor) {
            return response()->json(['message' => 'Visitor record not found'], 404);
        }

        $visitor->delete();

        return response()->json(['message' => 'Visitor record deleted successfully'], 200);
    }

    public function stats()
    {
        return response()->json([
            [
                'label' => 'Visited Members',
                'value' => Visitor::where('visit_status', 'Visited')->count(),
                'color' => 'bg-green-600',
            ],
            [
                'label' => 'Not Visited Members',
                'value' => Visitor::where('visit_status', 'Not Visited')->count(),
                'color' => 'bg-red-600',
            ],
        ]);
    }
}
