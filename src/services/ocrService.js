// src/services/ocrService.js
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export const extractTextFromFile = async (file) => {
  if (file.type === 'application/pdf') {
    return await extractFromPDF(file);
  } else if (file.type.startsWith('image/')) {
    return await extractFromImage(file);
  }
  return "";
};

const extractFromImage = async (file) => {
  const { data: { text } } = await Tesseract.recognize(file, 'eng');
  return text;
};

const extractFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(" ");
  }
  return fullText;
};