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
exports.updateShiftHours = exports.getShiftHours = exports.updateEmployeeById = exports.removeEmployeeById = exports.addEmployee = exports.updateShiftRestSchedule = exports.updateStatusAndScaleFlowSettings = exports.getAllEmployees = exports.transformEmployees = void 0;
const settingsModels_1 = require("../../models/settings/settingsModels");
const removeDuplicateObject_1 = require("./libs/removeDuplicateObject");
const addDayOffInArray_1 = require("./libs/addDayOffInArray");
const addVacationInArray_1 = require("./libs/addVacationInArray");
const filterDayOffAndVacation_1 = require("./libs/filterDayOffAndVacation");
function transformEmployees(employees) {
    return __awaiter(this, void 0, void 0, function* () {
        employees.map((employee) => (employee.idSeler === 1 ? true : false));
        (0, addDayOffInArray_1.addDayOffInArray)(employees);
        (0, addVacationInArray_1.addVacationInArray)(employees);
        const employeesWithOutDuplicateObjects = (0, removeDuplicateObject_1.removeDuplicateObject)(employees);
        const filterArray = (0, filterDayOffAndVacation_1.filterDayOffAndVacation)(employeesWithOutDuplicateObjects);
        return filterArray;
    });
}
exports.transformEmployees = transformEmployees;
function getAllEmployees(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode } = req.query;
            if (!storeCode)
                return res.status(404).send();
            const success = yield (0, settingsModels_1.execProcImportSellers)();
            if (success) {
                const employees = yield (0, settingsModels_1.findAllEmployees)(storeCode);
                const transformedEmployees = yield transformEmployees(employees);
                return res.status(200).json(transformedEmployees);
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
            const result = yield (0, settingsModels_1.updateSettingsEmployee)(data, storeCode);
            if (result.success) {
                const employees = yield (0, settingsModels_1.findAllEmployees)(storeCode);
                const transformedEmployees = yield transformEmployees(employees);
                return res
                    .status(200)
                    .json({ message: result.message, employees: transformedEmployees });
            }
            else {
                return res.status(400).json({ message: result.message });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Erro" });
        }
    });
}
exports.updateShiftRestSchedule = updateShiftRestSchedule;
function addEmployee(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const employee = req.body;
            yield (0, settingsModels_1.insertEmployee)(employee);
            return res.status(200).json({ message: "Usuário cadastrado com sucesso" });
        }
        catch (error) {
            res.status(500).json({ message: "Erro" });
        }
    });
}
exports.addEmployee = addEmployee;
function removeEmployeeById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: employeeId } = req.params; // Obtém o ID do funcionário do parâmetro da URL
        // Converte o id para número
        const employeeIdNumber = Number(employeeId);
        if (isNaN(employeeIdNumber)) {
            return res
                .status(400)
                .json({ message: "ID inválido. Deve ser um número." });
        }
        try {
            // Tenta encontrar e excluir o funcionário
            const employeeToDelete = yield (0, settingsModels_1.deleteEmployee)(employeeIdNumber);
            if (!employeeToDelete) {
                return res.status(404).json({ message: "Colaborador não encontrado" });
            }
            // Resposta de sucesso
            return res
                .status(200)
                .json({ message: "Colaborador excluído com sucesso" });
        }
        catch (err) {
            // Caso haja erro, retorna uma mensagem
            return res
                .status(500)
                .json({ message: "Erro ao excluir funcionário", error: err });
        }
    });
}
exports.removeEmployeeById = removeEmployeeById;
function updateEmployeeById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: employeeId } = req.params;
            const dataEmployee = req.body;
            const employeeIdNumber = Number(employeeId);
            if (!employeeIdNumber || !dataEmployee.storeCode)
                return res
                    .status(400)
                    .json({ message: "Id do usuário ou código da loja não identificado" });
            const result = yield (0, settingsModels_1.updateEmployee)(employeeIdNumber, dataEmployee);
            if (result) {
                const employees = yield (0, settingsModels_1.findAllEmployees)(dataEmployee.storeCode);
                const transformedEmployees = yield transformEmployees(employees);
                return res.status(200).json({
                    message: "Alteração feita com sucesso",
                    employees: transformedEmployees,
                });
            }
            else {
                return res
                    .status(400)
                    .json({ message: "Erro ao fazer alteração do colaborador" });
            }
        }
        catch (err) {
            return res.status(500).json({ message: "Erro no servidor", error: err });
        }
    });
}
exports.updateEmployeeById = updateEmployeeById;
function getShiftHours(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeCode } = req.query;
            if (!storeCode)
                return res.status(400).send();
            const result = yield (0, settingsModels_1.findShiftHours)(String(storeCode));
            const shifts = {};
            result.map((shift) => {
                if (shift) {
                    if (shift.turn === "Matutino")
                        shifts.morning = shift;
                    if (shift.turn === "Vespertino")
                        shifts.afternoon = shift;
                    if (shift.turn === "Noturno")
                        shifts.nocturnal = shift;
                }
            });
            return res.status(200).json(shifts);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro no servidor", error });
        }
    });
}
exports.getShiftHours = getShiftHours;
function updateShiftHours(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { shifts, storeCode } = req.body;
            if (!storeCode)
                return res.status(400).send();
            yield (0, settingsModels_1.updateShifitsByStore)(shifts, String(storeCode));
            return res.status(200).send();
        }
        catch (error) {
            return res.status(500).json({ message: "Erro no servidor", error });
        }
    });
}
exports.updateShiftHours = updateShiftHours;
