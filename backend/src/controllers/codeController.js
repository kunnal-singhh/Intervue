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

export const executeCode = async (req, res) => {
  const { language, code } = req.body;
  
  if (!language || !code) {
    return res.status(400).json({ success: false, error: "Language and code are required." });
  }

  const jdoodleLang = LANGUAGE_MAP[language];
  if (!jdoodleLang) {
    return res.status(400).json({ success: false, error: `Unsupported language: ${language}` });
  }

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
      res.json({ success: true, output: data.output || "No output" });
    } else {
      res.json({ success: false, error: data.error || data.output || "Execution failed" });
    }
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({ success: false, error: "Failed to connect to execution server." });
  }
};
