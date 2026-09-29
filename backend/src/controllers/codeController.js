import { ENV } from "../lib/env.js";

const LANGUAGE_MAP = {
  javascript: "nodejs",
  python: "python3",
  java: "java",
};

const VERSION_MAP = {
  nodejs: "4",
  python3: "4",
  java: "4",
};

async function executeWithPiston(language, code) {
  const pistonLang = language === "python" ? "python" : language === "javascript" ? "javascript" : "java";
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: pistonLang,
      version: "*",
      files: [{ content: code }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Piston API returned status ${response.status}`);
  }

  const data = await response.json();
  if (data.run) {
    const output = data.run.output || data.run.stderr || data.run.stdout || "Program finished with no output.";
    return {
      success: data.run.code === 0,
      output,
    };
  }
  throw new Error("Invalid response from Piston runner");
}

export const executeCode = async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ success: false, error: "Language and code are required." });
  }

  const jdoodleLang = LANGUAGE_MAP[language];
  if (!jdoodleLang) {
    return res.status(400).json({ success: false, error: `Unsupported language: ${language}` });
  }

  // If JDoodle credentials are available, try JDoodle first
  if (ENV.JDOODLE_CLIENT_ID && ENV.JDOODLE_CLIENT_SECRET) {
    try {
      const response = await fetch("https://api.jdoodle.com/v1/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: ENV.JDOODLE_CLIENT_ID,
          clientSecret: ENV.JDOODLE_CLIENT_SECRET,
          script: code,
          language: jdoodleLang,
          versionIndex: VERSION_MAP[jdoodleLang] || "0",
        }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        return res.json({ success: true, output: data.output || "No output" });
      }

      console.warn("⚠️ JDoodle returned non-200, attempting Piston fallback:", data.error || data.output);
    } catch (jdoodleErr) {
      console.warn("⚠️ JDoodle connection error, attempting Piston fallback:", jdoodleErr.message);
    }
  }

  // Fallback to high-availability Piston execution engine
  try {
    const result = await executeWithPiston(language, code);
    return res.json(result);
  } catch (pistonErr) {
    console.error("❌ Both JDoodle and Piston execution failed:", pistonErr);
    return res.status(500).json({
      success: false,
      error: "Code execution service is currently unavailable. Please try again in a few moments.",
    });
  }
};
