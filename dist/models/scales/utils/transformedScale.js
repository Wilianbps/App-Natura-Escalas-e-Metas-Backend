"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformedScale = void 0;
function transformedScale(scale) {
    return scale.map((item) => {
        let objScale = {};
        const data = Object.entries(item).map(([_key, value], index) => {
            let array = [];
            if (index > 5) {
                array.push({ id: index - 5, type: value });
            }
            return array;
        });
        const options = data.flat();
        let index = options.findIndex((option) => option.type === "T" || option.type === "R");
        objScale = {
            id: item.id,
            name: item.name,
            date: item.date,
            /*  turn: item.idTurn === 1 ? "T1": item.idTurn === 2 ? "T2" : item.idTurn === 3 && "T3", */
            turn: index >= 0 && index <= 7
                ? "T1"
                : index >= 8 && index <= 14
                    ? "T2"
                    : index >= 15 && index <= 30 && "T3",
            status: item.status === 1 ? true : false,
            /*       status: updateStatus(item.status, options), */
            activeDays: Number(item.activeDays),
            options: options,
        };
        return objScale;
    });
}
exports.transformedScale = transformedScale;
