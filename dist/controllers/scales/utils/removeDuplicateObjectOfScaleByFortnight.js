"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicateObjectOfScaleByFortnight = void 0;
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
function removeDuplicateObjectOfScaleByFortnight(scaleSummary) {
    function verificarTurno(startTime) {
        const turno1Inicio = (0, date_fns_1.subHours)((0, date_fns_1.setMinutes)((0, date_fns_1.setHours)((0, date_fns_1.startOfDay)(new Date(startTime)), 7), 0), 3);
        const turno2Inicio = (0, date_fns_1.subHours)((0, date_fns_1.setMinutes)((0, date_fns_1.setHours)((0, date_fns_1.startOfDay)(new Date(startTime)), 11), 0), 3);
        const turno3Inicio = (0, date_fns_1.subHours)((0, date_fns_1.setMinutes)((0, date_fns_1.setHours)((0, date_fns_1.startOfDay)(new Date(startTime)), 14), 30), 3);
        if ((0, date_fns_1.isAfter)(new Date(startTime), turno1Inicio) || (0, date_fns_1.isSameDay)(new Date(startTime), turno1Inicio)) {
            if ((0, date_fns_1.isBefore)(new Date(startTime), turno2Inicio)) {
                return "T1";
            }
        }
        if ((0, date_fns_1.isAfter)(new Date(startTime), turno2Inicio) || (0, date_fns_1.isSameDay)(new Date(startTime), turno2Inicio)) {
            if ((0, date_fns_1.isBefore)(new Date(startTime), turno3Inicio)) {
                return "T2";
            }
        }
        if ((0, date_fns_1.isSameDay)(new Date(startTime), turno3Inicio) || (0, date_fns_1.isAfter)(new Date(startTime), turno3Inicio)) {
            return "T3";
        }
        return "";
    }
    function processFortnight(fortnight) {
        const resultMap = new Map(); // Mapa para armazenar colaboradores únicos
        fortnight.forEach((item) => {
            if (item && item.days) {
                item.days.forEach((day) => {
                    if (day) {
                        const turn = verificarTurno(day.startTime); // Verifica o turno baseado em startTime
                        // Calcula o dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
                        let dayOfWeek = (0, date_fns_1.getDay)(new Date(day.date)) + 1; // Ajusta para 1 = Domingo, 2 = Segunda, etc.
                        if (dayOfWeek === 8)
                            dayOfWeek = 1; // Se o resultado for 8 (correspondente a um domingo), ajusta para 1
                        // Se não existe entrada para este colaborador, cria uma nova
                        if (!resultMap.has(item.id)) {
                            resultMap.set(item.id, {
                                id: item.id,
                                name: item.name,
                                days: [
                                    {
                                        date: day.date,
                                        day: day.day,
                                        month: day.month,
                                        year: day.year,
                                        turnId: day.turnId,
                                        status: day.status,
                                        startTime: day.startTime !== null ? (0, date_fns_tz_1.formatInTimeZone)(day.startTime, "UTC", "HH:mm") : "",
                                        endTime: day.endTime !== null ? (0, date_fns_tz_1.formatInTimeZone)(day.endTime, "UTC", "HH:mm") : "",
                                        dayOfWeek, // Armazena o cálculo do dayOfWeek
                                        turn, // Armazena o turno calculado
                                    },
                                ],
                            });
                        }
                        else {
                            // Se já existir, adicione o dia ao colaborador correspondente
                            const existing = resultMap.get(item.id);
                            // Verifica se o dia já foi adicionado
                            if (!existing.days.some(existingDay => existingDay.date === day.date)) {
                                existing.days.push({
                                    date: day.date,
                                    day: day.day,
                                    month: day.month,
                                    year: day.year,
                                    turnId: day.turnId,
                                    status: day.status,
                                    startTime: day.startTime !== null ? (0, date_fns_tz_1.formatInTimeZone)(day.startTime, "UTC", "HH:mm") : "",
                                    endTime: day.endTime !== null ? (0, date_fns_tz_1.formatInTimeZone)(day.endTime, "UTC", "HH:mm") : "",
                                    dayOfWeek, // Armazena o cálculo do dayOfWeek
                                    turn, // Armazena o turno calculado
                                });
                            }
                        }
                    }
                });
            }
        });
        return Array.from(resultMap.values()); // Retorna um array com os colaboradores únicos
    }
    // Processa cada uma das quinzena separadamente
    const firstFortnight = processFortnight(scaleSummary[0]); // Primeiro array (dias 1 a 15)
    const secondFortnight = processFortnight(scaleSummary[1]); // Segundo array (dias 16 em diante)
    return [firstFortnight, secondFortnight]; // Retorna os dois arrays processados
}
exports.removeDuplicateObjectOfScaleByFortnight = removeDuplicateObjectOfScaleByFortnight;
