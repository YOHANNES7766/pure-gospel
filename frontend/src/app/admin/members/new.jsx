"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMemberPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    member_id: "",
    id_number: "",
    birth_date: "",
    address: "",
    gender: "",
    church_group: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("token");

      const res = await fetch(`${api}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add member");

      alert("Member added successfully!");
      router.push("/admin/members");
    } catch (err) {
      console.error(err);
      alert("Error: Could not save member");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Add New Member</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
          <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <InputField label="Email" name="email" value={form.email} onChange={handleChange} />
          <InputField label="Member ID" name="member_id" value={form.member_id} onChange={handleChange} />
          <InputField label="ID Number" name="id_number" value={form.id_number} onChange={handleChange} />
          <InputField label="Address" name="address" value={form.address} onChange={handleChange} />
          <InputField label="Birth Date" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} />

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Church Group</label>
            <select name="church_group" value={form.church_group} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
              <option value="">Select group</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Youth Men">Youth Men</option>
              <option value="Youth Ladies">Youth Ladies</option>
              <option value="Choir">Choir</option>
              <option value="Elders">Elders</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md">
            Add Member
          </button>
          <button type="button" onClick={() => router.push("/admin/members")} className="border px-6 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      />
    </div>
  );
}
