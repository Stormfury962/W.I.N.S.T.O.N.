import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase.js';
import Navbar from '../components/Navbar.jsx';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        //getting  user data
        const response = await fetch(`http://localhost:3000/debug/users`);
        const data = await response.json();
        
        const userInDb = data.users.find(u => u.email === currentUser.email);
        
        if (userInDb) {
          setUsername(userInDb.username);
        } else {
          setError("User not found in database");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Profile</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Profile</h1>

      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>User Profile Information</h2>
        {user ? (
          <div>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
