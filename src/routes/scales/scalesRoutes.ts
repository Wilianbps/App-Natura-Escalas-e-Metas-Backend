import express from "express";
import {
  findInputFlow,
  findScaleByDate,
  findScaleSummary,
  loadMonthScale,
  updateScaleByDate,
  findFinishedScaleByMonth,
  updateFinishedScaleByMonth,
  postScaleApprovalRequest,
  findScaleApprovalRequest,
  putScaleApprovalRequest,
  findScaleSummarysByFortnight,
  getParamGenerateScaleNextMonth,
  getParamToAlterDayScale,
  findStoresScaleStatus,
} from "../../controllers/scales/scalesController";

const router = express.Router();

router.get("/get-scale-by-date", findScaleByDate);
router.get("/get-scale-summary", findScaleSummary);
router.get("/get-scale-summary-by-fortnight", findScaleSummarysByFortnight);
router.get("/get-input-flow", findInputFlow);
router.get("/get-finished-scale-by-month", findFinishedScaleByMonth);
router.get("/load-scale-of-month", loadMonthScale);
router.get("/get-scales-approval-request", findScaleApprovalRequest);
router.put("/update-scale-by-date", updateScaleByDate);
router.put("/update-finished-scale", updateFinishedScaleByMonth);
router.post("/post-scales-approval-request", postScaleApprovalRequest);
router.put("/put-scales-approval-request", putScaleApprovalRequest);
router.get("/get-param-generate-scale-next-month", getParamGenerateScaleNextMonth);
router.get("/get-param-to-alter-day-scale", getParamToAlterDayScale);
router.get("/get-stores-scale-status", findStoresScaleStatus)

export default router;
