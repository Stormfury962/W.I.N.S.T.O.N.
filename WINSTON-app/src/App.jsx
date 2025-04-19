import { useState } from 'react';

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Login from './routes/Login.jsx'
import Register from './routes/Register.jsx'
import Navbar from './components/Navbar.jsx'


function App() {

  return(
    <>
      <Navbar/>
      <Header/>
      <Footer/>
    </>
    
  );
  
}

export default App
