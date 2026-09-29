import { Code2, Clock, Users, Trophy, Loader, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import SessionReviewModal from "./SessionReviewModal";

const RATING_BADGES = {
  strong_hire: { text: "Strong Hire", color: "badge-success text-white" },
  hire: { text: "Hire", color: "badge-info text-white" },
  lean_hire: { text: "Lean Hire", color: "badge-warning" },
  lean_no_hire: { text: "Lean No Hire", color: "badge-warning text-warning-content" },
  no_hire: { text: "No Hire", color: "badge-error text-white" },
};

function RecentSessions({ sessions, isLoading }) {
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <>
      <div className="card bg-base-100 border-2 border-accent/20 hover:border-accent/30 mt-8">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-accent to-secondary rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Your Past Sessions</h2>
              <p className="text-xs text-base-content/60">Click any past interview to review code snapshot and evaluation notes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <Loader className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session._id}
                  onClick={() => setSelectedSession(session)}
                  className={`card relative cursor-pointer hover:scale-[1.02] transition-all shadow-sm hover:shadow-md ${
                    session.status === "active"
                      ? "bg-success/10 border-success/30 hover:border-success/60"
                      : "bg-base-200 border-base-300 hover:border-primary/50"
                  }`}
                >
                  {session.status === "active" && (
                    <div className="absolute top-3 right-3">
                      <div className="badge badge-success gap-1">
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                        ACTIVE
                      </div>
                    </div>
                  )}

                  <div className="card-body p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          session.status === "active"
                            ? "bg-gradient-to-br from-success to-success/70"
                            : "bg-gradient-to-br from-primary to-secondary"
                        }`}
                      >
                        <Code2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base mb-1 truncate">{session.problem}</h3>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}
                          >
                            {session.difficulty}
                          </span>
                          {session.rating && RATING_BADGES[session.rating] && (
                            <span className={`badge badge-sm ${RATING_BADGES[session.rating].color}`}>
                              {RATING_BADGES[session.rating].text}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm opacity-80 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatDistanceToNow(new Date(session.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {session.participant ? "2" : "1"} participant
                          {session.participant ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-base-300 text-xs">
                      <span className="font-semibold text-primary flex items-center gap-1">
                        View Dossier <ChevronRight className="size-3.5" />
                      </span>
                      <span className="opacity-40">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-accent/50" />
                </div>
                <p className="text-lg font-semibold opacity-70 mb-1">No sessions yet</p>
                <p className="text-sm opacity-50">Start your coding journey today!</p>
              </div>
            )}
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

export default RecentSessions;