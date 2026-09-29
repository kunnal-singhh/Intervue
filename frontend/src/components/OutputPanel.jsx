import { PlayIcon, TerminalIcon, Trash2Icon, VariableIcon } from "lucide-react";
import { useState } from "react";

function OutputPanel({ output, customInput = "", onCustomInputChange, onClearOutput }) {
  const [activeTab, setActiveTab] = useState("output");

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* TABS HEADER */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-base-200 border-b border-base-300">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("output")}
            className={`btn btn-xs gap-1.5 ${
              activeTab === "output" ? "btn-primary" : "btn-ghost text-base-content/70"
            }`}
          >
            <TerminalIcon className="size-3.5" />
            <span>Output</span>
          </button>

          {onCustomInputChange && (
            <button
              onClick={() => setActiveTab("input")}
              className={`btn btn-xs gap-1.5 ${
                activeTab === "input" ? "btn-primary" : "btn-ghost text-base-content/70"
              }`}
            >
              <VariableIcon className="size-3.5" />
              <span>Custom Input</span>
              {customInput.trim() && (
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
              )}
            </button>
          )}
        </div>

        {activeTab === "output" && output && onClearOutput && (
          <button
            onClick={onClearOutput}
            className="btn btn-ghost btn-xs gap-1 text-base-content/60 hover:text-error"
            title="Clear output"
          >
            <Trash2Icon className="size-3" />
            <span className="text-xs">Clear</span>
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "output" ? (
          output === null ? (
            <div className="h-full flex items-center justify-center text-center p-4">
              <p className="text-base-content/50 text-xs sm:text-sm">
                Click <span className="font-semibold text-primary">Run Code</span> to view stdout & test execution results
              </p>
            </div>
          ) : output.success ? (
            <pre className="text-xs sm:text-sm font-mono text-success whitespace-pre-wrap leading-relaxed">
              {output.output}
            </pre>
          ) : (
            <div className="space-y-2">
              {output.output && (
                <pre className="text-xs sm:text-sm font-mono text-base-content whitespace-pre-wrap">
                  {output.output}
                </pre>
              )}
              <pre className="text-xs sm:text-sm font-mono text-error whitespace-pre-wrap bg-error/10 p-3 rounded-lg border border-error/20">
                {output.error}
              </pre>
            </div>
          )
        ) : (
          <div className="h-full flex flex-col">
            <p className="text-xs text-base-content/60 mb-2">
              Provide input values passed directly to standard input (<code className="font-mono">stdin</code>):
            </p>
            <textarea
              className="textarea textarea-bordered font-mono text-xs flex-1 w-full resize-none"
              placeholder="e.g. 5&#10;10 20 30 40 50"
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;