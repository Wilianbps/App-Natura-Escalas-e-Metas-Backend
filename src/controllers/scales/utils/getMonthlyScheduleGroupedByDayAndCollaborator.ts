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

  // Usa o primeiro registro como referência
  const sampleDate = scaleArray[0].date;

  // Extrai ano, mês e dia corretamente no fuso UTC
  const year = parseInt(formatInTimeZone(sampleDate, "UTC", "yyyy"));
  const month = parseInt(formatInTimeZone(sampleDate, "UTC", "MM"));
  const day = parseInt(formatInTimeZone(sampleDate, "UTC", "dd"));

  // Pega o último dia do mês
  const lastDay = getDaysInMonth(new Date(year, month - 1));

  // Agrupa colaboradores
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

    // Adiciona registros reais
    entries.forEach(e => {
      const day = parseInt(formatInTimeZone(e.date, "UTC", "dd"));
      const daily: DailySchedule = {
        date: e.date,
        status: e.status,
        activeDays: parseInt(e.activeDays, 10),
        absenceId: e.absenceId,
      };
      if (day <= 15) firstDays.push(daily);
      else secondDays.push(daily);
    });

    // Preenche dias faltantes na primeira quinzena
    for (let d = 1; d <= 15; d++) {
      if (!firstDays.some(dayObj => parseInt(formatInTimeZone(dayObj.date, "UTC", "dd")) === d)) {
        firstDays.push({
          date: new Date(Date.UTC(year, month - 1, d)),
          status: null,
          activeDays: null,
          absenceId: null,
        });
      }
    }

    // Preenche dias faltantes na segunda quinzena
    for (let d = 16; d <= lastDay; d++) {
      if (!secondDays.some(dayObj => parseInt(formatInTimeZone(dayObj.date, "UTC", "dd")) === d)) {
        secondDays.push({
          date: new Date(Date.UTC(year, month - 1, d)),
          status: null,
          activeDays: null,
          absenceId: null,
        });
      }
    }

    // Ordena dias
    firstDays.sort((a, b) => a.date.getTime() - b.date.getTime());
    secondDays.sort((a, b) => a.date.getTime() - b.date.getTime());

    firstHalf.push({ id, name, days: firstDays });
    secondHalf.push({ id, name, days: secondDays });
  });

  // Ordena colaboradores por nome
  const sortByName = (a: PersonMonthlySchedule, b: PersonMonthlySchedule) =>
    a.name.localeCompare(b.name);

  return [firstHalf.sort(sortByName), secondHalf.sort(sortByName)];
}
