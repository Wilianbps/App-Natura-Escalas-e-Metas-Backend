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
exports.selectRankingGoalsLastTwelveMonths = exports.selectGoalsEmployeesByMonth = exports.selectGoalsByWeek = exports.selectGoalsByDate = exports.selectGoalsByDateOrderById = void 0;
const date_fns_1 = require("date-fns");
const connection_1 = __importDefault(require("../Connection/connection"));
const mssql_1 = __importDefault(require("mssql"));
function selectGoalsByDateOrderById(storeCode, month, year) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield connection_1.default.openConnection();
            const query = `SELECT ID_VENDEDOR_LINX AS id, CODIGO_LOJA AS codeStore, NOME_VENDEDOR AS name, VENDEDOR_EXTRA AS activeSeller, DATA AS date, META_DIA_LOJA AS goalDay, META_DIARIA_POR_VENDEDOR AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE CODIGO_LOJA = '${storeCode}' AND MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}' ORDER BY ID_VENDEDOR_LINX`;
            const goals = yield pool.request().query(query);
            return goals.recordset;
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
            console.log("Conexão fechada");
        }
    });
}
exports.selectGoalsByDateOrderById = selectGoalsByDateOrderById;
function selectGoalsByDate(storeCode, month, year) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT ID_VENDEDOR_LINX AS id, CODIGO_LOJA AS codeStore, NOME_VENDEDOR AS name, DATA AS date, META_DIA_LOJA AS goalDay, META_DIARIA_POR_VENDEDOR AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE CODIGO_LOJA = '${storeCode}' AND MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}'`;
            const goals = yield pool.request().query(query);
            return goals.recordset;
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
exports.selectGoalsByDate = selectGoalsByDate;
function selectGoalsByWeek(storeCode, initialDate, lastDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT SUM(META_VALOR) AS goalValue, META_TIPO AS goalType FROM W_DGCS_CONSULTA_METAS 
                  WHERE CODIGO_LOJA = '${storeCode}' AND DATA BETWEEN '${initialDate}' AND '${lastDate}'
                  GROUP BY META_TIPO`;
            const goals = yield pool.request().query(query);
            return goals.recordset;
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
exports.selectGoalsByWeek = selectGoalsByWeek;
function selectGoalsEmployeesByMonth(storeCode, month, year) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT ID_VENDEDOR_LINX AS id, NOME_VENDEDOR AS name, META_DIARIA_POR_VENDEDOR AS goalDayByEmployee FROM W_DGCS_METAS_VENDEDORES_ATIVOS WHERE CODIGO_LOJA = '${storeCode}' AND MONTH(DATA) = '${month}' AND YEAR(DATA) = '${year}'`;
            const goals = yield pool.request().query(query);
            return goals.recordset;
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
exports.selectGoalsEmployeesByMonth = selectGoalsEmployeesByMonth;
function selectRankingGoalsLastTwelveMonths(storeCode, lastDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const pool = yield connection_1.default.openConnection();
        try {
            const endDate = new Date(parseInt(lastDate.slice(0, 4)), parseInt(lastDate.slice(4, 6)) - 1, parseInt(lastDate.slice(6, 8)));
            const results = yield Promise.all(Array.from({ length: 12 }, (_, i) => {
                const startDateCalc = (0, date_fns_1.subMonths)(endDate, i);
                const startDateFormatted = (0, date_fns_1.format)((0, date_fns_1.startOfMonth)(startDateCalc), "yyyy-MM-dd");
                const endDateFormatted = (0, date_fns_1.format)((0, date_fns_1.endOfMonth)(startDateCalc), "yyyy-MM-dd");
                const monthIndex = startDateCalc.getMonth();
                const year = startDateCalc.getFullYear();
                const query = `
          SELECT SUM(META_VALOR) AS goalValue, META_TIPO AS goalType
          FROM W_DGCS_CONSULTA_METAS
          WHERE CODIGO_LOJA = @storeCode AND DATA BETWEEN @startDate AND @endDate
          GROUP BY META_TIPO
        `;
                const request = pool.request();
                request.input("storeCode", mssql_1.default.VarChar, storeCode);
                request.input("startDate", mssql_1.default.Date, startDateFormatted);
                request.input("endDate", mssql_1.default.Date, endDateFormatted);
                return request.query(query).then(result => {
                    const monthData = {
                        name: `${months[monthIndex]}-${year}`,
                        hiperMeta: 0,
                        superMeta: 0,
                        meta: 0,
                    };
                    result.recordset.forEach(record => {
                        if (record.goalType === "HIPER_META")
                            monthData.hiperMeta = record.goalValue;
                        if (record.goalType === "SUPER_META")
                            monthData.superMeta = record.goalValue;
                        if (record.goalType === "META")
                            monthData.meta = record.goalValue;
                    });
                    return monthData;
                });
            }));
            return results.reverse();
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
exports.selectRankingGoalsLastTwelveMonths = selectRankingGoalsLastTwelveMonths;
