import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon, UserCircleIcon, Code2Icon } from "lucide-react";
import { Link } from "react-router";

const TIPS = [
  "Think out loud — interviewers care about your reasoning, not just the answer.",
  "Always clarify requirements before writing any code.",
  "Start with a brute force, then optimize. Never skip edge cases.",
  "Practice with a partner to simulate real interview pressure.",
  "Write clean, readable code with good variable names.",
  "Ask about time and space complexity constraints upfront.",
];

function WelcomeSection({ onCreateSession, recentSessionsCount = 0 }) {
  const { user } = useUser();
  const tip = TIPS[new Date().getDay() % TIPS.length]; // rotate tip by day

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent truncate">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-sm sm:text-base text-base-content/60 sm:ml-15 mb-3">
              Ready to level up your coding skills?
              {recentSessionsCount > 0 && (
                <span className="ml-2 text-primary font-medium">
                  You've completed {recentSessionsCount} session{recentSessionsCount !== 1 ? "s" : ""}!
                </span>
              )}
            </p>

            {/* Daily Tip */}
            <div className="sm:ml-15 flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2 max-w-xl">
              <span className="text-lg shrink-0">💡</span>
              <p className="text-xs sm:text-sm text-base-content/70 italic">{tip}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Profile link */}
            <Link
              to="/profile"
              className="btn btn-outline btn-sm sm:btn-md gap-2 w-full sm:w-auto"
            >
              <UserCircleIcon className="w-4 h-4" />
              My Stats
            </Link>

            {/* Create session */}
            <button
              onClick={onCreateSession}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-200 hover:opacity-90 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-3 text-white font-bold text-base sm:text-lg">
                <ZapIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Create Session</span>
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;