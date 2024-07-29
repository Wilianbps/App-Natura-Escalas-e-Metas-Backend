import express from "express";
import {
  findInputFlow,
  findScaleByDate,
  findScaleSummary,
  loadMonthScale,
  updateScaleByDate,
} from "../../controllers/scales/scalesController";

const router = express.Router();

router.get("/get-scale-by-date", findScaleByDate);
router.get("/get-scale-summary", findScaleSummary);
router.get("/get-input-flow", findInputFlow);
router.get("/load-scale-of-month", loadMonthScale);

router.put("/update-scale-by-date", updateScaleByDate);

export default router;
