import React from "react";
import Navbar from '../components/Navbar.jsx'

const Contact = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Contact</h1>

        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <p>If you have any questions or need support, please reach out to us!</p>
            <p>Email: <a href="mailto:support@winston.edu">support@winston.edu</a></p>
            <p>Phone: (555) 123-4567</p>
            <p>Hours: Monday-Friday, 9:00 AM - 5:00 PM</p>
            <p>Disclaimer: Not real information</p>
        </div>
    </div>
  );
};

export default Contact;
