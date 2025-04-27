import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import googleIcon from '../Assets/googleIcon.svg';
import appleIcon from '../Assets/apple-icon.svg';
import styles from '../styles/Login.module.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase.js';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      console.log("Attempting login...");
  
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const userEmail = userCred.user.email;
        console.log("Logged in as:", userEmail);
  
        navigate("/dashboard");
  
      } catch (err) {
        console.error("Login Failed:", err.message);
        alert("Login failed: " + err.message);
      }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          console.log("Google sign-in successful:", result.user);
          navigate("/dashboard");
        } catch (error) {
          console.error("Google sign-in error:", error.message);
          alert("Google Sign-In failed: " + error.message);
        }
      };
      
  return (
    <div className={styles.page}>
    <div className={styles.loginContainer}>
        <h2 className={styles.formTitle}>Log in with</h2>
        <div onClick={handleGoogleSignIn} className={styles.socialLogin}>
            <button className={styles.socialButton}>
            <img src={googleIcon} alt="Google" className={styles.socialIcon}/>
                Google
            </button>
            <button className={styles.socialButton}>
                <img src={appleIcon} alt="Apple" className={styles.socialIcon} />
                Apple
            </button>
        </div>
        <p className={styles.separator}><span>or</span></p>

        <form onSubmit={handleLogin} className={styles.loginForm}>        <div className={styles.inputWrapper}>
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

        <a href="#" className={styles.forgotPassLink}>Forgot Password</a>

        <button className={styles.loginButton}>Log In</button>
        </form>

        <p className={styles.signupText}>Don't have an account? <Link to="/register">Register Here</Link></p>
    </div>
    </div>
  );
};

export default Login;


 

