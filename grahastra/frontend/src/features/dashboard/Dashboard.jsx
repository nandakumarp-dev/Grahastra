// Dashboard.jsx - Modern Layout
import React from "react";
import "./dashboard.css";
import { Outlet } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-logo">🌌</div>
          <span className="brand-text">GRAHASTRA</span>
        </div>
        
        <div className="nav-menu">
          <a href="/dashboard" className="nav-link active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </a>
          <a href="/profile" className="nav-link">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </a>
          <a href="/settings" className="nav-link">
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </a>
        </div>

        <button className="nav-logout">
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="footer-logo">🌌</span>
            <span className="footer-title">Grahastra</span>
          </div>
          <p className="footer-tagline">
            Your cosmic journey to self-discovery
          </p>
        </div>
        
        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy</a>
          <a href="/terms" className="footer-link">Terms</a>
          <a href="/support" className="footer-link">Support</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
        
        <div className="footer-copyright">
          <p>&copy; 2024 Grahastra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

function Dashboard() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;