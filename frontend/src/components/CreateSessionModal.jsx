import { Code2Icon, GlobeIcon, LoaderIcon, LockIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);
  const [isCustomProblem, setIsCustomProblem] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-2xl bg-base-100 border border-base-300 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-base-300 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
              <SparklesIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">Create Interview Session</h3>
              <p className="text-xs text-base-content/60">Configure your coding room and privacy</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* PROBLEM SELECTION MODE TOGGLE */}
          <div className="flex items-center justify-between">
            <label className="label-text font-semibold">Problem Question</label>
            <button
              type="button"
              onClick={() => {
                setIsCustomProblem(!isCustomProblem);
                setRoomConfig((prev) => ({
                  ...prev,
                  problem: "",
                  difficulty: isCustomProblem ? "Easy" : "Medium",
                }));
              }}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              {isCustomProblem ? "← Choose from Curated List" : "+ Enter Custom Problem"}
            </button>
          </div>

          {!isCustomProblem ? (
            <div className="space-y-2">
              <select
                className="select select-bordered w-full"
                value={roomConfig.problem}
                onChange={(e) => {
                  const selectedProblem = problems.find((p) => p.title === e.target.value);
                  setRoomConfig((prev) => ({
                    ...prev,
                    difficulty: selectedProblem?.difficulty || "Easy",
                    problem: e.target.value,
                  }));
                }}
              >
                <option value="" disabled>
                  Choose a curated problem...
                </option>
                {problems.map((problem) => (
                  <option key={problem.id} value={problem.title}>
                    {problem.title} ({problem.difficulty} • {problem.category})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3 bg-base-200/50 p-4 rounded-xl border border-base-300">
              <div>
                <label className="label-text text-xs font-semibold mb-1 block">Custom Problem Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design LRU Cache / Refactor Order Processing"
                  className="input input-bordered w-full text-sm"
                  value={roomConfig.problem}
                  onChange={(e) =>
                    setRoomConfig((prev) => ({ ...prev, problem: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="label-text text-xs font-semibold mb-1 block">Difficulty</label>
                <select
                  className="select select-bordered select-sm w-full"
                  value={roomConfig.difficulty || "medium"}
                  onChange={(e) =>
                    setRoomConfig((prev) => ({ ...prev, difficulty: e.target.value }))
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          )}

          {/* ROOM PRIVACY SETTINGS */}
          <div className="space-y-2">
            <label className="label-text font-semibold block">Room Privacy</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setRoomConfig((prev) => ({ ...prev, isPrivate: true }))}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  roomConfig.isPrivate
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-base-content/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <LockIcon className="size-4 text-primary" />
                  <span className="font-bold text-sm">Private (Invite Only)</span>
                  <span className="badge badge-xs badge-primary">Recommended</span>
                </div>
                <p className="text-xs text-base-content/70">
                  Hidden from public dashboard. Only people with your direct invite link can join.
                </p>
              </div>

              <div
                onClick={() => setRoomConfig((prev) => ({ ...prev, isPrivate: false }))}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  !roomConfig.isPrivate
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-base-content/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <GlobeIcon className="size-4 text-secondary" />
                  <span className="font-bold text-sm">Public (Community)</span>
                </div>
                <p className="text-xs text-base-content/70">
                  Listed in the Live Sessions feed on the dashboard for any peer to join.
                </p>
              </div>
            </div>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success/15 border border-success/30 rounded-xl py-3">
              <Code2Icon className="size-5 text-success shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-base-content">
                  {roomConfig.isPrivate ? "Private" : "Public"} 1-on-1 Interview:
                </span>{" "}
                <span className="font-medium text-base-content/90">{roomConfig.problem}</span> (
                {roomConfig.difficulty || "Easy"})
              </div>
            </div>
          )}
        </div>

        <div className="modal-action pt-4 border-t border-base-300">
          <button className="btn btn-ghost" onClick={onClose} disabled={isCreating}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem.trim()}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}
            {isCreating ? "Creating..." : "Create Room"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={isCreating ? undefined : onClose}></div>
    </div>
  );
}

export default CreateSessionModal;