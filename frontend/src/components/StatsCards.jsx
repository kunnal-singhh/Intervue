import { TrophyIcon, UsersIcon, CheckCircleIcon, XCircleIcon, BarChart3Icon } from "lucide-react";

const RATING_MAP = {
  strong_hire: { label: "Strong Hire", color: "text-success" },
  hire: { label: "Hire", color: "text-info" },
  lean_hire: { label: "Lean Hire", color: "text-warning" },
  lean_no_hire: { label: "Lean No Hire", color: "text-warning" },
  no_hire: { label: "No Hire", color: "text-error" },
};

function StatsCards({ activeSessionsCount, recentSessionsCount, recentSessions = [] }) {
  // Compute hire/no-hire breakdown from recent completed sessions
  const ratedSessions = recentSessions.filter((s) => s.rating && s.rating !== "");

  const hireCount = ratedSessions.filter((s) =>
    ["strong_hire", "hire", "lean_hire"].includes(s.rating)
  ).length;

  const noHireCount = ratedSessions.filter((s) =>
    ["lean_no_hire", "no_hire"].includes(s.rating)
  ).length;

  const hireRate =
    ratedSessions.length > 0 ? Math.round((hireCount / ratedSessions.length) * 100) : null;

  return (
    <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
      {/* Active Sessions Count */}
      <div className="card bg-base-100 border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <UsersIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="badge badge-primary">Live</div>
          </div>
          <div className="text-4xl font-black mb-1">{activeSessionsCount}</div>
          <div className="text-sm opacity-60">Active Sessions</div>
        </div>
      </div>

      {/* Total Sessions */}
      <div className="card bg-base-100 border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <TrophyIcon className="w-7 h-7 text-secondary" />
            </div>
            {ratedSessions.length > 0 && (
              <div className="badge badge-secondary">{ratedSessions.length} rated</div>
            )}
          </div>
          <div className="text-4xl font-black mb-1">{recentSessionsCount}</div>
          <div className="text-sm opacity-60">Total Sessions</div>
        </div>
      </div>

      {/* Hire Rate Card */}
      <div className="card bg-base-100 border-2 border-accent/20 hover:border-accent/40 transition-colors sm:col-span-2 lg:col-span-1">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <BarChart3Icon className="w-7 h-7 text-accent" />
            </div>
            <div className="badge badge-accent">Evaluation</div>
          </div>

          {hireRate !== null ? (
            <>
              <div className="text-4xl font-black mb-1">{hireRate}%</div>
              <div className="text-sm opacity-60 mb-3">Hire Rate</div>
              {/* Progress bar */}
              <div className="w-full bg-base-200 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-success to-info h-2 rounded-full transition-all"
                  style={{ width: `${hireRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-success font-semibold">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  {hireCount} Hire
                </span>
                <span className="flex items-center gap-1 text-error font-semibold">
                  <XCircleIcon className="w-3.5 h-3.5" />
                  {noHireCount} No Hire
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl font-black mb-1 opacity-30">—</div>
              <div className="text-sm opacity-60">No rated sessions yet</div>
              <p className="text-xs opacity-40 mt-1">Complete interviews to see your hire rate</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsCards;