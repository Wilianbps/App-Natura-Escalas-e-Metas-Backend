import { getDaysInMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface RawScaleEntry {
  storeCode: string;
  date: Date;
  id: string;
  absenceId: string | null;
  name: string;
  turnId: number;
  status: number;
  activeDays: string;
}

interface DailySchedule {
  date: Date;
  status: number | null;
  activeDays: number | null;
  absenceId: string | null;
}

interface PersonMonthlySchedule {
  id: string;
  name: string;
  days: DailySchedule[];
}

type SplitMonthlySchedule = [PersonMonthlySchedule[], PersonMonthlySchedule[]];

export function getMonthlyScheduleGroupedByDayAndCollaborator(
  scaleArray: RawScaleEntry[]
): SplitMonthlySchedule {
  if (!scaleArray || scaleArray.length === 0) return [[], []];

  const sampleDate = scaleArray[0].date;
  const year = sampleDate.getUTCFullYear();
  const month = sampleDate.getUTCMonth();
  const lastDay = getDaysInMonth(sampleDate);

  const byPerson = new Map<string, { name: string; entries: RawScaleEntry[] }>();
  for (const entry of scaleArray) {
    if (!byPerson.has(entry.id)) {
      byPerson.set(entry.id, { name: entry.name.trim(), entries: [] });
    }
    byPerson.get(entry.id)!.entries.push(entry);
  }

  const firstHalf: PersonMonthlySchedule[] = [];
  const secondHalf: PersonMonthlySchedule[] = [];

  byPerson.forEach(({ name, entries }, id) => {
    const firstDays: DailySchedule[] = [];
    const secondDays: DailySchedule[] = [];

    // Primeiro, adiciona todos os registros reais
    entries.forEach(e => {
      const day = e.date.getUTCDate();
      const daily: DailySchedule = {
        date: e.date,
        status: e.status,
        activeDays: parseInt(e.activeDays, 10),
        absenceId: e.absenceId,
      };
      if (day <= 15) firstDays.push(daily);
      else secondDays.push(daily);
    });

    // Depois, preenche os dias que não existem com status null
    for (let day = 1; day <= 15; day++) {
      if (!firstDays.some(d => d.date.getUTCDate() === day)) {
        firstDays.push({
          date: new Date(Date.UTC(year, month, day)),
          status: null,
          activeDays: null,
          absenceId: null,
        });
      }
    }
    for (let day = 16; day <= lastDay; day++) {
      if (!secondDays.some(d => d.date.getUTCDate() === day)) {
        secondDays.push({
          date: new Date(Date.UTC(year, month, day)),
          status: null,
          activeDays: null,
          absenceId: null,
        });
      }
    }

    // Ordena os dias
    firstDays.sort((a, b) => a.date.getTime() - b.date.getTime());
    secondDays.sort((a, b) => a.date.getTime() - b.date.getTime());

    firstHalf.push({ id, name, days: firstDays });
    secondHalf.push({ id, name, days: secondDays });
  });

  // Ordena os colaboradores pelo nome
  const sortByName = (a: PersonMonthlySchedule, b: PersonMonthlySchedule) =>
    a.name.localeCompare(b.name);

  return [firstHalf.sort(sortByName), secondHalf.sort(sortByName)];
}
