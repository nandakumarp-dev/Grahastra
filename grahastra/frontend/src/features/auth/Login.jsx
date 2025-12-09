// Login.jsx - Modern Responsive Design
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";
import { Mail, Lock, Eye, Sparkles } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
            <Eye size={isMobile ? 32 : 40} />
          </div>
          <h1 className="responsive-auth-title">Welcome Back</h1>
          <p className="responsive-auth-subtitle">
            Sign in to continue your cosmic journey
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={loginAPI} className="responsive-auth-form">
          {/* Email Input */}
          <div className="form-group-responsive">
            <label className="form-label-responsive">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input-responsive"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group-responsive">
            <div className="password-label-row">
              <label className="form-label-responsive">
                Password
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input-responsive"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="Enter your password"
                required
              />
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
              <span className="loading-text">Signing In...</span>
            ) : (
              <>
                <Eye size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Social Login Options */}
          <div className="social-login-section">
            <p className="social-login-divider">Or continue with</p>
            <div className="social-buttons">
              <button type="button" className="social-button google-button">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
              <button type="button" className="social-button github-button">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="responsive-auth-footer">
          <p className="footer-text">
            Don't have an account?{" "}
            <Link to="/signup" className="footer-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;