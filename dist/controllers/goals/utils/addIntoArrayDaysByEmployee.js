"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIntoArrayDaysByEmployee = void 0;
function addIntoArrayDaysByEmployee(goals) {
    const result = [];
    goals.forEach((week) => {
        const map = new Map();
        const weekResult = [];
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
exports.addIntoArrayDaysByEmployee = addIntoArrayDaysByEmployee;
