import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaFilePrescription } from 'react-icons/fa';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

 const patientId =localStorage.getItem('user_email'); 
console.log("patientId>>>",patientId)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors'); 
        // console.log("response>>>",response)
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPrescreptions = async () => {
      try {
        const payload = {patientId,};
        console.log("payload>>>",payload)
        const response = await axios.post('http://localhost:5000/api/prescriptionByPatientId',payload); 
        setPrescriptions(response.data)
        console.log("fetchPrescreptions>>>",response)
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPrescreptions();
  }, [patientId]);

  const navigateToConsultation = (doctor) => {
    navigate('/consultation', { state: { selectedDoctor: doctor } });
  };

  return (
    <Container className='col-6'>
      <h1>Patient Dashboard</h1>
      {prescriptions.length > 0 && (
                  <div className='my-2'>
                    <button type="button" className="btn btn-primary">
                    Prescriptions <span className="badge text-bg-secondary">{prescriptions.length}</span>
</button>
                  </div>
                )}
      {loading && <p>Loading doctors...</p>}
      {error && <p>Error loading doctors: {error}</p>}
      <Row>
        {doctors.map((doctor) => (
          <Col key={doctor._id} md={4}>
            <Card>
              <Card.Body>
                <Card.Title>{doctor.user.name}</Card.Title>
                <Card.Text>Specialty: {doctor.specialty}</Card.Text>
                <Card.Text>Specialty: {doctor.phoneNumber}</Card.Text>
                <Card.Text>Specialty: {doctor.yearsOfExperience}</Card.Text>
                {/* Add other doctor details as needed */}
                <Button type="button" className="btn btn-success"onClick={() => navigateToConsultation(doctor)}>Consult</Button>
                
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PatientDashboard;
