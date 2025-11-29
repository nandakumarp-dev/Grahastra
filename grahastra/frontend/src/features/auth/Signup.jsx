// Signup.jsx - Mobile Optimized
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    tob: "",
    pob: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/signup/", formData);

      if (response.data.success) {
        localStorage.setItem("access", response.data.tokens.access);
        localStorage.setItem("refresh", response.data.tokens.refresh);

        setMessage("Account created successfully! Redirecting...");
        setError("");

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(
          response.data.errors
            ? Object.values(response.data.errors).flat().join(", ")
            : response.data.message || "Signup failed"
        );
      }
    } catch (err) {
      setError(
        typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : typeof err.response?.data?.errors === "object"
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "An error occurred. Please try again."
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
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Grahastra and discover your cosmic blueprint</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time of Birth</label>
                <input
                  type="time"
                  className="form-control"
                  name="tob"
                  value={formData.tob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Place of Birth</label>
              <input
                type="text"
                className="form-control"
                name="pob"
                value={formData.pob}
                onChange={handleChange}
                placeholder="City, State, Country"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          </div>

          {error && <div className="auth-alert alert-danger">{error}</div>}
          {message && <div className="auth-alert alert-success">{message}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account? <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;