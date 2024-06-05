import express from "express";
import {
  findScaleByDate,
  findScaleSummary,
  updateScaleByDate,
} from "../../controllers/scales/scalesController";


const router = express.Router();

router.get("/get-scale-by-date", findScaleByDate);
router.get("/get-scale-summary", findScaleSummary)
router.put("/update-scale-by-date", updateScaleByDate);

export default router;
