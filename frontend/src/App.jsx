import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './Pages/MedicalPortalHome'
import Docdash from './Pages/DoctorDashboard'
import PatientDashboard from './Pages/PatientDashboard'
import MedicalHistoryForm from './Pages/MedicalHistoryForm'
import BookAppointment from './Pages/BookAppointment'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.role) {
      setIsAuthenticated(true);
      setUserRole(user.role);
    }
  }, []);

  const HomeRoute = () => {
    if (isAuthenticated) {
      return userRole === 'doctor' ? 
        <Navigate to="/doc/dash" replace /> : 
        <Navigate to="/patient/dash" replace />;
    }
    return <Home />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/doc/dash" element={
          <ProtectedRoute requiredRole="doctor">
            <Docdash />
          </ProtectedRoute>
        } />
        <Route path="/patient/dash" element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/medical-history" element={
          <ProtectedRoute requiredRole="patient">
            <MedicalHistoryForm />
          </ProtectedRoute>
        } />
        <Route path="/patient/book-appointment" element={
          <ProtectedRoute requiredRole="patient">
            <BookAppointment />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App