import express from "express";
import {
  createMedicalHistory,
  getMyMedicalHistories,
  getMedicalHistoryById,
  updateMedicalHistory,
} from "../controllers/medical.history.controller.js";
import MedicalHistory from "../models/medical.history.model.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, authorize("patient"), createMedicalHistory);

router.get("/", protect, authorize("patient"), getMyMedicalHistories);

router.get("/patient/:patientId", protect, authorize("doctor"), async (req, res) => {
  try {
    const record = await MedicalHistory.findOne({ patient: req.params.patientId }).populate('patient', 'name email');
    if (!record) return res.status(404).json({ message: 'Medical history not found' });
    res.json({ record });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/:id", protect, getMedicalHistoryById);

router.put("/:id", protect, updateMedicalHistory);

export default router;
