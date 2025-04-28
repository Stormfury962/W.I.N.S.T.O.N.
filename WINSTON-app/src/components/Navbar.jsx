import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/navbar.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";


const Navbar = () => {
    const navRef = useRef();     
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const showNavbar = () =>{
        navRef.current.classList.toggle("responsive_nav");
    };

    const handleLogout = async () => {
      try {
        await signOut(auth);
        console.log("User logged out successfully");
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error.message);
      }
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
      });
    

    return () => unsubscribe();
    }, []);

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
            {isLoggedIn ? (
          <button onClick={() => { handleLogout(); showNavbar(); }} className="nav-link-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" onClick={showNavbar}>Login</Link>
            <Link to="/register" onClick={showNavbar}>Register</Link>
          </>
        )}
            
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
