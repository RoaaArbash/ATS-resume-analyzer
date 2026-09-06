import { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { analyzeResume } from "../services/atsService";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export const useUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState("");

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

      let actualData = inputData;

      if (typeof actualData === "string") {
        text = actualData;
      }

      else if (actualData instanceof File) {
        if (actualData.size > 10 * 1024 * 1024) {
          setError(
            "File is too large. Maximum size is 10MB."
          );
          setLoading(false);
          return;
        }

        const arrayBuffer = await actualData.arrayBuffer();

        const pdf = await getDocument(
          new Uint8Array(arrayBuffer)
        ).promise;

        pdfInfo.pageCount = pdf.numPages;

        for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
          const page = await pdf.getPage(pageNo);

          const operatorList =
            await page.getOperatorList();

          if (
            operatorList.fnArray.includes(85) ||
            operatorList.fnArray.includes(88)
          ) {
            pdfInfo.hasImages = true;
          }

          const content =
            await page.getTextContent();

          text +=
            content.items
              .map((item) => item.str)
              .join(" ") + " ";
        }
      }

      text = text.trim();

      if (!text) {
        setError(
          "Please upload or paste a resume first."
        );
        setLoading(false);
        return;
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