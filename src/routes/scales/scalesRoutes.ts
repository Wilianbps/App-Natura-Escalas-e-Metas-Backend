import express from "express";
import {
  findScaleByDate,
  updateScaleByDate,
} from "../../controllers/scales/scalesController";


const router = express.Router();

router.get("/get-scale-by-date", findScaleByDate);
router.put("/update-scale-by-date", updateScaleByDate);

export default router;
