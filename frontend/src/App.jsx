import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/MedicalPortalHome'


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* Example: <Route path="/Patientdashboard" element={<PatientDashboard />} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App