import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Menu items configuration
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
      path: "/dashboard",
    },
    {
      id: "create",
      label: "Create Resume",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
      path: "/create-resume",
    },
    {
      id: "resumes",
      label: "My Resumes",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
      ),
      path: "/my-resumes",
    },
    {
      id: "tips",
      label: "ATS Tips",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      path: "/ats-tips",
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      path: "/profile",
    },
  ];

  // Handle menu item click
  const handleMenuClick = (path) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    // TODO: Add logout API call later
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Millka CV" className="sidebar-logo-img" />
          {!isCollapsed && <span className="logo-text">Millka CV</span>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => handleMenuClick(item.path)}
            title={isCollapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : ""}
        >
          <span className="logout-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          {!isCollapsed && <span className="logout-label">Logout</span>}
        </button>
      </div>
    </div>
  );
}
