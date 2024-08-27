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
exports.updateShiftRestSchedule = exports.updateStatusAndScaleFlowSettings = exports.getAllEmployees = void 0;
const settingsModels_1 = require("../../models/settings/settingsModels");
const removeDuplicateObject_1 = require("./libs/removeDuplicateObject");
const addDayOffInArray_1 = require("./libs/addDayOffInArray");
const addVacationInArray_1 = require("./libs/addVacationInArray");
const filterDayOffAndVacation_1 = require("./libs/filterDayOffAndVacation");
function getAllEmployees(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode } = req.query;
            if (!storeCode)
                return res.status(404).send();
            const success = yield (0, settingsModels_1.execProcImportSellers)();
            if (success) {
                const employees = yield (0, settingsModels_1.findAllEmployees)(storeCode);
                employees.map((employee) => (employee.idSeler === 1 ? true : false));
                (0, addDayOffInArray_1.addDayOffInArray)(employees);
                (0, addVacationInArray_1.addVacationInArray)(employees);
                const employeesWithOutDuplicateObjects = (0, removeDuplicateObject_1.removeDuplicateObject)(employees);
                const filterArray = (0, filterDayOffAndVacation_1.filterDayOffAndVacation)(employeesWithOutDuplicateObjects);
                return res.status(200).json(filterArray);
            }
            else {
                return res.status(400).send();
            }
        }
        catch (error) {
            console.log(error, "erro na solicitação");
            return res.status(400).end();
        }
    });
}
exports.getAllEmployees = getAllEmployees;
function updateStatusAndScaleFlowSettings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const { storeCode } = req.query;
            if (!data || !storeCode)
                return res.status(400).end();
            const settings = yield (0, settingsModels_1.updateSettings)(data, storeCode);
            if (settings.success) {
                res.status(200).json({ message: "Alteração feita com sucesso." });
            }
            else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
exports.updateStatusAndScaleFlowSettings = updateStatusAndScaleFlowSettings;
function updateShiftRestSchedule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            const { storeCode } = req.query;
            if (data.storeCode === "" || data.userLogin === "" || !storeCode)
                return res
                    .status(400)
                    .json({ message: "Usuário ou código da loja não identificado" });
            const update = yield (0, settingsModels_1.updateEmployee)(data, storeCode);
            if (update.success) {
                return res.status(200).json({ message: update.message });
            }
            else {
                return res.status(400).json({ message: update.message });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro" });
        }
    });
}
exports.updateShiftRestSchedule = updateShiftRestSchedule;
