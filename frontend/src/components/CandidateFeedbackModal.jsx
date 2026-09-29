import {
  XIcon,
  ClockIcon,
  Code2Icon,
  FileTextIcon,
  StarIcon,
  UsersIcon,
  CheckCircle2Icon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { useState } from "react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { downloadSessionReport, copySessionReportToClipboard } from "../lib/exportReport";

const RATING_LABELS = {
  strong_hire: { text: "Strong Hire ✨", color: "text-success", bg: "bg-success/10 border-success/30" },
  hire: { text: "Hire 👍", color: "text-info", bg: "bg-info/10 border-info/30" },
  lean_hire: { text: "Lean Hire 🤔", color: "text-warning", bg: "bg-warning/10 border-warning/30" },
  lean_no_hire: { text: "Lean No Hire 😬", color: "text-warning", bg: "bg-warning/10 border-warning/30" },
  no_hire: { text: "No Hire ❌", color: "text-error", bg: "bg-error/10 border-error/30" },
};

/**
 * Modal shown to the CANDIDATE after a session ends, summarizing the interview.
 */
function CandidateFeedbackModal({ session, isOpen, onClose }) {
  const [copiedReport, setCopiedReport] = useState(false);

  if (!isOpen || !session) return null;

  const handleDownload = () => {
    try {
      downloadSessionReport(session);
      toast.success("Interview report downloaded!");
    } catch {
      toast.error("Failed to download report");
    }
  };

  const handleCopy = async () => {
    try {
      await copySessionReportToClipboard(session);
      setCopiedReport(true);
      toast.success("Report copied to clipboard!");
      setTimeout(() => setCopiedReport(false), 2500);
    } catch {
      toast.error("Failed to copy report");
    }
  };

  const ratingInfo = session.rating && session.rating !== ""
    ? RATING_LABELS[session.rating]
    : null;

  const duration = session.duration;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-lg bg-base-100 border border-base-300 shadow-2xl p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between pb-4 border-b border-base-300 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <CheckCircle2Icon className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Interview Complete!</h3>
              <p className="text-xs text-base-content/60">Here's a summary of your session</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        {/* SESSION INFO */}
        <div className="space-y-4">
          {/* Problem & Difficulty */}
          <div className="flex items-center gap-3 bg-base-200 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Code2Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base">{session.problem}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                  {session.difficulty}
                </span>
                {session.language && (
                  <span className="text-xs text-base-content/50">{session.language}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-base-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-base-content/60 text-xs mb-1">
                <UsersIcon className="w-3.5 h-3.5" />
                <span>Interviewer</span>
              </div>
              <p className="font-semibold text-sm">{session.host?.name || "Host"}</p>
            </div>
            <div className="bg-base-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-base-content/60 text-xs mb-1">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>Duration</span>
              </div>
              <p className="font-semibold text-sm">
                {duration ? `${duration} min` : formatDistanceToNow(new Date(session.createdAt), { addSuffix: false })}
              </p>
            </div>
          </div>

          {/* Rating (if available) */}
          {ratingInfo ? (
            <div className={`rounded-xl p-4 border ${ratingInfo.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <StarIcon className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold text-base-content">Interviewer's Decision</span>
              </div>
              <p className={`text-lg font-black ${ratingInfo.color}`}>{ratingInfo.text}</p>
            </div>
          ) : (
            <div className="rounded-xl p-4 border border-base-300 bg-base-200">
              <div className="flex items-center gap-2 mb-1">
                <StarIcon className="w-4 h-4 text-base-content/40" />
                <span className="text-sm font-semibold text-base-content/60">No rating provided</span>
              </div>
              <p className="text-xs text-base-content/50">The interviewer didn't submit a rating.</p>
            </div>
          )}

          {/* Interviewer Notes */}
          {session.notes && (
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                <FileTextIcon className="w-4 h-4 text-primary" />
                <span>Interviewer's Notes</span>
              </div>
              <p className="text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">
                {session.notes}
              </p>
            </div>
          )}

          {/* Code length summary */}
          {session.finalCode && (
            <div className="text-xs text-base-content/40 text-center">
              {session.finalCode.length} characters of code submitted
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-action pt-4 border-t border-base-300 flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="btn btn-outline btn-sm gap-1.5 flex-1 sm:flex-initial"
              title="Download interview report as Markdown file"
            >
              <DownloadIcon className="size-3.5" />
              <span>Download (.md)</span>
            </button>
            <button
              onClick={handleCopy}
              className="btn btn-ghost btn-sm gap-1.5 flex-1 sm:flex-initial"
              title="Copy markdown report to clipboard"
            >
              {copiedReport ? (
                <CheckIcon className="size-3.5 text-success" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
              <span>{copiedReport ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <button onClick={onClose} className="btn btn-primary btn-sm w-full sm:w-auto sm:ml-auto">
            View Dashboard
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose}></div>
    </div>
  );
}

export default CandidateFeedbackModal;
