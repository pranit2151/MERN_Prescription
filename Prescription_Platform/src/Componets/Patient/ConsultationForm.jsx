import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConsultationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDoctor = location.state?.selectedDoctor;

  const [formData, setFormData] = useState({
    currentIllness: '',
    recentSurgery: '',
    isDiabetic: '',
    allergies: '',
    others: '',
    doctorId: selectedDoctor?.user.email
  });

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = { ...formData };
      formDataToSend.patientId = localStorage.getItem('user_email');

      const response = await axios.post('http://localhost:5000/api/consultations', formDataToSend);
      console.log('Consultation submitted successfully', response.data);

      toast.success('Consultation submitted successfully!', {
        position: 'top-center'
      });

      setTimeout(() => {
        navigate('/patient-dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error submitting consultation', error);
      toast.error('Error submitting consultation', {
        position: 'top-center'
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='mx-auto col-6'>
            <h2>Doctor: {selectedDoctor?.user.name}</h2>
            <h3 className='d-flex justify-content-center'>Step 1</h3>
            <Form.Group controlId="currentIllness">
              <Form.Label>Current Illness</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.currentIllness} onChange={(e) => setFormData({ ...formData, currentIllness: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="recentSurgery">
              <Form.Label>Recent Surgery</Form.Label>
              <Form.Control type="text" value={formData.recentSurgery} onChange={(e) => setFormData({ ...formData, recentSurgery: e.target.value })} />
            </Form.Group>
          </div>
        );
      case 2:
        return (
          <div className='mx-auto col-6'>
            <h3 className='d-flex justify-content-center'>Step 2</h3>
            <Form.Group controlId="isDiabetic">
              <Form.Label>Diabetic</Form.Label>
              <Form.Check type="radio" label="Yes" value="yes" checked={formData.isDiabetic === 'yes'} onChange={(e) => setFormData({ ...formData, isDiabetic: e.target.value })} />
              <Form.Check type="radio" label="No" value="no" checked={formData.isDiabetic === 'no'} onChange={(e) => setFormData({ ...formData, isDiabetic: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="allergies">
              <Form.Label>Allergies</Form.Label>
              <Form.Control type="text" value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="others">
              <Form.Label>Others</Form.Label>
              <Form.Control type="text" value={formData.others} onChange={(e) => setFormData({ ...formData, others: e.target.value })} />
            </Form.Group>
          </div>
        );
      case 3:
        return (
          <div className='mx-auto col-6'>
            <h3 className='d-flex justify-content-center'>Submit Form</h3>
            <Button className='mx-2 btn-success' onClick={handleSubmit}>Submit</Button>
          </div>
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div>
      {renderStep()}
      <div className='mx-auto col-6 ' style={{ marginTop: '20px' }}>
        {currentStep !== 1 && <Button className='mx-2' onClick={handlePrev}>Previous</Button>}
        {currentStep !== 3 && <Button onClick={handleNext}>Next</Button>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConsultationForm;
