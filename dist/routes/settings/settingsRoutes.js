"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../../controllers/settings/settingsController");
const router = express_1.default.Router();
router.put("/updateShiftRestSchedule", settingsController_1.updateShiftRestSchedule);
router.put("/updateSettings", settingsController_1.updateStatusAndScaleFlowSettings);
router.get("/getAllEmployees", settingsController_1.getAllEmployees);
exports.default = router;
