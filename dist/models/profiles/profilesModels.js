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
exports.selectPathBeepInput = exports.selectStoreByUser = void 0;
const connection_1 = __importDefault(require("../Connection/connection"));
function selectStoreByUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            /*     const query = `SELECT LOGIN_USUARIO AS [user], PERFIL AS profile, CODIGO_LOJA AS storeCode, FILIAL AS branch, ATIVO AS status
                FROM ACESSO_PERFIL WHERE LOGIN_USUARIO = '${user}' AND ATIVO = 1`; */
            const query = `SELECT LOGIN_USUARIO AS [user], PERFIL AS profile, CODIGO_LOJA AS storeCode, FILIAL AS branch, ATIVO AS status, CODIGO_LOJA + ' - ' + FILIAL AS storeBranch
    FROM ACESSO_PERFIL WHERE LOGIN_USUARIO = '${user}' AND ATIVO = 1 ORDER BY CODIGO_LOJA;`;
            const result = yield pool.request().query(query);
            return result.recordset;
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
exports.selectStoreByUser = selectStoreByUser;
function selectPathBeepInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield connection_1.default.openConnection();
        try {
            const query = `SELECT VALOR AS path FROM PARAMETROS_DGCS WHERE NOME_PARAMETRO = 'Acesso_Entrada_Bipada'`;
            const result = yield pool.request().query(query);
            return result.recordset;
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
exports.selectPathBeepInput = selectPathBeepInput;
