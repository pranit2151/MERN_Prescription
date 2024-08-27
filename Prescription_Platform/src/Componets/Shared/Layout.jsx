import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
