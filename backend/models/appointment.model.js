import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: { type: String, required: true },
  time: { type: String, required: true },

  doctor: { type: String, required: true },
  specialty: { type: String, required: true },

  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled", "reschedule_requested"], default: "pending" },
  rescheduleReason: { type: String, default: "" },
  rescheduleDate: { type: String, default: "" },
  rescheduleTime: { type: String, default: "" },

  prescription: { type: String, default: "Not Available" },
  diagnosis: { type: String, default: "Pending" },

  contact: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);
