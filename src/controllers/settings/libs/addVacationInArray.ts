import { IEmployee } from "src/models/settings/settings";

export function addVacationInArray(employees: IEmployee[]) {
  const filteredVacations = employees.filter(
    (item) => item.typeAbsence === "FERIAS"
  );

  employees.forEach((employee) => {
    if (!employee.arrayVacation) {
      employee.arrayVacation = [];
    }

    const vacationsById = filteredVacations.filter(
      (item) => item.idSeler === employee.idSeler
    );

    vacationsById.forEach((item) => {
      // Verifica se os campos necessários estão preenchidos
      if (item.idDayOff && item.startVacation && item.finishVacation) {
        // Adiciona a informação da férias no array de férias do funcionário
        employee.arrayVacation.push({
          id: item.idDayOff,
          startVacation: item.startVacation,
          finishVacation: item.finishVacation,
        });
      }
    });

  
  });
}
