// components/VisitorFilter.jsx
"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Search } from "lucide-react"; // icon for filter button

export default function VisitorFilter({
  filter,
  setFilter,
  onExportCSV,
  onExportPDF,
  onApplyFilter,
}) {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const isDark = theme === "dark";

  // Clears all filters
  const handleClear = () => {
    setFilter({
      search: "",
      purpose: "",
      from: "",
      to: "",
    });
  };

  // Applies the filters
  const handleFilter = () => {
    if (onApplyFilter) {
      onApplyFilter(filter);
    }
  };

  return (
    <div
      className={`${
        isDark
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200 text-gray-700"
      } shadow-sm rounded-lg p-4 mb-6 border`}
    >
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search name, email, or phone"
          value={filter.search || ""}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className={`border rounded p-2 flex-1 focus:ring ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
          }`}
        />

        <input
          type="text"
          placeholder="Purpose"
          value={filter.purpose || ""}
          onChange={(e) => setFilter({ ...filter, purpose: e.target.value })}
          className={`border rounded p-2 focus:ring ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
          }`}
        />

        <input
          type="date"
          value={filter.from || ""}
          onChange={(e) => setFilter({ ...filter, from: e.target.value })}
          className={`border rounded p-2 focus:ring ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        />

        <input
          type="date"
          value={filter.to || ""}
          onChange={(e) => setFilter({ ...filter, to: e.target.value })}
          className={`border rounded p-2 focus:ring ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        />

        {/* Filter & Clear Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="flex items-center gap-2 bg-[#2f3042] hover:bg-[#242537] text-white px-4 py-2 rounded"
          >
            <Search size={16} />
            Filter
          </button>

          <button
            onClick={handleClear}
            className="border border-gray-400 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>

        <button
          onClick={() => router.push("/admin/visitors/new")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Visitor
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={onExportCSV} className="border px-3 py-1 rounded">
          Export CSV
        </button>
        <button onClick={onExportPDF} className="border px-3 py-1 rounded">
          Export PDF
        </button>
      </div>
    </div>
  );
}