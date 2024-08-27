"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scalesController_1 = require("../../controllers/scales/scalesController");
const router = express_1.default.Router();
router.get("/get-scale-by-date", scalesController_1.findScaleByDate);
router.get("/get-scale-summary", scalesController_1.findScaleSummary);
router.get("/get-input-flow", scalesController_1.findInputFlow);
router.get("/get-finished-scale-by-month", scalesController_1.findFinishedScaleByMonth);
router.get("/load-scale-of-month", scalesController_1.loadMonthScale);
router.get("/get-scales-approval-request", scalesController_1.findScaleApprovalRequest);
router.put("/update-scale-by-date", scalesController_1.updateScaleByDate);
router.put("/update-finished-scale", scalesController_1.updateFinishedScaleByMonth);
router.post("/post-scales-approval-request", scalesController_1.postScaleApprovalRequest);
router.put("/put-scales-approval-request", scalesController_1.putScaleApprovalRequest);
exports.default = router;
