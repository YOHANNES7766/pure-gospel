"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    member_id: "",
    id_number: "",
    birth_date: "",
    address: "",
    gender: "",
    member_category: "",
    church_group: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError("");

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not logged in!");
        router.push("/login");
        return;
      }

      // Filter out empty values
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== "")
      );

      const res = await fetch(`${api}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        // 🧩 Handle all backend statuses gracefully
        if (res.status === 401) {
          toast.error("Session expired. Please log in again.");
          router.push("/login");
          return;
        }

        if (res.status === 403) {
          toast.error("You do not have permission to perform this action.");
          return;
        }

        if (res.status === 404) {
          toast.error("The requested endpoint was not found.");
          return;
        }

        if (res.status === 422 && data.errors) {
          setErrors(data.errors);
          const messages = Object.values(data.errors).flat().join("\n");
          setFormError(messages);
          toast.error("Validation failed. Please check the fields.");
          return;
        }

        const message =
          data.message || "Something went wrong. Please try again.";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("✅ Member added successfully!");
      router.push("/admin/members");
    } catch {
      toast.error("Failed to connect to the server. Please try again later.");
      setFormError("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Add New Member</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200"
      >
        {/* Top-level error banner */}
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required error={errors.full_name} />
          <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
          <InputField label="Member ID" name="member_id" value={form.member_id} onChange={handleChange} error={errors.member_id} />
          <InputField label="ID Number" name="id_number" value={form.id_number} onChange={handleChange} error={errors.id_number} />
          <InputField label="Birth Date" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} error={errors.birth_date} />
          <InputField label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} />

          <SelectField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={[
              { value: "", label: "Select Gender" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            error={errors.gender}
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
            error={errors.member_category}
          />

          <SelectField
            label="Church Group"
            name="church_group"
            value={form.church_group}
            onChange={handleChange}
            options={[
              { value: "", label: "Select Group" },
              { value: "Men", label: "Men" },
              { value: "Women", label: "Women" },
              { value: "Youth Men", label: "Youth Men" },
              { value: "Youth Ladies", label: "Youth Ladies" },
              { value: "Choir", label: "Choir" },
              { value: "Elders", label: "Elders" },
            ]}
            error={errors.church_group}
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
            error={errors.status}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/members")}
            className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Saving..." : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ✅ Reusable input field */
function InputField({ label, name, value, onChange, type = "text", required = false, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full border rounded-md p-2 focus:ring focus:ring-indigo-200 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}

/* ✅ Reusable select field */
function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full border rounded-md p-2 bg-white focus:ring focus:ring-indigo-200 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
