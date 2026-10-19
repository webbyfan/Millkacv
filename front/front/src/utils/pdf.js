import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Universal robust PDF exporter for resume elements.
 * Works with visible elements, child .resume-template elements, and off-screen containers.
 */
export async function exportElementToPdf(element, fileName = "resume.pdf") {
  if (!element) {
    throw new Error("Resume element is not available for PDF export.");
  }

  // Locate the actual template element if element is a wrapper container
  const targetElement = element.querySelector?.(".resume-template") || element;

  // Create an off-screen staging container with standard A4 desktop width (850px)
  // This avoids responsive layout squishing, overflow:hidden clipping, and scrollbar interference
  const stagingContainer = document.createElement("div");
  stagingContainer.style.position = "fixed";
  stagingContainer.style.left = "-9999px";
  stagingContainer.style.top = "0";
  stagingContainer.style.width = "850px";
  stagingContainer.style.minHeight = "1100px";
  stagingContainer.style.zIndex = "-9999";
  stagingContainer.style.backgroundColor = "#ffffff";
  stagingContainer.style.overflow = "visible";
  stagingContainer.style.boxSizing = "border-box";

  // Deep clone the resume element
  const clone = targetElement.cloneNode(true);
  clone.style.width = "850px";
  clone.style.maxWidth = "850px";
  clone.style.minHeight = "auto";
  clone.style.height = "auto";
  clone.style.overflow = "visible";
  clone.style.boxShadow = "none";
  clone.style.margin = "0";

  stagingContainer.appendChild(clone);
  document.body.appendChild(stagingContainer);

  try {
    // Small delay to ensure browser layout and fonts are computed in clone
    await new Promise((resolve) => setTimeout(resolve, 150));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Failed to render resume canvas.");
    }

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

    let remainingHeight = pdfHeight - pageHeight;
    while (remainingHeight > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      remainingHeight -= pageHeight;
    }

    const safeFileName = fileName ? (fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`) : "resume.pdf";
    pdf.save(safeFileName);
    return true;
  } finally {
    if (document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
    }
  }
}
