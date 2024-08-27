import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PrescriptionForm = () => {
  const { patientId } = useParams(); // Extract the patientId from the URL
//   const history = useHistory(); // To redirect after submission
// console.log("patientId>>",patientId)

  // State for form fields
  const [careToBeTaken, setCareToBeTaken] = useState('');
  const [medicines, setMedicines] = useState('');
  const doctorId = localStorage.getItem("user_email");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the payload
    const prescriptionData = {
      doctorId,
      patientId,
      careToBeTaken,
      medicines
    };

    try {
        console.log("prescriptionData>>>>",prescriptionData)
      // Make an API call to submit the form data
      const response =await axios.post('http://localhost:5000/api/prescription', prescriptionData);
      console.log('Prescription submitted successfully!');
      console.log("response>>",response)
      // Redirect or update UI on success
   
      // history.push('/some-path'); // Redirect to another page if needed
    } catch (error) {
      console.error('Error submitting the prescription:', error);
      alert('Failed to submit prescription.');
    }
  };

  return (
    <div className="container mt-4">
    <h2>Prescription Form</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="careToBeTaken" className="form-label">Care to be Taken:</label>
        <textarea
          id="careToBeTaken"
          className="form-control"
          value={careToBeTaken}
          onChange={(e) => setCareToBeTaken(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="medicines" className="form-label">Medicines:</label>
        <textarea
          id="medicines"
          className="form-control"
          value={medicines}
          onChange={(e) => setMedicines(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit Prescription</button>
    </form>
  </div>
  
  );
};

export default PrescriptionForm;
