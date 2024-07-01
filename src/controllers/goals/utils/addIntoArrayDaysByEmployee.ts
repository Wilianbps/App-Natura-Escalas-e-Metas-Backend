interface IGoalsByWeek {
  id: string
  codeStore: string
  name: string
  date: string
  goalDay: number
  goalDayByEmployee:number
  dayOfWeek: number;
}

type Day = IGoalsByWeek | null;
type Week = Day[];
type WeeksArray = Week[];

export function addIntoArrayDaysByEmployee(goals: WeeksArray) {

  const result: WeeksArray = [];

  goals.forEach((week) => {
    const map = new Map();
    const weekResult: Week = [];
    week.forEach((item) => {
      if (item && !map.has(item.id)) {
        map.set(item.id, {
          id: item.id,
          name: item.name,
          codeStore: item.codeStore,
          days: [],
        });
      }

      if (item) {
        const entry = map.get(item.id);
        entry.days.push({
          date: item.date,
          goalDay: item.goalDay,
          goalDayByEmployee: item.goalDayByEmployee,
          dayOfWeek: item.dayOfWeek
        });
      }
    });
    map.forEach((value) => weekResult.push(value));
    result.push(weekResult);
  });

  return result;
}
