import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DownloadPDFButton = () => {
  const handleDownload = () => {
    const input = document.getElementById("resume-section");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    });
  };

  return <button onClick={handleDownload}>Download as PDF</button>;
};

export default DownloadPDFButton;
