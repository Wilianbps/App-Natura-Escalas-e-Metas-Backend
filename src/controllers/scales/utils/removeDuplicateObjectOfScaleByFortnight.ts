import { isAfter, isBefore, isSameDay, setHours, setMinutes, startOfDay, subHours, getDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export interface IDayDetails {
  date: string;   // Data em formato ISO
  day: number;    // Dia do mês
  month: number;  // Mês
  year: number;   // Ano
  turnId: number; // ID do turno
  status: number; // Status do dia
  startTime: string; // Horário de início
  lunchTime: string; // Horário de almoço
  endTime: string;   // Horário de término
  dayOfWeek: number; // Dia da semana
  turn: string;      // Turno (T1, T2, T3)
}

export interface IScaleSummary {
  id: string; // ID do colaborador
  name: string; // Nome do colaborador
  days: IDayDetails[]; // Array de detalhes do dia
}

export function removeDuplicateObjectOfScaleByFortnight(scaleSummary: IScaleSummary[][]): IScaleSummary[][] {
  function verificarTurno(startTime: string): string {
    const turno1Inicio = subHours(setMinutes(setHours(startOfDay(new Date(startTime)), 7), 0), 3);
    const turno2Inicio = subHours(setMinutes(setHours(startOfDay(new Date(startTime)), 11), 0), 3);
    const turno3Inicio = subHours(setMinutes(setHours(startOfDay(new Date(startTime)), 14), 30), 3);

    if (isAfter(new Date(startTime), turno1Inicio) || isSameDay(new Date(startTime), turno1Inicio)) {
      if (isBefore(new Date(startTime), turno2Inicio)) {
        return "T1";
      }
    }
    if (isAfter(new Date(startTime), turno2Inicio) || isSameDay(new Date(startTime), turno2Inicio)) {
      if (isBefore(new Date(startTime), turno3Inicio)) {
        return "T2";
      }
    }
    if (isSameDay(new Date(startTime), turno3Inicio) || isAfter(new Date(startTime), turno3Inicio)) {
      return "T3";
    }
    return "";
  }

  function processFortnight(fortnight: IScaleSummary[]): IScaleSummary[] {
    const resultMap = new Map<string, IScaleSummary>(); // Mapa para armazenar colaboradores únicos

    fortnight.forEach((item) => {
      if (item && item.days) {
        item.days.forEach((day) => {
          if (day) {
            const turn = verificarTurno(day.startTime); // Verifica o turno baseado em startTime

            // Calcula o dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
            let dayOfWeek = getDay(new Date(day.date)) + 1; // Ajusta para 1 = Domingo, 2 = Segunda, etc.
            if (dayOfWeek === 8) dayOfWeek = 1; // Se o resultado for 8 (correspondente a um domingo), ajusta para 1

            // Se não existe entrada para este colaborador, cria uma nova
            if (!resultMap.has(item.id)) {
              resultMap.set(item.id, {
                id: item.id,
                name: item.name,
                days: [
                  {
                    date: day.date,
                    day: day.day,
                    month: day.month,
                    year: day.year,
                    turnId: day.turnId,
                    status: day.status,
                    startTime: day.startTime !== null ? formatInTimeZone(day.startTime, "UTC", "HH:mm")  : "",
                    lunchTime: day.lunchTime !== null ? formatInTimeZone(day.lunchTime, "UTC", "HH:mm")  : "",
                    endTime: day.endTime !== null ? formatInTimeZone(day.endTime, "UTC", "HH:mm") : "",
                    dayOfWeek, // Armazena o cálculo do dayOfWeek
                    turn,      // Armazena o turno calculado
                  },
                ],
              });
            } else {
              // Se já existir, adicione o dia ao colaborador correspondente
              const existing = resultMap.get(item.id);
              // Verifica se o dia já foi adicionado
              if (!existing!.days.some(existingDay => existingDay.date === day.date)) {
                existing!.days.push({
                  date: day.date,
                  day: day.day,
                  month: day.month,
                  year: day.year,
                  turnId: day.turnId,
                  status: day.status,
                  startTime: day.startTime !== null ? formatInTimeZone(day.startTime, "UTC", "HH:mm") : "",
                  lunchTime: day.lunchTime !== null ? formatInTimeZone(day.lunchTime, "UTC", "HH:mm")  : "",
                  endTime: day.endTime !== null ? formatInTimeZone(day.endTime, "UTC", "HH:mm") : "",
                  dayOfWeek, // Armazena o cálculo do dayOfWeek
                  turn,      // Armazena o turno calculado
                });
              }
            }
          }
        });
      }
    });

    return Array.from(resultMap.values()); // Retorna um array com os colaboradores únicos
  }

  // Processa cada uma das quinzena separadamente
  const firstFortnight = processFortnight(scaleSummary[0]);  // Primeiro array (dias 1 a 15)
  const secondFortnight = processFortnight(scaleSummary[1]); // Segundo array (dias 16 em diante)

  return [firstFortnight, secondFortnight]; // Retorna os dois arrays processados
}
