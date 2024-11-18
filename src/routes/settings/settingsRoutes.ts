import express from "express";

import {
  addEmployee,
  removeEmployeeById,
  getAllEmployees,
  updateShiftRestSchedule,
  updateStatusAndScaleFlowSettings
} from "../../controllers/settings/settingsController";

const router = express.Router();

router.put("/updateShiftRestSchedule", updateShiftRestSchedule);
router.put("/updateSettings", updateStatusAndScaleFlowSettings);
router.get("/getAllEmployees", getAllEmployees);
router.post("/addEmployee", addEmployee);
router.delete("/delete-employee/:id", removeEmployeeById);

export default router;
