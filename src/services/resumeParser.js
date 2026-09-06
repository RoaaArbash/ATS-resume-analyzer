// src/services/resumeParser.js

export const parseResume = (text = "") => {
  const resume = {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
  };

  if (!text.trim()) return resume;

  const cleanText = text.replace(/\r/g, "").trim();

  const lines = cleanText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  resume.name = lines[0] || "";

  const emailMatch = cleanText.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );

  if (emailMatch) {
    resume.email = emailMatch[0];
  }

  const phoneMatch = cleanText.match(
    /(\+?\d[\d\s\-()]{7,})/
  );

  if (phoneMatch) {
    resume.phone = phoneMatch[0];
  }

  
  const linkedinMatch = cleanText.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i
  );

  if (linkedinMatch) {
    resume.linkedin = linkedinMatch[0];
  }

  
  const extractSection = (titles) => {
    const regex = new RegExp(
      `(?:${titles.join("|")})\\s*([\\s\\S]*?)(?=summary|profile|skills|technical skills|experience|work experience|education|projects|certifications|$)`,
      "i"
    );

    const match = cleanText.match(regex);

    if (!match) return "";

    return match[1].trim();
  };

  resume.summary = extractSection([
    "summary",
    "professional summary",
    "profile",
    "objective",
  ]);

  const skills = extractSection([
    "skills",
    "technical skills",
  ]);

  if (skills) {
    resume.skills = skills
      .split(/\n|,|•|·|\|/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const experience = extractSection([
    "experience",
    "work experience",
    "professional experience",
  ]);

  if (experience) {
    resume.experience = experience
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

 
  const education = extractSection([
    "education",
  ]);

  if (education) {
    resume.education = education
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const projects = extractSection([
    "projects",
    "personal projects",
    "portfolio",
  ]);

  if (projects) {
    resume.projects = projects
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return resume;
};