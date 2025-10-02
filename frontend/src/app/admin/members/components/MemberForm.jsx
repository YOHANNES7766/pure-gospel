"use client";

import { useState } from "react";

export default function MemberForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "Men",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Member:", form);
    alert("Member Added!");
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
        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
      >
        Save Member
      </button>
    </form>
  );
}
