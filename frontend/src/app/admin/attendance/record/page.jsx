"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordAttendance() {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState([]);
  const [date, setDate] = useState("");
  const [fellowshipType, setFellowshipType] = useState("");
  const [attendanceCategory, setAttendanceCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const API = "http://localhost:8000/api";

  // ✅ Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Session expired. Please log in again.");
          router.push("/login");
          return;
        }

        const res = await fetch(`${API}/attendance/members`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();

        // sort alphabetically
        const sorted = data.sort((a, b) =>
          a.full_name.localeCompare(b.full_name)
        );

        setMembers(sorted);
        setFiltered(sorted);
      } catch (err) {
        console.error(err);
        setError("Error fetching members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [router]);

  // ✅ Filter search
  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      members.filter((m) =>
        m.full_name.toLowerCase().includes(lower)
      )
    );
  }, [search, members]);

  // ✅ Handle submit
  const handleSubmit = async () => {
    if (!date || !fellowshipType || !attendanceCategory) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          fellowship_type: fellowshipType,
          attendance_category: attendanceCategory,
          present_member_ids: selected,
        }),
      });

      if (res.status === 422) {
        const data = await res.json();
        console.error("Validation Error:", data);
        alert(JSON.stringify(data.errors || data.message));
        return;
      }

      if (!res.ok) throw new Error("Failed to record attendance");

      alert("✅ Attendance recorded successfully!");
      router.push("/admin/attendance");
    } catch (err) {
      console.error(err);
      alert("Error saving attendance. Please try again.");
    }
  };

  // ✅ Select toggles
  const handleSelectAll = () => setSelected(filtered.map((m) => m.id));
  const handleClearAll = () => setSelected([]);
  const handleCancel = () => router.push("/admin/attendance");

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Record Attendance
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 p-4 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* Attendance Form */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Date</label>
                <input
                  type="date"
                  className="border rounded p-2 w-full"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Fellowship Type
                </label>
                <select
                  className="border rounded p-2 w-full"
                  value={fellowshipType}
                  onChange={(e) => setFellowshipType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Midweek">Midweek</option>
                  <option value="Youth">Youth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Attendance Category
                </label>
                <select
                  className="border rounded p-2 w-full"
                  value={attendanceCategory}
                  onChange={(e) => setAttendanceCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Regular">Regular</option>
                  <option value="Excused">Excused</option>
                  <option value="Late">Late</option>
                </select>
              </div>
            </div>

            {/* Search + Controls */}
            <div className="flex justify-between items-center mb-3">
              <input
                type="text"
                placeholder="Search member..."
                className="border rounded p-2 w-1/2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Member List */}
            <div className="border rounded-lg max-h-[400px] overflow-y-auto mb-6">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No members found.
                </p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Select</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected.includes(member.id)}
                            onChange={(e) =>
                              setSelected((prev) =>
                                e.target.checked
                                  ? [...prev, member.id]
                                  : prev.filter((id) => id !== member.id)
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 font-medium">
                          {member.full_name}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {member.member_category || "Uncategorized"}
                        </td>
                        <td className="px-4 py-2 text-gray-500">
                          {member.phone || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Save Attendance
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
