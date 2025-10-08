"use client";

import { useRouter } from "next/navigation";

export default function AttendanceFilter({
  filter,
  setFilter,
  onExportCSV,
  onExportPDF,
  onSummaryCSV,
  onSummaryPDF,
}) {
  const router = useRouter();

  const handleRecordClick = () => {
    router.push("/admin/attendance/record");
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6 border border-gray-200">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setFilter({ ...filter, range: "week" })}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          This Week
        </button>
        <button
          onClick={() => setFilter({ ...filter, range: "month" })}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          This Month
        </button>

        <input
          type="date"
          className="border rounded p-2 focus:ring focus:ring-gray-200"
          value={filter.date || ""}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />

        <select
          className="border rounded p-2 focus:ring focus:ring-gray-200"
          value={filter.fellowship_type || ""}
          onChange={(e) =>
            setFilter({ ...filter, fellowship_type: e.target.value })
          }
        >
          <option value="">All Fellowship</option>
          <option value="Sunday">Sunday</option>
          <option value="Midweek">Midweek</option>
          <option value="Youth">Youth</option>
        </select>

        <input
          type="text"
          placeholder="Search member name"
          className="border rounded p-2 flex-1 focus:ring focus:ring-gray-200"
          value={filter.member || ""}
          onChange={(e) => setFilter({ ...filter, member: e.target.value })}
        />

        <button
          onClick={handleRecordClick}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          + Record Attendance
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={onExportCSV}
          className="border px-3 py-1 rounded hover:bg-gray-100"
        >
          Export CSV
        </button>
        <button
          onClick={onExportPDF}
          className="border px-3 py-1 rounded hover:bg-gray-100"
        >
          Export PDF
        </button>
        <button
          onClick={onSummaryCSV}
          className="border px-3 py-1 rounded hover:bg-gray-100"
        >
          Summary CSV
        </button>
        <button
          onClick={onSummaryPDF}
          className="border px-3 py-1 rounded hover:bg-gray-100"
        >
          Summary PDF
        </button>
      </div>
    </div>
  );
}
