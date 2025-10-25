<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class MemberController extends Controller
{
    /**
     * =====================
     * List all members
     * =====================
     */
    public function index()
    {
        return response()->json(Member::all(), 200);
    }

    /**
     * =====================
     * Store new member
     * =====================
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name'       => 'required|string|max:255',
                'phone'           => 'nullable|string|max:20',
                'email'           => 'nullable|email|unique:members,email',
                'member_id'       => 'nullable|string|unique:members,member_id',
                'id_number'       => 'nullable|string|max:50',
                'birth_date'      => 'nullable|date',
                'address'         => 'nullable|string|max:255',
                'gender'          => 'nullable|in:male,female,Male,Female',
                'church_group'    => 'nullable|string|max:50',
                'status'          => 'nullable|in:Active,Inactive,Pending',
                'member_category' => 'nullable|string|max:50',
            ], [
                'full_name.required' => 'Full name is required.',
                'email.email'        => 'Please enter a valid email address.',
                'email.unique'       => 'This email is already registered.',
                'member_id.unique'   => 'This member ID already exists.',
            ]);

            // Normalize gender capitalization
            if (isset($validated['gender'])) {
                $validated['gender'] = ucfirst(strtolower($validated['gender']));
            }

            $member = Member::create($validated);

            return response()->json([
                'message' => 'Member created successfully',
                'data'    => $member,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'An unexpected error occurred while creating member.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =====================
     * Show single member
     * =====================
     */
    public function show($id)
    {
        $member = Member::find($id);

        if (!$member) {
            return response()->json([
                'message' => 'Member not found',
            ], 404);
        }

        return response()->json($member, 200);
    }

    /**
     * =====================
     * Update member
     * =====================
     */
    public function update(Request $request, $id)
    {
        try {
            $member = Member::findOrFail($id);

            $validated = $request->validate([
                'full_name'       => 'sometimes|required|string|max:255',
                'phone'           => 'nullable|string|max:20',
                'email'           => 'nullable|email|unique:members,email,' . $id,
                'member_id'       => 'nullable|string|unique:members,member_id,' . $id,
                'id_number'       => 'nullable|string|max:50',
                'birth_date'      => 'nullable|date',
                'address'         => 'nullable|string|max:255',
                'gender'          => 'nullable|in:male,female,Male,Female',
                'church_group'    => 'nullable|string|max:50',
                'status'          => 'nullable|in:Active,Inactive,Pending',
                'member_category' => 'nullable|string|max:50',
            ]);

            if (isset($validated['gender'])) {
                $validated['gender'] = ucfirst(strtolower($validated['gender']));
            }

            $member->update($validated);

            return response()->json([
                'message' => 'Member updated successfully',
                'data'    => $member,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'An unexpected error occurred while updating member.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =====================
     * Delete member
     * =====================
     */
    public function destroy($id)
    {
        $member = Member::find($id);

        if (!$member) {
            return response()->json([
                'message' => 'Member not found',
            ], 404);
        }

        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully',
        ], 200);
    }

    /**
     * =====================
     * Stats endpoint (for dashboard)
     * =====================
     */
    public function stats()
    {
        return response()->json([
            [
                "label" => "Active Members",
                "value" => Member::where('status', 'Active')->count(),
                "color" => "bg-green-600",
            ],
            [
                "label" => "Inactive Members",
                "value" => Member::where('status', 'Inactive')->count(),
                "color" => "bg-red-600",
            ],
            [
                "label" => "Pending Members",
                "value" => Member::where('status', 'Pending')->count(),
                "color" => "bg-yellow-500",
            ],
            [
                "label" => "Men",
                "value" => Member::where('church_group', 'Men')->count(),
                "color" => "bg-blue-600",
            ],
            [
                "label" => "Women",
                "value" => Member::where('church_group', 'Women')->count(),
                "color" => "bg-pink-600",
            ],
            [
                "label" => "Youth Men",
                "value" => Member::where('church_group', 'Youth Men')->count(),
                "color" => "bg-indigo-600",
            ],
            [
                "label" => "Youth Ladies",
                "value" => Member::where('church_group', 'Youth Ladies')->count(),
                "color" => "bg-purple-600",
            ],
        ], 200);
    }
}
