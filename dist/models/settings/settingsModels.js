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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployee = exports.updateSettings = exports.findAllEmployees = exports.execProcImportSellers = void 0;
const connection_1 = __importDefault(require("../Connection/connection"));
function execProcImportSellers() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            // Executa a stored procedure e obtém o resultado
            const result = yield pool.request().execute("SP_DGCS_IMPORTAR_VENDEDORES");
            // Verifica se a procedure foi bem-sucedida
            // Aqui assumimos que se o returnValue for 0, significa sucesso
            if (result.returnValue === 0) {
                return true;
            }
            else {
                console.log(`A procedure retornou um valor diferente de 0: ${result.returnValue}`);
                return false;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Erro ao executar a consulta ${error.message}`);
            }
            else {
                console.log("Erro desconhecido ao executar a consulta");
            }
            throw error;
        }
        finally {
            yield connection_1.default.closeConnection();
            console.log("Conexão fechada");
        }
    });
}
exports.execProcImportSellers = execProcImportSellers;
function findAllEmployees(storeCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT ID_VENDEDOR_LINX AS idSeler, ID_AUSENCIA_PROGRAMADA AS idDayOff, CODIGO_LOJA AS storeCode, LOGIN_USUARIO AS userLogin, 
    NOME_VENDEDOR AS name, ATIVO AS status, CARGO AS office, ID_TURNOS AS idShift, TURNO AS shift, HR_INICIO AS startTime, HR_FIM AS finishTime, 
    AUSENCIA_INI AS startVacation, AUSENCIA_FIM AS finishVacation, TIPO_AUSENCIA AS typeAbsence, FLUXO_LOJA AS flowScale 
    FROM W_CONSULTA_COLABORADORES WHERE CODIGO_LOJA = '${storeCode}'`;
            const employees = yield pool.request().query(query);
            return employees.recordset;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Erro ao executar a consulta ${error.message}`);
            }
            else {
                console.log("Erro desconhecido ao executar a consulta");
            }
            throw error;
        }
        finally {
            yield connection_1.default.closeConnection();
            console.log("Conexão fechada");
        }
    });
}
exports.findAllEmployees = findAllEmployees;
function updateSettings(settings, storeCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const results = { success: true, message: "" };
            yield Promise.all(settings.employeeStatus.map((employee) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield pool
                        .request()
                        .query(`UPDATE LOJA_VENDEDOR SET ATIVO = ${employee.status} WHERE ID_VENDEDOR_LINX = '${employee.idSeler}' AND CODIGO_lOJA = '${storeCode}'`);
                }
                catch (error) {
                    results.success = false;
                    if (error instanceof Error) {
                        results.message = `Erro ao atualizar o status do funcionário '${employee.idSeler}': ${error.message}`;
                    }
                }
            })));
            if (results.success) {
                const updateScaleFlow = `UPDATE PARAMETROS_DGCS SET VALOR = '${settings.flowScale}' WHERE NOME_PARAMETRO = 'FLUXO_MEDIO'`;
                yield pool.request().query(updateScaleFlow);
            }
            return results;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Erro ao executar a consulta ${error.message}`);
            }
            else {
                console.log("Erro desconhecido ao executar a consulta");
            }
            throw error;
        }
        finally {
            yield connection_1.default.closeConnection();
            console.log("Conexão fechada");
        }
    });
}
exports.updateSettings = updateSettings;
function updateEmployee(employee, storeCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                //INÍCIO UPDATE DO TURNO
                const UpdateIdShift = `UPDATE LOJA_VENDEDOR SET ID_TURNOS = '${employee.idShift}' WHERE ID_VENDEDOR_LINX = '${employee.idSeler}' AND CODIGO_LOJA = '${storeCode}'`;
                yield pool.request().query(UpdateIdShift);
                //FIM UPDATE DO TURNO
                //INÍCIO INSERT OU DELETE DAS FOLGAS
                const arrayDaysOff = employee.arrayDaysOff;
                for (let i = 0; i < arrayDaysOff.length; i++) {
                    if (arrayDaysOff[i].type === "")
                        continue;
                    if (arrayDaysOff[i].type === "I") {
                        const insertDayOff = `INSERT INTO AUSENCIA_PROGRAMADA (CODIGO_LOJA, LOGIN_USUARIO, ID_VENDEDOR_LINX, DATA_INICIO, DATA_FIM, TIPO_AUSENCIA) values ('${employee.storeCode}', '${employee.userLogin}', '${employee.idSeler}', '${arrayDaysOff[i].date}', '${arrayDaysOff[i].date}', 'FOLGA')`;
                        yield pool.request().query(insertDayOff);
                    }
                    if (arrayDaysOff[i].type === "D") {
                        const deleteDayOff = `DELETE FROM AUSENCIA_PROGRAMADA WHERE ID = '${arrayDaysOff[i].id}' AND CODIGO_LOJA = '${storeCode}'`;
                        yield pool.request().query(deleteDayOff);
                    }
                }
                //FIM INSERT OU DELETE DAS FOLGAS
                const arrayVacation = employee.arrayVacation;
                for (let i = 0; i < arrayVacation.length; i++) {
                    if (arrayVacation[i].type === "")
                        continue;
                    if (arrayVacation[i].type === "I") {
                        const insertVacation = `INSERT INTO AUSENCIA_PROGRAMADA (CODIGO_LOJA, LOGIN_USUARIO, ID_VENDEDOR_LINX, DATA_INICIO, DATA_FIM, TIPO_AUSENCIA) values ('${employee.storeCode}', '${employee.userLogin}', '${employee.idSeler}', '${arrayVacation[i].startVacation}', '${arrayVacation[i].finishVacation}', 'FERIAS')`;
                        yield pool.request().query(insertVacation);
                    }
                    if (arrayVacation[i].type === "D") {
                        const deleteVacation = `DELETE FROM AUSENCIA_PROGRAMADA WHERE ID = '${arrayVacation[i].id}' AND CODIGO_lOJA = '${storeCode}'`;
                        yield pool.request().query(deleteVacation);
                    }
                }
                //INÍCIO INSERT OU DELETE DAS FÉRIAS
                //FIM INSERT OU DELETE DAS FÉRIAS
                return resolve({
                    success: true,
                    message: "Alterações feitas com sucesso.",
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(`Erro ao executar a consulta ${error.message}`);
                }
                else {
                    console.log("Erro desconhecido ao executar a consulta");
                }
                throw error;
            }
            finally {
                yield connection_1.default.closeConnection();
                console.log("Conexão fechada");
            }
        }));
    });
}
exports.updateEmployee = updateEmployee;
