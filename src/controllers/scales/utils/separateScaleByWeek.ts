import {
  eachWeekOfInterval,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";

export interface IScaleSummary {
  id: string;
  name: string;
  date: string;
  day: string;
  month: string;
  year: string;
  turnId: number;
  status: number;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
}

type Day = IScaleSummary | null;
type Week = Day[];
type WeeksArray = Week[];

export function separateScaleByWeek(
  scaleSummary: IScaleSummary[],
  month: number,
  year: number
) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const result = eachWeekOfInterval(
    {
      start: firstDay,
      end: lastDay,
    },
    { weekStartsOn: 1 }
  );

  const numberOfWeeks = result.length;

  const weeksArray: WeeksArray = Array.from(
    { length: numberOfWeeks },
    () => []
  );

  result.forEach((item) => {
    item.setUTCHours(0, 0, 0, 0);
  });

  
  for (let weekNumber = 0; weekNumber < numberOfWeeks; weekNumber++) {

    scaleSummary.forEach((item) => {
      const date = item.date;

      let dayOfWeek = getDay(date) + 1;

      if (dayOfWeek === 8) {
        dayOfWeek = 1;
      }

      if (
        (isAfter(date, result[weekNumber]) ||
          isSameDay(date, result[weekNumber])) &&
        isBefore(date, result[weekNumber + 1])
      ) {
        weeksArray[weekNumber].push({ ...item, dayOfWeek });
      } else if (
        (result[weekNumber + 1] === undefined &&
          isAfter(date, result[weekNumber])) ||
        isSameDay(date, result[weekNumber])
      ) {
        weeksArray[weekNumber].push({ ...item, dayOfWeek });
      }
    });
  }
 
  return weeksArray;
}
