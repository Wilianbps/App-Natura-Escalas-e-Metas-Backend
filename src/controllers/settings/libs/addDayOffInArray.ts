import { IEmployee } from "src/models/settings/settings";

export function addDayOffInArray(employees: IEmployee[]) {
  const daysOff = employees.filter((dayOff) => dayOff.typeAbsence === "FOLGA");

  employees.forEach((employee) => {
    if (!employee.arrayDaysOff) {
      employee.arrayDaysOff = [];
    }

    const employeeDaysOff = daysOff.filter(
      (dayOff) => dayOff.idSeler == employee.idSeler
    );

    employeeDaysOff.forEach((dayOff) => {
      if (dayOff.idDayOff && dayOff.startVacation) {
        employee.arrayDaysOff.push({
          id: dayOff.idDayOff,
          date: dayOff.startVacation,
        });
      }
    });

  });
}
