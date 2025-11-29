// Login.jsx - Mobile Optimized
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createStars();
    window.addEventListener('resize', createStars);
    return () => window.removeEventListener('resize', createStars);
  }, []);

  const createStars = () => {
    const starsContainer = document.querySelector('.auth-stars-container');
    if (!starsContainer) return;
    
    const starCount = window.innerWidth < 768 ? 60 : 120;
    starsContainer.innerHTML = '';

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random();
      let starClass = 'auth-star--small';
      if (size > 0.7) starClass = 'auth-star--large';
      else if (size > 0.4) starClass = 'auth-star--medium';
      
      star.className = `auth-star ${starClass}`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      starsContainer.appendChild(star);
    }
  };

  const loginAPI = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email: credentials.email,
        password: credentials.password,
      });

      localStorage.setItem("access", response.data.tokens.access);
      localStorage.setItem("refresh", response.data.tokens.refresh);

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-cosmic-overlay"></div>
      <div className="auth-stars-container"></div>

      <Link to="/" className="auth-back-home">
        <div className="back-home-button">
          ← Back to Home
        </div>
      </Link>

      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue your cosmic journey</p>

        <form onSubmit={loginAPI} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="auth-alert alert-danger">{error}</div>}
          {message && <div className="auth-alert alert-success">{message}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account? <Link to="/signup" className="auth-link">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;