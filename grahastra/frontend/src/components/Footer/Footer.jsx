// src/pages/dashboard/Footer.jsx
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="container">
        <h5 className="brand-text">Grahastra</h5>
        <p className="mt-2">Vedic Wisdom Meets AI Brilliance</p>
        <div className="d-flex justify-content-center mt-3">
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
        <p className="mt-3 small">&copy; {new Date().getFullYear()} Grahastra. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
