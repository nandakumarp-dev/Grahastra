import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import defaultProfile from "../assets/default-profile.png"; // Adjust path as needed

export default function Dashboard() {
  // Example user profile data (replace with props or context)
  const user = {
    profilePhoto: null,
    name: "John Doe"
  };

  return (
    <div className="dashboard-body">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{ backgroundColor: "#0a0014" }}>
        <a href="/dashboard" className="navbar-brand brand-text">Grahastra</a>
        <div className="ms-auto d-flex align-items-center">
          <div className="dropdown">
            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <img
                src={user.profilePhoto || defaultProfile}
                width="32"
                height="32"
                className="rounded-circle"
                alt="Profile"
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">My Account</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="/">Logout</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container py-5">
        <h2 className="dashboard-title">Your Celestial Command Center ✨</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {[
            { title: "🌟 AI Astrologer", desc: "Ask real-time questions and receive intuitive, AI-powered astrological guidance 24/7.", link: "/ask-astrology", btn: "Ask Now" },
            { title: "🪐 Birth Chart", desc: "Explore the cosmic blueprint of your soul. View planetary placements, ascendant, and house lords.", link: "/mychart", btn: "View Chart" },
            { title: "🔮 Yogas", desc: "Discover rare and powerful yogas influencing your personality, success, and destiny path.", link: "/yogas", btn: "Analyze Yogas" },
            { title: "📆 Dasha Timeline", desc: "View major & minor planetary periods (Mahadasha, Antardasha) with interpretations and timelines.", link: "#", btn: "Check Dasha" },
            { title: "🧘‍♂️ My Profile", desc: "Update your details, manage preferences, and personalize your spiritual dashboard experience.", link: "/profile", btn: "Edit Profile" },
            { title: "📬 Contact Support", desc: "Need help? Get in touch with our support team or astrological experts for fast resolution.", link: "/contact", btn: "Get Help" },
            { title: "💎 Upgrade", desc: "Unlock full astrological power, exclusive features, and lifetime access options.", link: "/upgrade", btn: "Upgrade Now" }
          ].map((widget, i) => (
            <div className="col d-flex" key={i}>
              <div className="widget w-100">
                <h5 className="widget-title">{widget.title}</h5>
                <p>{widget.desc}</p>
                <a href={widget.link} className="btn btn-glow mt-auto">{widget.btn}</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <h5 className="brand-text">Grahastra</h5>
          <p className="mt-2">Vedic Wisdom Meets AI Brilliance</p>
          <div className="d-flex justify-content-center mt-3">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <p className="mt-3 small">&copy; 2025 Grahastra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
