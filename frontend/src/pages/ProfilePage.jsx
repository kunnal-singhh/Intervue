import { useUser } from "@clerk/clerk-react";
import { useMyRecentSessions } from "../hooks/useSessions";
import { useUserProgress, useUserStats } from "../hooks/useUserProgress";
import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  UserIcon,
  CodeIcon,
  TrophyIcon,
  BarChart3Icon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  Code2Icon,
  ChevronRight,
  Loader,
  Star,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getDifficultyBadgeClass } from "../lib/utils";
import SessionReviewModal from "../components/SessionReviewModal";

const RATING_BADGES = {
  strong_hire: { text: "Strong Hire", color: "badge-success text-white" },
  hire: { text: "Hire", color: "badge-info text-white" },
  lean_hire: { text: "Lean Hire", color: "badge-warning" },
  lean_no_hire: { text: "Lean No Hire", color: "badge-warning text-warning-content" },
  no_hire: { text: "No Hire", color: "badge-error text-white" },
};

function ProfilePage() {
  const { user } = useUser();
  const { data: sessionsData, isLoading } = useMyRecentSessions();
  const { data: progressData } = useUserProgress();
  const { data: statsData } = useUserStats();
  const [selectedSession, setSelectedSession] = useState(null);

  const sessions = sessionsData?.sessions || [];
  const solvedProblems = progressData?.solvedProblems || [];
  // Use backend-aggregated stats when available, fallback to client-side
  const avgDuration = statsData?.avgDuration;
  const uniqueProblems = statsData?.uniqueProblems ?? sessions.length;
  const ratedSessions = sessions.filter((s) => s.rating && s.rating !== "");

  const hireCount = ratedSessions.filter((s) =>
    ["strong_hire", "hire", "lean_hire"].includes(s.rating)
  ).length;
  const noHireCount = ratedSessions.filter((s) =>
    ["lean_no_hire", "no_hire"].includes(s.rating)
  ).length;
  const hireRate =
    ratedSessions.length > 0 ? Math.round((hireCount / ratedSessions.length) * 100) : null;

  const easyCount = sessions.filter((s) => s.difficulty === "easy").length;
  const mediumCount = sessions.filter((s) => s.difficulty === "medium").length;
  const hardCount = sessions.filter((s) => s.difficulty === "hard").length;

  // Determine most common difficulty
  const difficultyBreakdown = [
    { label: "Easy", count: easyCount, color: "bg-success" },
    { label: "Medium", count: mediumCount, color: "bg-warning" },
    { label: "Hard", count: hardCount, color: "bg-error" },
  ];

  return (
    <>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* PROFILE HEADER */}
          <div className="card bg-base-100 shadow-md mb-6">
            <div className="card-body p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-primary/30"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/20 flex items-center justify-center ring-4 ring-primary/30">
                      <UserIcon className="w-10 h-10 text-primary" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-success border-2 border-base-100" title="Online" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-black mb-1">{user?.fullName || "User"}</h1>
                  <p className="text-base-content/60 text-sm mb-3">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <div className="badge badge-primary badge-lg gap-1">
                      <TrophyIcon className="w-3.5 h-3.5" />
                      {sessions.length} sessions
                    </div>
                    {hireRate !== null && (
                      <div className="badge badge-success badge-lg gap-1">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        {hireRate}% hire rate
                      </div>
                    )}
                    <div className="badge badge-secondary badge-lg gap-1">
                      <Code2Icon className="w-3.5 h-3.5" />
                      {hardCount > 0 ? "Hard solver" : mediumCount > 0 ? "Medium solver" : "Easy solver"}
                    </div>
                    {solvedProblems.length > 0 && (
                      <div className="badge badge-accent badge-lg gap-1">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        {solvedProblems.length} solved
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Sessions", value: sessions.length, color: "text-primary", bg: "bg-primary/10" },
              { label: "Rated Sessions", value: ratedSessions.length, color: "text-secondary", bg: "bg-secondary/10" },
              { label: "Hire Decisions", value: hireCount, color: "text-success", bg: "bg-success/10" },
              { label: "No Hire", value: noHireCount, color: "text-error", bg: "bg-error/10" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="card bg-base-100 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className={`text-3xl font-black ${color}`}>{value}</div>
                  <div className="text-xs opacity-60 mt-1">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* EXTRA STATS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4 text-center">
                <div className="text-3xl font-black text-accent">{solvedProblems.length}</div>
                <div className="text-xs opacity-60 mt-1">Problems Solved</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4 text-center">
                <div className="text-3xl font-black text-info">{uniqueProblems}</div>
                <div className="text-xs opacity-60 mt-1">Unique Problems</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm col-span-2 sm:col-span-1">
              <div className="card-body p-4 text-center">
                <div className="text-3xl font-black text-warning">
                  {avgDuration !== null && avgDuration !== undefined ? `${avgDuration}m` : "—"}
                </div>
                <div className="text-xs opacity-60 mt-1">Avg Session Duration</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Hire Rate Chart */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <BarChart3Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="font-bold text-lg">Hire Rate</h2>
                </div>

                {hireRate !== null ? (
                  <>
                    <div className="text-5xl font-black text-center my-4">{hireRate}%</div>
                    <div className="w-full bg-base-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-success to-info h-3 rounded-full transition-all"
                        style={{ width: `${hireRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-success font-semibold">
                        <CheckCircleIcon className="w-4 h-4" /> {hireCount} Hire
                      </span>
                      <span className="flex items-center gap-1 text-error font-semibold">
                        <XCircleIcon className="w-4 h-4" /> {noHireCount} No Hire
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 opacity-50">
                    <Star className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No rated sessions yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-warning/10 rounded-xl">
                    <Code2Icon className="w-5 h-5 text-warning" />
                  </div>
                  <h2 className="font-bold text-lg">Difficulty Mix</h2>
                </div>

                {sessions.length > 0 ? (
                  <div className="space-y-3">
                    {difficultyBreakdown.map(({ label, count, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{label}</span>
                          <span className="opacity-60">{count} sessions</span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2">
                          <div
                            className={`${color} h-2 rounded-full transition-all`}
                            style={{
                              width: sessions.length > 0 ? `${(count / sessions.length) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 opacity-50">
                    <p className="text-sm">No data yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-success/10 rounded-xl">
                    <Star className="w-5 h-5 text-success" />
                  </div>
                  <h2 className="font-bold text-lg">Rating Breakdown</h2>
                </div>

                {ratedSessions.length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(RATING_BADGES).map(([key, { text, color }]) => {
                      const count = ratedSessions.filter((s) => s.rating === key).length;
                      if (count === 0) return null;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className={`badge badge-sm ${color}`}>{text}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-base-200 rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${(count / ratedSessions.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold w-4 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 opacity-50">
                    <p className="text-sm">No rated sessions</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SESSION HISTORY */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ClockIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Session History</h2>
                  <p className="text-xs text-base-content/50">Click any session to review details</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : sessions.length > 0 ? (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session._id}
                      onClick={() => setSelectedSession(session)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-base-200 hover:bg-base-300 cursor-pointer transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Code2Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm truncate">{session.problem}</span>
                          <span className={`badge badge-xs ${getDifficultyBadgeClass(session.difficulty)}`}>
                            {session.difficulty}
                          </span>
                          {session.rating && RATING_BADGES[session.rating] && (
                            <span className={`badge badge-xs ${RATING_BADGES[session.rating].color}`}>
                              {RATING_BADGES[session.rating].text}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-base-content/50 mt-0.5">
                          {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })} •{" "}
                          {session.language || "javascript"}
                          {session.participant
                            ? ` • with ${session.participant?.name || "a participant"}`
                            : ""}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 opacity-50">
                  <TrophyIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No sessions yet</p>
                  <p className="text-sm">Start your first interview session!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SessionReviewModal
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}

export default ProfilePage;
