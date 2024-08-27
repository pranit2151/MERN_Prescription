import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/authSlice';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // To handle programmatic navigation
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
   const { token, user, loading, error } = useSelector((state) => state.auth); // Access data from auth slice
   useEffect(() => {
    localStorage.clear();
  }, []);

  function handleChange(e) {
    // console.log(e);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      console.log("response>>>>", response)
      let user_email=localStorage.getItem('user_email');
      // Navigate based on user role
      if (response.user.role === 'patient') {
        console.log(">>>>", user_email)
        navigate('/patient-dashboard');
      } else if (response.user.role === 'doctor') {
        navigate('/doctor-dashboard');
        console.log(">>>>", user_email)
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      // Handle login error (e.g., show a message to the user)
    }
  };
  return (
    <Container className='container col-6 my-5'>
      <h4 className='d-flex justify-content-center'> Login Form</h4>
      {loading && <p>Loading...</p>} {/* Display loading message while fetching */}
      {error && <p className='text-danger'>{error}</p>} {/* Display error message if present */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="my-3 "controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
        </Form.Group>
        {/* You can add a checkbox here if needed */}
        <div className='d-flex justify-content-center'>
          <Button variant="primary"  type="submit">
            Login
          </Button>
        </div>
      </Form>
      <Link to="/signup">Don't have an account? Sign up</Link>
    </Container>
  );
};

export default LoginForm;
