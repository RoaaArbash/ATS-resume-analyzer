// src/services/atsService.js

export const analyzeResume = (text) => {
  const score = calculateScore(text);
  
  return {
    score: score,
    suggestions: [
      text.includes("React") ? "Great! React skills detected." : "Consider adding React skills.",
      text.length > 500 ? "Your CV content is detailed enough." : "Your CV is too short, add more project details.",
      text.includes("roarb@gmail.com") ? "Contact info found." : "Make sure to include your email."
    ],
    status: score > 60 ? "Strong Match" : "Needs Improvement"
  };
};

const calculateScore = (text) => {
  let score = 50; // نقطة البداية
  if (text.includes("React")) score += 20;
  if (text.includes("Laravel")) score += 20;
  if (text.includes("Education")) score += 10;
  return Math.min(score, 100);
};