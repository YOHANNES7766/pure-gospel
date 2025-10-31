// components/AttendanceTable.js
"use client";

import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

export default function AttendanceTable({ records }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className={`border rounded-lg overflow-x-auto shadow-sm ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <table className={`min-w-full text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        <thead className={`${isDark ? "bg-gray-700" : "bg-gray-100"} border-b`}>
          <tr>
            {["Member Name", "Fellowship Type", "Member Category", "Attendance Category", "Status", "Date"].map(
              (h) => (
                <th key={h} className="p-3 font-semibold border-r">
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((r, i) => (
              <tr key={i} className={`border-t ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                <td className="p-3 border-r">{r.name}</td>
                <td className="p-3 border-r">{r.fellowship}</td>
                <td className="p-3 border-r">{r.category}</td>
                <td className="p-3 border-r">{r.attendanceCategory}</td>
                <td className="p-3 border-r">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      r.status === "Present"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3">{r.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="sm:hidden text-center text-xs p-2 text-gray-500">
        Swipe to see all columns
      </div>
    </div>
  );
}