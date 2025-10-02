export default function AttendanceFilter({
  filter,
  setFilter,
  onExportCSV,
  onExportPDF,
  onSummaryCSV,
  onSummaryPDF,
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 border">
      <div className="flex flex-wrap gap-3 items-center">
        <button className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50">
          This Week
        </button>
        <button className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50">
          This Month
        </button>

        <input
          type="date"
          className="border rounded p-2 focus:ring focus:ring-blue-200"
          value={filter.date || ""}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />

        <select
          className="border rounded p-2 focus:ring focus:ring-blue-200"
          value={filter.fellowship || ""}
          onChange={(e) => setFilter({ ...filter, fellowship: e.target.value })}
        >
          <option value="">All Fellowship</option>
          <option value="sunday">Sunday</option>
          <option value="youth">Youth</option>
        </select>

        <select
          className="border rounded p-2 focus:ring focus:ring-blue-200"
          value={filter.category || ""}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="regular">Regular</option>
          <option value="visitor">Visitor</option>
        </select>

        <input
          type="text"
          placeholder="Search member name"
          className="border rounded p-2 flex-1 focus:ring focus:ring-blue-200"
          value={filter.member || ""}
          onChange={(e) => setFilter({ ...filter, member: e.target.value })}
        />

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2">
          + Record Attendance
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={onExportCSV} className="border px-3 py-1 rounded hover:bg-gray-100">
          Export CSV
        </button>
        <button onClick={onExportPDF} className="border px-3 py-1 rounded hover:bg-gray-100">
          Export PDF
        </button>
        <button onClick={onSummaryCSV} className="border px-3 py-1 rounded hover:bg-gray-100">
          Summary CSV
        </button>
        <button onClick={onSummaryPDF} className="border px-3 py-1 rounded hover:bg-gray-100">
          Summary PDF
        </button>
      </div>
    </div>
  );
}
