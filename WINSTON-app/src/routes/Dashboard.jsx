import Navbar from '../components/Navbar.jsx'
import React, { useEffect, useState } from "react";
import styles from '../styles/login.module.css';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { api } from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const roleData = await api.getUserRole(currentUser.email);
                    setUserRole(roleData.role);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
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
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Dashboard</h1>

            {user ? (
                <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <p>Logged in as: {user.email}</p>
                    {userRole && <p>Role: {userRole}</p>}
                    <button onClick={handleLogout} className={styles.loginButton}>
                        Logout
                    </button>
                </div>
            ) : (
                <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <p>Not logged in</p>
                    <button onClick={() => navigate("/login")} className={styles.loginButton}>
                        Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
