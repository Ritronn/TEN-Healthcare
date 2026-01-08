import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Search, Filter, ChevronDown, Activity, LogOut, Home, Users, Bell, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedView, setSelectedView] = useState('appointments');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', reason: '' });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionAppointmentId, setPrescriptionAppointmentId] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({ 
    diagnosis: {
      primaryDiagnosis: '',
      secondaryDiagnosis: '',
      icdCode: '',
      severity: 'mild'
    },
    prescription: {
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    },
    notes: ''
  });
  const [prescriptionStep, setPrescriptionStep] = useState(1);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);
  const [viewPrescriptionData, setViewPrescriptionData] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const doctorName = user.name || "Doctor";
  const doctorSpecialty = "Healthcare Professional";

  useEffect(() => {
    // Check if user is actually a doctor
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Stored user:', storedUser);
    console.log('User role:', storedUser.role);
    
    if (storedUser.role !== 'doctor') {
      setError('You must be logged in as a doctor to access this page');
      setLoading(false);
      return;
    }
    
    fetchAllAppointments();
  }, []);

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const appointment = displayAppointments.find(apt => apt._id === appointmentId);
      
      const updateData = { status: 'confirmed' };
      
      // If accepting a reschedule, update with the new date/time
      if (appointment && appointment.rescheduleDate && appointment.rescheduleTime) {
        updateData.date = appointment.rescheduleDate;
        updateData.time = appointment.rescheduleTime;
        updateData.rescheduleReason = '';
        updateData.rescheduleDate = '';
        updateData.rescheduleTime = '';
      }
      
      const response = await fetch(`http://localhost:5000/api/auth/appointments/doctor/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        fetchAllAppointments(); // Refresh appointments
      }
    } catch (err) {
      console.error('Error confirming appointment:', err);
    }
  };

  const handleRequestReschedule = (appointmentId) => {
    setRescheduleAppointmentId(appointmentId);
    setShowRescheduleModal(true);
  };

  const submitReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.reason) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/appointments/doctor/${rescheduleAppointmentId}`, {
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
        setShowSuccessModal(true);
        fetchAllAppointments();
        setTimeout(() => setShowSuccessModal(false), 3000);
      }
    } catch (err) {
      console.error('Error requesting reschedule:', err);
    }
  };

  const handleCompleteAppointment = (appointmentId) => {
    setPrescriptionAppointmentId(appointmentId);
    setShowPrescriptionModal(true);
  };

  const submitPrescription = async () => {
    if (!prescriptionData.diagnosis.primaryDiagnosis || prescriptionData.prescription.medications.length === 0 || !prescriptionData.prescription.medications[0].name) {
      alert('Please fill primary diagnosis and at least one medication');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const diagnosisText = `${prescriptionData.diagnosis.primaryDiagnosis}${prescriptionData.diagnosis.secondaryDiagnosis ? '; ' + prescriptionData.diagnosis.secondaryDiagnosis : ''}${prescriptionData.diagnosis.icdCode ? ' (ICD: ' + prescriptionData.diagnosis.icdCode + ')' : ''} - Severity: ${prescriptionData.diagnosis.severity}`;
      const prescriptionText = prescriptionData.prescription.medications.map(med => 
        `${med.name} ${med.dosage} - ${med.frequency} for ${med.duration}${med.instructions ? ' (' + med.instructions + ')' : ''}`
      ).join('; ');
      
      const response = await fetch(`http://localhost:5000/api/auth/appointments/doctor/${prescriptionAppointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'completed',
          diagnosis: diagnosisText,
          prescription: prescriptionText,
          notes: prescriptionData.notes
        })
      });

      if (response.ok) {
        setShowPrescriptionModal(false);
        setPrescriptionData({ 
          diagnosis: {
            primaryDiagnosis: '',
            secondaryDiagnosis: '',
            icdCode: '',
            severity: 'mild'
          },
          prescription: {
            medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
          },
          notes: ''
        });
        setPrescriptionStep(1);
        fetchAllAppointments();
      }
    } catch (err) {
      console.error('Error completing appointment:', err);
    }
  };

  const addMedication = () => {
    setPrescriptionData({
      ...prescriptionData,
      prescription: {
        ...prescriptionData.prescription,
        medications: [...prescriptionData.prescription.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
      }
    });
  };

  const removeMedication = (index) => {
    const newMedications = prescriptionData.prescription.medications.filter((_, i) => i !== index);
    setPrescriptionData({
      ...prescriptionData,
      prescription: {
        ...prescriptionData.prescription,
        medications: newMedications
      }
    });
  };

  const updateMedication = (index, field, value) => {
    const newMedications = [...prescriptionData.prescription.medications];
    newMedications[index][field] = value;
    setPrescriptionData({
      ...prescriptionData,
      prescription: {
        ...prescriptionData.prescription,
        medications: newMedications
      }
    });
  };

  const nextStep = () => {
    if (prescriptionStep === 1 && !prescriptionData.diagnosis.primaryDiagnosis) {
      alert('Please enter primary diagnosis');
      return;
    }
    if (prescriptionStep === 2 && (!prescriptionData.prescription.medications[0].name || !prescriptionData.prescription.medications[0].dosage)) {
      alert('Please fill medication name and dosage');
      return;
    }
    setPrescriptionStep(prescriptionStep + 1);
  };

  const prevStep = () => {
    setPrescriptionStep(prescriptionStep - 1);
  };

  const handleViewHistory = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/auth/medical-history/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.record) {
        setPatientHistory(data.record);
        setShowHistoryModal(true);
      } else {
        alert('No medical history found for this patient');
      }
    } catch (err) {
      console.error('Error fetching patient history:', err);
      alert('Error fetching patient history');
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      console.log('Fetching appointments for doctor...');
      const response = await fetch('http://localhost:5000/api/auth/appointments/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('API Response:', response.status, data);

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
  const activeAppointments = displayAppointments.filter(apt => apt.status !== 'completed');
  const completedAppointments = displayAppointments.filter(apt => apt.status === 'completed');
  
  const currentAppointments = selectedView === 'completed' ? completedAppointments : 
                              selectedView === 'reschedule_requested' ? displayAppointments.filter(apt => apt.status === 'reschedule_requested') :
                              activeAppointments;
  const filteredAppointments = currentAppointments.filter(apt => {
    const patientName = apt.patient?.name || apt.patient || '';
    const matchesSearch = 
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.description || apt.complaint || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.specialty || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || apt.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const today = new Date().toLocaleDateString('en-GB');
  const todayAppointments = displayAppointments.filter(a => a.date === today);
  const scheduledCount = displayAppointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  const completedCount = displayAppointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)' }}>
      <style>{`
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 70, 255, 0.15);
        }
        
        .card-hover:hover .patient-icon {
          transform: scale(1.1);
        }
        
        .patient-icon {
          transition: all 0.3s ease;
        }
        
        .status-badge {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover .status-badge {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
        
        .status-scheduled {
          background-color: #FF9013;
          color: white;
        }
        
        .status-completed {
          background-color: #73C8D2;
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
        
        .stat-card {
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 70, 255, 0.15);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8" style={{ color: '#059669' }} />
              <h1 className="text-2xl font-bold custom-primary">TEN HEALTHCARE</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-semibold text-gray-800">{doctorName}</p>
                <p className="text-xs text-gray-500">{doctorSpecialty}</p>
              </div>
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
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button 
              onClick={() => setSelectedView('appointments')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 ${selectedView === 'appointments' ? 'border-green-600 text-green-600' : 'border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800'}`}
            >
              <Home className="w-5 h-5" style={{ color: selectedView === 'appointments' ? '#059669' : '#6B7280' }} />
              <span className={selectedView === 'appointments' ? 'font-semibold' : ''} style={{ color: selectedView === 'appointments' ? '#059669' : '' }}>Dashboard</span>
            </button>
            <button 
              onClick={() => setSelectedView('patients')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 ${selectedView === 'patients' ? 'border-green-600 text-green-600' : 'border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800'}`}
            >
              <Users className="w-5 h-5" />
              <span>My Patients</span>
            </button>
            <button 
              onClick={() => setSelectedView('completed')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 ${selectedView === 'completed' ? 'border-green-600 text-green-600' : 'border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800'}`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Completed</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-3xl font-bold custom-primary mb-2">Doctor Dashboard</h2>
          <p className="text-gray-600">Manage your appointments and patient consultations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6 stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Today's Appointments</p>
                <p className="text-3xl font-bold custom-primary">{todayAppointments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center custom-bg-blue">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Scheduled</p>
                <p className="text-3xl font-bold" style={{ color: '#FF9013' }}>{scheduledCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center custom-bg-orange">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold" style={{ color: '#73C8D2' }}>{completedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center custom-bg-cyan">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Patients</p>
                <p className="text-3xl font-bold custom-primary">{displayAppointments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center custom-bg-blue">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
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
                placeholder="Search by patient name, complaint, or type..."
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
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F5F1DC' }}>
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

        {/* Content based on selected view */}
        {(selectedView === 'appointments' || selectedView === 'completed') && (
          <>
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
                        <div className="w-14 h-14 rounded-full flex items-center justify-center patient-icon custom-bg-cyan">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{appointment.patient?.name || appointment.patient}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold status-badge ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#F5F1DC', color: '#0046FF' }}>
                            {appointment.type}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
                          <span className="font-medium">{appointment.patient?.email || 'Email not available'}</span>
                        </div>
                        
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
                        
                        {appointment.status === 'reschedule_requested' && appointment.rescheduleDate && (
                          <div className="p-3 bg-orange-50 rounded-lg mb-3 text-sm">
                            <p className="font-semibold text-orange-800 mb-1">Patient Reschedule Request:</p>
                            <p className="text-orange-700"><strong>Reason:</strong> {appointment.rescheduleReason}</p>
                            <p className="text-orange-700"><strong>Requested:</strong> {new Date(appointment.rescheduleDate.split('/').reverse().join('-')).toLocaleDateString('en-GB')} at {appointment.rescheduleTime}</p>
                          </div>
                        )}

                        <div className="p-4 rounded-lg mb-3" style={{ backgroundColor: '#F5F1DC' }}>
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#0046FF' }} />
                            <div>
                              <p className="text-sm font-semibold text-gray-800 mb-1">Description:</p>
                              <p className="text-sm text-gray-700">{appointment.description || appointment.complaint}</p>
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
                    {(appointment.status === 'pending' || appointment.status === 'confirmed' || appointment.status === 'reschedule_requested') ? (
                      <>
                        {appointment.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleConfirmAppointment(appointment._id)}
                              className="px-5 py-2 rounded-lg text-white font-medium transition-all bg-green-600 hover:bg-green-700 whitespace-nowrap"
                            >
                              Confirm Appointment
                            </button>
                            <button 
                              onClick={() => handleRequestReschedule(appointment._id)}
                              className="px-5 py-2 rounded-lg font-medium transition-all border-2 border-orange-500 text-orange-600 hover:bg-orange-50 whitespace-nowrap"
                            >
                              Request Reschedule
                            </button>
                          </>
                        ) : appointment.status === 'reschedule_requested' ? (
                          <>
                            <button 
                              onClick={() => handleConfirmAppointment(appointment._id)}
                              className="px-5 py-2 rounded-lg text-white font-medium transition-all bg-green-600 hover:bg-green-700 whitespace-nowrap"
                            >
                              Accept Reschedule
                            </button>
                            <button 
                              onClick={() => handleRequestReschedule(appointment._id)}
                              className="px-5 py-2 rounded-lg font-medium transition-all bg-orange-600 text-white hover:bg-orange-700 whitespace-nowrap"
                            >
                              Request Different Time
                            </button>
                          </>
                        ) : appointment.status === 'confirmed' ? (
                          <button 
                            onClick={() => handleCompleteAppointment(appointment._id)}
                            disabled={new Date(appointment.date.split('/').reverse().join('-')) > new Date()}
                            className={`px-5 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                              new Date(appointment.date.split('/').reverse().join('-')) > new Date() 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {new Date(appointment.date.split('/').reverse().join('-')) > new Date() 
                              ? 'Complete (Future Date)' 
                              : 'Complete Appointment'
                            }
                          </button>
                        ) : null}
                        <button 
                          onClick={() => handleViewHistory(appointment.patient?._id)}
                          className="px-5 py-2 rounded-lg font-medium transition-all border-2 hover:bg-blue-50 whitespace-nowrap" 
                          style={{ borderColor: '#059669', color: '#059669' }}
                        >
                          View History
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setViewPrescriptionData(appointment);
                            setShowViewPrescriptionModal(true);
                          }}
                          className="px-5 py-2 rounded-lg text-white font-medium transition-all custom-bg-blue custom-hover-blue hover:shadow-lg whitespace-nowrap action-button"
                        >
                          View Prescription
                        </button>
                      </>
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


        
        {/* My Patients View */}
        {selectedView === 'patients' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#059669' }}>My Patients</h3>
            {!loading && appointments.length > 0 ? (
              <div className="grid gap-4">
                {[...new Map(appointments.map(apt => [apt.patient?._id || apt.patient, apt])).values()].map((appointment, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{appointment.patient?.name || 'Patient Name'}</h4>
                        <p className="text-gray-600">{appointment.patient?.email || 'Email not available'}</p>
                        <p className="text-sm text-gray-500 mt-1">Last appointment: {new Date(appointment.date.split('/').reverse().join('-')).toLocaleDateString('en-GB')} at {appointment.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No patients yet</h3>
                <p className="text-gray-500">Patients will appear here once they book appointments</p>
              </div>
            )}
          </div>
        )}

        {/* Reschedule Modal */}
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
                  onClick={submitReschedule}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reschedule Request Sent!</h3>
              <p className="text-gray-600 mb-4">The patient will be notified about your reschedule request.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Multi-Step Prescription Modal */}
        {showPrescriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#059669' }}>Complete Appointment</h3>
                <div className="text-sm text-gray-500">Step {prescriptionStep} of 3</div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(prescriptionStep / 3) * 100}%` }}
                ></div>
              </div>

              {/* Step 1: Diagnosis */}
              {prescriptionStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Diagnosis Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Diagnosis *</label>
                    <select
                      value={prescriptionData.diagnosis.primaryDiagnosis}
                      onChange={(e) => setPrescriptionData({
                        ...prescriptionData,
                        diagnosis: { ...prescriptionData.diagnosis, primaryDiagnosis: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select primary diagnosis</option>
                      <option value="Upper Respiratory Tract Infection">Upper Respiratory Tract Infection</option>
                      <option value="Hypertension">Hypertension</option>
                      <option value="Type 2 Diabetes Mellitus">Type 2 Diabetes Mellitus</option>
                      <option value="Gastroenteritis">Gastroenteritis</option>
                      <option value="Migraine">Migraine</option>
                      <option value="Anxiety Disorder">Anxiety Disorder</option>
                      <option value="Allergic Rhinitis">Allergic Rhinitis</option>
                      <option value="Bronchitis">Bronchitis</option>
                      <option value="Urinary Tract Infection">Urinary Tract Infection</option>
                      <option value="Musculoskeletal Pain">Musculoskeletal Pain</option>
                      <option value="Dermatitis">Dermatitis</option>
                      <option value="Other">Other (specify below)</option>
                    </select>
                  </div>
                  
                  {prescriptionData.diagnosis.primaryDiagnosis === 'Other' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specify Primary Diagnosis</label>
                      <input
                        type="text"
                        placeholder="Enter specific diagnosis..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setPrescriptionData({
                          ...prescriptionData,
                          diagnosis: { ...prescriptionData.diagnosis, primaryDiagnosis: e.target.value }
                        })}
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Diagnosis (Optional)</label>
                    <input
                      type="text"
                      value={prescriptionData.diagnosis.secondaryDiagnosis}
                      onChange={(e) => setPrescriptionData({
                        ...prescriptionData,
                        diagnosis: { ...prescriptionData.diagnosis, secondaryDiagnosis: e.target.value }
                      })}
                      placeholder="Enter secondary diagnosis if any..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ICD Code (Optional)</label>
                      <input
                        type="text"
                        value={prescriptionData.diagnosis.icdCode}
                        onChange={(e) => setPrescriptionData({
                          ...prescriptionData,
                          diagnosis: { ...prescriptionData.diagnosis, icdCode: e.target.value }
                        })}
                        placeholder="e.g., J06.9"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                      <select
                        value={prescriptionData.diagnosis.severity}
                        onChange={(e) => setPrescriptionData({
                          ...prescriptionData,
                          diagnosis: { ...prescriptionData.diagnosis, severity: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Prescription */}
              {prescriptionStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-800">Prescription Details</h4>
                    <button
                      onClick={addMedication}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      + Add Medication
                    </button>
                  </div>
                  
                  {prescriptionData.prescription.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium text-gray-700">Medication {index + 1}</h5>
                        {prescriptionData.prescription.medications.length > 1 && (
                          <button
                            onClick={() => removeMedication(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                          <input
                            type="text"
                            value={medication.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            placeholder="e.g., Paracetamol"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                          <select
                            value={medication.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Select frequency</option>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="Three times daily">Three times daily</option>
                            <option value="Four times daily">Four times daily</option>
                            <option value="Every 4 hours">Every 4 hours</option>
                            <option value="Every 6 hours">Every 6 hours</option>
                            <option value="Every 8 hours">Every 8 hours</option>
                            <option value="As needed">As needed</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                          <select
                            value={medication.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Select duration</option>
                            <option value="3 days">3 days</option>
                            <option value="5 days">5 days</option>
                            <option value="7 days">7 days</option>
                            <option value="10 days">10 days</option>
                            <option value="14 days">14 days</option>
                            <option value="1 month">1 month</option>
                            <option value="3 months">3 months</option>
                            <option value="6 months">6 months</option>
                            <option value="Ongoing">Ongoing</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                        <input
                          type="text"
                          value={medication.instructions}
                          onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                          placeholder="e.g., Take with food, Before meals"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Additional Notes */}
              {prescriptionStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Notes</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Instructions</label>
                    <textarea
                      value={prescriptionData.notes}
                      onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                      placeholder="Enter any follow-up instructions, lifestyle recommendations, or additional notes..."
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">Summary:</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Diagnosis:</strong> {prescriptionData.diagnosis.primaryDiagnosis}
                      {prescriptionData.diagnosis.secondaryDiagnosis && `, ${prescriptionData.diagnosis.secondaryDiagnosis}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Medications:</strong> {prescriptionData.prescription.medications.filter(med => med.name).length} prescribed
                    </p>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    setPrescriptionStep(1);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                {prescriptionStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                
                {prescriptionStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitPrescription}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Complete Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* View Prescription Modal */}
        {showViewPrescriptionModal && viewPrescriptionData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#059669' }}>Prescription Details</h3>
              
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Patient Name</label>
                      <p className="text-gray-900">{viewPrescriptionData.patient?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                      <p className="text-gray-900">{new Date(viewPrescriptionData.date.split('/').reverse().join('-')).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Diagnosis Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Diagnosis Information</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {(() => {
                        const diagnosisText = viewPrescriptionData.diagnosis || '';
                        const parts = diagnosisText.split(' - Severity: ');
                        const mainDiagnosis = parts[0] || '';
                        const severity = parts[1] || 'Not specified';
                        
                        // Extract ICD code if present
                        const icdMatch = mainDiagnosis.match(/\(ICD: ([^)]+)\)/);
                        const icdCode = icdMatch ? icdMatch[1] : '';
                        const diagnosisWithoutICD = mainDiagnosis.replace(/\s*\(ICD: [^)]+\)/, '');
                        
                        // Split primary and secondary diagnosis
                        const diagnosisParts = diagnosisWithoutICD.split('; ');
                        const primaryDiagnosis = diagnosisParts[0] || '';
                        const secondaryDiagnosis = diagnosisParts[1] || '';
                        
                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-green-800">Primary Diagnosis:</p>
                                <p className="text-green-700">{primaryDiagnosis}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-green-800">Severity:</p>
                                <p className="text-green-700 capitalize">{severity}</p>
                              </div>
                            </div>
                            {secondaryDiagnosis && (
                              <div>
                                <p className="text-sm font-medium text-green-800">Secondary Diagnosis:</p>
                                <p className="text-green-700">{secondaryDiagnosis}</p>
                              </div>
                            )}
                            {icdCode && (
                              <div>
                                <p className="text-sm font-medium text-green-800">ICD Code:</p>
                                <p className="text-green-700">{icdCode}</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                
                {/* Prescription Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Prescribed Medications</h4>
                  <div className="space-y-3">
                    {(() => {
                      const prescriptionText = viewPrescriptionData.prescription || '';
                      const medications = prescriptionText.split('; ').filter(med => med.trim());
                      
                      return medications.length > 0 ? medications.map((medication, index) => {
                        // Parse medication string: "Name Dosage - Frequency for Duration (Instructions)"
                        const parts = medication.split(' - ');
                        const nameDosage = parts[0] || '';
                        const rest = parts[1] || '';
                        
                        const forIndex = rest.indexOf(' for ');
                        const frequency = forIndex > -1 ? rest.substring(0, forIndex) : rest;
                        const durationAndInstructions = forIndex > -1 ? rest.substring(forIndex + 5) : '';
                        
                        const instructionsMatch = durationAndInstructions.match(/^([^(]+)\s*\(([^)]+)\)$/);
                        const duration = instructionsMatch ? instructionsMatch[1].trim() : durationAndInstructions;
                        const instructions = instructionsMatch ? instructionsMatch[2] : '';
                        
                        // Split name and dosage
                        const nameWords = nameDosage.split(' ');
                        const name = nameWords.slice(0, -1).join(' ') || nameDosage;
                        const dosage = nameWords[nameWords.length - 1] || '';
                        
                        return (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                <p className="text-sm font-medium text-blue-800">Medicine:</p>
                                <p className="text-blue-700 font-semibold">{name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-800">Dosage:</p>
                                <p className="text-blue-700">{dosage}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-blue-800">Frequency:</p>
                                <p className="text-blue-700">{frequency}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-800">Duration:</p>
                                <p className="text-blue-700">{duration}</p>
                              </div>
                            </div>
                            {instructions && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-blue-800">Instructions:</p>
                                <p className="text-blue-700 italic">{instructions}</p>
                              </div>
                            )}
                          </div>
                        );
                      }) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-gray-600">No medications prescribed</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Additional Notes */}
                {viewPrescriptionData.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Follow-up Instructions</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800">{viewPrescriptionData.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-right">
                <button
                  onClick={() => setShowViewPrescriptionModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patient History Modal */}
        {showHistoryModal && patientHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#059669' }}>Patient Medical History</h3>
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Patient Name</label>
                    <p className="text-gray-900">{patientHistory.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <p className="text-gray-900">{new Date(patientHistory.dob).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Gender</label>
                    <p className="text-gray-900">{patientHistory.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                    <p className="text-gray-900">{patientHistory.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-gray-900">{patientHistory.email || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Address</label>
                  <p className="text-gray-900">{patientHistory.address || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Chief Complaint</label>
                  <p className="text-gray-900 bg-yellow-50 p-3 rounded">{patientHistory.chiefComplaint}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Allergies</label>
                    <p className="text-gray-900 bg-red-50 p-3 rounded">{patientHistory.allergies || 'None reported'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Current Medications</label>
                    <p className="text-gray-900 bg-blue-50 p-3 rounded">{patientHistory.medications || 'None reported'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Past Medical History</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{patientHistory.pastHistory || 'None reported'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Family History</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{patientHistory.familyHistory || 'None reported'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Social History</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{patientHistory.socialHistory || 'None reported'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Immunizations</label>
                  <p className="text-gray-900 bg-green-50 p-3 rounded">{patientHistory.immunizations || 'None reported'}</p>
                </div>
              </div>
              
              <div className="mt-6 text-right">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;