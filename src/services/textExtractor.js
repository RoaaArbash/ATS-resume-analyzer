import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const extractTextFromFile = async (file) => {

  // PDF
  if (file.type === "application/pdf") {

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    let hasImages = false;

    for (let i = 1; i <= pdf.numPages; i++) {

      const page = await pdf.getPage(i);

      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";

      const ops = await page.getOperatorList();

      if (
        ops.fnArray.includes(pdfjsLib.OPS.paintImageXObject) ||
        ops.fnArray.includes(pdfjsLib.OPS.paintJpegXObject)
      ) {
        hasImages = true;
      }
    }

    return {
      text: fullText,
      pageCount: pdf.numPages,
      hasImages,
      hasText: fullText.trim().length > 0
    };
  }

  const {
    data: { text }
  } = await Tesseract.recognize(file, "eng");

  return {
    text,
    pageCount: 1,
    hasImages: true,
    hasText: text.trim().length > 0
  };
};