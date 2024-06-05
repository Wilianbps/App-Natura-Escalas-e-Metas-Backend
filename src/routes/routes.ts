import express from "express";

import useSettingsRouter from "./settings/settingsRoutes";
import useScalesRouter from "./scales/scalesRoutes";

const router = express.Router();

router.use("/settings", useSettingsRouter);
router.use("/scales", useScalesRouter);

export default router;
