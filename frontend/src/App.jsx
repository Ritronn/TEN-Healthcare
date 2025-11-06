import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import './App.css'
import Patientlogin from './Pages/Patientlogin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patientlogin" element={<Patientlogin/>}/>

        {/* Example: <Route path="/Patientdashboard" element={<PatientDashboard />} /> */}
      </Routes>
    </Router>
  )
}

export default App