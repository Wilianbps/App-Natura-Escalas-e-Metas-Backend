import { isBefore, parse } from "date-fns";

interface IScales {
  id: string;
  name: string;
  date: string; day: number; month: number; year: number; turnId: number; status: number; startTime: string; endTime: string; lunchTime: string; dayOfWeek: number; turn: string
}

interface IDataScale {
  id: string;
  name: string;
  days: { date: string; day: number; month: number; year: number; turnId: number; status: number; startTime: string; endTime: string; lunchTime: string; dayOfWeek: number; turn: string}[];
}

export function splitsArrayIntoTwoParts(scales: IScales[]) {
  const arrayScales1: IScales[] = [];
  const resultArray1: IDataScale[] = [];
  const mapArray1 = new Map();

  const arrayScales2: IScales[] = [];
  const resultArray2: IDataScale[] = [];
  const mapArray2 = new Map();

  let data = [];

  scales.forEach((scale) => {
    const isoDate = new Date(scale.date).toISOString();
    const partDate = isoDate.toString().substring(0, 7);

    const completeDate = `${partDate}-15`;

    const day15 = parse(completeDate, "yyyy-MM-dd", new Date().toISOString());

    const date = new Date(scale.date);

    if (isBefore(date, day15)) {
      arrayScales1.push(scale);
    } else {
      arrayScales2.push(scale);
    }
  });

  arrayScales1.forEach((item) => {
    if (item && !mapArray1.has(item.id)) {
      mapArray1.set(item.id, {
        id: item.id,
        name: item.name,
        days: [],
      });
    }

    if (item) {
      const entry = mapArray1.get(item.id);
      entry.days.push({
        date: item.date,
        day: item.day,
        month: item.month,
        year: item.year,
        turnId: item.turnId,
        status: item.status,
        startTime: item.startTime,
        lunchTime: item.lunchTime,
        endTime: item.endTime,
        dayOfWeek: item.dayOfWeek,
        turn: item.turn,
      });
    }
  });

  arrayScales2.forEach((item) => {
    if (item && !mapArray2.has(item.id)) {
      mapArray2.set(item.id, {
        id: item.id,
        name: item.name,
        days: [],
      });
    }

    if (item) {
      const entry = mapArray2.get(item.id);
      entry.days.push({
        date: item.date,
        day: item.day,
        month: item.month,
        year: item.year,
        turnId: item.turnId,
        status: item.status,
        startTime: item.startTime,
        lunchTime: item.lunchTime,
        endTime: item.endTime,    
        dayOfWeek: item.dayOfWeek,
        turn: item.turn    
      });
    }
  });

  mapArray1.forEach((value) => resultArray1.push(value));
  mapArray2.forEach((value) => resultArray2.push(value));

  data.push(resultArray1, resultArray2);

  return data;
}