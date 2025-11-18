import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Search,
  Filter,
  ChevronDown,
  Activity,
  LogOut,
  Home,
  History,
  Phone,
  FileSignature
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();

  // ======================= STATE =======================
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  // ======================= FETCH APPOINTMENTS =======================
  useEffect(() => {
    fetchAppointments();
    fetchMedicalHistory();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${apiBase}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = res.data.appointments.map((item) => ({
        id: item._id,
        date: item.date,
        time: item.time,
        doctor: item.doctor,
        specialty: item.specialty,
        description: item.description,
        status: item.status,
        prescription: item.prescription,
        diagnosis: item.diagnosis,
        contact: item.contact,
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  // ======================= FETCH MEDICAL HISTORY =======================
  const fetchMedicalHistory = async () => {
    try {
      const res = await axios.get(`${apiBase}/medical-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedicalHistory(res.data.records);
    } catch (err) {
      console.error("Error fetching medical history:", err);
    }
  };

  // ======================= LOGOUT =======================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ======================= FILTER APPOINTMENTS =======================
  const filteredAppointments = appointments.filter((apt) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      apt.doctor.toLowerCase().includes(s) ||
      apt.specialty.toLowerCase().includes(s) ||
      apt.description.toLowerCase().includes(s);

    const matchesFilter =
      filterStatus === "all" || apt.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F1DC" }}>
      
      {/* ===================== HEADER ===================== */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-7 h-7 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold custom-primary">
              MediCare Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-800">
                {user.name || "Patient"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================== TABS ===================== */}
      <div className="bg-white border-b sticky top-[65px] z-40">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-4 py-3">

          <TabButton
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
            icon={<History className="w-5 h-5" />}
            label="Appointment History"
          />

          <TabButton
            active={activeTab === "medical"}
            onClick={() => setActiveTab("medical")}
            icon={<FileSignature className="w-5 h-5" />}
            label="Medical History"
          />

          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={<User className="w-5 h-5" />}
            label="Profile"
          />

        </div>
      </div>

      {/* ===================== CONTENT ===================== */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <AppointmentsTab
            filteredAppointments={filteredAppointments}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}

        {/* MEDICAL HISTORY TAB */}
        {activeTab === "medical" && <MedicalHistoryTab medicalHistory={medicalHistory} />}

        {/* PROFILE TAB */}
        {activeTab === "profile" && <ProfileTab user={user} />}
      </div>
    </div>
  );
};

export default PatientDashboard;

/* ======================================================
   TAB BUTTON COMPONENT
====================================================== */
const TabButton = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
      active
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

/* ======================================================
   APPOINTMENTS TAB
====================================================== */
const AppointmentsTab = ({
  filteredAppointments,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) => (
  <>
    {/* Search + Filter */}
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <div className="grid sm:grid-cols-2 gap-4">

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 p-3 border rounded-lg"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select
            className="w-full pl-10 p-3 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Appointments</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

      </div>
    </div>

    {/* Appointment Cards */}
    <div className="space-y-4">
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map((apt) => <AppointmentCard key={apt.id} apt={apt} />)
      ) : (
        <div className="bg-white p-10 text-center rounded-xl shadow text-gray-600">
          No appointments found.
        </div>
      )}
    </div>
  </>
);

/* ======================================================
   APPOINTMENT CARD
====================================================== */
const AppointmentCard = ({ apt }) => (
  <div className="bg-white p-6 rounded-2xl shadow card-hover">
    <div className="flex flex-col sm:flex-row gap-5">

      <div className="w-14 h-14 rounded-full custom-bg-cyan flex items-center justify-center">
        <User className="text-white w-7 h-7" />
      </div>

      <div className="flex-1">

        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{apt.doctor}</h3>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              apt.status === "completed" ? "status-completed" : "status-upcoming"
            }`}
          >
            {apt.status}
          </span>
        </div>

        <p className="text-sm font-semibold text-blue-600">{apt.specialty}</p>

        <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-700">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-orange-500" /> {apt.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-orange-500" /> {apt.time}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-cyan-600" /> {apt.contact}
          </span>
        </div>

        <div className="bg-yellow-100 p-3 rounded-lg mt-4">
          <p className="font-semibold">Details:</p>
          <p className="text-gray-700">{apt.description}</p>
        </div>

        {apt.status === "completed" && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-semibold text-green-700">Diagnosis:</p>
              <p>{apt.diagnosis}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-semibold text-blue-700">Prescription:</p>
              <p>{apt.prescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ======================================================
   MEDICAL HISTORY TAB
====================================================== */
const MedicalHistoryTab = ({ medicalHistory }) => (
  <div className="space-y-4">

    {medicalHistory.length > 0 ? (
      medicalHistory.map((rec) => (
        <div key={rec._id} className="bg-white rounded-xl shadow p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800">{rec.fullName}</h3>

          <div className="text-gray-700 text-sm mt-3 space-y-1">
            <p>
              <strong>Chief Complaint:</strong> {rec.chiefComplaint}
            </p>
            <p>
              <strong>Past History:</strong> {rec.pastHistory}
            </p>
            <p>
              <strong>Allergies:</strong> {rec.allergies}
            </p>
          </div>
        </div>
      ))
    ) : (
      <div className="bg-white p-10 rounded-xl shadow text-center text-gray-600">
        No medical history found.
      </div>
    )}
  </div>
);

/* ======================================================
   PROFILE TAB
====================================================== */
const ProfileTab = ({ user }) => (
  <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
    <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
      Profile Information
    </h2>

    <div className="space-y-4 text-lg text-gray-700">

      <p>
        <strong>Name:</strong> {user.name}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Role:</strong> {user.role}
      </p>

    </div>
  </div>
);
