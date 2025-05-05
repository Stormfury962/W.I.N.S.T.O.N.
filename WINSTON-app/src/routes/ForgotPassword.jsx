import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from "../styles/login.module.css"; // optional

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage("Password reset email sent! Check your inbox.");
      setError(null);

    } catch (err) {

      setMessage(null);
      setError(err.message);
    }
  };


  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "6rem", 
    }}>
      <div style={{ width:"400px", padding: "2rem", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Reset Your Password</h2>
        

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{padding: "0.75rem", border: "1px solid ", borderColor: "#bfb3f2", fontSize: "1rem"}}
          />

          <button
            type="submit"
            style={{padding: "0.75rem", backgroundColor: "#5F41E4", color: "white", border: "1px solid ", cursor: "pointer", fontSize: "1rem"
            }}
          >
            Send Reset Link
        </button>
        </form>

        {message && <p style={{ color: "green", marginTop: "1rem", textAlign: "center" }}>{message}</p>}
    </div>
    </div>
  );
}
