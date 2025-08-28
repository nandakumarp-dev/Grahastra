import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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

  const loginAPI = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

  try {
    const response = await axios.post("https://grahastra.onrender.com/login/", {
      email: credentials.email,
      password: credentials.password,
    });

    // ✅ Store JWT tokens correctly
    localStorage.setItem("access", response.data.tokens.access);
    localStorage.setItem("refresh", response.data.tokens.refresh);

    setMessage("Login successful | Redirecting...");
    setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err) {
    setError(
      err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid email or password ❌"
    );

    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login redirect
  const googleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google/";
  };

  return (
    <div className="login-page">
      <div className="auth-box">
        <h2>Login to Grahastra</h2>

        <form onSubmit={loginAPI}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              name="email"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              name="password"
            />
          </div>

          {/* Alerts */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {message && <div className="alert alert-success mt-3">{message}</div>}

          {/* Submit */}
          <button
            type="submit"
            className="btn-purple mt-3 pt-2 pb-2 w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider mt-3 mb-3 text-center">
          <span>OR</span>
        </div>

        {/* Google Login */}
        <button onClick={googleLogin} className="google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          <span>Continue with Google</span>
        </button>

        <div className="auth-footer mt-4">
          <small>
            Don’t have an account? <a href="/signup">Sign up here</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
