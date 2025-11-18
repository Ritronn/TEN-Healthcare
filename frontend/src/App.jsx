import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/MedicalPortalHome'
import PatientDashboard from './Pages/PatientDashboard'
import DoctorDashboard from './Pages/DoctorDashboard'
import MedicalHistoryForm from './Pages/MedicalHistoryForm'


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/patient/dashboard" element={<PatientDashboard/>} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard/>} />
        <Route path='/medicalHistoryForm' element={<MedicalHistoryForm/>} />
        {/* Example: <Route path="/Patientdashboard" element={<PatientDashboard />} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App

