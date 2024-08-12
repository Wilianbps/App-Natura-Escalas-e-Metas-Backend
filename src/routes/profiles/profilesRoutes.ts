import express from "express";
import { findStoreByUser } from "../../controllers/profiles/profilesController";

const router = express.Router();

router.get("/get-stores-by-user", findStoreByUser);

export default router;
