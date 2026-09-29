import { format } from "date-fns";

const RATING_NAMES = {
  strong_hire: "Strong Hire (Top Candidate)",
  hire: "Hire (Meets All Bar Requirements)",
  lean_hire: "Lean Hire (Minor Areas for Growth)",
  lean_no_hire: "Lean No Hire (Below Standard)",
  no_hire: "No Hire (Does Not Meet Bar)",
};

/**
 * Generates a clean, professional Markdown report for an interview session.
 */
export function generateSessionMarkdown(session) {
  if (!session) return "";

  const dateStr = session.createdAt
    ? format(new Date(session.createdAt), "MMMM d, yyyy 'at' h:mm a")
    : "N/A";

  const durationStr = session.duration
    ? `${session.duration} minutes`
    : "Not recorded";

  const hostName = session.host?.name || "Interviewer";
  const candidateName = session.participant?.name || "Candidate (Unassigned)";
  const ratingText = session.rating
    ? RATING_NAMES[session.rating] || session.rating
    : "No recommendation recorded";

  const lang = session.language || "javascript";
  const code = session.finalCode?.trim() || "// No code snapshot recorded";
  const output = session.executionOutput?.trim() || "No execution output recorded";
  const notes = session.notes?.trim() || "No detailed notes provided";

  return `# Technical Interview Evaluation Report

**Platform:** Intervue Collaborative Assessment  
**Session ID:** \`${session._id || session.id || "N/A"}\`  
**Date:** ${dateStr}  
**Duration:** ${durationStr}  

---

## 📋 Session Overview

| Field | Details |
| :--- | :--- |
| **Problem Title** | **${session.problem || "Interview Problem"}** |
| **Difficulty** | ${(session.difficulty || "medium").toUpperCase()} |
| **Interviewer (Host)** | ${hostName} (${session.host?.email || "N/A"}) |
| **Candidate** | ${candidateName} (${session.participant?.email || "N/A"}) |
| **Final Recommendation** | **${ratingText}** |

---

## 📝 Interviewer Evaluation & Notes

${notes}

---

## 💻 Candidate Code Snapshot (\`${lang}\`)

\`\`\`${lang}
${code}
\`\`\`

---

## ⚡ Execution Output & Test Results

\`\`\`
${output}
\`\`\`

---
*Report generated automatically by Intervue on ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}*
`;
}

/**
 * Downloads the interview report as a Markdown (.md) file to user's computer.
 */
export function downloadSessionReport(session) {
  const markdown = generateSessionMarkdown(session);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const sanitizedProblem = (session.problem || "session")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
  const dateTag = session.createdAt
    ? format(new Date(session.createdAt), "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  link.href = url;
  link.download = `interview-report-${sanitizedProblem}-${dateTag}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the full markdown report to the clipboard.
 */
export async function copySessionReportToClipboard(session) {
  const markdown = generateSessionMarkdown(session);
  await navigator.clipboard.writeText(markdown);
}
