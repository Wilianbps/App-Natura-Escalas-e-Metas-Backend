import { Request, Response } from "express";
import { selectGoalsByDate } from "../../models/goals/goalsModels";
import { splitsArrayIntoTwoParts } from "./utils/splitsArrayIntoTwoParts";
import { addDaysOfMonthIntoArrays } from "./utils/addDaysOfMonthIntoArrays";

export interface IGoals {
  id: string
  name: string
  codeStore: string
  days: { date: string; goalDay: number; goalDayByEmployee: number, day: number }[]
}

export async function findGoalsByFortnight(req: Request, res: Response) {
  try {
    const { month, year } = req.query;

    console.log(month, year)

    if (!month || !year) return res.status(400).send();

    const goals = await selectGoalsByDate(month.toString(), year.toString());

    const splitArray = splitsArrayIntoTwoParts(goals)

    const result = addDaysOfMonthIntoArrays(splitArray as Array<IGoals[]>, Number(month), Number(year))

    res.status(200).json(result);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
