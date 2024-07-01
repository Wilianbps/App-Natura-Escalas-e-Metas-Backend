import { Request, Response } from "express";
import { selectGoalsByDate, selectGoalsByDateOrderById } from "../../models/goals/goalsModels";
import { splitsArrayIntoTwoParts } from "./utils/splitsArrayIntoTwoParts";
import { addDaysOfMonthIntoArrays } from "./utils/addDaysOfMonthIntoArrays";
/* import { separateGoalsByWeek } from "./utils/separateGoalsByWeek";
import { addIntoArrayDaysByEmployee } from "./utils/addIntoArrayDaysByEmployee"; */
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

    const goals = await selectGoalsByDateOrderById(month.toString(), year.toString());

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
      Number(year))
    

    res.status(200).json(goalsByWeek);
  } catch (error) {
    console.log(error, "erro na solicitação");
    return res.status(500).end();
  }
}
