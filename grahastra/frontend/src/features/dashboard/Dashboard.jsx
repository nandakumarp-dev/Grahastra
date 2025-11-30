// Dashboard.jsx - Fully Responsive
import React, { useState } from "react";
import "./dashboard.css";
import { Outlet } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-logo"></div>
          <span className="brand-text">GRAHASTRA</span>
        </div>
        
        {/* Mobile Menu Toggle - Hidden on desktop */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Desktop Navigation */}
        <div className="nav-menu">
          <a href="/dashboard" className="nav-link active">
            <span className="nav-icon dashboard-icon"></span>
            <span className="nav-text">Dashboard</span>
          </a>
          <a href="/profile" className="nav-link">
            <span className="nav-icon profile-icon"></span>
            <span className="nav-text">Profile</span>
          </a>
          <a href="/settings" className="nav-link">
            <span className="nav-icon settings-icon"></span>
            <span className="nav-text">Settings</span>
          </a>
        </div>

        {/* Desktop User Menu */}
        <div className="user-menu">
          <div className="user-avatar">
            <div className="avatar-initial">U</div>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <span className="footer-logo"></span>
              <span className="footer-title">Grahastra</span>
            </div>
            <p className="footer-tagline">
              Your cosmic journey to self-discovery
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Features</h4>
            <div className="footer-links">
              <a href="/birth-chart" className="footer-link">Birth Chart</a>
              <a href="/horoscope" className="footer-link">Daily Horoscope</a>
              <a href="/compatibility" className="footer-link">Compatibility</a>
              <a href="/numerology" className="footer-link">Numerology</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <div className="footer-links">
              <a href="/help" className="footer-link">Help Center</a>
              <a href="/contact" className="footer-link">Contact Us</a>
              <a href="/privacy" className="footer-link">Privacy Policy</a>
              <a href="/terms" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 Grahastra. All rights reserved.</p>
          </div>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="social-icon twitter"></span>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <span className="social-icon facebook"></span>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <span className="social-icon instagram"></span>
            </a>
          </div>
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