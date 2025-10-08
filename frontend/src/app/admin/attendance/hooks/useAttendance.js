"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import

export function useAttendance() {
  const [filter, setFilter] = useState({});
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });

  const API_BASE = "http://localhost:8000/api"; // Laravel backend

  // 🔹 Fetch attendance records
  const fetchRecords = async () => {
    try {
      const query = new URLSearchParams(filter).toString();
      const res = await fetch(`${API_BASE}/attendance?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch attendance");

      const data = await res.json();
      setRecords(
        data.map((r) => ({
          id: r.id,
          name: r.member?.full_name || "Unknown",
          phone: r.member?.phone || "",
          fellowship: r.fellowship_type || "-",
          category: r.member_category || "-",
          attendanceCategory: r.attendance_category || "-",
          status: r.status,
          date: new Date(r.date).toLocaleDateString(),
        }))
      );
    } catch (err) {
      console.error("❌ Error fetching attendance:", err);
    }
  };

  // 🔹 Fetch attendance stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/attendance/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, [filter]);

  // 🔹 CSV Export Helper
  const exportToCSV = (data, filename) => {
    if (!data.length) return alert("No data to export");

    const keys = Object.keys(data[0]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      keys.join(",") +
      "\n" +
      data.map((row) => keys.map((k) => `"${row[k] ?? ""}"`).join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔹 PDF Export Helper (fully fixed)
  const exportToPDF = (data, filename, title = "Attendance Report") => {
    if (!data.length) return alert("No data to export");

    const doc = new jsPDF();

    // 🏛 Header
    doc.setFontSize(18);
    doc.text("PURE GOSPEL CHURCH", 14, 15);
    doc.setFontSize(12);
    doc.text(title, 14, 23);
    doc.setDrawColor(22, 160, 133);
    doc.line(14, 25, 195, 25);

    // 🧾 Table
    const headers = [Object.keys(data[0])];
    const rows = data.map((obj) => Object.values(obj));

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 248, 255] },
    });

    // 🦶 Footer
    const date = new Date().toLocaleString();
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, pageHeight - 10);
    doc.text("Powered by Pure Gospel Attendance System", 140, pageHeight - 10);

    doc.save(`${filename}.pdf`);
  };

  // 🔹 Export helpers
  const exportCSV = () => exportToCSV(records, "attendance_records.csv");
  const summaryCSV = () => exportToCSV([stats], "attendance_summary.csv");

  const exportPDF = () =>
    exportToPDF(records, "attendance_records", "Attendance Report");

  const summaryPDF = () =>
    exportToPDF([stats], "attendance_summary", "Attendance Summary");

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
