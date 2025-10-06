"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
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

  // Fetch existing member details
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const token = localStorage.getItem("token");

        const res = await fetch(`${api}/api/members/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch member");
        const data = await res.json();

        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          member_id: data.member_id || "",
          id_number: data.id_number || "",
          birth_date: data.birth_date || "",
          address: data.address || "",
          gender: data.gender || "",
          church_group: data.church_group || "",
          status: data.status || "Active",
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        alert("Could not load member info");
        router.push("/admin/members");
      }
    };

    if (id) fetchMember();
  }, [id, router]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("token");

      const res = await fetch(`${api}/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update member");

      alert("✅ Member updated successfully!");
      router.push(`/admin/members/${id}`); // Go back to view page
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Error: Could not update member");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading member...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Edit Member</h1>

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
          <SelectField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={[
              { value: "", label: "Select Gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />

          {/* Group */}
          <SelectField
            label="Church Group"
            name="church_group"
            value={form.church_group}
            onChange={handleChange}
            options={[
              { value: "", label: "Select group" },
              { value: "Men", label: "Men" },
              { value: "Women", label: "Women" },
              { value: "Youth Men", label: "Youth Men" },
              { value: "Youth Ladies", label: "Youth Ladies" },
              { value: "Choir", label: "Choir" },
              { value: "Elders", label: "Elders" },
            ]}
          />

          {/* Status */}
          <SelectField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/members/${id}`)}
            className="border px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable input field
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      />
    </div>
  );
}

// Reusable select field
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
