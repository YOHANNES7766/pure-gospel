export function exportToCSV(data, filename) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    Object.keys(data[0])
      .join(",") +
    "\n" +
    data.map((row) => Object.values(row).join(",")).join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data, filename) {
  // Dummy implementation for now
  alert(`PDF export for ${filename} not implemented yet`);
}
