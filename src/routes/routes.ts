import express from "express";

import useSettingsRouter from "./settings/settingsRoutes";
import useScalesRouter from "./scales/scalesRoutes";
import useGoalsRoutes from './goals/goalsRoutes'

const router = express.Router();

router.use("/settings", useSettingsRouter);
router.use("/scales", useScalesRouter);
router.use("/goals", useGoalsRoutes);

export default router;
