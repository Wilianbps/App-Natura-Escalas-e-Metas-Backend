"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatName = void 0;
function formatName(name) {
    var _a, _b;
    if (name) {
        const parts = name === null || name === void 0 ? void 0 : name.toLowerCase().split(' ');
        // Capitaliza a primeira letra de cada parte do nome
        for (let i = 0; i < (parts === null || parts === void 0 ? void 0 : parts.length); i++) {
            parts[i] = ((_a = parts[i]) === null || _a === void 0 ? void 0 : _a.charAt(0).toUpperCase()) + ((_b = parts[i]) === null || _b === void 0 ? void 0 : _b.substring(1));
        }
        // Junta as partes do nome novamente
        return parts === null || parts === void 0 ? void 0 : parts.join(' ');
    }
}
exports.formatName = formatName;
