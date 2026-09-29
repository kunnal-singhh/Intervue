import { CheckIcon, ClockIcon, Code2Icon, CopyIcon, FileTextIcon, StarIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { format } from "date-fns";

const RATING_LABELS = {
  strong_hire: { text: "Strong Hire", color: "badge-success text-white" },
  hire: { text: "Hire", color: "badge-info text-white" },
  lean_hire: { text: "Lean Hire", color: "badge-warning" },
  lean_no_hire: { text: "Lean No Hire", color: "badge-warning text-warning-content" },
  no_hire: { text: "No Hire", color: "badge-error text-white" },
};

function SessionReviewModal({ session, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !session) return null;

  const handleCopyCode = () => {
    if (!session.finalCode) return;
    navigator.clipboard.writeText(session.finalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ratingInfo = session.rating ? RATING_LABELS[session.rating] : null;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-4xl bg-base-100 border border-base-300 shadow-2xl p-6 max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex items-start justify-between pb-4 border-b border-base-300">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-base-content">{session.problem}</h3>
              <span className={`badge ${getDifficultyBadgeClass(session.difficulty)}`}>
                {session.difficulty}
              </span>
              {ratingInfo && (
                <span className={`badge font-bold ${ratingInfo.color}`}>
                  {ratingInfo.text}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-base-content/70 mt-2">
              <div className="flex items-center gap-1.5">
                <ClockIcon className="size-3.5" />
                <span>
                  {session.createdAt
                    ? format(new Date(session.createdAt), "MMM d, yyyy • h:mm a")
                    : "Completed"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <UsersIcon className="size-3.5" />
                <span>Host: {session.host?.name || "Host"}</span>
                {session.participant && <span>• Candidate: {session.participant?.name}</span>}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1">
          {/* INTERVIEWER NOTES */}
          {session.notes && (
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-base-content">
                <FileTextIcon className="size-4 text-primary" />
                <span>Interviewer Evaluation & Notes</span>
              </div>
              <p className="text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">
                {session.notes}
              </p>
            </div>
          )}

          {/* CODE EDITOR SNAPSHOT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code2Icon className="size-4 text-primary" />
                <span className="font-semibold text-sm text-base-content">
                  Final Code Snapshot ({session.language || "javascript"})
                </span>
              </div>

              {session.finalCode && (
                <button
                  onClick={handleCopyCode}
                  className="btn btn-ghost btn-xs gap-1.5 text-xs"
                >
                  {copied ? (
                    <CheckIcon className="size-3.5 text-success" />
                  ) : (
                    <CopyIcon className="size-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>
              )}
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-base-300">
              {session.finalCode ? (
                <Editor
                  height="100%"
                  language={session.language || "javascript"}
                  value={session.finalCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 13,
                    lineNumbers: "on",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              ) : (
                <div className="h-full bg-base-300 flex items-center justify-center text-xs text-base-content/50">
                  No code snapshot was recorded for this session.
                </div>
              )}
            </div>
          </div>

          {/* EXECUTION OUTPUT */}
          {session.executionOutput && (
            <div>
              <span className="font-semibold text-sm text-base-content block mb-2">
                Execution Output
              </span>
              <pre className="bg-base-300 text-xs font-mono p-3 rounded-xl border border-base-300 overflow-x-auto max-h-36">
                {session.executionOutput}
              </pre>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-action pt-3 border-t border-base-300">
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose}></div>
    </div>
  );
}

export default SessionReviewModal;
