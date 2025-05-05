import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from '../styles/login.module.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase.js';
import { api } from '../services/api';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Attempting Registration...");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered in Firebase:", userCred.user.email);


      try {
        await api.registerUser({
          username,
          email: userCred.user.email,
          password: password, 
          role
        });

        console.log("User registered in database");
        navigate("/dashboard"); 
      } catch (dbError) {
        console.error("Database registration failed:", dbError.message);
        alert("Registration in database failed: " + dbError.message);
      }
    } catch (authErr) {
      console.error("Firebase registration failed:", authErr.message);
      alert("Registration failed: " + authErr.message);
    }
  };

  return (
      <div className={styles.page}>
      <div className={styles.loginContainer}>
          <h2 className={styles.formTitle}>Register</h2>

          <form onSubmit={handleRegister} className={styles.loginForm}>
              <div className={styles.inputWrapper}>
                  <input
                      type="email"
                      placeholder="Email address"
                      className={styles.inputField}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}/>
                  <i className="material-symbols-outlined">mail</i>
              </div>
  
              <div className={styles.inputWrapper}>
                  <input
                      type="password"
                      placeholder="Password"
                      className={styles.inputField}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}/>
                  <i className="material-symbols-outlined">lock</i>
              </div>

              <div className={styles.inputWrapper}>
                  <input
                      type="text"
                      placeholder="Username"
                      className={styles.inputField}
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}/>
                  <i className="material-symbols-outlined">person</i>
              </div>

              <div className={styles.inputWrapper}>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${styles.inputField} ${styles.registerInputField}`}
                  required>
                  <option value="student">Student</option>
                  <option value="ta">Professor/TA</option>
                </select>
                <i className="material-symbols-outlined">school</i>
              </div>

          <button className={styles.loginButton}>Register</button>
          </form>

          <p className={styles.signupText}>Already have an account? <Link to="/Login">Login Here</Link></p>
      </div>
      </div>
    );
  };

export default Register;
