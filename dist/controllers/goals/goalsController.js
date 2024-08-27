"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRankingGoalsLastTwelveMonths = exports.findGoalsEmployeesByMonth = exports.findGoalsByMonth = exports.findGoalsByWeek = exports.findGoalsByFortnight = void 0;
const goalsModels_1 = require("../../models/goals/goalsModels");
const splitsArrayIntoTwoParts_1 = require("./utils/splitsArrayIntoTwoParts");
const addDaysOfMonthIntoArrays_1 = require("./utils/addDaysOfMonthIntoArrays");
const separateGoalsByEmployees_1 = require("./utils/separateGoalsByEmployees");
const calculateGoalMonthByEmployee_1 = require("./utils/calculateGoalMonthByEmployee");
function findGoalsByFortnight(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode, month, year } = req.query;
            if (!storeCode || !month || !year)
                return res.status(400).send();
            const goals = yield (0, goalsModels_1.selectGoalsByDateOrderById)(storeCode.toString(), month.toString(), year.toString());
            const splitArray = (0, splitsArrayIntoTwoParts_1.splitsArrayIntoTwoParts)(goals);
            const result = (0, addDaysOfMonthIntoArrays_1.addDaysOfMonthIntoArrays)(splitArray, Number(month), Number(year));
            res.status(200).json(result);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findGoalsByFortnight = findGoalsByFortnight;
function findGoalsByWeek(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode, month, year } = req.query;
            if (!storeCode || !month || !year)
                return res.status(400).send();
            const goals = yield (0, goalsModels_1.selectGoalsByDate)(storeCode.toString(), month.toString(), year.toString());
            const goalsByWeek = (0, separateGoalsByEmployees_1.separateGoalsByEmployees)(goals, Number(month), Number(year));
            res.status(200).json(goalsByWeek);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findGoalsByWeek = findGoalsByWeek;
function findGoalsByMonth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode, initialDate, lastDate } = req.query;
            if (!storeCode || !initialDate || !lastDate)
                return res.status(400).send();
            const goals = yield (0, goalsModels_1.selectGoalsByWeek)(storeCode.toString(), initialDate.toString(), lastDate.toString());
            res.status(200).json(goals);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findGoalsByMonth = findGoalsByMonth;
function findGoalsEmployeesByMonth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode, month, year } = req.query;
            if (!storeCode || !month || !year)
                return res.status(400).send();
            const goals = yield (0, goalsModels_1.selectGoalsEmployeesByMonth)(storeCode.toString(), month.toString(), year.toString());
            const result = (0, calculateGoalMonthByEmployee_1.calculateGoalMonthByEmployee)(goals);
            res.status(200).json(result);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findGoalsEmployeesByMonth = findGoalsEmployeesByMonth;
function findRankingGoalsLastTwelveMonths(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode, initialDate, lastDate } = req.query;
            if (!storeCode || !initialDate || !lastDate)
                return res.status(400).send();
            const goalsLastTwelveMonths = yield (0, goalsModels_1.selectRankingGoalsLastTwelveMonths)(storeCode.toString(), initialDate.toString());
            res.status(200).json(goalsLastTwelveMonths);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findRankingGoalsLastTwelveMonths = findRankingGoalsLastTwelveMonths;
