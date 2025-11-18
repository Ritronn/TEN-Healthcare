import express from "express";
import {
  createMedicalHistory,
  getMyMedicalHistories,
  getMedicalHistoryById,
  updateMedicalHistory,
} from "../controllers/medical.history.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, authorize("patient"), createMedicalHistory);

router.get("/", protect, authorize("patient"), getMyMedicalHistories);

router.get("/:id", protect, getMedicalHistoryById);

router.put("/:id", protect, updateMedicalHistory);

export default router;
