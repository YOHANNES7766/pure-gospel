"use client";

import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext"; // Adjust path based on your structure
import { useRouter } from "next/navigation";

export default function AddVisitor() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const router = useRouter();

  const [formData, setFormData] = useState({
    member_id: "",
    pastor_id: "",
    visit_date: "",
    visit_status: "Visited",
    remarks: "",
  });
  const [members, setMembers] = useState([]);
  const [pastors, setPastors] = useState([]); // Assuming pastors are users; fetch from /users or a dedicated endpoint
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8000/api";

  // Fetch members and pastors (adjust endpoints if needed; e.g., add Route::get('/members', ...) and Route::get('/users', ...) in Laravel)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      try {
        // Fetch members
        const membersRes = await fetch(`${API_BASE}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!membersRes.ok) throw new Error("Failed to fetch members");
        const membersData = await membersRes.json();
        setMembers(membersData);

        // Fetch pastors (assuming all users or filter by role in backend)
        const pastorsRes = await fetch(`${API_BASE}/users`, { // Add this route in Laravel if missing: Route::get('/users', [UserController::class, 'index']);
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!pastorsRes.ok) throw new Error("Failed to fetch pastors");
        const pastorsData = await pastorsRes.json();
        setPastors(pastorsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/visitors`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add visit record");
      }

      router.push("/admin/visitors"); // Redirect back to list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"} p-4 sm:p-6`}>
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Visitor</h1>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline">
            ← Back to List
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="mb-4">
            <label className="block mb-1">Member</label>
            <select
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              required
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} ({member.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Pastor</label>
            <select
              name="pastor_id"
              value={formData.pastor_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              required
            >
              <option value="">Select Pastor</option>
              {pastors.map((pastor) => (
                <option key={pastor.id} value={pastor.id}>
                  {pastor.fullName} ({pastor.mobile})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Visit Date</label>
            <input
              type="date"
              name="visit_date"
              value={formData.visit_date}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Visit Status</label>
            <select
              name="visit_status"
              value={formData.visit_status}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              required
            >
              <option value="Visited">Visited</option>
              <option value="Not Visited">Not Visited</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Remarks / Purpose</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={() => router.back()} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}