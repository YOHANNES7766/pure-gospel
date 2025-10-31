"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { Search } from "lucide-react"; // icon for filter button

export default function AttendanceFilter({
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
      date: "",
      fellowship_type: "",
      member: "",
    });
  };

  // Applies only the selected date (and others if set)
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
          type="date"
          value={filter.date || ""}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className={`border rounded p-2 focus:ring ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        />

        <select
          value={filter.fellowship_type || ""}
          onChange={(e) =>
            setFilter({ ...filter, fellowship_type: e.target.value })
          }
          className={`border rounded p-2 focus:ring ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          <option value="">All Fellowship</option>
          <option value="Sunday">Sunday</option>
          <option value="Midweek">Midweek</option>
          <option value="Youth">Youth</option>
        </select>

        <input
          type="text"
          placeholder="Search member name"
          value={filter.member || ""}
          onChange={(e) => setFilter({ ...filter, member: e.target.value })}
          className={`border rounded p-2 flex-1 focus:ring ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
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
          onClick={() => router.push("/admin/attendance/record")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Record Attendance
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
