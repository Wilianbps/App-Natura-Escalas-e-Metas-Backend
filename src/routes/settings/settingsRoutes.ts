import express from "express";

import {
  getAllEmployees,
  updateShiftRestSchedule,
  updateStatusAndScaleFlowSettings
} from "../../controllers/settings/settingsController";

const router = express.Router();

router.put("/updateShiftRestSchedule", updateShiftRestSchedule);
router.put("/updateSettings", updateStatusAndScaleFlowSettings);
router.get("/getAllEmployees", getAllEmployees);

export default router;
