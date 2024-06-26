export interface IGoals {
  id: string;
  name: string;
  codeStore: string;
  days: {
    date: string;
    goalDay: number | string;
    goalDayByEmployee: number | string;
    day: number;
  }[];
}

export function addDaysOfMonthIntoArrays(
  array: Array<IGoals[]>,
  month: number,
  year: number
) {
  const arrayPart1 = array[0];

  const arrayPart2 = array[1];

  let data = [];

  const daysOfMonth = new Date(year, month, 0).getDate();

  arrayPart1.forEach((item) => {
    const existingDates = item.days.map(day => new Date(day.date).getUTCDate());
    const newDays = [];
 
    for (let dayNumber = 1; dayNumber <= 15; dayNumber++) {
      if (!existingDates.includes(dayNumber)) {
        newDays.push({
          date: new Date(year, month - 1, dayNumber).toISOString(),
          goalDay: "-",
          goalDayByEmployee: "-",
          day: dayNumber,
        });
      }
    }
  
    item.days.forEach((day) => {
      const data = {
        date: day.date,
        goalDay: day.goalDay,
        goalDayByEmployee: day.goalDayByEmployee,
        day: new Date(day.date).getUTCDate(),
      };
  
      newDays.push(data);
    });
  
    item.days = newDays.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  });

  arrayPart2.forEach((item) => {
    const existingDates = item.days.map(day => new Date(day.date).getUTCDate());
    const newDays = [];
  
    for (let dayNumber = 16; dayNumber <= daysOfMonth; dayNumber++) {
      if (!existingDates.includes(dayNumber)) {
        newDays.push({
          date: new Date(year, month - 1, dayNumber).toISOString(),
          goalDay: "-",
          goalDayByEmployee: "-",
          day: dayNumber,
        });
      }
    }
  
    item.days.forEach((day) => {
      const data = {
        date: day.date,
        goalDay: day.goalDay,
        goalDayByEmployee: day.goalDayByEmployee,
        day: new Date(day.date).getUTCDate(),
      };
  
      newDays.push(data);
    });
  
    item.days = newDays.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  });

/*   array[0].forEach((item=>{
    item.days.forEach((day=>{
      console.log(day.goalDayByEmplyoee)
    }))
  })) */

  data.push(arrayPart1, arrayPart2)

  return data
}
