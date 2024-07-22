import { formatName } from "./../../../utils/formatName";

interface IGoals {
  id: string;
  name: string;
  goalDayByEmployee: number;
}

interface IGoalTotal {
  id: string;
  name: string;
  metas: number;
}

export function calculateGoalMonthByEmployee(goals: IGoals[]): IGoalTotal[] {
  
  const map = new Map<string, IGoalTotal>();

  goals.forEach((goal) => {
    if (goal) {
      if (!map.has(goal.id)) {
        map.set(goal.id, {
          id: goal.id,
          name: formatName(goal.name)!,
          metas: goal.goalDayByEmployee,
        });
      } else {
        const entry = map.get(goal.id);
        if (entry) {
          entry.metas += goal.goalDayByEmployee;
        }
      }
    }
  });

  return Array.from(map.values());
}
