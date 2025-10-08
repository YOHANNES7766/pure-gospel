"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMemberPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    id_number: "",
    member_id: "",
    birth_date: "",
    address: "",
    age: "",
    gender: "",
    status: "Active",
    member_category: "",
    church_group: "",
  });

  const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age.toString();
  };

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Session expired. Please login again.");
          router.push("/login");
          return;
        }

        const res = await fetch(`${api}/api/members/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "include",
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Fetch failed: ${res.status} - ${errText}`);
        }

        const data = await res.json();

        setForm({
          full_name: data.full_name || data.first_name || "",
          email: data.email || "",
          phone: data.phone || "",
          id_number: data.id_number || "",
          member_id: data.member_id || "",
          birth_date: data.birth_date || "",
          address: data.address || "",
          age: data.age || calculateAge(data.birth_date),
          gender: data.gender || "",
          status: data.status || "Active",
          member_category: data.member_category || "",
          church_group: data.church_group || "",
        });
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(
          "Could not load member info. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMember();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    if (name === "birth_date") updated.age = calculateAge(value);
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing authentication token");

      const res = await fetch(`${api}/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(form),
        mode: "cors",
        credentials: "include",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Update failed: ${res.status} - ${errText}`);
      }

      alert("✅ Member updated successfully!");
      router.push("/admin/members");
    } catch (err) {
      console.error("❌ Update error:", err);
      setError(
        "Failed to update member. Please try again or check console for details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading member info...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-red-600 space-y-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Edit Member Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
            <InputField label="Email" name="email" value={form.email} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <InputField label="ID Number" name="id_number" value={form.id_number} onChange={handleChange} />
            <InputField label="Member ID" name="member_id" value={form.member_id} onChange={handleChange} />
            <InputField label="Birth Date" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} />
            <InputField label="Age" name="age" value={form.age} readOnly />
            <InputField label="Address" name="address" value={form.address} onChange={handleChange} />

            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { value: "", label: "Select gender" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
            />

            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
                { value: "Pending", label: "Pending" },
              ]}
            />

            <SelectField
              label="Member Category"
              name="member_category"
              value={form.member_category}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Category" },
                { value: "Regular", label: "Regular" },
                { value: "Visitor", label: "Visitor" },
                { value: "New Convert", label: "New Convert" },
              ]}
            />

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
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-md shadow-md text-white font-medium transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? "Updating..." : "Update Member"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/members")}
              className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🔹 Reusable Input Field (with higher-contrast text)
function InputField({ label, name, value, onChange, type = "text", readOnly }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
          readOnly ? "bg-gray-100 text-gray-700" : "focus:ring-blue-500"
        }`}
      />
    </div>
  );
}

// 🔹 Reusable Select Field (with higher-contrast text)
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
