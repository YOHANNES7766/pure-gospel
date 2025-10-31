// components/AttendanceStats.js
"use client";

import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

export default function AttendanceStats({ stats }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div
      className={`${
        isDark
          ? "bg-gray-800 border-gray-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-800"
      } border rounded-lg p-4 mb-6 shadow-sm`}
    >
      <h2 className="text-lg font-semibold mb-3">Attendance Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-3 border rounded text-center ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className={`p-3 border rounded text-center ${isDark ? "bg-green-900/50" : "bg-green-50"}`}>
          <p className="text-sm text-gray-400">Present</p>
          <p className="text-xl font-bold text-green-500">{stats.present}</p>
        </div>
        <div className={`p-3 border rounded text-center ${isDark ? "bg-red-900/50" : "bg-red-50"}`}>
          <p className="text-sm text-gray-400">Absent</p>
          <p className="text-xl font-bold text-red-500">{stats.absent}</p>
        </div>
      </div>
    </div>
  );
}