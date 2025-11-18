import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointment.controller.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, authorize("patient"), createAppointment);

router.get("/", protect, authorize("patient"), getMyAppointments);

router.get("/:id", protect, authorize("patient"), getAppointmentById);

router.put("/:id", protect, authorize("patient"), updateAppointment);

router.delete("/:id", protect, authorize("patient"), deleteAppointment);

export default router;
