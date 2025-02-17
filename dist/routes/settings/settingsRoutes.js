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
router.post("/add-employee", settingsController_1.addEmployee);
router.delete("/delete-employee/:id", settingsController_1.removeEmployeeById);
router.put("/update-employee/:id", settingsController_1.updateEmployeeById);
router.get("/get-shift-hours", settingsController_1.getShiftHours);
router.put("/update-shift-hours", settingsController_1.updateShiftHours);
exports.default = router;
