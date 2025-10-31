// pages/AttendancePage.js (modified)
"use client";

import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAttendance } from "./hooks/useAttendance";
import AttendanceFilter from "./components/AttendanceFilter";
import AttendanceStats from "./components/AttendanceStats";
import AttendanceTable from "./components/AttendanceTable";

export default function AttendancePage() {
  const { theme } = useContext(ThemeContext);
  const {
    records,
    stats,
    filter,
    setFilter,
    exportCSV,
    exportPDF,
    fetchRecords,
  } = useAttendance();

  const isDark = theme === "dark";
  const bg = isDark ? "bg-gray-900" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen flex flex-col ${bg} text-gray-800 dark:text-gray-200`}>
      <main className="flex-grow p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Attendance Records</h1>
        </div>

        <div className={`${cardBg} rounded-lg p-4 sm:p-6 shadow-sm`}>
          <AttendanceFilter
            filter={filter}
            setFilter={setFilter}
            onExportCSV={exportCSV}
            onExportPDF={exportPDF}
            onApplyFilter={fetchRecords} // Refresh all records from API on Filter button click
          />
        </div>

        <div className={`${cardBg} rounded-lg p-4 sm:p-6 shadow-sm`}>
          <AttendanceStats stats={stats} />
        </div>

        <div className={`${cardBg} rounded-lg p-4 sm:p-6 shadow-sm overflow-x-auto`}>
          <AttendanceTable records={records} />
        </div>
      </main>

      {/* Mobile footer buttons */}
      <footer className={`${cardBg} border-t p-3 sm:hidden fixed bottom-0 left-0 right-0 flex justify-around`}>
        <button onClick={exportCSV} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">
          CSV
        </button>
        <button onClick={exportPDF} className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700">
          PDF
        </button>
      </footer>
    </div>
  );
}