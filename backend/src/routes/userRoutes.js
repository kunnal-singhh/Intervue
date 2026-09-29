import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProgress,
  markProblemSolved,
  getUserStats,
  toggleStarProblem,
} from "../controllers/userController.js";

const router = Router();

router.get("/progress", protectRoute, getUserProgress);
router.get("/stats", protectRoute, getUserStats);
router.post("/solve/:problemId", protectRoute, markProblemSolved);
router.post("/star/:problemId", protectRoute, toggleStarProblem);

export default router;
