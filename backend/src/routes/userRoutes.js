import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProgress, markProblemSolved } from "../controllers/userController.js";

const router = Router();

router.get("/progress", protectRoute, getUserProgress);
router.post("/solve/:problemId", protectRoute, markProblemSolved);

export default router;
