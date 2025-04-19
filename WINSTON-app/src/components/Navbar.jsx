import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>    
        <Link to='/'>Home</Link>
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='/contact'>Contact</Link>
        <Link to='/Profile'>Profile</Link>
        <Link to='/Login'>Login</Link>
        <Link to='/Register'>Register</Link>



    </div>
  );
};

export default Navbar;