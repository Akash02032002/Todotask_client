// client/components/Header.jsx

import axios from "axios";
import React, { useContext, useState } from "react"; // Import useState
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Context, server } from "../main";
import './Header.css';

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } =
    useContext(Context);

  // New state to manage the mobile menu visibility
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logoutHandler = async () => {
    setLoading(true);
    try {
      await axios.get(`${server}/users/logout`, {
        withCredentials: true,
      });

      toast.success("Logged Out Successfully");
      setIsAuthenticated(false);
      setLoading(false);
      // Close mobile menu on logout
      setShowMobileMenu(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(true);
      setLoading(false);
    }
  };

  // Function to toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  // Function to close mobile menu after a link click
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <nav className="header">
      <div>
        <h2>Todo App.</h2>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
        {/* You can use a hamburger icon here, or just text for simplicity */}
        {showMobileMenu ? '✕' : '☰'} {/* 'X' when open, 'Hamburger' when closed */}
      </button>

      {/* Navigation links and button - apply class conditionally */}
      <article className={`nav-links ${showMobileMenu ? 'active' : ''}`}>
        <Link to={"/"} onClick={closeMobileMenu}>Home</Link>
        <Link to={"/profile"} onClick={closeMobileMenu}>Profile</Link>
        {isAuthenticated ? (
          <button disabled={loading} onClick={() => { logoutHandler(); closeMobileMenu(); }} className="btn">
            Logout
          </button>
        ) : (
          <Link to={"/login"} onClick={closeMobileMenu}>Login</Link>
        )}
      </article>
    </nav>
  );
};

export default Header;