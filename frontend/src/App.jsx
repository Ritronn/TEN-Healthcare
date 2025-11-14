import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/MedicalPortalHome'
import MedicalHistoryForm from './Pages/MedicalHistoryForm'


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/medicalHistoryForm' element={<MedicalHistoryForm/>} />
        {/* Example: <Route path="/Patientdashboard" element={<PatientDashboard />} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App