import express from "express";

import useSettingsRouter from "./settings/settingsRoutes";
import useScalesRouter from "./scales/scalesRoutes";
import useGoalsRoutes from "./goals/goalsRoutes";
import useProfilesRoutes from "./profiles/profilesRoutes";

const router = express.Router();

router.use("/profiles", useProfilesRoutes);
router.use("/settings", useSettingsRouter);
router.use("/scales", useScalesRouter);
router.use("/goals", useGoalsRoutes);

export default router;
