// components/MemberForm.jsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function MemberForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "Men",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("token");

      // ✅ Frontend validation
      if (!form.name.trim() || !form.phone.trim()) {
        toast.error("Full name and phone number are required!");
        setLoading(false);
        return;
      }

      if (!token) {
        toast.error("You are not logged in!");
        setLoading(false);
        return;
      }

      // Fetch current members to calculate member_id
      const resCount = await fetch(`${api}/api/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resCount.ok) {
        throw new Error("Failed to fetch current members count");
      }

      const dataCount = await resCount.json();
      const memberId = (dataCount.length + 1).toString(); // Start from 1, as string

      const res = await fetch(`${api}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.name,
          phone: form.phone,
          category: form.category,
          status: form.status,
          member_id: memberId,
        }),
      });

      // ✅ If server returns an error response
      if (!res.ok) {
        let message = "Something went wrong while saving the member.";

        try {
          const data = await res.json();
          message =
            data.message ||
            Object.values(data.errors || {})[0]?.[0] ||
            `Server responded with ${res.status}`;
        } catch {
          // Fallback if the response is not JSON (e.g., HTML error page)
          message = `Server error: ${res.status}`;
        }

        throw new Error(message);
      }

      // ✅ If successful
      const data = await res.json();
      console.log("✅ Member saved:", data);
      toast.success("🎉 Member successfully added!");

      // Reset form
      setForm({ name: "", phone: "", category: "Men", status: "Active" });
    } catch (err) {
      console.error("❌ Error saving member:", err);
      toast.error(err.message || "Failed to save member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Enter full name"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Enter phone number"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option>Men</option>
          <option>Women</option>
          <option>Youth Men</option>
          <option>Youth Ladies</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Member"}
      </button>
    </form>
  );
}