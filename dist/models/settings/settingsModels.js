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
exports.updateEmployee = exports.updateSettings = exports.findAllEmployees = void 0;
const connection_1 = __importDefault(require("../Connection/connection"));
function findAllEmployees() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = "SELECT ID_VENDEDOR_LINX AS idSeler, ID_AUSENCIA_PROGRAMADA AS idDayOff, CODIGO_LOJA AS storeCode, LOGIN_USUARIO AS userLogin, NOME_VENDEDOR AS name, ATIVO AS status, CARGO AS office, ID_TURNOS AS idShift, TURNO AS shift, HR_INICIO AS startTime, HR_FIM AS finishTime, AUSENCIA_INI AS startVacation, AUSENCIA_FIM AS finishVacation, TIPO_AUSENCIA AS typeAbsence, FLUXO_LOJA AS flowScale FROM W_CONSULTA_COLABORADORES";
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
            yield connection_1.default.closeConnection(pool);
            console.log("Conexão fechada");
        }
    });
}
exports.findAllEmployees = findAllEmployees;
function updateSettings(settings) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const results = { success: true, message: "" };
            yield Promise.all(settings.employeeStatus.map((employee) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield pool
                        .request()
                        .query(`UPDATE LOJA_VENDEDOR SET ATIVO = ${employee.status} WHERE ID_VENDEDOR_LINX = '${employee.idSeler}'`);
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
            yield connection_1.default.closeConnection(pool);
            console.log("Conexão fechada");
        }
    });
}
exports.updateSettings = updateSettings;
function updateEmployee(employee) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                //INÍCIO UPDATE OU INSERT DAS FÉRIAS
                /*  const query = `SELECT ID as idDayOff FROM AUSENCIA_PROGRAMADA WHERE ID_VENDEDOR_LINX = ${employee.idSeler} AND TIPO_AUSENCIA = 'FERIAS'`;
           
                 const resultSelect: IEmployee[] = (await pool.request().query(query))
                   .recordset;
           
                 if (resultSelect.length === 0) {
                   let insertVacation = `INSERT INTO AUSENCIA_PROGRAMADA (CODIGO_LOJA, LOGIN_USUARIO, ID_VENDEDOR_LINX, DATA_INICIO, DATA_FIM, TIPO_AUSENCIA) VALUES (`;
           
                    Adiciona os valores que não podem ser null diretamente na query
                   insertVacation += `'${employee.storeCode}', '${employee.userLogin}', '${employee.idSeler}', `;
           
                    Verifica e adiciona DATA_INICIO
                   if (employee.startVacation === null) {
                     insertVacation += `null, `;
                   } else if (typeof employee.startVacation === "string") {
                     insertVacation += `'${employee.startVacation}', `;
                   }
                    Verifica e adiciona DATA_FIM
                   if (employee.finishVacation === null) {
                     insertVacation += `null, `;
                   } else if (typeof employee.finishVacation === "string") {
                     insertVacation += `'${employee.finishVacation}', `;
                   }
                    Adiciona o valor fixo 'FERIAS' para TIPO_AUSENCIA
                   insertVacation += `'FERIAS')`;
           
                   await pool.request().query(insertVacation);
                 } else {
                   for (let i = 0; i <= resultSelect.length; i++) {
                     if (resultSelect[i]?.idDayOff === employee.idDayOff) {
                       let updateVacation = `UPDATE AUSENCIA_PROGRAMADA SET`;
           
                       if (employee.startVacation === null) {
                         updateVacation += ` DATA_INICIO = null,`;
                       } else if (typeof employee.startVacation === "string") {
                         updateVacation += ` DATA_INICIO = '${employee.startVacation}',`;
                       }
           
                       if (employee.finishVacation === null) {
                         updateVacation += ` DATA_FIM = null`;
                       } else if (typeof employee.finishVacation === "string") {
                         updateVacation += ` DATA_FIM = '${employee.finishVacation}'`;
                       }
                       updateVacation += ` WHERE ID = ${employee.idDayOff}`;
           
                       await pool.request().query(updateVacation);
                     }
                   }
                 } */
                //FIM UPDATE OU INSERT DAS FÉRIAS
                //INÍCIO UPDATE DO TURNO
                /*       const queryUpdateIdShift = `UPDATE LOJA_VENDEDOR SET ID_TURNOS = ${employee.idShift} WHERE ID_VENDEDOR_LINX = '${employee.idSeler}'`;
                
                      const updateShift = await pool.request().query(queryUpdateIdShift);
                
                
                      if (updateShift.rowsAffected[0] === 0) {
                        console.log("updateShift.rowsAffected[0]", updateShift.rowsAffected[0]);
                        return resolve({
                          success: false,
                          message: "Erro na solicitação",
                        });
                      } */
                //FIM UPDATE DO TURNO
                //INÍCIO UPDATE DO TURNO
                const UpdateIdShift = `UPDATE LOJA_VENDEDOR SET ID_TURNOS = '${employee.idShift}' WHERE ID_VENDEDOR_LINX = '${employee.idSeler}'`;
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
                        const deleteDayOff = `DELETE FROM AUSENCIA_PROGRAMADA WHERE ID = '${arrayDaysOff[i].id}'`;
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
                        const deleteVacation = `DELETE FROM AUSENCIA_PROGRAMADA WHERE ID = '${arrayVacation[i].id}'`;
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
                yield connection_1.default.closeConnection(pool);
                console.log("Conexão fechada");
            }
        }));
    });
}
exports.updateEmployee = updateEmployee;
