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

  /*   const numberOfWeeks = differenceInCalendarWeeks(lastDay, firstDay) + 1; */

  const numberOfWeeks = result.length;

  const weeksArray: WeeksArray = Array.from(
    { length: numberOfWeeks },
    () => []
  );

  result.forEach((item) => {
    item.setUTCHours(0, 0, 0, 0);
  });

  const firstWeekDay = getDay(firstDay);

  /*  */

  /*   for (
    let i = 0;
    i < firstWeekDay && startOfWeek(firstDay).getTime() <= lastDay.getTime();
    i++
  ) {
    weeksArray[0].push(null);
  } */

  /*   for (let i = 0; i < firstWeekDay; i++) {
    weeksArray[0].push(null);
  } */

  for (let weekNumber = 0; weekNumber < numberOfWeeks; weekNumber++) {
    console.log("weekNumber", weekNumber);
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
  /*  scaleSummary.forEach((item) => {
    const date = new Date(item.date);

    const weekStart = startOfWeek(date);

    const weekNumber = Math.floor(
      (weekStart.getTime() - startOfWeek(firstDay).getTime()) /
        (7 * 24 * 60 * 60 * 1000) +
        1
    );

    weeksArray[weekNumber].push(item);
  }); */

  /*   console.log("firstDay", firstDay);
  console.log("lastDay", lastDay);

  console.log("numberOfWeeks", numberOfWeeks);

  console.log("weeksArray", weeksArray.length); */

  /*   console.log("result", result) */

  return weeksArray;
}
