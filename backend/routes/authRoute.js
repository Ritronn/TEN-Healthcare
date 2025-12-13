import express from 'express';
import {
  doctorSignup,
  doctorLogin,
  patientSignup,
  patientLogin,
  getProfile
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import User from '../models/user.model.js';

const router = express.Router();

// Doctor routes
router.post('/doctor/signup', doctorSignup);
router.post('/doctor/login', doctorLogin);

// Patient routes
router.post('/patient/signup', patientSignup);
router.post('/patient/login', patientLogin);

// Protected route check - Get profile (both doctor and patient can access)
router.get('/profile', protect, getProfile);


// Get all doctors
router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email');
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Example: Doctor only route
router.get('/doctor/dashboard', protect, authorize('doctor'), (req, res) => {
  res.json({ message: 'Welcome to Doctor Dashboard', user: req.user });
});

// Example: Patient only route
router.get('/patient/dashboard', protect, authorize('patient'), (req, res) => {
  res.json({ message: 'Welcome to Patient Dashboard', user: req.user });
});

export default router;