import { Request, Response } from "express";
import {
  selectGoalsByDate,
  selectGoalsByDateOrderById,
  selectGoalsByWeek,
} from "../../models/goals/goalsModels";
import { splitsArrayIntoTwoParts } from "./utils/splitsArrayIntoTwoParts";
import { addDaysOfMonthIntoArrays } from "./utils/addDaysOfMonthIntoArrays";
import { separateGoalsByEmployees } from "./utils/separateGoalsByEmployees";

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
    const { month, year } = req.query;

    console.log(month, year);

    if (!month || !year) return res.status(400).send();

    const goals = await selectGoalsByDateOrderById(
      month.toString(),
      year.toString()
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
    const { month, year } = req.query;

    if (!month || !year) return res.status(400).send();

    const goals = await selectGoalsByDate(month.toString(), year.toString());

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

    if (!storeCode || !initialDate || !lastDate)
      return res.status(400).send();

    console.log(storeCode);
    console.log(initialDate);
    console.log(lastDate);

    const goals = await selectGoalsByWeek(
      storeCode.toString(),
      initialDate.toString(),
      lastDate.toString()
    );

 /*    if (goals.length === 0){
      return res.status(404).send();
    } */

   res.status(200).json(goals);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
