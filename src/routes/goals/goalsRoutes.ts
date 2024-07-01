import express from "express";
import { findGoalsByFortnight, findGoalsByWeek } from "../../controllers/goals/goalsController";

const router = express.Router();

router.get("/get-goals-by-fortnight", findGoalsByFortnight);
router.get("/get-goals-by-week", findGoalsByWeek);

export default router;
