"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDayOffInArray = void 0;
function addDayOffInArray(employees) {
    const daysOff = employees.filter((dayOff) => dayOff.typeAbsence === "FOLGA");
    employees.forEach((employee) => {
        if (!employee.arrayDaysOff) {
            employee.arrayDaysOff = [];
        }
        const employeeDaysOff = daysOff.filter((dayOff) => dayOff.idSeler == employee.idSeler);
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
exports.addDayOffInArray = addDayOffInArray;
