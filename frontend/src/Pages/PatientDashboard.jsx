import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Search, Filter, ChevronDown, Activity, LogOut, Home, History, Phone, Mail, Plus, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedView, setSelectedView] = useState('dashboard');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', reason: '' });
  const [showChatBot, setShowChatBot] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const patientName = user.name || "Patient";

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAcceptReschedule = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const appointment = displayAppointments.find(apt => apt._id === appointmentId);
      
      const response = await fetch(`http://localhost:5000/api/auth/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'confirmed',
          date: appointment.rescheduleDate,
          time: appointment.rescheduleTime,
          rescheduleReason: '',
          rescheduleDate: '',
          rescheduleTime: ''
        })
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error accepting reschedule:', err);
    }
  };

  const handleDeclineReschedule = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'confirmed',
          rescheduleReason: '',
          rescheduleDate: '',
          rescheduleTime: ''
        })
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error declining reschedule:', err);
    }
  };

  const handlePatientReschedule = (appointmentId) => {
    setRescheduleAppointmentId(appointmentId);
    setShowRescheduleModal(true);
  };

  const submitPatientReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.reason) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/appointments/${rescheduleAppointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'reschedule_requested',
          rescheduleReason: rescheduleData.reason,
          rescheduleDate: rescheduleData.date,
          rescheduleTime: rescheduleData.time
        })
      });

      if (response.ok) {
        setShowRescheduleModal(false);
        setRescheduleData({ date: '', time: '', reason: '' });
        fetchAppointments();
        alert('Reschedule request sent to doctor!');
      }
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch appointments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleAppointments = [];

  const displayAppointments = appointments.length > 0 ? appointments : sampleAppointments;
  const filteredAppointments = displayAppointments.filter(apt => {
    const matchesSearch = 
      (apt.doctor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.specialty || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || apt.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)' }}>
      <style>{`
        .floating-medical {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .medical-icon {
          position: absolute;
          color: rgba(5, 150, 105, 0.1);
          animation: medicalFloat 8s ease-in-out infinite;
        }
        
        .medical-icon:nth-child(1) {
          left: 5%;
          top: 20%;
          animation-delay: 0s;
        }
        
        .medical-icon:nth-child(2) {
          right: 10%;
          top: 60%;
          animation-delay: 3s;
        }
        
        .medical-icon:nth-child(3) {
          left: 70%;
          top: 10%;
          animation-delay: 6s;
        }
        
        @keyframes medicalFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) rotate(10deg);
            opacity: 0.6;
          }
        }
        
        .dashboard-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out;
        }
        
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(5, 150, 105, 0.15);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .stat-card {
          animation: scaleIn 0.5s ease-out;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .pulse-icon {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 70, 255, 0.15);
        }
        
        .card-hover:hover .doctor-icon {
          transform: scale(1.1);
        }
        
        .doctor-icon {
          transition: all 0.3s ease;
        }
        
        .status-badge {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover .status-badge {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .detail-section {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover .detail-section {
          transform: translateX(5px);
        }
        
        .action-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 70, 255, 0.3);
        }
        
        .action-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .action-button:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .info-icon {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover .info-icon {
          transform: scale(1.2) rotate(10deg);
        }
        
        .status-completed {
          background-color: #73C8D2;
          color: white;
        }
        
        .status-upcoming {
          background-color: #FF9013;
          color: white;
        }
        
        .custom-primary {
          color: #059669;
        }
        
        .custom-bg-blue {
          background-color: #059669;
        }
        
        .custom-bg-cyan {
          background-color: #10B981;
        }
        
        .custom-bg-orange {
          background-color: #34D399;
        }
        
        .custom-hover-blue:hover {
          background-color: #047857;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .card-hover:hover .date-time {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .description-box {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover .description-box {
          background-color: #e8e4cd;
          transform: scale(1.02);
        }
      `}</style>

      {/* Animated Background */}
      <div className="floating-medical">
        <Activity className="medical-icon w-16 h-16" />
        <Calendar className="medical-icon w-12 h-12" />
        <User className="medical-icon w-14 h-14" />
      </div>
      
      {/* Header */}
      <header className="bg-white shadow-md relative z-10 backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8" style={{ color: '#059669' }} />
              <h1 className="text-2xl font-bold custom-primary">TEN HEALTHCARE</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{patientName}</p>
              </div>
              <button 
                onClick={() => setShowChatBot(true)}
                className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-800 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden md:inline">Chat Assistant</span>
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  localStorage.removeItem('isNewUser');
                  window.location.replace('/');
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button 
              onClick={() => setSelectedView('dashboard')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-all cursor-pointer ${selectedView === 'dashboard' ? 'border-green-600 text-green-600' : 'border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800'}`}
            >
              <Home className="w-5 h-5" style={{ color: selectedView === 'dashboard' ? '#059669' : '#6B7280' }} />
              <span className={selectedView === 'dashboard' ? 'font-semibold' : ''}>Dashboard</span>
            </button>
            <button 
              onClick={() => setSelectedView('history')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-all cursor-pointer ${selectedView === 'history' ? 'border-green-600 text-green-600' : 'border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800'}`}
            >
              <History className="w-5 h-5" style={{ color: selectedView === 'history' ? '#059669' : '#6B7280' }} />
              <span className={selectedView === 'history' ? 'font-semibold' : ''}>Appointment History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard View */}
        {selectedView === 'dashboard' && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 dashboard-card relative z-10" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold custom-primary mb-2">Patient Dashboard</h2>
                  <p className="text-gray-600">Welcome back, {patientName}! Manage your healthcare appointments</p>
                </div>
                <button 
                  onClick={() => navigate('/patient/book-appointment')}
                  className="flex items-center gap-2 px-6 py-3 custom-bg-blue text-white rounded-xl custom-hover-blue transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Plus className="w-5 h-5 pulse-icon" />
                  Book Appointment
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
              <div className="bg-white rounded-2xl shadow-xl p-6 stat-card dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="text-center">
                  <p className="text-3xl font-bold custom-primary">{displayAppointments.filter(a => a.status === 'completed').length}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Completed</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 stat-card dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: '#34D399' }}>{displayAppointments.filter(a => a.status === 'pending').length}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Pending</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 stat-card dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{displayAppointments.filter(a => a.status === 'confirmed').length}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Confirmed</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 stat-card dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="text-center">
                  <p className="text-3xl font-bold custom-primary">{new Set(displayAppointments.map(a => a.doctor)).size}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Doctors Met</p>
                </div>
              </div>
            </div>
            
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-xl p-6 dashboard-card relative z-10" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <h3 className="text-xl font-bold custom-primary mb-4">Upcoming Appointments</h3>
              {displayAppointments.filter(a => a.status !== 'completed').length > 0 ? (
                <div className="space-y-4">
                  {displayAppointments.filter(a => a.status !== 'completed').slice(0, 3).map((appointment, index) => (
                    <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{appointment.doctor}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{appointment.specialty}</p>
                          <p className="text-sm text-gray-600 mb-3">{new Date(appointment.date.split('/').reverse().join('-')).toLocaleDateString('en-GB')} at {appointment.time}</p>
                          <p className="text-sm text-gray-700">{appointment.description}</p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {appointment.status === 'reschedule_requested' && (
                            <div className="text-xs text-orange-600 mb-2 p-2 bg-orange-50 rounded">
                              <p><strong>Reschedule Request:</strong> {appointment.rescheduleReason}</p>
                              {appointment.rescheduleDate && (
                                <p><strong>Suggested:</strong> {appointment.rescheduleDate} at {appointment.rescheduleTime}</p>
                              )}
                            </div>
                          )}
                          {appointment.status === 'reschedule_requested' && (
                            <>
                              <button 
                                onClick={() => handleAcceptReschedule(appointment._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                              >
                                Accept Reschedule
                              </button>
                              <button 
                                onClick={() => handlePatientReschedule(appointment._id)}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                              >
                                Request Different Time
                              </button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <button 
                              onClick={() => handlePatientReschedule(appointment._id)}
                              className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg text-sm hover:bg-orange-50 transition-colors"
                            >
                              Reschedule
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming appointments. Book your first appointment!</p>
              )}
              {displayAppointments.filter(a => a.status !== 'completed').length > 3 && (
                <div className="text-center mt-4">
                  <button 
                    onClick={() => setSelectedView('history')}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    View All Appointments →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* History View */}
        {selectedView === 'history' && (
          <>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold custom-primary mb-2">Your Appointment History</h2>
                  <p className="text-gray-600">View all your previous and upcoming medical appointments</p>
                </div>
                <button 
                  onClick={() => navigate('/patient/book-appointment')}
                  className="flex items-center gap-2 px-6 py-3 custom-bg-blue text-white rounded-lg custom-hover-blue transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by doctor, specialty, or description..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="all">All Appointments</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#e8f5e8' }}>
                  <Activity className="w-8 h-8 custom-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading appointments...</h3>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Appointments List */}
            {!loading && (
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-md p-6 card-hover transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center custom-bg-cyan">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{appointment.doctor}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'reschedule_requested' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <p className="text-sm font-semibold mb-3" style={{ color: '#0046FF' }}>
                          {appointment.specialty}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: '#FF9013' }} />
                            <span className="font-medium">{new Date(appointment.date.split('/').reverse().join('-')).toLocaleDateString('en-GB')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" style={{ color: '#FF9013' }} />
                            <span className="font-medium">{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" style={{ color: '#73C8D2' }} />
                            <span className="font-medium">{appointment.contact}</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg mb-3" style={{ backgroundColor: '#F5F1DC' }}>
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#0046FF' }} />
                            <div>
                              <p className="text-sm font-semibold text-gray-800 mb-1">Appointment Details:</p>
                              <p className="text-sm text-gray-700">{appointment.description}</p>
                            </div>
                          </div>
                        </div>

                        {appointment.status === 'completed' && (
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="font-semibold text-green-800 mb-1">Diagnosis:</p>
                              <p className="text-green-700">{appointment.diagnosis}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="font-semibold text-blue-800 mb-1">Prescription:</p>
                              <p className="text-blue-700">{appointment.prescription}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Action Buttons */}
                  <div className="flex lg:flex-col gap-2 flex-shrink-0">
                    {appointment.prescription === 'Available' && (
                      <button className="px-5 py-2 rounded-lg font-medium transition-all border-2 hover:bg-blue-50 whitespace-nowrap" style={{ borderColor: '#0046FF', color: '#0046FF' }}>
                        Download Report
                      </button>
                    )}
                    {appointment.status === 'reschedule_requested' && (
                      <>
                        <button 
                          onClick={() => handleAcceptReschedule(appointment._id)}
                          className="px-5 py-2 rounded-lg font-medium transition-all bg-green-600 text-white hover:bg-green-700 whitespace-nowrap"
                        >
                          Accept Reschedule
                        </button>
                        <button 
                          onClick={() => handlePatientReschedule(appointment._id)}
                          className="px-5 py-2 rounded-lg font-medium transition-all bg-orange-600 text-white hover:bg-orange-700 whitespace-nowrap"
                        >
                          Request Different Time
                        </button>
                      </>
                    )}
                    {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                      <button 
                        onClick={() => handlePatientReschedule(appointment._id)}
                        className="px-5 py-2 rounded-lg font-medium transition-all custom-bg-orange text-white hover:opacity-90 whitespace-nowrap"
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F5F1DC' }}>
                <Calendar className="w-8 h-8" style={{ color: '#0046FF' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No appointments found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
              )}
            </div>
            )}
          </>
        )}


      </div>

      {/* Patient Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#059669' }}>Reschedule Appointment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                <select
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                  placeholder="Reason for rescheduling..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitPatientReschedule}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ChatBot */}
      <ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} />
    </div>
  );
};

export default PatientDashboard;