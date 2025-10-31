"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "../../../../context/ThemeContext";

export default function EditMemberPage() {
  const router = useRouter();
  const { id } = useParams();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

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
          toast.error("Session expired. Please login again.");
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
        toast.error("Could not load member info. Please check your connection or try again later.");
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
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in!");
        router.push("/login");
        return;
      }

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

      toast.success("✅ Member updated successfully!");
      router.push("/admin/members");
    } catch {
      toast.error("Failed to connect to the server. Please try again later.");
      setFormError("Failed to connect to the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-lg`}>
        Loading member info...
      </div>
    );
  }

  if (formError && !Object.keys(errors).length) { // Show global error if no field errors
    return (
      <div className={`flex flex-col items-center justify-center h-screen text-center ${theme === "dark" ? "text-red-200" : "text-red-600"} space-y-4`}>
        <p>{formError}</p>
        <button
          onClick={() => window.location.reload()}
          className={`${theme === "dark" ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2 rounded-md`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <div className={`max-w-4xl mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-xl rounded-xl p-8`}>
        <h1 className={`text-3xl font-bold mb-8 ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
          Edit Member Information
        </h1>

        {/* Top-level error banner */}
        {formError && (
          <div className={`${theme === "dark" ? "bg-red-900/30 border-red-700 text-red-200" : "bg-red-100 border-red-400 text-red-700"} border px-4 py-3 rounded mb-6`}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} theme={theme} error={errors.full_name} />
            <InputField label="Email" name="email" value={form.email} onChange={handleChange} theme={theme} error={errors.email} />
            <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} theme={theme} error={errors.phone} />
            <InputField label="ID Number" name="id_number" value={form.id_number} onChange={handleChange} theme={theme} error={errors.id_number} />
            <InputField label="Member ID" name="member_id" value={form.member_id} onChange={handleChange} theme={theme} error={errors.member_id} />
            <InputField label="Birth Date" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} theme={theme} error={errors.birth_date} />
            <InputField label="Age" name="age" value={form.age} readOnly theme={theme} />
            <InputField label="Address" name="address" value={form.address} onChange={handleChange} theme={theme} error={errors.address} />

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
              theme={theme}
              error={errors.gender}
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
              theme={theme}
              error={errors.status}
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
              theme={theme}
              error={errors.member_category}
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
              theme={theme}
              error={errors.church_group}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-md shadow-md text-white font-medium transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : `${theme === "dark" ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}`
              }`}
            >
              {submitting ? "Updating..." : "Update Member"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/members")}
              className={`border px-6 py-2 rounded-md hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
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
function InputField({ label, name, value, onChange, type = "text", readOnly, theme, error }) {
  return (
    <div className="flex flex-col">
      <label className={`text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`border rounded-md p-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
          readOnly ? `${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}` : "focus:ring-blue-500"
        } ${error ? "border-red-500" : (theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900")}`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}

// 🔹 Reusable Select Field (with higher-contrast text)
function SelectField({ label, name, value, onChange, options, theme, error }) {
  return (
    <div className="flex flex-col">
      <label className={`text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : (theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900")}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
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