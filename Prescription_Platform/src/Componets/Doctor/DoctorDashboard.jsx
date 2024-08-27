// DoctorDashboard.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [formForDoctor, setFormForDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate= useNavigate();

  const loggedInDoctor = localStorage.getItem("user_email");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/consultations/doctor/${loggedInDoctor}`);
        console.log("response>>>", response.data);
        setFormForDoctor(response.data);
        console.log("formForDoctor>>>", formForDoctor);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      } finally {
        setLoading(false); // Stop loading indicator after the operation is complete
      }
    };
    fetchForms();
  }, [loggedInDoctor]);

    // useEffect to log the updated formForDoctor state
    useEffect(() => {
      console.log("formForDoctor>>>", formForDoctor);
    }, [formForDoctor]); // This will run whenever formForDoctor changes

    const navigateToPrescription=(patientDetails) =>{
      navigate(`/prescription/${patientDetails.patientId}`);
    }
  return (
    <Container className='col-6'>
    <h1>Patient Dashboard</h1>
    {loading && <p>Loading doctors...</p>}
    {error && <p>Error loading doctors: {error}</p>}
    <Row>
      {formForDoctor.map((form) => (
        <Col key={form._id} md={4}>
          <Card>
            <Card.Body>
              <Card.Title>{form.patientId}</Card.Title>
              <Card.Text>Is Diabatic: {form.isDiabetic}</Card.Text>
              <Card.Text>Recent Surgeries: {form.recentSurgery}</Card.Text>
              <Card.Text>Current Illness: {form.currentIllness}</Card.Text>
              {/* Add other form details as needed */}
              <Button type="button" className="btn btn-success"onClick={() => navigateToPrescription(form)}>Consult</Button>
              
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
  );
};

export default DoctorDashboard;
