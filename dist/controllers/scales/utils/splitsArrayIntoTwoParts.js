"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitsArrayIntoTwoParts = void 0;
const date_fns_1 = require("date-fns");
function splitsArrayIntoTwoParts(scales) {
    const arrayScales1 = [];
    const resultArray1 = [];
    const mapArray1 = new Map();
    const arrayScales2 = [];
    const resultArray2 = [];
    const mapArray2 = new Map();
    let data = [];
    scales.forEach((scale) => {
        const isoDate = new Date(scale.date).toISOString();
        const partDate = isoDate.toString().substring(0, 7);
        const completeDate = `${partDate}-15`;
        const day15 = (0, date_fns_1.parse)(completeDate, "yyyy-MM-dd", new Date().toISOString());
        const date = new Date(scale.date);
        if ((0, date_fns_1.isBefore)(date, day15)) {
            arrayScales1.push(scale);
        }
        else {
            arrayScales2.push(scale);
        }
    });
    arrayScales1.forEach((item) => {
        if (item && !mapArray1.has(item.id)) {
            mapArray1.set(item.id, {
                id: item.id,
                name: item.name,
                days: [],
            });
        }
        if (item) {
            const entry = mapArray1.get(item.id);
            entry.days.push({
                date: item.date,
                day: item.day,
                month: item.month,
                year: item.year,
                turnId: item.turnId,
                status: item.status,
                startTime: item.startTime,
                endTime: item.endTime,
                dayOfWeek: item.dayOfWeek,
                turn: item.turn,
            });
        }
    });
    arrayScales2.forEach((item) => {
        if (item && !mapArray2.has(item.id)) {
            mapArray2.set(item.id, {
                id: item.id,
                name: item.name,
                days: [],
            });
        }
        if (item) {
            const entry = mapArray2.get(item.id);
            entry.days.push({
                date: item.date,
                day: item.day,
                month: item.month,
                year: item.year,
                turnId: item.turnId,
                status: item.status,
                startTime: item.startTime,
                endTime: item.endTime,
                dayOfWeek: item.dayOfWeek,
                turn: item.turn
            });
        }
    });
    mapArray1.forEach((value) => resultArray1.push(value));
    mapArray2.forEach((value) => resultArray2.push(value));
    data.push(resultArray1, resultArray2);
    return data;
}
exports.splitsArrayIntoTwoParts = splitsArrayIntoTwoParts;
