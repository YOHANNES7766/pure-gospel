// hooks/useAttendance.js (modified)
"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useAttendance() {
  const [filter, setFilter] = useState({
    date: "",
    fellowship_type: "",
    member: "",
  });
  const [allRecords, setAllRecords] = useState([]); // store all data from API
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });

  const API_BASE = "http://localhost:8000/api"; // Laravel backend

  // Fetch all attendance records from backend (no filters in query)
  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_BASE}/attendance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch attendance");

      const data = await res.json();
      const mapped = data.map((r) => ({
        id: r.id,
        name: r.member?.full_name || "Unknown",
        phone: r.member?.phone || "",
        fellowship: r.fellowship_type || "-",
        category: r.member_category || "-",
        attendanceCategory: r.attendance_category || "-",
        status: r.status,
        date: new Date(r.date).toLocaleDateString(),
      }));

      setAllRecords(mapped);
    } catch (err) {
      console.error("❌ Error fetching attendance:", err);
    }
  };

  // Apply all filters locally (date, fellowship_type, member)
  useEffect(() => {
    let filtered = [...allRecords];

    if (filter.date) {
      const selectedDate = new Date(filter.date).toLocaleDateString();
      filtered = filtered.filter((r) => r.date === selectedDate);
    }

    if (filter.fellowship_type) {
      filtered = filtered.filter((r) => r.fellowship === filter.fellowship_type);
    }

    if (filter.member) {
      const search = filter.member.toLowerCase();
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(search));
    }

    setRecords(filtered);
  }, [allRecords, filter]);

  // Compute stats locally from filtered records
  useEffect(() => {
    const present = records.filter((r) => r.status === "Present").length;
    const absent = records.filter((r) => r.status === "Absent").length;
    const total = records.length;

    setStats({ total, present, absent });
  }, [records]);

  // Fetch all records on mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // ===== CSV & PDF EXPORTS (same as before) =====

  const exportToCSV = (data, filename) => {
    if (!data.length) return alert("No data to export");

    const keys = Object.keys(data[0]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      keys.join(",") +
      "\n" +
      data
        .map((row) =>
          keys
            .map(
              (k) =>
                `"${typeof row[k] === "object" && row[k] !== null
                  ? JSON.stringify(row[k])
                  : row[k] ?? ""}"`
            )
            .join(",")
        )
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRecordsToPDF = (data, filename, title = "Attendance Report") => {
    if (!data.length) return alert("No data to export");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("PURE GOSPEL CHURCH", 14, 15);
    doc.setFontSize(12);
    doc.text(title, 14, 23);
    doc.setDrawColor(22, 160, 133);
    doc.line(14, 25, 195, 25);

    const headers = [
      [
        "Member Name",
        "Fellowship Type",
        "Member Category",
        "Attendance Category",
        "Status",
        "Date",
      ],
    ];
    const rows = data.map((r) => [
      r.name,
      r.fellowship,
      r.category,
      r.attendanceCategory,
      r.status,
      r.date,
    ]);

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 248, 255] },
    });

    const date = new Date().toLocaleString();
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, pageHeight - 10);
    doc.text("Powered by Pure Gospel Attendance System", 140, pageHeight - 10);
    doc.save(`${filename}.pdf`);
  };

  const exportSummaryToPDF = (stats, filename, title = "Attendance Summary") => {
    if (!stats) return alert("No data to export");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("PURE GOSPEL CHURCH", 14, 15);
    doc.setFontSize(12);
    doc.text(title, 14, 23);
    doc.setDrawColor(22, 160, 133);
    doc.line(14, 25, 195, 25);

    let startY = 30;
    doc.setFontSize(14);
    doc.text("Overall Summary", 14, startY);
    startY += 7;

    const overallHeaders = [["Metric", "Count"]];
    const overallRows = [
      ["Total", stats.total || 0],
      ["Present", stats.present || 0],
      ["Absent", stats.absent || 0],
    ];

    autoTable(doc, {
      startY,
      head: overallHeaders,
      body: overallRows,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 248, 255] },
    });

    const date = new Date().toLocaleString();
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, pageHeight - 10);
    doc.text("Powered by Pure Gospel Attendance System", 140, pageHeight - 10);
    doc.save(`${filename}.pdf`);
  };

  const exportCSV = () => exportToCSV(records, "attendance_records.csv");
  const summaryCSV = () => exportToCSV([stats], "attendance_summary.csv");
  const exportPDF = () =>
    exportRecordsToPDF(records, "attendance_records", "Attendance Report");
  const summaryPDF = () =>
    exportSummaryToPDF(stats, "attendance_summary", "Attendance Summary");

  return {
    records,
    stats,
    filter,
    setFilter,
    exportCSV,
    exportPDF,
    summaryCSV,
    summaryPDF,
    fetchRecords, // Expose for manual refresh via Filter button
  };
}