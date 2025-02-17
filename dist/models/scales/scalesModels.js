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
exports.updateScaleApprovalRequest = exports.selectScaleApprovalRequest = exports.insertInTableScaleApproval = exports.updateFinishedScale = exports.SelectFinishedScaleByMonth = exports.executeProcToLoadMonthScale = exports.SelectInputFlow = exports.updateScale = exports.selectScaleSummary = exports.selectScaleByDate = void 0;
const connection_1 = __importDefault(require("../Connection/connection"));
function selectScaleByDate(date, storeCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT 
    DATA_ESCALA AS date, 
    ID_VENDEDOR_LINX AS id, 
    NOME_VENDEDOR AS name, 
    ID_TURNO AS idTurn, 
    STATUS AS status, 
    ACTIVE_DAYS as activeDays, 
    HR_ID14, HR_ID15, HR_ID16, HR_ID17, HR_ID18, HR_ID19, HR_ID20, HR_ID21, HR_ID22, HR_ID23, HR_ID24, HR_ID25, HR_ID26,
    HR_ID27, HR_ID28, HR_ID29, HR_ID30, HR_ID31, HR_ID32, HR_ID33, HR_ID34, HR_ID35, HR_ID36, HR_ID37, HR_ID38, HR_ID39, HR_ID40, HR_ID41, HR_ID42, HR_ID43 
FROM 
    W_DGCS_CONSULTA_ESCALAS 
WHERE 
    CAST(DATA_ESCALA AS DATE) = '${date}' AND CODIGO_LOJA = '${storeCode}'
ORDER BY NOME_VENDEDOR ASC`;
            const scale = yield pool.request().query(query);
            return scale.recordset;
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
exports.selectScaleByDate = selectScaleByDate;
function selectScaleSummary(month, year, storeCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT ID_VENDEDOR_LINX AS id, NOME_VENDEDOR AS name, DATA_ESCALA AS date, DAY(DATA_ESCALA) AS day, MONTH(DATA_ESCALA) AS month, YEAR(DATA_ESCALA) AS year, ID_TURNO AS turnId, STATUS AS status, HR_INICIO AS startTime, HR_FIM AS endTime FROM W_DGCS_CONSULTA_ESCALAS_RESUMO WHERE MONTH(DATA_ESCALA) = '${month}' AND YEAR(DATA_ESCALA) = '${year}' AND CODIGO_LOJA = '${storeCode}' ORDER BY NOME_VENDEDOR`;
            const scaleSummary = yield pool.request().query(query);
            return scaleSummary.recordset;
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
exports.selectScaleSummary = selectScaleSummary;
function updateScale(scales) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const results = { success: true, message: "" };
            yield Promise.all(scales.map((scale) => __awaiter(this, void 0, void 0, function* () {
                scale.options.forEach((item) => {
                    if (item.type === "null") {
                        item.type = "";
                    }
                });
                try {
                    const update = `UPDATE ESCALA SET ID_TURNO = ${scale.turn}, STATUS = ${scale.status}, HR_ID14 = '${scale.options[0].type}', 
          HR_ID15 = '${scale.options[1].type}', HR_ID16  = '${scale.options[2].type}', HR_ID17 = '${scale.options[3].type}', HR_ID18 = '${scale.options[4].type}', 
          HR_ID19 = '${scale.options[5].type}', HR_ID20 = '${scale.options[6].type}', HR_ID21 = '${scale.options[7].type}', HR_ID22 = '${scale.options[8].type}', 
          HR_ID23 = '${scale.options[9].type}', HR_ID24 = '${scale.options[10].type}', HR_ID25 = '${scale.options[11].type}', HR_ID26 = '${scale.options[12].type}', 
          HR_ID27 = '${scale.options[13].type}', HR_ID28 = '${scale.options[14].type}', HR_ID29 = '${scale.options[15].type}', HR_ID30 = '${scale.options[16].type}', 
          HR_ID31 = '${scale.options[17].type}', HR_ID32 = '${scale.options[18].type}', HR_ID33 = '${scale.options[19].type}', HR_ID34 = '${scale.options[20].type}', 
          HR_ID35 = '${scale.options[21].type}', HR_ID36 = '${scale.options[22].type}', HR_ID37 = '${scale.options[23].type}', HR_ID38 = '${scale.options[24].type}', 
          HR_ID39 = '${scale.options[25].type}', HR_ID40 = '${scale.options[26].type}', HR_ID41 = '${scale.options[27].type}', HR_ID42 = '${scale.options[28].type}', 
          HR_ID43 = '${scale.options[29].type}' WHERE ID_VENDEDOR_LINX = '${scale.id}' AND CAST(DATA_ESCALA AS DATE) = '${scale.date}'`;
                    yield pool.request().query(update);
                }
                catch (error) {
                    if (error instanceof Error) {
                        results.success = false;
                        results.message = `Erro ao atualizar a escala.'${scale.id}'`;
                        console.log(error.message);
                    }
                }
            })));
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
exports.updateScale = updateScale;
function SelectInputFlow(date, codeStore) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT [HR_ID14] ,[HR_ID15] ,[HR_ID16], [HR_ID17], [HR_ID18] ,[HR_ID19] ,[HR_ID20] ,[HR_ID21] ,[HR_ID22] ,[HR_ID23]
      ,[HR_ID24], [HR_ID25], [HR_ID26] ,[HR_ID27] ,[HR_ID28] ,[HR_ID29] ,[HR_ID30] ,[HR_ID31] ,[HR_ID32] ,[HR_ID33] ,[HR_ID34],[HR_ID35]
      ,[HR_ID36] ,[HR_ID37] ,[HR_ID38] ,[HR_ID39] ,[HR_ID40] ,[HR_ID41] ,[HR_ID42],[HR_ID43] FROM W_DGCS_FLUXO_ENTRADA_DATA 
      WHERE DATA = '${date}' AND CODIGO_LOJA = '${codeStore}'`;
            const inputFlow = (yield pool.request().query(query)).recordset;
            inputFlow.forEach((obj) => {
                for (let key in obj) {
                    if (obj[key] === null) {
                        obj[key] = 0;
                    }
                }
            });
            return inputFlow;
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
exports.SelectInputFlow = SelectInputFlow;
function executeProcToLoadMonthScale(storeCode, loginUser, date, currentDate, finished) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SP_DGCS_PREENCHER_ESCALA '${date}', '${loginUser}'`;
            yield pool.request().query(query);
            const insertQuery = `
        INSERT INTO ESCALA_FINALIZADA (CODIGO_LOJA, LOGIN_USUARIO, DATA_ESCALA_INICIO, FINALIZADA)
        VALUES ('${storeCode}', '${loginUser}', '${currentDate}', ${finished})
      `;
            yield pool.request().query(insertQuery);
            console.log("Dados inseridos com sucesso");
            return true;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Erro ao executar a consulta: ${error.message}`);
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
exports.executeProcToLoadMonthScale = executeProcToLoadMonthScale;
function SelectFinishedScaleByMonth(month, year) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT CODIGO_LOJA AS storeCode, LOGIN_USUARIO AS loginUser, DATA_ESCALA_INICIO AS startDate, 
    DATA_ESCALA_FIM AS endDate, FINALIZADA AS finished FROM ESCALA_FINALIZADA 
    WHERE DATEPART(MONTH, DATA_ESCALA_INICIO) = ${month} AND DATEPART(YEAR, DATA_ESCALA_INICIO) = ${year};`;
            const result = (yield pool.request().query(query)).recordset;
            return result;
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
exports.SelectFinishedScaleByMonth = SelectFinishedScaleByMonth;
function updateFinishedScale(userLogin, storeCode, month, year, endScaleDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `UPDATE ESCALA_FINALIZADA SET LOGIN_USUARIO = '${userLogin}', DATA_ESCALA_FIM = '${endScaleDate}', FINALIZADA = 1 WHERE CODIGO_LOJA = '${storeCode}' AND DATEPART(MONTH, DATA_ESCALA_INICIO) = ${month}
  AND DATEPART(YEAR, DATA_ESCALA_INICIO) = ${year};`;
            yield pool.request().query(query);
            return true;
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
exports.updateFinishedScale = updateFinishedScale;
function insertInTableScaleApproval(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const insert = `INSERT INTO APROVACAO_ESCALA (DESCRICAO, RESPONSAVEL, CODIGO_LOJA, FILIAL, DATA_SOLICITACAO, [STATUS]) VALUES ('${data.description}', '${data.responsible}', '${data.storeCode}', '${data.branch}', '${data.requestDate}', ${data.status})`;
            yield pool.request().query(insert);
            return true;
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
exports.insertInTableScaleApproval = insertInTableScaleApproval;
function selectScaleApprovalRequest(userLogin, profileLogin, month, year) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            let query = "";
            if (profileLogin === "Gerente Loja") {
                query = `SELECT ID AS id, DESCRICAO AS description, RESPONSAVEL AS responsible, FILIAL AS branch, 
      DATA_SOLICITACAO AS requestDate, DATA_APROVACAO AS approvalDate, STATUS AS status FROM APROVACAO_ESCALA 
      WHERE DATEPART(MONTH, DATA_SOLICITACAO) = ${month} AND DATEPART(YEAR, DATA_SOLICITACAO) = ${year}`;
            }
            else if (profileLogin === "Supervisão Loja" ||
                profileLogin === "Master") {
                query = `SELECT distinct A.ID AS id, A.DESCRICAO AS description, A.RESPONSAVEL AS responsible, A.FILIAL AS branch,
    A.DATA_SOLICITACAO AS requestDate, A.DATA_APROVACAO AS approvalDate, A.STATUS AS status FROM APROVACAO_ESCALA A
    JOIN SUPERVISAO_LOJA B ON B.CODIGO_LOJA = A.CODIGO_LOJA WHERE B.LOGIN_USUARIO = '${userLogin}'
    AND DATEPART(MONTH, DATA_SOLICITACAO) = ${month} AND DATEPART(YEAR, DATA_SOLICITACAO) = ${year}`;
            }
            const result = (yield pool.request().query(query)).recordset;
            return result;
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
exports.selectScaleApprovalRequest = selectScaleApprovalRequest;
function updateScaleApprovalRequest(id, month, year, storeCode, approvalDate, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const update = `UPDATE APROVACAO_ESCALA SET DATA_APROVACAO = '${approvalDate}', STATUS = ${status} WHERE ID = '${id}' AND CODIGO_LOJA = '${storeCode}' AND DATEPART(MONTH, DATA_SOLICITACAO) = ${month}
  AND DATEPART(YEAR, DATA_SOLICITACAO) = ${year};`;
            yield pool.request().query(update);
            return true;
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
exports.updateScaleApprovalRequest = updateScaleApprovalRequest;
