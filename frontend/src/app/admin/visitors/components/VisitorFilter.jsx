"use client";
import { useState } from "react";

export default function VisitorFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    search: "",
    purpose: "",
    from: "",
    to: "",
  });

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const clearFilters = () => {
    setFilters({ search: "", purpose: "", from: "", to: "" });
    onFilter({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-3 items-end"
    >
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Name, email, or phone"
        className="border px-3 py-2 rounded-md flex-1"
      />
      <select
        name="purpose"
        value={filters.purpose}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">All purposes</option>
        <option value="Prayer">Prayer</option>
        <option value="Counseling">Counseling</option>
        <option value="Visit">Visit</option>
      </select>
      <input
        type="date"
        name="from"
        value={filters.from}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md"
      />
      <input
        type="date"
        name="to"
        value={filters.to}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
      <button
        type="button"
        onClick={clearFilters}
        className="border border-gray-400 text-gray-600 px-4 py-2 rounded-md"
      >
        Clear
      </button>
    </form>
  );
}
