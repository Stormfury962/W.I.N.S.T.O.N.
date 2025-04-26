import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRef } from "react";
import "../Styles/Navbar.css";


const Navbar = () => {
    const navRef = useRef(); 

    const showNavbar = () =>{
        navRef.current.classList.toggle("responsive_nav");
    }
  return (
/*  <h3>Logo</h3>   - if making a logo for WINSTON*/
    <header>
        <h1 style={{ letterSpacing: '1.5px', fontWeight: 'bold' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                WINSTON
            </Link>
        </h1>
        <nav ref={navRef}>
            <Link to="/" onClick={showNavbar}>Home</Link>
            <Link to="/dashboard" onClick={showNavbar}>Dashboard</Link>
            <Link to="/contact" onClick={showNavbar}>Contact</Link>
            <Link to="/profile" onClick={showNavbar}>Profile</Link>
            <Link to="/login" onClick={showNavbar}>Login</Link>
            <Link to="/register" onClick={showNavbar}>Register</Link>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
        <button className="nav-btn" onClick={showNavbar}>
            <FaBars />
        </button>
    </header>
    
  );
};

export default Navbar;