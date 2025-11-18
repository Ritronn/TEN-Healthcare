import React, { useEffect, useState } from 'react';
import { Activity, UserCircle, Stethoscope } from 'lucide-react';
import axios from 'axios';

export default function MedicalPortalHome() {
  const [showDoctorSignup, setShowDoctorSignup] = useState(false);
  const [showPatientSignup, setShowPatientSignup] = useState(false);
  
  const [doctorData, setDoctorData] = useState({ name: '', email: '', password: '' });
  const [patientData, setPatientData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const doctorRes = await axios.get(`${apiUrl}/doctor/profile`);
        const patientsRes = await axios.get(`${apiUrl}/doctor/patients`);
        console.log("Doctor Profile:", doctorRes.data);
        console.log("Patients:", patientsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // ✅ Make all handlers async (important)
  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiUrl}/doctor/login`, doctorData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', 'doctor');

      console.log('Doctor login successful:', response.data);
      alert('Login successful!');
      window.location.href = '/doctor/dashboard';
    } catch (error) {
      console.error('Doctor login failed:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiUrl}/patient/login`, patientData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', 'patient');

      console.log('Patient login successful:', response.data);
      alert('Login successful!');
      window.location.href = '/patient/dashboard';
    } catch (error) {
      console.error('Patient login failed:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const handleDoctorSignup = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiUrl}/doctor/signup`, doctorData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', 'doctor');

      console.log('Doctor signup successful:', response.data);
      alert('Account created successfully!');
      window.location.href = '/doctor/dashboard';
    } catch (error) {
      console.error('Doctor signup failed:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  const handlePatientSignup = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiUrl}/patient/signup`, patientData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', 'patient');

      console.log('Patient signup successful:', response.data);
      alert('Account created successfully!');
      window.location.href = '/patient/dashboard';
    } catch (error) {
      console.error('Patient signup failed:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };


  return (
     <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 overflow-auto" style={{ colorScheme: 'light' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Activity className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">MediCare Portal</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to MediCare Portal
          </h2>
          <p className="text-lg text-gray-600">
            Connect with healthcare professionals or manage your health records
          </p>
        </div>

        {/* Login Boxes */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Doctor Login/Signup */}
          {showDoctorSignup ? (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <Stethoscope className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Doctor Sign Up</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={doctorData.name}
                    onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={doctorData.email}
                    onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="doctor@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={doctorData.password}
                    onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleDoctorSignup}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Sign Up
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowDoctorSignup(false)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Already have an account? Login
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <Stethoscope className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Doctor Login</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={doctorData.email}
                    onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white "
                    placeholder="doctor@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={doctorData.password}
                    onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleDoctorLogin}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Login
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowDoctorSignup(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Patient Login/Signup */}
          {showPatientSignup ? (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <UserCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Patient Sign Up</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={patientData.email}
                    onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="patient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={patientData.password}
                    onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handlePatientSignup}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Sign Up
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowPatientSignup(false)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Already have an account? Login
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <UserCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Patient Login</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={patientData.email}
                    onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white "
                    placeholder="patient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={patientData.password}
                    onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handlePatientLogin}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Login
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowPatientSignup(true)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}