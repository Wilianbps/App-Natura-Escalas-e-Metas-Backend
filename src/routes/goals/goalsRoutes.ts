import express from "express";
import { findGoalsByFortnight, findGoalsByWeek, findGoalsByMonth } from "../../controllers/goals/goalsController";

const router = express.Router();

router.get("/get-goals-by-fortnight", findGoalsByFortnight);
router.get("/get-goals-by-week", findGoalsByWeek);
router.get("/get-goals-by-month", findGoalsByMonth);

export default router;
