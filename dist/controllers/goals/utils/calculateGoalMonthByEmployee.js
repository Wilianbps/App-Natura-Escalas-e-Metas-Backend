"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGoalMonthByEmployee = void 0;
const formatName_1 = require("./../../../utils/formatName");
function calculateGoalMonthByEmployee(goals) {
    const map = new Map();
    goals.forEach((goal) => {
        if (goal) {
            if (!map.has(goal.id)) {
                map.set(goal.id, {
                    id: goal.id,
                    name: (0, formatName_1.formatName)(goal.name),
                    metas: goal.goalDayByEmployee,
                });
            }
            else {
                const entry = map.get(goal.id);
                if (entry) {
                    entry.metas += goal.goalDayByEmployee;
                }
            }
        }
    });
    return Array.from(map.values());
}
exports.calculateGoalMonthByEmployee = calculateGoalMonthByEmployee;
