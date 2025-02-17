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
exports.closeConnection = exports.openConnection = void 0;
const mssql_1 = __importDefault(require("mssql"));
const config_1 = __importDefault(require("../../configs/config"));
let pool = null;
function openConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar se o pool existe e está conectado
            if (pool && pool.connected) {
                console.log("Conexão já está aberta");
                return pool;
            }
            // Se o pool estiver presente mas não conectado, feche-o antes de criar um novo
            if (pool) {
                console.log("Fechando conexão existente");
                yield closeConnection();
            }
            pool = yield mssql_1.default.connect(config_1.default);
            console.log("Conexão aberta");
            return pool;
        }
        catch (error) {
            console.error("Erro ao estabelecer conexão:", error);
            throw error;
        }
    });
}
exports.openConnection = openConnection;
function closeConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pool) {
            try {
                yield pool.close();
                pool = null;
            }
            catch (error) {
                console.error("Erro ao fechar conexão:", error);
                throw error;
            }
        }
    });
}
exports.closeConnection = closeConnection;
exports.default = { openConnection, closeConnection };
