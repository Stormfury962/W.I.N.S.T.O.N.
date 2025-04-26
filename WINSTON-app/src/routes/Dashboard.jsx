import Navbar from '../components/Navbar.jsx'

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";


const Dashboard = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
}, []);
  return (
    <div>
        <Navbar />
        <h1>Dashboard</h1>
        {user ? (
        <p> Logged in as: {user.email}</p>
      ) : (
        <p> Not logged in</p>
      )}
    </div>
  );
};

export default Dashboard;