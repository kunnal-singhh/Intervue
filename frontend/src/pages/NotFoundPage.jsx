import { Link } from "react-router";
import { HomeIcon, ArrowLeftIcon, SparklesIcon } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl animate-pulse">
          <SparklesIcon className="w-10 h-10 text-white" />
        </div>

        {/* 404 number */}
        <div className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-none mb-4">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-base-content/60 text-sm sm:text-base mb-8">
          Looks like this route doesn't exist. Maybe the interview session ended?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="btn btn-primary gap-2 w-full sm:w-auto">
            <HomeIcon className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost gap-2 w-full sm:w-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
