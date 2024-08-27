import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        {/* <li><Link to="/signup">Signup</Link></li> */}
        <li><Link to="/signup/patient">Signup</Link></li>
        {/* <li><Link to="/signup/doctor">DSignup</Link></li> */}
        {/* Add more links for authenticated users */}
      </ul>
    </nav>
  );
};

export default Navbar;
