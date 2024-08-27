import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signupUser } from '../../redux/authSlice'; // Assuming a signup action
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Add other fields as needed
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    console.log("submitted")
    e.preventDefault();
    // Replace this with actual API call to signup
    dispatch(signupUser(formData));
  };

  return (
    <Container className='container col-6 my-5'>
        <h4 className='d-flex justify-content-center'> Sign Up</h4>
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

        {/* Add more fields as needed */}
      <div className='d-flex justify-content-center'>  <Button variant="primary" type="submit">
        Sign Up
        </Button></div>
      
      </Form>
      <Link to="/signup">Already Sign up?Log in</Link>
    </Container>
  );
};

export default SignupForm;
