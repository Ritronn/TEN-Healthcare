import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  fullName: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },

  chiefComplaint: { type: String, required: true },
  allergies: { type: String, default: "" },
  medications: { type: String, default: "" },
  pastHistory: { type: String, default: "" },
  familyHistory: { type: String, default: "" },
  socialHistory: { type: String, default: "" },
  immunizations: { type: String, default: "" },

  consent: { type: Boolean, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

medicalHistorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("MedicalHistory", medicalHistorySchema);
