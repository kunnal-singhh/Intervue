import { useState, useMemo } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, SearchIcon, XIcon, FilterIcon, CheckCircle2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useUserProgress } from "../hooks/useUserProgress";

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: progressData } = useUserProgress();
  const solvedProblemIds = new Set((progressData?.solvedProblems || []).map((p) => p.problemId));

  // Extract all unique top-level categories
  const allCategories = useMemo(() => {
    const cats = new Set();
    problems.forEach((p) => {
      // Take first tag from "Array • Two Pointers" style
      const first = p.category?.split("•")[0]?.trim();
      if (first) cats.add(first);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [problems]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      const matchesCategory =
        selectedCategory === "All" || p.category.includes(selectedCategory);
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, search, selectedDifficulty, selectedCategory]);

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;
  const solvedCount = problems.filter((p) => solvedProblemIds.has(p.id)).length;

  const hasFilters = search || selectedDifficulty !== "All" || selectedCategory !== "All";

  const clearFilters = () => {
    setSearch("");
    setSelectedDifficulty("All");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-sm sm:text-base text-base-content/70">
            Sharpen your coding skills with {problems.length} curated problems
          </p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
        { label: "Total", count: problems.length, color: "text-primary" },
            { label: "Easy", count: easyCount, color: "text-success" },
            { label: "Medium", count: mediumCount, color: "text-warning" },
            { label: "Hard", count: hardCount, color: "text-error" },
            { label: "Solved", count: solvedCount, color: "text-accent" },
          ].map(({ label, count, color }) => (
            <div key={label} className="card bg-base-100 shadow-sm">
              <div className="card-body p-3 sm:p-4 text-center">
                <div className={`text-2xl sm:text-3xl font-black ${color}`}>{count}</div>
                <div className="text-xs sm:text-sm opacity-60">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body p-4 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                id="problem-search"
                type="text"
                placeholder="Search problems or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full pl-9 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-1.5 flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`btn btn-sm ${
                    selectedDifficulty === d
                      ? d === "Easy"
                        ? "btn-success text-white"
                        : d === "Medium"
                        ? "btn-warning"
                        : d === "Hard"
                        ? "btn-error text-white"
                        : "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered select-sm w-full sm:w-auto"
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasFilters && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm gap-1">
                <XIcon className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="flex items-center gap-2 mb-4 text-sm text-base-content/60">
          <FilterIcon className="w-4 h-4" />
          <span>
            Showing <span className="font-bold text-base-content">{filtered.length}</span> of {problems.length} problems
          </span>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((problem) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="card bg-base-100 hover:scale-[1.01] transition-all shadow-sm hover:shadow-md group"
              >
                <div className="card-body p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`size-10 sm:size-11 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        solvedProblemIds.has(problem.id)
                          ? "bg-success/15 group-hover:bg-success/25"
                          : "bg-primary/10 group-hover:bg-primary/20"
                      }`}>
                        {solvedProblemIds.has(problem.id) ? (
                          <CheckCircle2Icon className="size-5 sm:size-5.5 text-success" />
                        ) : (
                          <Code2Icon className="size-5 sm:size-5.5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <h2 className="text-base sm:text-lg font-bold truncate">{problem.title}</h2>
                          <span className={`badge badge-sm ${getDifficultyBadgeClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-base-content/50">{problem.category}</p>
                      </div>
                    </div>

                    {/* DESCRIPTION PREVIEW (hidden on mobile) */}
                    <p className="hidden lg:block text-sm text-base-content/60 max-w-xs line-clamp-1 flex-1">
                      {problem.description.text}
                    </p>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2 text-primary self-end sm:self-center shrink-0">
                      <span className="font-semibold text-sm">Solve</span>
                      <ChevronRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4">
                  <SearchIcon className="w-8 h-8 opacity-30" />
                </div>
                <p className="text-lg font-semibold opacity-70">No problems found</p>
                <p className="text-sm opacity-50 mb-4">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn btn-primary btn-sm">
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;