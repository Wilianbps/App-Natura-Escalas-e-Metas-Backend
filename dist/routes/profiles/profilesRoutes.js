"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profilesController_1 = require("../../controllers/profiles/profilesController");
const router = express_1.default.Router();
router.get("/get-stores-by-user", profilesController_1.findStoreByUser);
exports.default = router;
