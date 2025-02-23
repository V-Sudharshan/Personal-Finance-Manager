import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Styling for navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Expense Manager</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; // ✅ Ensure this line is present
