import express from "express";
import { findGoalsByFortnight, findGoalsByWeek, findGoalsByMonth, findGoalsEmployeesByMonth, findRankingGoalsLastTwelveMonths } from "../../controllers/goals/goalsController";

const router = express.Router();

router.get("/get-goals-by-fortnight", findGoalsByFortnight);
router.get("/get-goals-by-week", findGoalsByWeek);
router.get("/get-goals-by-month", findGoalsByMonth);
router.get("/get-goals-employees-by-month", findGoalsEmployeesByMonth)
router.get("/get-ranking-goals-last-twelve-months", findRankingGoalsLastTwelveMonths)

export default router;
