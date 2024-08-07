"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVacationInArray = void 0;
function addVacationInArray(employees) {
    const filteredVacations = employees.filter((item) => item.typeAbsence === "FERIAS");
    employees.forEach((employee) => {
        if (!employee.arrayVacation) {
            employee.arrayVacation = [];
        }
        const vacationsById = filteredVacations.filter((item) => item.idSeler === employee.idSeler);
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
        /* const vacationsById = filteredVacations.filter(
          (item) => item.idSeler === employee.idSeler
        );
    
        console.log(vacationsById);
    
        if (vacationsById) {
          vacationsById.forEach((item) => {
            if (item.idDayOff && item.startVacation && item.finishVacation) {
              item.arrayVacation?.push({
                id: item.idDayOff,
                startVacation: { date: item.startVacation },
                finishVacation: { date: item.finishVacation },
              });
            }
          });
        } */
    });
}
exports.addVacationInArray = addVacationInArray;
/*
  data.forEach((employee) => {
    if (!employee.arrayVacation) {
      employee.arrayVacation = [];
    }

    const vacationsById = filteredVacations.filter(
      (item) => item.idSeler == employee.idSeler
    );

    vacationsById.forEach((item) => {
      if (employee.typeAbsence === "FERIAS") {
        if (item.idDayOff && item.startVacation && item.finishVacation) {
          item.arrayVacation?.push({
            id: item.idDayOff,
            startVacation: { date: item.startVacation },
            finishVacation: { date: item.finishVacation },
          });
        }
      }
    });
   
  }); */
