import Editor from "@monaco-editor/react";
import { CheckIcon, CopyIcon, Loader2Icon, PlayIcon, RotateCcwIcon, TypeIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isCollaborative = false,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onResetCode,
}) {
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const lineCount = useMemo(() => code?.split("\n").length || 0, [code]);
  const charCount = code?.length || 0;

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (onResetCode) {
      onResetCode();
      setShowResetConfirm(false);
      toast.success("Reset code to starter template");
    }
  };

  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex flex-wrap items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-base-100 border-t border-base-300 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage]?.icon || "/javascript.png"}
            alt={LANGUAGE_CONFIG[selectedLanguage]?.name || "Code"}
            className="size-5 sm:size-6"
          />
          <select
            className="select select-xs sm:select-sm text-xs sm:text-sm font-medium"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
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

          {/* Code stats */}
          {charCount > 0 && (
            <div className="hidden lg:flex items-center gap-1 text-xs text-base-content/50">
              <span>{lineCount} lines</span>
              <span className="opacity-50">•</span>
              <span>{charCount} chars</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Font Size Selector */}
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-xs sm:btn-sm gap-1 text-xs text-base-content/70"
              title="Change Font Size"
            >
              <TypeIcon className="size-3.5" />
              <span className="hidden sm:inline">{fontSize}px</span>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-1 shadow-lg bg-base-200 rounded-box w-24 text-xs z-30 border border-base-300"
            >
              {[12, 13, 14, 16, 18].map((size) => (
                <li key={size}>
                  <button
                    className={fontSize === size ? "active font-bold" : ""}
                    onClick={() => setFontSize(size)}
                  >
                    {size}px {fontSize === size && "✓"}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="btn btn-ghost btn-xs sm:btn-sm gap-1"
            title="Copy code to clipboard"
          >
            {copied ? (
              <CheckIcon className="size-3.5 text-success" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>

          {/* Reset Code */}
          {onResetCode && (
            <div className="relative">
              {showResetConfirm ? (
                <div className="flex items-center gap-1 bg-warning/10 p-0.5 rounded-lg border border-warning/30 animate-in fade-in">
                  <span className="text-[10px] text-warning px-1 font-semibold">Reset?</span>
                  <button
                    onClick={handleReset}
                    className="btn btn-warning btn-xs py-0 h-6 min-h-0 text-[11px]"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="btn btn-ghost btn-xs py-0 h-6 min-h-0 text-[11px]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="btn btn-ghost btn-xs sm:btn-sm gap-1 text-base-content/70 hover:text-warning"
                  title="Reset to starter code"
                >
                  <RotateCcwIcon className="size-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          )}

          {/* Run Code */}
          <button
            className="btn btn-primary btn-xs sm:btn-sm gap-1.5 sm:gap-2 ml-1"
            disabled={isRunning}
            onClick={onRunCode}
          >
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
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: fontSize,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: "on",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;