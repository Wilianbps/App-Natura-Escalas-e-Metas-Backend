import { Request, Response } from "express";
import {
  selectGoalsByDate,
  selectGoalsByDateOrderById,
  selectGoalsByWeek,
  selectGoalsEmployeesByMonth,
  selectRankingGoalsLastTwelveMonths,
} from "../../models/goals/goalsModels";
import { splitsArrayIntoTwoParts } from "./utils/splitsArrayIntoTwoParts";
import { addDaysOfMonthIntoArrays } from "./utils/addDaysOfMonthIntoArrays";
import { separateGoalsByEmployees } from "./utils/separateGoalsByEmployees";
import { calculateGoalMonthByEmployee } from "./utils/calculateGoalMonthByEmployee";

interface IGoals {
  id: string;
  name: string;
  codeStore: string;
  days: {
    date: string;
    goalDay: number;
    goalDayByEmployee: number;
    day: number;
  }[];
}

interface IGoalsByWeek {
  id: string;
  codeStore: string;
  name: string;
  date: string;
  goalDay: number;
  goalDayByEmployee: number;
  dayOfWeek: number;
}

export async function findGoalsByFortnight(req: Request, res: Response) {
  try {
    const { storeCode, month, year, goalType } = req.query;

    if (!storeCode || !month || !year || !goalType) return res.status(400).send();

    const goals = await selectGoalsByDateOrderById(
      storeCode.toString(),
      month.toString(),
      year.toString(),
      goalType.toString()
    );

    const splitArray = splitsArrayIntoTwoParts(goals);

    const result = addDaysOfMonthIntoArrays(
      splitArray as Array<IGoals[]>,
      Number(month),
      Number(year)
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findGoalsByWeek(req: Request, res: Response) {
  try {
    const { storeCode, month, year, goalType } = req.query;

    if (!storeCode || !month || !year || !goalType) return res.status(400).send();

    const goals = await selectGoalsByDate(
      storeCode.toString(),
      month.toString(),
      year.toString(),
      goalType.toString()
    );

    const goalsByWeek = separateGoalsByEmployees(
      goals as IGoalsByWeek[],
      Number(month),
      Number(year)
    );

    res.status(200).json(goalsByWeek);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findGoalsByMonth(req: Request, res: Response) {
  try {
    const { storeCode, initialDate, lastDate } = req.query;

    if (!storeCode || !initialDate || !lastDate) return res.status(400).send();

    const goals = await selectGoalsByWeek(
      storeCode.toString(),
      initialDate.toString(),
      lastDate.toString()
    );

    res.status(200).json(goals);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findGoalsEmployeesByMonth(req: Request, res: Response) {
  try {
    const { storeCode, month, year } = req.query;

    if (!storeCode || !month || !year) return res.status(400).send();

    const goals = await selectGoalsEmployeesByMonth(
      storeCode.toString(),
      month.toString(),
      year.toString()
    );

    const result = calculateGoalMonthByEmployee(goals);

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}

export async function findRankingGoalsLastTwelveMonths(
  req: Request,
  res: Response
) {
  try {
    const { storeCode, initialDate, lastDate } = req.query;

    if (!storeCode || !initialDate || !lastDate) return res.status(400).send();

    const goalsLastTwelveMonths = await selectRankingGoalsLastTwelveMonths(
      storeCode.toString(),
      initialDate.toString()
    );

    res.status(200).json(goalsLastTwelveMonths);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
