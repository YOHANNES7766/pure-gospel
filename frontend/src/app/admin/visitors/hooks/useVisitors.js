// hooks/useVisitors.js
"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useVisitors() {
  const [filter, setFilter] = useState({
    search: "",
    purpose: "",
    from: "",
    to: "",
  });
  const [allRecords, setAllRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, week: 0, month: 0 });
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8000/api"; // Laravel backend

  // Fetch visitor records from backend
  const fetchRecords = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const res = await fetch(`${API_BASE}/visitors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        let message = `Error: ${res.status} ${res.statusText}`;
        try {
          const data = await res.json();
          message = data.message || data.error || message;
        } catch {}
        setError(message);
        return;
      }

      const data = await res.json();
      const mapped = data.map((r) => ({
        id: r.id,
        name: r.member?.full_name || "Unknown",
        contact: r.member?.phone || r.member?.email || "",
        purpose: r.remarks || "",
        date: new Date(r.visit_date).toLocaleDateString(),
        dateObj: new Date(r.visit_date),
        status: r.visit_status,
      }));

      setAllRecords(mapped);
    } catch (err) {
      console.error("❌ Error fetching visitors:", err);
      setError("Network error: Could not connect to the server.");
    }
  };

  // Apply frontend filtering
  useEffect(() => {
    let filtered = [...allRecords];

    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.contact.toLowerCase().includes(search)
      );
    }

    if (filter.purpose) {
      const purpose = filter.purpose.toLowerCase();
      filtered = filtered.filter((r) => r.purpose.toLowerCase().includes(purpose));
    }

    if (filter.from) {
      const fromDate = new Date(filter.from);
      filtered = filtered.filter((r) => r.dateObj >= fromDate);
    }

    if (filter.to) {
      const toDate = new Date(filter.to);
      filtered = filtered.filter((r) => r.dateObj <= toDate);
    }

    setRecords(filtered);
  }, [filter, allRecords]);

  // Compute stats locally from filtered records
  useEffect(() => {
    const now = new Date();
    const total = records.length;
    const week = records.filter((r) => (now - r.dateObj) / (1000 * 60 * 60 * 24) <= 7).length;
    const month = records.filter(
      (r) =>
        r.dateObj.getMonth() === now.getMonth() && r.dateObj.getFullYear() === now.getFullYear()
    ).length;

    setStats({ total, week, month });
  }, [records]);

  // Fetch all records on mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // ===== CSV & PDF EXPORTS =====

  const exportToCSV = (data, filename) => {
    if (!data.length) return alert("No data to export");

    const keys = ["name", "contact", "purpose", "date"];
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

  const exportRecordsToPDF = (data, filename, title = "Visitors Report") => {
    if (!data.length) return alert("No data to export");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("PURE GOSPEL CHURCH", 14, 15);
    doc.setFontSize(12);
    doc.text(title, 14, 23);
    doc.setDrawColor(22, 160, 133);
    doc.line(14, 25, 195, 25);

    const headers = [["Name & Contact", "Purpose", "Visit Date"]];
    const rows = data.map((r) => [
      `${r.name}\n${r.contact}`,
      r.purpose,
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

  const exportSummaryToPDF = (stats, filename, title = "Visitors Summary") => {
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
      ["This Week", stats.week || 0],
      ["This Month", stats.month || 0],
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

  const exportCSV = () => exportToCSV(records, "visitors_records.csv");
  const exportPDF = () =>
    exportRecordsToPDF(records, "visitors_records", "Visitors Report");
  const summaryCSV = () => exportToCSV([stats], "visitors_summary.csv");
  const summaryPDF = () =>
    exportSummaryToPDF(stats, "visitors_summary", "Visitors Summary");

  const deleteVisitor = async (id) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const res = await fetch(`${API_BASE}/visitors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        let message = `Error deleting visitor: ${res.status} ${res.statusText}`;
        try {
          const data = await res.json();
          message = data.message || data.error || message;
        } catch {}
        setError(message);
        return;
      }
      // Refresh records
      fetchRecords();
    } catch (err) {
      console.error("❌ Error deleting visitor:", err);
      setError("Network error: Could not connect to the server.");
    }
  };

  return {
    records,
    stats,
    filter,
    setFilter,
    exportCSV,
    exportPDF,
    summaryCSV,
    summaryPDF,
    deleteVisitor,
    fetchRecords,
    error,
  };
}