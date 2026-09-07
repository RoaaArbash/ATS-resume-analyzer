import { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { analyzeResume } from "../services/atsService";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export const useUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await getDocument(
      new Uint8Array(arrayBuffer)
    ).promise;

    let text = "";
    let hasImages = false;

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);

      const operatorList = await page.getOperatorList();

      if (
        operatorList.fnArray.includes(85) ||
        operatorList.fnArray.includes(88)
      ) {
        hasImages = true;
      }

      const content = await page.getTextContent();

      text +=
        content.items
          .map((item) => item.str)
          .join(" ") + " ";
    }

    return {
      text: text.trim(),
      pdfInfo: {
        pageCount: pdf.numPages,
        hasImages,
      },
    };
  };

  const extractTextFromImage = async (file) => {
    const result = await Tesseract.recognize(
      file,
      "eng",
      {
        logger: (message) => {
          console.log("OCR Progress:", message);
        },
      }
    );

    return result.data.text.trim();
  };

  const handleFileUpload = async (inputData) => {
    setLoading(true);
    setError(null);
    setExtractedText("");

    try {
      let text = "";

      let pdfInfo = {
        pageCount: 1,
        hasImages: false,
      };

      const actualData = inputData;

      // Pasted text
      if (typeof actualData === "string") {
        text = actualData.trim();
      }

      // Uploaded file
      else if (actualData instanceof File) {
        // File size validation
        if (actualData.size > 10 * 1024 * 1024) {
          throw new Error(
            "File is too large. Maximum size is 10MB."
          );
        }

        // PDF
        if (actualData.type === "application/pdf") {
          const pdfResult =
            await extractTextFromPdf(actualData);

          text = pdfResult.text;
          pdfInfo = pdfResult.pdfInfo;
        }

        // Images
        else if (
          actualData.type === "image/png" ||
          actualData.type === "image/jpeg" ||
          actualData.type === "image/jpg"
        ) {
          text = await extractTextFromImage(actualData);

          pdfInfo = {
            pageCount: 1,
            hasImages: true,
          };
        }

        else {
          throw new Error(
            "Unsupported file format. Please upload PDF, PNG, JPG, or JPEG."
          );
        }
      }

      text = text.trim();

      if (!text || text.length < 10) {
        throw new Error(
          "Could not extract enough text from this resume."
        );
      }

      setExtractedText(text);

      const analysis = analyzeResume(
        text,
        pdfInfo
      );

      const result = {
        ...analysis,
        extractedText: text,
        pdfInfo,
      };

      setFile({
        name:
          actualData instanceof File
            ? actualData.name
            : "Resume Text",

        result,
      });

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to process the uploaded resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    loading,
    error,
    extractedText,
    handleFileUpload,
  };
};