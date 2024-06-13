
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

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

export function removeDuplicateObject(scaleSummary: WeeksArray){

  const result: WeeksArray = [];

  scaleSummary.forEach((week)=>{
    const map = new Map();
    const weekResult: Week = [];
    week.forEach((item) => {
      if (item && !map.has(item.id)) {
        map.set(item.id, { id: item.id, name: item.name, dayOfWeek: item.dayOfWeek, days: [] });
      }

      if (item) {
        const entry = map.get(item.id);
        entry.days.push({
          date: item.date,
          day: item.day,
          month: item.month,
          year: item.year,
          turnId: item.turnId,
          status: item.status,
          startTime: formatInTimeZone(item.startTime, "UTC", 'HH:mm'),
          endTime: formatInTimeZone(item.endTime, "UTC", 'HH:mm'),
          dayOfWeek: item.dayOfWeek,
        });
      }
    });
    map.forEach((value) => weekResult.push(value));
    result.push(weekResult);
  })

  return result

}