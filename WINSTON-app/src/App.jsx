import { useState } from 'react';

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Login from './routes/Login.jsx'
import Register from './routes/Register.jsx'
import Navbar from './components/Navbar.jsx'


function App() {

  return(
    
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to WINSTON</h1>
      <p>Web-based Interface Network for Students, TAs, and Organized Networks</p>
    </div>
    
  );
  
}

export default App
