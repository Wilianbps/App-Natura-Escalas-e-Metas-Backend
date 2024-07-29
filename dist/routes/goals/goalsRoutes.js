"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const goalsController_1 = require("../../controllers/goals/goalsController");
const router = express_1.default.Router();
router.get("/get-goals-by-fortnight", goalsController_1.findGoalsByFortnight);
router.get("/get-goals-by-week", goalsController_1.findGoalsByWeek);
router.get("/get-goals-by-month", goalsController_1.findGoalsByMonth);
router.get("/get-goals-employees-by-month", goalsController_1.findGoalsEmployeesByMonth);
router.get("/get-ranking-goals-last-twelve-months", goalsController_1.findRankingGoalsLastTwelveMonths);
exports.default = router;
