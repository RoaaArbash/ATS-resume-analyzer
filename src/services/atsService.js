// src/services/atsService.js

const ESSENTIAL_SECTIONS = {
  experienceOrProjects: /(experience|work experience|employment|professional history|projects)/i,
  education: /(education|academic background|qualifications)/i,
  skills: /(skills|technical skills|core competencies|expertise)/i,
};

const RECOMMENDED_SECTIONS = {
  summary: /(professional summary|summary|professional profile|profile|career objective|objective)/i,
  projects: /(projects|portfolio|personal projects)/i,
  certifications: /(certifications|licenses|certificates)/i,
};

const NON_STANDARD_HEADINGS = [
  /my journey/i,
  /my story/i,
  /my superpowers/i,
  /what i can do/i,
  /things i love/i,
  /about me/i,
  /who am i/i,
  /my expertise/i,
  /career highlights/i,
];

const SKILL_DATABASE = {
  frontend: ["javascript", "typescript", "react", "vue", "angular", "html", "css", "tailwind", "next.js", "redux"],
  backend: ["node.js", "python", "java", "c++", "c#", "php", "laravel", "sql", "mysql", "mongodb", "api", "rest", "graphql"],
  data: ["python", "pandas", "numpy", "scikit-learn", "tensorflow", "sql", "tableau", "power bi", "machine learning"],
  design: ["figma", "adobe xd", "photoshop", "illustrator", "ui/ux", "wireframing"],
  marketing: ["seo", "google analytics", "content marketing", "crm", "hubspot", "social media", "email marketing", "ppc"],
  business: ["project management", "agile", "scrum", "leadership", "strategy", "data analysis", "budgeting"]
};

const ALL_GENERAL_SKILLS = Object.values(SKILL_DATABASE).flat();

const ACTION_VERBS = [
  "developed", "built", "engineered", "implemented", "designed", "optimized",
  "managed", "led", "created", "resolved", "improved", "integrated", "deployed",
  "executed", "spearheaded", "analyzed", "increased", "reduced", "delivered"
];

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const containsKeyword = (text, keyword) => {
  try {
    const escaped = escapeRegExp(keyword);
    const regex = new RegExp(
      `(^|\\s|[^a-zA-Z0-9])${escaped}(?=$|\\s|[^a-zA-Z0-9])`,
      "i"
    );
    return regex.test(text);
  } catch (e) {
    return false;
  }
};

const extractKeywordsFromJD = (jdText) => {
  if (!jdText || jdText.trim().length === 0) return [];
  const normalizedJD = jdText.toLowerCase();
  const matchedSkills = ALL_GENERAL_SKILLS.filter((skill) =>
    containsKeyword(normalizedJD, skill)
  );
  return [...new Set(matchedSkills)];
};

const detectKeywordStuffing = (text, keywords, wordCount) => {
  const stuffedKeywords = [];
  if (wordCount === 0) return stuffedKeywords;

  keywords.forEach((keyword) => {
    try {
      const escaped = escapeRegExp(keyword);
      const matches = text.match(new RegExp(`\\b${escaped}\\b`, "gi"));
      if (matches && matches.length > 0) {
        const frequencyRatio = matches.length / wordCount;
        if (frequencyRatio > 0.03) {
          stuffedKeywords.push(keyword);
        }
      }
    } catch (e) {
      // ignore
    }
  });
  return stuffedKeywords;
};

const getCompatibilityLevel = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Needs Improvement";
  return "Poor ATS Compatibility";
};

export const analyzeResume = (extractedText, pdfInfo = {}, jobDescription = "") => {
  const issuesSet = new Set();
  const strengthsSet = new Set();

  if (!extractedText || extractedText.trim().length < 10) {
    return {
      finalScore: 0,
      compatibilityLevel: "Poor ATS Compatibility",
      breakdown: { formatScore: 0, contactScore: 0, sectionsScore: 0, keywordScore: 0, skillsScore: 0, experienceScore: 0, formattingScore: 0 },
      issues: ["Could not extract enough text to analyze."],
      strengths: [],
      matchedKeywords: [],
      missingKeywords: [],
      isCompatible: false,
      extractedText: "",
      pdfInfo,
    };
  }

  const text = extractedText.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let formatScore = 10;
  let contactScore = 15;
  let sectionsScore = 15;
  let keywordScore = 25;
  let skillsScore = 15;
  let experienceScore = 10;
  let formattingScore = 10;

  if (pdfInfo.pageCount > 1) {
    formatScore -= 10;
    issuesSet.add("Resume exceeds one page. Ideally, it should be kept to a single page.");
  } else {
    strengthsSet.add("Resume length is concise and fits on a single page.");
  }

  if (pdfInfo.hasImages) {
    issuesSet.add("Resume contains images or non-text elements, which may cause ATS parsing issues.");
    formattingScore -= 10;
  }

  if (wordCount < 80) {
    issuesSet.add("Resume content is too short for comprehensive ATS parsing.");
    formatScore -= 5;
  }

  const hasEmail = /[@].+\.[a-z]{2,}/i.test(extractedText);
  const hasPhone = /(\+?\d{10,}|00\d{10,}|[0-9\-\s()]{8,})/i.test(extractedText);
  const hasLinkedIn = /linkedin\.com/i.test(text);
  const hasCandidateName = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.test(extractedText);

  if (!hasCandidateName && !hasEmail) {
    issuesSet.add("Missing candidate name or contact information.");
    contactScore -= 10;
  }

  if (!hasEmail) {
    issuesSet.add("Missing a professional email address.");
    contactScore -= 5;
  }
  if (!hasPhone) {
    issuesSet.add("Missing phone number.");
    contactScore -= 5;
  }
  if (!hasLinkedIn) {
    issuesSet.add("Missing LinkedIn profile link.");
    contactScore -= 5;
  }

  contactScore = Math.max(0, contactScore);

  const hasSkillsSection = ESSENTIAL_SECTIONS.skills.test(text);
  const hasExpOrProjSection = ESSENTIAL_SECTIONS.experienceOrProjects.test(text);
  const hasEducationSection = ESSENTIAL_SECTIONS.education.test(text);
  const hasSummarySection = RECOMMENDED_SECTIONS.summary.test(text);

  if (hasSummarySection) {
    const summaryMatch = text.match(RECOMMENDED_SECTIONS.summary);
    if (summaryMatch) {
      const summarySnippet = text.slice(summaryMatch.index, summaryMatch.index + 150);
      if (summarySnippet.length < 40 || /hard worker|like programming|good worker|motivated/i.test(summarySnippet)) {
        issuesSet.add("Professional summary lacks relevant professional details or technical keywords.");
        sectionsScore -= 5;
      } else {
        strengthsSet.add("Professional summary is well-structured.");
      }
    }
  } else {
    issuesSet.add("Missing Professional Summary section.");
    sectionsScore -= 5;
  }

  if (!hasEducationSection) {
    issuesSet.add("Missing essential section: EDUCATION");
    sectionsScore -= 5;
  }

  sectionsScore = Math.max(0, sectionsScore);

  if (!hasExpOrProjSection) {
    issuesSet.add("Missing essential section: EXPERIENCE / PROJECTS");
    experienceScore -= 10;
  } else {
    const expMatch = text.match(RECOMMENDED_SECTIONS.projects) || text.match(/experience|work history|employment/i);
    if (expMatch) {
      const expSnippet = text.slice(expMatch.index, expMatch.index + 250);
      const hasActionVerb = ACTION_VERBS.some(verb => expSnippet.includes(verb));
      if (/worked on websites|did tasks|job description/i.test(expSnippet) && !hasActionVerb) {
        issuesSet.add("Work experience lacks sufficient detail or measurable achievements.");
        experienceScore -= 5;
      } else {
        strengthsSet.add("Experience/Projects section contains solid professional details.");
      }
    }
  }
  experienceScore = Math.max(0, experienceScore);

  if (!hasSkillsSection) {
    issuesSet.add("Missing essential section: SKILLS");
    skillsScore -= 15;
  } else {
    const genericTerms = ["computer", "internet", "microsoft", "coding", "software basics"];
    const foundGenerics = genericTerms.filter(term => text.includes(term));
    if (foundGenerics.length >= 2) {
      issuesSet.add("Skills section contains generic terms and lacks relevant technical keywords.");
      skillsScore -= 5;
    } else {
      strengthsSet.add("Skills section is present.");
    }
  }
  skillsScore = Math.max(0, skillsScore);

  NON_STANDARD_HEADINGS.forEach((regex) => {
    if (regex.test(text)) {
      issuesSet.add("Consider using a standard section heading instead of creative/non-standard titles.");
      formattingScore -= 5;
    }
  });
  formattingScore = Math.max(0, formattingScore);

  let targetKeywords = [];
  let matchedKeywords = [];
  let missingKeywords = [];

  if (jobDescription && jobDescription.trim().length > 0) {
    targetKeywords = extractKeywordsFromJD(jobDescription);
    matchedKeywords = targetKeywords.filter(kw => containsKeyword(text, kw));
    missingKeywords = targetKeywords.filter(kw => !containsKeyword(text, kw));

    if (targetKeywords.length > 0) {
      const matchRatio = matchedKeywords.length / targetKeywords.length;
      if (matchRatio < 0.5) {
        const penalty = Math.round((0.5 - matchRatio) * 20);
        keywordScore -= penalty;
        issuesSet.add(`Low keyword match with job description (${Math.round(matchRatio * 100)}%). Missing key skills.`);
      } else {
        strengthsSet.add(`Good keyword alignment with job description (${Math.round(matchRatio * 100)}%).`);
      }
    }

    const stuffed = detectKeywordStuffing(text, targetKeywords, wordCount);
    if (stuffed.length > 0) {
      issuesSet.add(`Keyword stuffing detected for terms: ${stuffed.join(", ")}.`);
      keywordScore -= 5;
    }
  }
  keywordScore = Math.max(0, keywordScore);

  let finalScore = formatScore + contactScore + sectionsScore + keywordScore + skillsScore + experienceScore + formattingScore;
  finalScore = Math.max(0, Math.min(100, finalScore));
  const compatibilityLevel = getCompatibilityLevel(finalScore);

  return {
    finalScore,
    compatibilityLevel,
    breakdown: {
      formatScore,
      contactScore,
      sectionsScore,
      keywordScore,
      skillsScore,
      experienceScore,
      formattingScore,
    },
    issues: Array.from(issuesSet),
    strengths: Array.from(strengthsSet),
    matchedKeywords,
    missingKeywords,
    isCompatible: finalScore >= 70,
    extractedText,
    pdfInfo,
  };
};