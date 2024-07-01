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
type Week = {
  days: Day[];
  amountWeek: number;
};
type WeeksArray = Week[];

interface Employee {
  id: string;
  name: string;
  codeStore: string;
  totalAmountMonth: number;
  weeks: WeeksArray;
}

interface SeparateGoalsByEmployeesResult {
  employeesByWeeks: Employee[];
  weeksSums: number[];
}

export function separateGoalsByEmployees(
  goals: IGoals[],
  month: number,
  year: number
): SeparateGoalsByEmployeesResult {
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

  // Transformar o objeto arraysByIds em um array de arrays com id, name e codeStore
  const arrayEmployees: {
    id: string;
    name: string;
    codeStore: string;
    goals: IGoals[];
  }[] = Object.keys(arraysByIds).map((id) => {
    const employeeGoals = arraysByIds[id];
    const { name, codeStore } = employeeGoals[0]; // Presume que todos os objetos de um mesmo id possuem o mesmo name e codeStore
    return {
      id,
      name,
      codeStore,
      goals: employeeGoals,
    };
  });

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

  // Função para separar os goals por semanas
  const separateByWeeks = (
    goals: IGoals[],
    month: number,
    year: number
  ): WeeksArray => {
    const weeksArray: WeeksArray = Array.from(
      { length: numberOfWeeks },
      () => ({
        days: [],
        amountWeek: 0,
      })
    );

    result.forEach((item) => {
      item.setUTCHours(0, 0, 0, 0);
    });

    for (let weekNumber = 0; weekNumber < numberOfWeeks; weekNumber++) {
      let amountWeek = 0;

      goals.forEach((item) => {
        const date = new Date(item.date);
        console.log("Date", date); // Verifique se as datas são válidas
        let dayOfWeek = getDay(date) + 1;

        if (dayOfWeek === 8) {
          dayOfWeek = 1;
        }

        if (
          (isAfter(date, result[weekNumber]) ||
            isSameDay(date, result[weekNumber])) &&
          isBefore(date, result[weekNumber + 1])
        ) {
          weeksArray[weekNumber].days.push({ ...item, dayOfWeek });
          weeksArray[weekNumber].amountWeek += item.goalDayByEmployee;
          amountWeek += item.goalDayByEmployee;
        } else if (
          (result[weekNumber + 1] === undefined &&
            isAfter(date, result[weekNumber])) ||
          isSameDay(date, result[weekNumber])
        ) {
          weeksArray[weekNumber].days.push({ ...item, dayOfWeek });
          weeksArray[weekNumber].amountWeek += item.goalDayByEmployee;
          amountWeek += item.goalDayByEmployee;
        }
      });

      // Armazenar a soma da semana atual como parte do objeto de semana
      weeksArray[weekNumber].amountWeek = amountWeek;
    }

    return weeksArray;
  };

  // Para cada funcionário, separar os goals por semanas e calcular totalAmountWeeks
  const employeesByWeeks: Employee[] = arrayEmployees.map((employee) => {
    const weeks = separateByWeeks(employee.goals, month, year);
    const totalAmountMonth = weeks.reduce(
      (total, week) => total + week.amountWeek,
      0
    );
    return {
      id: employee.id,
      name: employee.name,
      codeStore: employee.codeStore,
      totalAmountMonth,
      weeks,
    };
  });

  const totalAmountWeeks = (): number[] => {
    let dataWeeks: number[] = [];
    let total = 0;
    for (let i = 0; i < numberOfWeeks; i++) {
      employeesByWeeks.map((obj) => {
        total += obj.weeks[i].amountWeek;
      });
      dataWeeks.push(total);
      total = 0;
    }
    return dataWeeks;
  };

  const weeksSums = totalAmountWeeks();

  return {
    employeesByWeeks,
    weeksSums,
  };
}
