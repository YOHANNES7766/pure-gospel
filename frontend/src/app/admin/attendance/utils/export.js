// src/utils/export.js
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Export to CSV
export function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const csvContent =
    "data:text/csv;charset=utf-8," +
    Object.keys(data[0]).join(",") +
    "\n" +
    data.map((row) => Object.values(row).join(",")).join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ✅ Export to PDF (using jsPDF)
export function exportToPDF(data, filename) {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text(filename, 14, 15);

  // Table
  const headers = [Object.keys(data[0])];
  const rows = data.map((obj) => Object.values(obj));

  doc.autoTable({
    startY: 25,
    head: headers,
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [22, 160, 133] },
    styles: { fontSize: 10 },
  });

  // Save
  doc.save(`${filename}.pdf`);
}
