import './App.css'

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Componets/Shared/Layout';
import Home from './Componets/Pages/Home';
import Login from './Componets/Auth/LoginForm';
import Signup from './Componets/Auth/SignupForm';
import DoctorDashboard from './Componets/Doctor/DoctorDashboard';
import PatientDashboard from './Componets/Patient/PatientDashboard';
import ConsultationForm from './Componets/Patient/ConsultationForm';
import PrescriptionForm from './Componets/Doctor/PrescriptionForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/patient" element={<Signup />} />
          <Route path="/signup/doctor" element={<Signup />} />
          

          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="consultation" element={<ConsultationForm />} />
          <Route path="/consultation/:doctorId" element={<ConsultationForm />} />
          <Route path="/prescription/:patientId" element={<PrescriptionForm />} />
          {/* Add more routes for other pages */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

