"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFinishedScaleByMonth = exports.findFinishedScaleByMonth = exports.loadMonthScale = exports.findInputFlow = exports.updateScaleByDate = exports.findScaleSummary = exports.findScaleByDate = void 0;
const scalesModels_1 = require("../../models/scales/scalesModels");
const transformedScale_1 = require("../../models/scales/utils/transformedScale");
const separateScaleByWeek_1 = require("./utils/separateScaleByWeek");
const removeDuplicateObject_1 = require("./utils/removeDuplicateObject");
function findScaleByDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { date } = req.query;
            if (!date)
                return res.status(400).send();
            const scale = yield (0, scalesModels_1.selectScaleByDate)(date);
            const result = (0, transformedScale_1.transformedScale)(scale);
            res.status(200).json({ result });
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findScaleByDate = findScaleByDate;
function findScaleSummary(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { month, year } = req.query;
            if (!month || !year)
                return res.status(400).send();
            const getScaleSummary = yield (0, scalesModels_1.selectScaleSummary)(month.toString(), year.toString());
            const scaleSummaryByWeek = (0, separateScaleByWeek_1.separateScaleByWeek)(getScaleSummary, Number(month), Number(year));
            const data = (0, removeDuplicateObject_1.removeDuplicateObject)(scaleSummaryByWeek);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findScaleSummary = findScaleSummary;
function updateScaleByDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = req.body;
            const result = (0, scalesModels_1.updateScale)(data);
            if ((yield result).success) {
                res.status(200).json({ message: "Alteração feita com sucesso." });
            }
            else {
                res.status(500).json({ message: (yield result).message });
            }
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.updateScaleByDate = updateScaleByDate;
function findInputFlow(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { date, codeStore } = req.query;
            if (!date || !codeStore)
                return res.status(400).end();
            const result = yield (0, scalesModels_1.SelectInputFlow)(date, codeStore);
            res.status(200).json(result);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findInputFlow = findInputFlow;
function loadMonthScale(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode, loginUser, date, currentDate, finished } = req.query;
            if (!storeCode || !loginUser || !date || !finished)
                return res.status(400).send();
            const success = yield (0, scalesModels_1.executeProcToLoadMonthScale)(storeCode, loginUser, date, currentDate, Number(finished));
            if (success) {
                res.status(200).send();
            }
            else {
                res.status(400).json({ message: "Não foi possível carregar a escala" });
            }
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.loadMonthScale = loadMonthScale;
function findFinishedScaleByMonth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { month, year } = req.query;
            if (!month || !year)
                return res.status(400).send();
            const result = yield (0, scalesModels_1.SelectFinishedScaleByMonth)(Number(month), Number(year));
            res.status(200).json(result);
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.findFinishedScaleByMonth = findFinishedScaleByMonth;
function updateFinishedScaleByMonth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode, month, year, endScaleDate } = req.query;
            if (!storeCode || !month || !year || !endScaleDate)
                return res.status(400).send();
            const success = yield (0, scalesModels_1.updateFinishedScale)(storeCode, Number(month), Number(year), endScaleDate);
            if (success) {
                res.status(200).send();
            }
            else {
                res.status(400).json({ message: "Não foi possível atualizar a escala como finalizada" });
            }
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(500).end();
        }
    });
}
exports.updateFinishedScaleByMonth = updateFinishedScaleByMonth;
