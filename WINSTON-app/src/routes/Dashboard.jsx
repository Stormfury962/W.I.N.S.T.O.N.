import Navbar from '../components/Navbar.jsx'

import React, { useEffect, useState } from "react";
import styles from '../styles/Login.module.css';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";



const Dashboard = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
}, []);

const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

  return (
    <div>
        <Navbar />
        <h1>Dashboard</h1>
        {user ? (
        <p> Logged in as: {user.email}</p>
      ) : (
        <p> Not logged in</p>
      )}
      <button onClick={handleLogout} className={styles.loginButton}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;