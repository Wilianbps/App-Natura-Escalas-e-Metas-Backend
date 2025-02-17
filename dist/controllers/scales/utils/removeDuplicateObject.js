"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicateObject = void 0;
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
function removeDuplicateObject(scaleSummary) {
    function verificarTurno(startTime, endTime) {
        // Definindo os intervalos de cada turno
        const turno1Inicio = (0, date_fns_1.subHours)((0, date_fns_1.setMinutes)((0, date_fns_1.setHours)((0, date_fns_1.startOfDay)(startTime), 7), 0), 3);
        const turno2Inicio = (0, date_fns_1.subHours)((0, date_fns_1.setMinutes)((0, date_fns_1.setHours)((0, date_fns_1.startOfDay)(startTime), 11), 0), 3);
        const turno3Inicio = (0, date_fns_1.subHours)((0, date_fns_1.setMinutes)((0, date_fns_1.setHours)((0, date_fns_1.startOfDay)(startTime), 14), 30), 3);
        // Verificando em qual intervalo a data/hora está
        if (((0, date_fns_1.isAfter)(startTime, turno1Inicio) ||
            (0, date_fns_1.isSameDay)(startTime, turno1Inicio)) && (0, date_fns_1.isBefore)(startTime, turno2Inicio)) {
            return "T1";
        }
        if (((0, date_fns_1.isAfter)(startTime, turno2Inicio) ||
            (0, date_fns_1.isSameDay)(startTime, turno2Inicio)) && (0, date_fns_1.isBefore)(startTime, turno3Inicio)) {
            return "T2";
        }
        if ((0, date_fns_1.isSameDay)(startTime, turno3Inicio) || (0, date_fns_1.isAfter)(startTime, turno3Inicio)) {
            return "T3";
        }
        else {
            return "";
        }
    }
    const result = [];
    scaleSummary.forEach((week) => {
        const map = new Map();
        const weekResult = [];
        week.forEach((item) => {
            if (item && !map.has(item.id)) {
                map.set(item.id, {
                    id: item.id,
                    name: item.name,
                    dayOfWeek: item.dayOfWeek,
                    days: [],
                });
            }
            if (item) {
                const turn = verificarTurno(item.startTime, item.endTime);
                const entry = map.get(item.id);
                entry.days.push({
                    date: item.date,
                    day: item.day,
                    month: item.month,
                    year: item.year,
                    turnId: item.turnId,
                    status: item.status,
                    startTime: item.startTime !== null ? (0, date_fns_tz_1.formatInTimeZone)(item.startTime, "UTC", "HH:mm") : "",
                    endTime: item.startTime !== null ? (0, date_fns_tz_1.formatInTimeZone)(item.endTime, "UTC", "HH:mm") : "",
                    dayOfWeek: item.dayOfWeek,
                    turn,
                });
            }
        });
        map.forEach((value) => weekResult.push(value));
        result.push(weekResult);
    });
    return result;
}
exports.removeDuplicateObject = removeDuplicateObject;
