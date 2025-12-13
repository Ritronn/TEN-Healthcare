import React, { useState } from 'react';
import { Activity, UserCircle, Stethoscope, AlertCircle } from 'lucide-react';

export default function MedicalPortalHome() {
  const [showDoctorSignup, setShowDoctorSignup] = useState(false);
  const [showPatientSignup, setShowPatientSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [doctorData, setDoctorData] = useState({ name: '', email: '', password: '' });
  const [patientData, setPatientData] = useState({ name: '', email: '', password: '' });

  const API_URL = 'http://localhost:5000/api/auth';

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/doctor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: doctorData.email, password: doctorData.password })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.replace('/doc/dash');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/patient/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: patientData.email, password: patientData.password })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.replace('/patient/dash');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/doctor/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.replace('/doc/dash');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/patient/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isNewUser', 'true');
      window.location.replace('/patient/medical-history');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)' }}>
      <style>{`
        .custom-primary { color: #059669; }
        .custom-bg-blue { background-color: #059669; }
        .custom-hover-blue:hover { background-color: #047857; }
        .custom-bg-green { background-color: #10B981; }
        .custom-hover-green:hover { background-color: #059669; }
        
        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .shape {
          position: absolute;
          background: rgba(5, 150, 105, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .shape:nth-child(1) {
          width: 80px;
          height: 80px;
          left: 10%;
          animation-delay: 0s;
        }
        
        .shape:nth-child(2) {
          width: 120px;
          height: 120px;
          left: 80%;
          animation-delay: 2s;
        }
        
        .shape:nth-child(3) {
          width: 60px;
          height: 60px;
          left: 60%;
          animation-delay: 4s;
        }
        
        .shape:nth-child(4) {
          width: 100px;
          height: 100px;
          left: 30%;
          animation-delay: 1s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        
        .card-entrance {
          animation: slideUp 0.6s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-input {
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(5, 150, 105, 0.15);
        }
        
        .btn-hover {
          transition: all 0.3s ease;
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(5, 150, 105, 0.3);
        }
      `}</style>
      
      {/* Animated Background */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Activity className="w-8 h-8 custom-primary mr-2" />
            <h1 className="text-2xl font-bold custom-primary">TEN HEALTHCARE</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to TEN HEALTHCARE
          </h2>
          <p className="text-lg text-gray-600">
            Connect with healthcare professionals or manage your health records
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-5xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Login Boxes */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
          {/* Doctor Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto card-entrance backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="flex items-center justify-center mb-6">
              <Stethoscope className="w-12 h-12 custom-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              {showDoctorSignup ? 'Doctor Sign Up' : 'Doctor Login'}
            </h2>
            <form onSubmit={showDoctorSignup ? handleDoctorSignup : handleDoctorLogin} className="space-y-4">
              {showDoctorSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={doctorData.name}
                    onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={doctorData.email}
                  onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="doctor@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={doctorData.password}
                  onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full custom-bg-blue text-white py-2 rounded-lg custom-hover-blue transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (showDoctorSignup ? 'Sign Up' : 'Login')}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowDoctorSignup(!showDoctorSignup);
                  setError('');
                }}
                className="custom-primary hover:text-blue-800 text-sm font-medium"
              >
                {showDoctorSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>

          {/* Patient Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto card-entrance backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center mb-6">
              <UserCircle className="w-12 h-12" style={{ color: '#10B981' }} />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              {showPatientSignup ? 'Patient Sign Up' : 'Patient Login'}
            </h2>
            <form onSubmit={showPatientSignup ? handlePatientSignup : handlePatientLogin} className="space-y-4">
              {showPatientSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={patientData.email}
                  onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="patient@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={patientData.password}
                  onChange={(e) => setPatientData({ ...patientData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full custom-bg-green text-white py-2 rounded-lg custom-hover-green transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (showPatientSignup ? 'Sign Up' : 'Login')}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowPatientSignup(!showPatientSignup);
                  setError('');
                }}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                {showPatientSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}