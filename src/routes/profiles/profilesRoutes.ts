import express from "express";
import { findStoreByUser, findPathBeepInput } from "../../controllers/profiles/profilesController";

const router = express.Router();

router.get("/get-stores-by-user", findStoreByUser);
router.get("/get-path-beep-input", findPathBeepInput);

export default router;
