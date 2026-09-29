import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isCollaborative = false,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage]?.icon || "/javascript.png"}
            alt={LANGUAGE_CONFIG[selectedLanguage]?.name || "Code"}
            className="size-5 sm:size-6"
          />
          <select className="select select-xs sm:select-sm text-xs sm:text-sm" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>

          {isCollaborative && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/30 text-success text-xs font-medium">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              <span>Live Sync</span>
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-xs sm:btn-sm gap-1.5 sm:gap-2" disabled={isRunning} onClick={onRunCode}>
          {isRunning ? (
            <>
              <Loader2Icon className="size-3.5 sm:size-4 animate-spin" />
              <span className="text-xs sm:text-sm">Running...</span>
            </>
          ) : (
            <>
              <PlayIcon className="size-3.5 sm:size-4" />
              <span className="text-xs sm:text-sm">Run Code</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;