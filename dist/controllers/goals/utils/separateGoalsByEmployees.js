"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separateGoalsByEmployees = void 0;
const date_fns_1 = require("date-fns");
function separateGoalsByEmployees(goals, month, year) {
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
    // Transformar o objeto arraysByIds em um array de arrays com id, name e codeStore
    const arrayEmployees = Object.keys(arraysByIds).map((id) => {
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
    const result = (0, date_fns_1.eachWeekOfInterval)({
        start: firstDay,
        end: lastDay,
    }, { weekStartsOn: 1 });
    const numberOfWeeks = result.length;
    // Função para separar os goals por semanas
    const separateByWeeks = (goals, month, year) => {
        const weeksArray = Array.from({ length: numberOfWeeks }, () => ({
            days: [],
            amountWeek: 0,
        }));
        result.forEach((item) => {
            item.setUTCHours(0, 0, 0, 0);
        });
        for (let weekNumber = 0; weekNumber < numberOfWeeks; weekNumber++) {
            let amountWeek = 0;
            goals.forEach((item) => {
                const date = new Date(item.date);
                let dayOfWeek = (0, date_fns_1.getDay)(date) + 1;
                if (dayOfWeek === 8) {
                    dayOfWeek = 1;
                }
                if (((0, date_fns_1.isAfter)(date, result[weekNumber]) ||
                    (0, date_fns_1.isSameDay)(date, result[weekNumber])) &&
                    (0, date_fns_1.isBefore)(date, result[weekNumber + 1])) {
                    weeksArray[weekNumber].days.push(Object.assign(Object.assign({}, item), { dayOfWeek }));
                    weeksArray[weekNumber].amountWeek += item.goalDayByEmployee;
                    amountWeek += item.goalDayByEmployee;
                }
                else if ((result[weekNumber + 1] === undefined &&
                    (0, date_fns_1.isAfter)(date, result[weekNumber])) ||
                    (0, date_fns_1.isSameDay)(date, result[weekNumber])) {
                    weeksArray[weekNumber].days.push(Object.assign(Object.assign({}, item), { dayOfWeek }));
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
    const employeesByWeeks = arrayEmployees.map((employee) => {
        const weeks = separateByWeeks(employee.goals, month, year);
        const totalAmountMonth = weeks.reduce((total, week) => total + week.amountWeek, 0);
        return {
            id: employee.id,
            name: employee.name,
            codeStore: employee.codeStore,
            totalAmountMonth,
            weeks,
        };
    });
    const totalAmountWeeks = () => {
        let dataWeeks = [];
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
exports.separateGoalsByEmployees = separateGoalsByEmployees;
