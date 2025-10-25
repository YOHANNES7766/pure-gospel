"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportMembersToPDF(ref, logoUrl = "") {
  try {
    const node = ref.current;
    if (!node) throw new Error("No element reference found.");

    // 🧼 Fix unsupported lab() color issues
    node.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.color.includes("lab(") || style.backgroundColor.includes("lab(")) {
        el.style.color = "black";
        el.style.backgroundColor = "white";
      }
    });

    const canvas = await html2canvas(node, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = margin + 60;
    let page = 1;
    const totalPages = Math.ceil(imgHeight / (pageHeight - 100));

    const drawHeader = async () => {
      const headerY = 30;

      // 🏷️ Optional Logo
      if (logoUrl) {
        try {
          const img = await fetch(logoUrl);
          const blob = await img.blob();
          const reader = new FileReader();
          await new Promise((res) => {
            reader.onload = () => {
              pdf.addImage(reader.result, "PNG", margin, 15, 40, 40);
              res();
            };
            reader.readAsDataURL(blob);
          });
        } catch {
          console.warn("⚠️ Could not load logo for header.");
        }
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Pure Gospel Church — Members Report", logoUrl ? 70 : margin, headerY);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, logoUrl ? 70 : margin, headerY + 15);

      pdf.setLineWidth(0.5);
      pdf.line(margin, headerY + 25, pageWidth - margin, headerY + 25);
    };

    const drawFooter = (pageNum) => {
      pdf.setFontSize(10);
      pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 60, pageHeight - 20);
    };

    await drawHeader();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    drawFooter(page);
    heightLeft -= pageHeight - 100;

    while (heightLeft > 0) {
      pdf.addPage();
      page++;
      await drawHeader();
      position = heightLeft - imgHeight + margin + 60;
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      drawFooter(page);
      heightLeft -= pageHeight - 100;
    }

    pdf.save("members_report.pdf");
  } catch (err) {
    console.error("❌ PDF Export Error:", err);
    alert("Failed to export PDF. Please try again.");
  }
}
