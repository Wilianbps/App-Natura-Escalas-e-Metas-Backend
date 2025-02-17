"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separateScaleByWeek = void 0;
const date_fns_1 = require("date-fns");
function separateScaleByWeek(scaleSummary, month, year) {
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
        scaleSummary.forEach((item) => {
            const date = item.date;
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
}
exports.separateScaleByWeek = separateScaleByWeek;
