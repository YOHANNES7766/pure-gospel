"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

export default function AddMemberPage() {
  const router = useRouter();
  const { theme } = useTheme();
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
        // 🧩 Handle backend statuses gracefully
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
    <div className={`p-8 min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <h1 className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
        Add New Member
      </h1>

      <form
        onSubmit={handleSubmit}
        className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-md rounded-lg p-8 space-y-6 border`}
      >
        {/* Top-level error banner */}
        {formError && (
          <div className={`${theme === "dark" ? "bg-red-900/30 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"} border px-4 py-3 rounded`}>
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            error={errors.full_name}
            theme={theme}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            theme={theme}
          />
          <InputField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            theme={theme}
          />
          <InputField
            label="Member ID"
            name="member_id"
            value={form.member_id}
            onChange={handleChange}
            error={errors.member_id}
            theme={theme}
          />
          <InputField
            label="ID Number"
            name="id_number"
            value={form.id_number}
            onChange={handleChange}
            error={errors.id_number}
            theme={theme}
          />
          <InputField
            label="Birth Date"
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
            error={errors.birth_date}
            theme={theme}
          />
          <InputField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            error={errors.address}
            theme={theme}
          />

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
            theme={theme}
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
            theme={theme}
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
            theme={theme}
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
            theme={theme}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/members")}
            className={`border px-6 py-2 rounded-md hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} transition ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : `${theme === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"}`
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
function InputField({ label, name, value, onChange, type = "text", required = false, error, theme }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full border rounded-md p-2 focus:ring ${theme === "dark" ? "focus:ring-indigo-400 bg-gray-700 text-gray-100" : "focus:ring-indigo-200 bg-white text-gray-800"} ${
          error ? "border-red-500" : (theme === "dark" ? "border-gray-600" : "border-gray-300")
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
function SelectField({ label, name, value, onChange, options, error, theme }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full border rounded-md p-2 focus:ring ${theme === "dark" ? "focus:ring-indigo-400 bg-gray-700 text-gray-100" : "focus:ring-indigo-200 bg-white text-gray-800"} ${
          error ? "border-red-500" : (theme === "dark" ? "border-gray-600" : "border-gray-300")
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