"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitsArrayIntoTwoParts = void 0;
const date_fns_1 = require("date-fns");
function splitsArrayIntoTwoParts(goals) {
    const arrayGoals1 = [];
    const resultArray1 = [];
    const mapArray1 = new Map();
    const arrayGoals2 = [];
    const resultArray2 = [];
    const mapArray2 = new Map();
    let data = [];
    goals.forEach((goal) => {
        const isoDate = new Date(goal.date).toISOString();
        const partDate = isoDate.toString().substring(0, 7);
        const completeDate = `${partDate}-15`;
        const day15 = (0, date_fns_1.parse)(completeDate, "yyyy-MM-dd", new Date().toISOString());
        const date = new Date(goal.date);
        if ((0, date_fns_1.isBefore)(date, day15)) {
            arrayGoals1.push(goal);
        }
        else {
            arrayGoals2.push(goal);
        }
    });
    arrayGoals1.forEach((item) => {
        if (item && !mapArray1.has(item.id)) {
            mapArray1.set(item.id, {
                id: item.id,
                name: item.name,
                codeStore: item.codeStore,
                sumGoalDayByEmployee: item.goalDayByEmployee,
                days: [],
            });
        }
        if (item) {
            const entry = mapArray1.get(item.id);
            entry.days.push({
                date: item.date,
                goalDay: item.goalDay,
                goalDayByEmployee: item.goalDayByEmployee,
            });
        }
    });
    arrayGoals2.forEach((item) => {
        if (item && !mapArray2.has(item.id)) {
            mapArray2.set(item.id, {
                id: item.id,
                name: item.name,
                codeStore: item.codeStore,
                days: [],
            });
        }
        if (item) {
            const entry = mapArray2.get(item.id);
            entry.days.push({
                date: item.date,
                goalDay: item.goalDay,
                goalDayByEmployee: item.goalDayByEmployee,
            });
        }
    });
    mapArray1.forEach((value) => resultArray1.push(value));
    mapArray2.forEach((value) => resultArray2.push(value));
    data.push(resultArray1, resultArray2);
    return data;
}
exports.splitsArrayIntoTwoParts = splitsArrayIntoTwoParts;
/* import { isBefore, parse } from "date-fns";

interface IGoals {
  id: string;
  name: string;
  codeStore: string;
  date: string;
  goalDay: number;
  goalDayByEmployee: number | string;
}

interface IDataGoal {
  id: string;
  name: string;
  codeStore: string;
  days: { date: string; goalDay: number; goalDayByEmployee: number | string }[];
  sumGoalDayByEmployee: number;
}

export function splitsArrayIntoTwoParts(goals: IGoals[]): IDataGoal[][] {
  const arrayGoals1: IGoals[] = [];
  const resultArray1: IDataGoal[] = [];
  const mapArray1 = new Map<string, IDataGoal>();

  const arrayGoals2: IGoals[] = [];
  const resultArray2: IDataGoal[] = [];
  const mapArray2 = new Map<string, IDataGoal>();

  let data: IDataGoal[][] = [];

  goals.forEach((goal) => {
    const isoDate = new Date(goal.date).toISOString();
    const partDate = isoDate.toString().substring(0, 7);

    const completeDate = `${partDate}-15`;

    const day15 = parse(completeDate, "yyyy-MM-dd", new Date().toISOString());

    const date = new Date(goal.date);

    if (isBefore(date, day15)) {
      arrayGoals1.push(goal);
    } else {
      arrayGoals2.push(goal);
    }
  });

  arrayGoals1.forEach((item) => {
    let entry = mapArray1.get(item.id);
    if (!entry) {
      entry = {
        id: item.id,
        name: item.name,
        codeStore: item.codeStore,
        sumGoalDayByEmployee: 0,
        days: [],
      };
      mapArray1.set(item.id, entry);
    }

    entry.days.push({
      date: item.date,
      goalDay: item.goalDay,
      goalDayByEmployee: item.goalDayByEmployee,
    });

    if (typeof item.goalDayByEmployee === 'number') {
      entry.sumGoalDayByEmployee += item.goalDayByEmployee;
    }
  });

  arrayGoals2.forEach((item) => {
    let entry = mapArray2.get(item.id);
    if (!entry) {
      entry = {
        id: item.id,
        name: item.name,
        codeStore: item.codeStore,
        sumGoalDayByEmployee: 0,
        days: [],
      };
      mapArray2.set(item.id, entry);
    }

    entry.days.push({
      date: item.date,
      goalDay: item.goalDay,
      goalDayByEmployee: item.goalDayByEmployee,
    });

    if (typeof item.goalDayByEmployee === 'number') {
      entry.sumGoalDayByEmployee += item.goalDayByEmployee;
    }
  });

  mapArray1.forEach((value) => resultArray1.push(value));
  mapArray2.forEach((value) => resultArray2.push(value));

  data.push(resultArray1, resultArray2);

  return data;
}
 */ 
