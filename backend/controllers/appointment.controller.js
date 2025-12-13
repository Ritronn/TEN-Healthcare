import Appointment from "../models/appointment.model.js";

// CREATE appointment
export const createAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;

    const appointment = await Appointment.create({
      ...req.body,
      patient: patientId
    });

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all appointments for logged-in patient
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id
    }).sort({ createdAt: -1 });

    res.json({ appointments });
  } catch (err) {
    console.error("Fetch appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single appointment
export const getAppointmentById = async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: "Not found" });

    if (apt.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ appointment: apt });
  } catch (err) {
    console.error("Fetch appointment by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE appointment
export const updateAppointment = async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: "Not found" });

    if (apt.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(apt, req.body);
    await apt.save();

    res.json({ message: "Appointment updated", appointment: apt });
  } catch (err) {
    console.error("Update appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE appointment
export const deleteAppointment = async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: "Not found" });

    if (apt.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await apt.deleteOne();
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Delete appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all appointments for doctors
export const getAllAppointments = async (req, res) => {
  try {
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user._id);
    console.log('Doctor name:', req.user.name);
    
    // Only show appointments for this specific doctor
    const appointments = await Appointment.find({ doctor: req.user.name })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    console.log('Found appointments for this doctor:', appointments.length);
    res.json({ appointments });
  } catch (err) {
    console.error("Fetch all appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE appointment status/diagnosis (for doctors)
export const updateAppointmentByDoctor = async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: "Not found" });

    Object.assign(apt, req.body);
    await apt.save();

    res.json({ message: "Appointment updated", appointment: apt });
  } catch (err) {
    console.error("Update appointment by doctor error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
