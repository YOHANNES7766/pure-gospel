"use client";

import { useAttendance } from "./hooks/useAttendance";
import AttendanceFilter from "./components/AttendanceFilter";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceStats from "./components/AttendanceStats";

export default function AttendancePage() {
  const {
    records,
    stats,
    filter,
    setFilter,
    exportCSV,
    exportPDF,
    summaryCSV,
    summaryPDF,
  } = useAttendance();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Attendance Records
      </h1>

      <AttendanceFilter
        filter={filter}
        setFilter={setFilter}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        onSummaryCSV={summaryCSV}
        onSummaryPDF={summaryPDF}
      />

      <AttendanceStats stats={stats} />

      <AttendanceTable records={records} />
    </div>
  );
}
