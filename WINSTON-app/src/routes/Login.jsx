import React from "react";
import Navbar from '../components/Navbar.jsx'

import googleIcon from '../Assets/googleIcon.svg';
import appleIcon from '../Assets/apple-icon.svg';
import mailIcon from '../Assets/mailIcon.svg'; 

import styles from '../styles/Login.module.css';


const Login = () => {
  return (
    <div className={styles.page}>
    <div className={styles.loginContainer}>
        <h2 className={styles.formTitle}>Log in with</h2>
        <div className={styles.socialLogin}>
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

        <form action="#" className={styles.loginForm}>
        <div className={styles.inputWrapper}>
                <input type="email" placeholder="Email address" 
                className={styles.inputField} required />
            <   i className="material-symbols-outlined">mail</i>
            </div>

            <div className={styles.inputWrapper}>
                <input type="password" placeholder="Password" 
                className={styles.inputField} required />
                <i className="material-symbols-outlined">lock</i>
            </div>

        <a href="#" className={styles.forgotPassLink}>Forgot Password</a>

        <button className={styles.loginButton}>Log In</button>
        </form>

        <p className={styles.singupText}>Don't have an account? <a href="#">Register Here</a></p>
    </div>
    </div>
  );
};

export default Login;


 

