import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Search, Filter, ChevronDown, Activity, LogOut, Home, History, Phone, Mail } from 'lucide-react';

const PatientDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const patientName = "John Doe";

  const appointments = [
    {
        
      id: 1,
      date: '12/12/2025',
      time: '10:30 AM',
      doctor: 'Dr. Khanna',
      specialty: 'Cardiologist',
      description: 'Regular heart checkup and ECG test. Blood pressure monitoring and cardiac health assessment. Discussed lifestyle modifications for better heart health.',
      status: 'completed',
      prescription: 'Available',
      diagnosis: 'Normal cardiac function',
      contact: '+91-9876543210'
    },
    {
      id: 2,
      date: '05/12/2025',
      time: '02:00 PM',
      doctor: 'Dr. Sharma',
      specialty: 'General Physician',
      description: 'Seasonal flu symptoms and throat infection treatment. Physical examination and throat culture test performed. Prescribed rest and medication.',
      status: 'completed',
      prescription: 'Available',
      diagnosis: 'Acute pharyngitis',
      contact: '+91-9876543211'
    },
    {
      id: 3,
      date: '28/11/2025',
      time: '11:00 AM',
      doctor: 'Dr. Patel',
      specialty: 'Dermatologist',
      description: 'Skin allergy consultation and treatment plan discussion. Patch testing done for common allergens. Provided skin care recommendations.',
      status: 'completed',
      prescription: 'Available',
      diagnosis: 'Contact dermatitis',
      contact: '+91-9876543212'
    },
    {
      id: 4,
      date: '15/11/2025',
      time: '09:15 AM',
      doctor: 'Dr. Khanna',
      specialty: 'Cardiologist',
      description: 'Follow-up appointment for cardiac health assessment. Reviewed previous test results and discussed medication adjustments. All vitals normal.',
      status: 'completed',
      prescription: 'Available',
      diagnosis: 'Improved cardiac markers',
      contact: '+91-9876543210'
    },
    {
      id: 5,
      date: '20/12/2025',
      time: '03:30 PM',
      doctor: 'Dr. Verma',
      specialty: 'Orthopedic',
      description: 'Knee pain examination and X-ray review. Discussion about treatment options and physical therapy recommendations.',
      status: 'upcoming',
      prescription: 'Not Available',
      diagnosis: 'Pending',
      contact: '+91-9876543213'
    },
    {
      id: 6,
      date: '10/11/2025',
      time: '04:00 PM',
      doctor: 'Dr. Gupta',
      specialty: 'Ophthalmologist',
      description: 'Eye examination and vision test. Prescription for corrective lenses updated. No major concerns found.',
      status: 'completed',
      prescription: 'Available',
      diagnosis: 'Myopia',
      contact: '+91-9876543214'
    }
  ];

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || apt.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1DC' }}>
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
          color: #0046FF;
        }
        
        .custom-bg-blue {
          background-color: #0046FF;
        }
        
        .custom-bg-cyan {
          background-color: #73C8D2;
        }
        
        .custom-bg-orange {
          background-color: #FF9013;
        }
        
        .custom-hover-blue:hover {
          background-color: #0038CC;
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

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8" style={{ color: '#0046FF' }} />
              <h1 className="text-2xl font-bold custom-primary">MediCare Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{patientName}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
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
            <button className="flex items-center gap-2 px-4 py-4 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-4 border-b-2 text-gray-800" style={{ borderColor: '#0046FF' }}>
              <History className="w-5 h-5" style={{ color: '#0046FF' }} />
              <span className="custom-primary font-semibold">Appointment History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-3xl font-bold custom-primary mb-2">Your Appointment History</h2>
          <p className="text-gray-600">View all your previous and upcoming medical appointments</p>
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
                <option value="upcoming">Upcoming</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Appointments List */}
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
                            appointment.status === 'completed' ? 'status-completed' : 'status-upcoming'
                          }`}>
                            {appointment.status === 'completed' ? 'Completed' : 'Upcoming'}
                          </span>
                        </div>
                        
                        <p className="text-sm font-semibold mb-3" style={{ color: '#0046FF' }}>
                          {appointment.specialty}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: '#FF9013' }} />
                            <span className="font-medium">{appointment.date}</span>
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
                    <button className="px-5 py-2 rounded-lg text-white font-medium transition-all custom-bg-blue custom-hover-blue hover:shadow-lg whitespace-nowrap">
                      View Full Details
                    </button>
                    {appointment.prescription === 'Available' && (
                      <button className="px-5 py-2 rounded-lg font-medium transition-all border-2 hover:bg-blue-50 whitespace-nowrap" style={{ borderColor: '#0046FF', color: '#0046FF' }}>
                        Download Report
                      </button>
                    )}
                    {appointment.status === 'upcoming' && (
                      <button className="px-5 py-2 rounded-lg font-medium transition-all custom-bg-orange text-white hover:opacity-90 whitespace-nowrap">
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

        {/* Summary Statistics */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Appointment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1DC' }}>
              <p className="text-3xl font-bold custom-primary">{appointments.filter(a => a.status === 'completed').length}</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Completed</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1DC' }}>
              <p className="text-3xl font-bold" style={{ color: '#FF9013' }}>{appointments.filter(a => a.status === 'upcoming').length}</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Upcoming</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1DC' }}>
              <p className="text-3xl font-bold" style={{ color: '#73C8D2' }}>{appointments.length}</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Total Visits</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1DC' }}>
              <p className="text-3xl font-bold custom-primary">{new Set(appointments.map(a => a.doctor)).size}</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Doctors Met</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;