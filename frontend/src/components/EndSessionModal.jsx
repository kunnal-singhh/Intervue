import { CheckCircle2Icon, Loader2Icon, LogOutIcon, MessageSquareIcon, StarIcon, XIcon } from "lucide-react";
import { useState } from "react";

const RATINGS = [
  { value: "strong_hire", label: "Strong Hire", color: "badge-success text-white" },
  { value: "hire", label: "Hire", color: "badge-info text-white" },
  { value: "lean_hire", label: "Lean Hire", color: "badge-warning" },
  { value: "lean_no_hire", label: "Lean No Hire", color: "badge-warning text-warning-content" },
  { value: "no_hire", label: "No Hire", color: "badge-error text-white" },
];

function EndSessionModal({
  isOpen,
  onClose,
  onConfirmEnd,
  isEnding,
  problemTitle,
  participantName,
  codeLength,
}) {
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmEnd({ rating, notes });
  };

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-xl bg-base-100 border border-base-300 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-base-300 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-error/10 text-error">
              <LogOutIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">End Interview Session</h3>
              <p className="text-xs text-base-content/60">Save candidate code & submit final evaluation</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isEnding} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SESSION SUMMARY */}
          <div className="bg-base-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-base-content/60">Problem:</span>{" "}
              <span className="font-semibold text-base-content">{problemTitle}</span>
            </div>
            {participantName && (
              <div>
                <span className="text-base-content/60">Candidate:</span>{" "}
                <span className="font-semibold text-base-content">{participantName}</span>
              </div>
            )}
            <div>
              <span className="text-base-content/60">Code Size:</span>{" "}
              <span className="font-semibold text-base-content">{codeLength} chars</span>
            </div>
          </div>

          {/* RATING SELECTION */}
          <div>
            <label className="label text-sm font-semibold flex items-center gap-1.5 pb-2">
              <StarIcon className="size-4 text-warning" />
              <span>Hiring Recommendation (Optional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {RATINGS.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRating(rating === r.value ? "" : r.value)}
                  className={`btn btn-sm ${
                    rating === r.value
                      ? "btn-primary font-bold shadow"
                      : "btn-outline border-base-300 hover:border-primary text-xs"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* INTERVIEWER NOTES */}
          <div>
            <label className="label text-sm font-semibold flex items-center gap-1.5 pb-2">
              <MessageSquareIcon className="size-4 text-primary" />
              <span>Interviewer Notes & Assessment</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24 text-sm"
              placeholder="Candidate solved the core problem in O(N). Demonstrated clear edge case handling and strong communication..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="modal-action pt-2 border-t border-base-300 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} disabled={isEnding} className="btn btn-ghost btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={isEnding} className="btn btn-error btn-sm gap-2">
              {isEnding ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Saving & Ending...</span>
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="size-4" />
                  <span>End & Save Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={isEnding ? undefined : onClose}></div>
    </div>
  );
}

export default EndSessionModal;
