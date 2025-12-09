// Signup.jsx - Modern Responsive Design
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";
import { User, Calendar, Clock, MapPin, Users, Mail, Lock, Eye, Sparkles } from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      createBackgroundEffects();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    createBackgroundEffects();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const createBackgroundEffects = () => {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    const particleCount = isMobile ? 20 : window.innerWidth < 1024 ? 40 : 60;
    container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.width = `${Math.random() * 4 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
      
      container.appendChild(particle);
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
    <div className="responsive-auth-container">
      {/* Background Particles */}
      <div className="particles-container"></div>
      
      {/* Responsive Background Elements */}
      <div className="responsive-bg-shapes">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      {/* Back Navigation */}
      <div className="responsive-nav-back">
        <Link to="/" className="responsive-back-link">
          <div className="responsive-back-button">
            ← Back to Home
          </div>
        </Link>
      </div>

      {/* Main Auth Card */}
      <div className="responsive-auth-card">
        {/* Header Section */}
        <div className="responsive-auth-header">
          <div className="responsive-auth-icon">
            <Sparkles size={isMobile ? 32 : 40} />
          </div>
          <h1 className="responsive-auth-title">Create Your Account</h1>
          <p className="responsive-auth-subtitle">
            Join our cosmic community and unlock personalized insights
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="responsive-auth-form">
          <div className="form-section">
            <h3 className="form-section-title">
              <User size={18} />
              Personal Information
            </h3>
            
            <div className="form-grid-responsive">
              {/* Full Name */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Full Name
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input-responsive"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Date of Birth
                </label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input
                    type="date"
                    className="form-input-responsive"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Time of Birth */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Time of Birth
                </label>
                <div className="input-with-icon">
                  <Clock size={18} className="input-icon" />
                  <input
                    type="time"
                    className="form-input-responsive"
                    name="tob"
                    value={formData.tob}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Place of Birth */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Place of Birth
                </label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input-responsive"
                    name="pob"
                    value={formData.pob}
                    onChange={handleChange}
                    placeholder="City, State, Country"
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Gender
                </label>
                <div className="input-with-icon">
                  <Users size={18} className="input-icon" />
                  <select
                    name="gender"
                    className="form-input-responsive"
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
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              <Mail size={18} />
              Account Information
            </h3>
            
            <div className="form-grid-responsive">
              {/* Email */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Email Address
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-input-responsive"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Password
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-input-responsive"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group-responsive">
                <label className="form-label-responsive">
                  Confirm Password
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-input-responsive"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="responsive-alert alert-error">
              <Eye size={16} />
              {error}
            </div>
          )}
          {message && (
            <div className="responsive-alert alert-success">
              <Sparkles size={16} />
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="responsive-submit-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-text">Creating Account...</span>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="responsive-auth-footer">
          <p className="footer-text">
            Already have an account?{" "}
            <Link to="/login" className="footer-link">
              Login here
            </Link>
          </p>
          <p className="footer-terms">
            By creating an account, you agree to our{" "}
            <a href="#" className="footer-link">Terms</a> and{" "}
            <a href="#" className="footer-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;