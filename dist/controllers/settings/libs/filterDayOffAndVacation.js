"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDayOffAndVacation = void 0;
const date_fns_tz_1 = require("date-fns-tz");
function filterDayOffAndVacation(data) {
    data.map((item) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const filteredArrayDayOff = [];
        const filteredVacation = [];
        item.arrayDaysOff.forEach((dayOff) => {
            const dateFormated = (0, date_fns_tz_1.formatInTimeZone)(dayOff.date, "UTC", "dd-MM-yyyy");
            var partsOfDate = dateFormated.split("-");
            // Obter mês e ano a partir das partes
            var month = parseInt(partsOfDate[1], 10);
            var year = parseInt(partsOfDate[2], 10);
            if (month >= currentMonth && year >= currentYear) {
                filteredArrayDayOff.push(dayOff);
            }
        });
        item.arrayDaysOff = filteredArrayDayOff;
        item.arrayVacation.forEach((dateVacation) => {
            const dateFinishVacation = (0, date_fns_tz_1.formatInTimeZone)(dateVacation.finishVacation, "UTC", "dd-MM-yyyy");
            var partsOfDate = dateFinishVacation.split("-");
            var month = parseInt(partsOfDate[1], 10);
            var year = parseInt(partsOfDate[2], 10);
            if (month >= currentMonth && year >= currentYear) {
                filteredVacation.push(dateVacation);
            }
        });
        item.arrayVacation = filteredVacation;
    });
    return data;
}
exports.filterDayOffAndVacation = filterDayOffAndVacation;
