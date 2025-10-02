import { useState } from "react";
import { exportToCSV, exportToPDF } from "../utils/attendanceUtils";

export function useAttendance() {
  const [filter, setFilter] = useState({});
  const [records] = useState([
    {
      name: "Yohannes Dawit Bireda",
      fellowship: "sunday",
      category: "Regular",
      attendanceCategory: "late",
      status: "Present",
      date: "2025-10-02",
    },
  ]);

  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === "Present").length,
    absent: records.filter((r) => r.status !== "Present").length,
  };

  const exportCSV = () => exportToCSV(records, "attendance.csv");
  const exportPDF = () => exportToPDF(records, "attendance.pdf");
  const summaryCSV = () => exportToCSV(stats, "summary.csv");
  const summaryPDF = () => exportToPDF(stats, "summary.pdf");

  return {
    records,
    stats,
    filter,
    setFilter,
    exportCSV,
    exportPDF,
    summaryCSV,
    summaryPDF,
  };
}
