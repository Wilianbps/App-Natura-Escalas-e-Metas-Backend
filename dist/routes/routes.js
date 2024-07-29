"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsRoutes_1 = __importDefault(require("./settings/settingsRoutes"));
const scalesRoutes_1 = __importDefault(require("./scales/scalesRoutes"));
const goalsRoutes_1 = __importDefault(require("./goals/goalsRoutes"));
const router = express_1.default.Router();
router.use("/settings", settingsRoutes_1.default);
router.use("/scales", scalesRoutes_1.default);
router.use("/goals", goalsRoutes_1.default);
exports.default = router;
