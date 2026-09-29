import User from "../models/User.js";

export const markProblemSolved = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { language = "javascript" } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySolved = user.solvedProblems?.some((p) => p.problemId === problemId);
    if (!alreadySolved) {
      if (!user.solvedProblems) user.solvedProblems = [];
      user.solvedProblems.push({ problemId, language, solvedAt: new Date() });
      await user.save();
    }

    res.status(200).json({ success: true, solvedProblems: user.solvedProblems });
  } catch (error) {
    console.error("Error in markProblemSolved controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("solvedProblems");
    res.status(200).json({ solvedProblems: user?.solvedProblems || [] });
  } catch (error) {
    console.error("Error in getUserProgress controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const Session = (await import("../models/Session.js")).default;

    const sessions = await Session.find({
      $or: [{ host: userId }, { participant: userId }],
      status: "completed",
    });

    const totalSessions = sessions.length;
    const ratedSessions = sessions.filter((s) => s.rating && s.rating !== "");

    const ratingCounts = {
      strong_hire: 0, hire: 0, lean_hire: 0, lean_no_hire: 0, no_hire: 0,
    };
    ratedSessions.forEach((s) => {
      if (ratingCounts[s.rating] !== undefined) ratingCounts[s.rating]++;
    });

    const hireCount = (ratingCounts.strong_hire + ratingCounts.hire + ratingCounts.lean_hire);
    const noHireCount = (ratingCounts.lean_no_hire + ratingCounts.no_hire);
    const hireRate = ratedSessions.length > 0 ? Math.round((hireCount / ratedSessions.length) * 100) : null;

    const durationsWithValues = sessions.filter((s) => s.duration !== null && s.duration !== undefined);
    const avgDuration = durationsWithValues.length > 0
      ? Math.round(durationsWithValues.reduce((sum, s) => sum + s.duration, 0) / durationsWithValues.length)
      : null;

    const difficultyBreakdown = {
      easy: sessions.filter((s) => s.difficulty === "easy").length,
      medium: sessions.filter((s) => s.difficulty === "medium").length,
      hard: sessions.filter((s) => s.difficulty === "hard").length,
    };

    const uniqueProblems = [...new Set(sessions.map((s) => s.problem))].length;

    res.status(200).json({
      totalSessions,
      ratedSessions: ratedSessions.length,
      hireCount,
      noHireCount,
      hireRate,
      avgDuration,
      ratingCounts,
      difficultyBreakdown,
      uniqueProblems,
    });
  } catch (error) {
    console.error("Error in getUserStats controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
