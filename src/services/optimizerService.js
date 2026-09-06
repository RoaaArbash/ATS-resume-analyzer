// src/services/optimizerService.js

export const generateOptimizedContent = (
  issues = [],
  extractedText = ""
) => {
  let finalCVText = extractedText || "";
  const changesLog = [];

  if (!finalCVText.trim()) {
    return {
      finalCVText:
        "No resume text found. Please upload your resume again.",
      changesLog: [
        "Unable to optimize because no resume text was found.",
      ],
    };
  }

  finalCVText = finalCVText
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  changesLog.push(
    "Cleaned extra spaces and unnecessary blank lines."
  );

  const hasPhotoIssue = issues.some((issue) => {
    const text = issue.toLowerCase();

    return (
      text.includes("photo") ||
      text.includes("image") ||
      text.includes("picture")
    );
  });

  if (hasPhotoIssue) {
    finalCVText = finalCVText
      .split("\n")
      .filter((line) => {
        const value = line.toLowerCase();

        return (
          !value.includes("photo") &&
          !value.includes("picture") &&
          !value.includes("image")
        );
      })
      .join("\n");

    changesLog.push(
      "Removed photo-related content for ATS compatibility."
    );
  }



  const standardTitles = {
    "professional summary": "PROFESSIONAL SUMMARY",
    summary: "PROFESSIONAL SUMMARY",

    skills: "TECHNICAL SKILLS",

    experience: "WORK EXPERIENCE",

    "work experience": "WORK EXPERIENCE",

    education: "EDUCATION",

    projects: "PROJECTS",

    certifications: "CERTIFICATIONS",
  };

  Object.entries(standardTitles).forEach(([oldTitle, newTitle]) => {
    const regex = new RegExp(`^${oldTitle}$`, "gim");

    finalCVText = finalCVText.replace(regex, newTitle);
  });

  changesLog.push(
    "Standardized resume section headings."
  );

  if (
    issues.some((issue) =>
      issue.toLowerCase().includes("one page")
    )
  ) {
    changesLog.push(
      "Resume length reviewed to better fit one-page ATS recommendations."
    );
  }

  if (
    issues.some((issue) =>
      issue.toLowerCase().includes("linkedin")
    )
  ) {
    changesLog.push(
      "Consider adding your LinkedIn profile."
    );
  }

  if (
    issues.some((issue) =>
      issue.toLowerCase().includes("email")
    )
  ) {
    changesLog.push(
      "Consider adding a professional email address."
    );
  }

  issues.forEach((issue) => {
    if (issue.startsWith("Missing section")) {
      changesLog.push(issue);
    }
  });

  return {
    finalCVText,
    changesLog,
  };
};