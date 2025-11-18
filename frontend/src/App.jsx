import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/MedicalPortalHome'
import PatientDashboard from './Pages/PatientDashboard'
import DoctorDashboard from './Pages/DoctorDashboard'
import MedicalHistoryForm from './Pages/MedicalHistoryForm'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Home />} />

        
        <Route 
          path="/patient/dashboard" 
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/medicalHistoryForm" 
          element={
            <ProtectedRoute>
              <MedicalHistoryForm />
            </ProtectedRoute>
          } 
        />

        
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  )
}

export default App
