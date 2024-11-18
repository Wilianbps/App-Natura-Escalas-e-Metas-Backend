import {
  isAfter,
  isBefore,
  isSameDay,
  setHours,
  setMinutes,
  startOfDay,
  subHours,
} from "date-fns";
import { formatInTimeZone  } from "date-fns-tz";

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
  turn: string;
}

type Day = IScaleSummary | null;
type Week = Day[];
type WeeksArray = Week[];

export function removeDuplicateObject(scaleSummary: WeeksArray) {

/*   console.log("scaleSummary", scaleSummary) */

  function verificarTurno(startTime: string, endTime: string): string {
    console.log("startTime", startTime)

    // Definindo os intervalos de cada turno
    
    const turno1Inicio = subHours(setMinutes(setHours(startOfDay(startTime), 7), 0), 3);
    const turno2Inicio = subHours(setMinutes(setHours(startOfDay(startTime), 11), 0), 3);
    const turno3Inicio = subHours(setMinutes(setHours(startOfDay(startTime), 14), 30), 3);
  
    // Verificando em qual intervalo a data/hora está
    if ((isAfter(startTime, turno1Inicio) ||
    isSameDay(startTime, turno1Inicio)) && isBefore(startTime, turno2Inicio)) {
      return "T1";
    } 
     if ((isAfter(startTime, turno2Inicio) ||
    isSameDay(startTime, turno2Inicio)) && isBefore(startTime, turno3Inicio)) {
      return "T2";
    } 
    if (isSameDay(startTime, turno3Inicio) || isAfter(startTime, turno3Inicio)) {
      return "T3";
    } else {
      return "";
    }
  }

  const result: WeeksArray = [];

  scaleSummary.forEach((week) => {
    const map = new Map();
    const weekResult: Week = [];
    week.forEach((item) => {
      if (item && !map.has(item.id)) {
        map.set(item.id, {
          id: item.id,
          name: item.name,
          dayOfWeek: item.dayOfWeek,
          days: [],
        });
      }

      if (item) {
        const turn = verificarTurno(item.startTime, item.endTime);
        const entry = map.get(item.id);
        entry.days.push({
          date: item.date,
          day: item.day,
          month: item.month,
          year: item.year,
          turnId: item.turnId,
          status: item.status,
          startTime: item.startTime !== null ? formatInTimeZone(item.startTime, "UTC", "HH:mm") : "",
          endTime: item.startTime !== null ? formatInTimeZone(item.endTime, "UTC", "HH:mm") : "",
          dayOfWeek: item.dayOfWeek,
          turn,
        });
      }
    });
    map.forEach((value) => weekResult.push(value));
    result.push(weekResult);
  });

  return result;
}
