import MedicalHistory from "../models/medical.history.model.js";
import User from "../models/user.model.js";


export const createMedicalHistory = async (req, res) => {
  try {
    const patientId = req.user._id;

    const {
      fullName,
      dob,
      gender,
      phone,
      email,
      address,
      chiefComplaint,
      allergies,
      medications,
      pastHistory,
      familyHistory,
      socialHistory,
      immunizations,
      consent,
    } = req.body;

    if (!fullName || !dob || !chiefComplaint || consent !== true) {
      return res.status(400).json({
        message: "Required fields missing or consent not given",
      });
    }

    const record = await MedicalHistory.create({
      patient: patientId,
      fullName,
      dob,
      gender,
      phone,
      email,
      address,
      chiefComplaint,
      allergies,
      medications,
      pastHistory,
      familyHistory,
      socialHistory,
      immunizations,
      consent,
    });

    res.status(201).json({ message: "Medical history saved", record });
  } catch (err) {
    console.error("Create medical history error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// patients ke all records
export const getMyMedicalHistories = async (req, res) => {
  try {
    const patientId = req.user._id;
    const records = await MedicalHistory.find({ patient: patientId }).sort({
      createdAt: -1,
    });

    res.json({ records });
  } catch (err) {
    console.error("Get medical histories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// individual record by id (patient own or doctor)
export const getMedicalHistoryById = async (req, res) => {
  try {
    const rec = await MedicalHistory.findById(req.params.id).populate(
      "patient",
      "name email"
    );

    if (!rec) return res.status(404).json({ message: "Record not found" });

    if (
      req.user.role === "patient" &&
      rec.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ record: rec });
  } catch (err) {
    console.error("Get record by id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update record (patient owns OR doctor)
export const updateMedicalHistory = async (req, res) => {
  try {
    const rec = await MedicalHistory.findById(req.params.id);

    if (!rec) return res.status(404).json({ message: "Record not found" });

    if (
      req.user.role === "patient" &&
      rec.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(rec, req.body, { updatedAt: Date.now() });
    await rec.save();

    res.json({ message: "Record updated", record: rec });
  } catch (err) {
    console.error("Update record error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
