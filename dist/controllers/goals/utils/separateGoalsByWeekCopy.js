"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separateGoalsByEmployees = void 0;
const date_fns_1 = require("date-fns");
function separateGoalsByEmployees(goals, month, year) {
    // Objeto para armazenar arrays separados por ids
    const arraysByIds = {};
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
    const arrayEmployees = Object.keys(arraysByIds).map(id => ({
        id,
        goals: arraysByIds[id]
    }));
    // Função para separar os goals por semanas
    const separateByWeeks = (goals, month, year) => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const result = (0, date_fns_1.eachWeekOfInterval)({
            start: firstDay,
            end: lastDay,
        }, { weekStartsOn: 1 });
        const numberOfWeeks = result.length;
        const weeksArray = Array.from({ length: numberOfWeeks }, () => []);
        result.forEach((item) => {
            item.setUTCHours(0, 0, 0, 0);
        });
        for (let weekNumber = 0; weekNumber < numberOfWeeks; weekNumber++) {
            goals.forEach((item) => {
                const date = new Date(item.date);
                let dayOfWeek = (0, date_fns_1.getDay)(date) + 1;
                if (dayOfWeek === 8) {
                    dayOfWeek = 1;
                }
                if (((0, date_fns_1.isAfter)(date, result[weekNumber]) ||
                    (0, date_fns_1.isSameDay)(date, result[weekNumber])) &&
                    (0, date_fns_1.isBefore)(date, result[weekNumber + 1])) {
                    weeksArray[weekNumber].push(Object.assign(Object.assign({}, item), { dayOfWeek }));
                }
                else if ((result[weekNumber + 1] === undefined &&
                    (0, date_fns_1.isAfter)(date, result[weekNumber])) ||
                    (0, date_fns_1.isSameDay)(date, result[weekNumber])) {
                    weeksArray[weekNumber].push(Object.assign(Object.assign({}, item), { dayOfWeek }));
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
exports.separateGoalsByEmployees = separateGoalsByEmployees;
