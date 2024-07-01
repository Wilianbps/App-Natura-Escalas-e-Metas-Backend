import {
  eachWeekOfInterval,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";

interface IGoals {
  id: string;
  codeStore: string;
  name: string;
  date: string;
  goalDay: number;
  goalDayByEmployee: number;
  dayOfWeek: number;
}

type Day = IGoals | null;
type Week = Day[];
type WeeksArray = Week[];

export function separateGoalsByEmployees(
  goals: IGoals[],
  month: number,
  year: number
): { id: string; weeks: WeeksArray }[] {
  // Objeto para armazenar arrays separados por ids
  const arraysByIds: { [key: string]: IGoals[] } = {};

  // Iterar sobre o array de goals
  goals.forEach((goal) => {
    // Se o id ainda não existir no objeto arraysByIds, cria um novo array
    if (!arraysByIds[goal.id]) {
      arraysByIds[goal.id] = [];
    }
    // Adiciona o goal ao array correspondente ao seu id
    arraysByIds[goal.id].push(goal);
  });

  // Transformar o objeto arraysByIds em um array de arrays
  const arrayEmployees: { id: string; goals: IGoals[] }[] = Object.keys(arraysByIds).map(id => ({
    id,
    goals: arraysByIds[id]
  }));

  // Função para separar os goals por semanas
  const separateByWeeks = (goals: IGoals[], month: number, year: number): WeeksArray => {
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
      goals.forEach((item) => {
        const date = new Date(item.date);

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
  };

  // Para cada funcionário, separar os goals por semanas
  const employeesWithWeeks = arrayEmployees.map(employee => ({
    id: employee.id,
    weeks: separateByWeeks(employee.goals, month, year)
  }));

  return employeesWithWeeks;
}
