import express from "express";

import {
  addEmployee,
  removeEmployeeById,
  updateEmployeeById,
  getAllEmployees,
  updateShiftRestSchedule,
  updateStatusAndScaleFlowSettings
} from "../../controllers/settings/settingsController";

const router = express.Router();

router.put("/updateShiftRestSchedule", updateShiftRestSchedule);
router.put("/updateSettings", updateStatusAndScaleFlowSettings);
router.get("/getAllEmployees", getAllEmployees);
router.post("/add-employee", addEmployee);
router.delete("/delete-employee/:id", removeEmployeeById);
router.put("/update-employee/:id", updateEmployeeById)

export default router;
