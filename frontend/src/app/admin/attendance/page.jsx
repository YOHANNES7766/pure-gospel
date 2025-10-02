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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>

      {/* Filter & Actions */}
      <AttendanceFilter
        filter={filter}
        setFilter={setFilter}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        onSummaryCSV={summaryCSV}
        onSummaryPDF={summaryPDF}
      />

      {/* Stats */}
      <AttendanceStats stats={stats} />

      {/* Table */}
      <AttendanceTable records={records} />
    </div>
  );
}
