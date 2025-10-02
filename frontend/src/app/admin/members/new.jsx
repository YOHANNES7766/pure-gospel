"use client";

import { useState } from "react";

export default function AddMemberPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    memberId: "",
    idNumber: "",
    birthDate: "",
    address: "",
    gender: "",
    churchGroup: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Member:", form);
    // Later: Send to API
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Add New Member</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
          <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <InputField label="Email" name="email" value={form.email} onChange={handleChange} />
          <InputField label="Member ID" name="memberId" value={form.memberId} onChange={handleChange} />
          <InputField label="ID Number" name="idNumber" value={form.idNumber} onChange={handleChange} />
          <InputField label="Address" name="address" value={form.address} onChange={handleChange} />
          <InputField label="Birth Date" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />

          {/* Gender Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Church Group Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Church Group</label>
            <select
              name="churchGroup"
              value={form.churchGroup}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select group</option>
              <option value="youth">Youth</option>
              <option value="choir">Choir</option>
              <option value="elders">Elders</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
          >
            Add Member
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="border px-6 py-2 rounded-md"
          >
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
