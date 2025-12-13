import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentByDoctor
} from "../controllers/appointment.controller.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();


// Doctor routes (put first to avoid conflicts)
router.get("/all", protect, authorize("doctor"), getAllAppointments);
router.put("/doctor/:id", protect, authorize("doctor"), updateAppointmentByDoctor);

// Patient routes
router.post("/", protect, authorize("patient"), createAppointment);
router.get("/", protect, authorize("patient"), getMyAppointments);
router.get("/:id", protect, authorize("patient"), getAppointmentById);
router.put("/:id", protect, authorize("patient"), updateAppointment);
router.delete("/:id", protect, authorize("patient"), deleteAppointment);

export default router;
