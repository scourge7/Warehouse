import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaBox,
  FaChartBar,
  FaSignOutAlt,
  FaHome,
  FaBars,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ onLogout, role }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileButton, setShowMobileButton] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
      setShowMobileButton(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isMobile && showMobileButton && (
        <button className="mobile-toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}

      <div
        className={`sidebar modern-theme ${isOpen ? "open" : "closed"}`}
        style={{
          backgroundColor: "#1976d2",
          color: "#fff",
          borderRight: "none",
          boxShadow: "none",
          transition: "width 0.3s",
        }}
      >
        {isMobile && isOpen && (
          <button className="toggle-btn mb-6" onClick={toggleSidebar}>
            <FaArrowLeft />
          </button>
        )}

        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3>W-House</h3>
          </div>

          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                <FaHome className="nav-icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/inventory"
                className={`nav-link ${isActive("/inventory") ? "active" : ""}`}
              >
                <FaBox className="nav-icon" />
                <span>Inventory</span>
              </Link>
            </li>
            {role === "admin" && (
              <li className="nav-item">
                <Link
                  to="/transactions"
                  className={`nav-link ${isActive("/transactions") ? "active" : ""}`}
                >
                  <FaChartBar className="nav-icon" />
                  <span>Transactions</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="sidebar-footer">
            <button onClick={onLogout} className="logout-btn">
              <FaSignOutAlt className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
