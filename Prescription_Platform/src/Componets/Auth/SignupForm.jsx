import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signupUser } from '../../redux/authSlice'; // Assuming a signup action
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '', // Optional
    phoneNumber: '', // Optional
    yearsOfExperience: '', // Optional
    age: '', // Optional
    historyOfSurgery: '', // Optional
    historyOfIllness: '', // Optional
    profilePicture: null, // Added for profile picture
  });
  const [previewImage, setPreviewImage] = useState(null); // State to store image preview

  let title = window.location.pathname.split('/')[2];

  const handleChange = (e) => {
    if (e.target.files) {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userType = window.location.pathname.split('/')[2]; // Assuming URL format: /signup/doctor or /signup/patient

    // Validate required fields based on user type
    const requiredFields = userType === 'doctor'
      ? ['name', 'email', 'password', 'specialty', 'phoneNumber', 'yearsOfExperience']
      : ['name', 'email', 'password', 'age', 'phoneNumber', 'historyOfSurgery', 'historyOfIllness'];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      // Handle missing field errors
      return;
    }

    try {
      // Create form data for image upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      // ... other fields ...
      formDataToSend.append('profilePicture', formData.profilePicture); // Include profile picture

      const response = await dispatch(signupUser({ ...formData, userType })); // Pass userType and formData
      console.log(response);
      // navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      console.error(error);
      // Handle signup errors
    }
  };

  return (
    <Container className='container col-6 my-5'>
      <h4 className='d-flex justify-content-center'> {title} Sign Up Form</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name="name" value={formData.name} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="my-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="my-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
        </Form.Group>

        {/* Profile Picture Upload */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control type="file" onChange={handleChange} />
          {previewImage && <Image src={previewImage} alt="Preview" width="100" height="100" />}
        </Form.Group>

       
        {/* Conditional rendering of doctor specific fields */}
        {window.location.pathname.split('/')[2] === 'doctor' && (
          <>
            <Form.Group className="my-3" controlId="formBasicSpecialty">
              <Form.Label>Specialty</Form.Label>
              <Form.Control type="text" placeholder="Enter specialty" name="specialty" value={formData.specialty} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="my-3" controlId="formBasicPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" placeholder="Enter phone number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="my-3" controlId="formBasicYearsOfExperience">
              <Form.Label>Years of Experience</Form.Label>
              <Form.Control type="number" placeholder="Enter years of experience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} />
            </Form.Group>
          </>
        )}

        {/* Conditional rendering of patient specific fields */}
        {window.location.pathname.split('/')[2] === 'patient' && (
          <>
            <Form.Group className="my-3" controlId="formBasicAge">
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" placeholder="Enter age" name="age" value={formData.age} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="my-3" controlId="formBasicPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" placeholder="Enter phone number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="my-3" controlId="formBasicHistoryOfSurgery">
              <Form.Label>History of Surgery</Form.Label>
              <Form.Control type="text" placeholder="Enter history of surgery" name="historyOfSurgery" value={formData.historyOfSurgery} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="my-3" controlId="formBasicHistoryOfIllness">
              <Form.Label>History of Illness</Form.Label>
              <Form.Control type="text" placeholder="Enter history of illness" name="historyOfIllness" value={formData.historyOfIllness} onChange={handleChange} />
            </Form.Group>
          </>
        )}

        <div className='d-flex justify-content-center'>  <Button variant="primary" type="submit">
          Sign Up
        </Button></div>
      </Form>
      <Link to="/login">Already Sign up? Log in</Link>
      {window.location.pathname.split('/')[2] === 'doctor' && (<Link to="/signup/patient">Patient Sign Up</Link>)}
      {window.location.pathname.split('/')[2] === 'patient' && (<Link to="/signup/doctor">Doctor SignUp</Link>)}
    </Container>
  );
};

export default SignupForm;
