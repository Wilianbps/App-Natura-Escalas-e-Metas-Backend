import express from "express";
import { findGoalsByFortnight } from "../../controllers/goals/goalsController";

const router = express.Router();

router.get("/get-goals-by-fortnight", findGoalsByFortnight);

export default router;
