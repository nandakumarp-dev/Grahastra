import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../authenticationpage/css/Login.css";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loginAPI(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login/",
        credentials,
        {
          withCredentials: true, // include cookies (if using session login)
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        setError("");
        navigate("/"); // redirect to home/dashboard
      } else {
        setError(response.data.message || "Login failed.");
        setMessage("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setMessage("");
    }
  }

  return (
    <div className="login-page">
      <div className="auth-box">
        <h2>Login to Grahastra</h2>

        <form onSubmit={loginAPI}>
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

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {message && <div className="alert alert-success mt-3">{message}</div>}

          <button type="submit" className="btn-purple mt-3 pt-2 pb-2 w-100">
            Login
          </button>
        </form>

        <div className="auth-footer mt-4">
          <small>
            Don't have an account? <a href="/signup">Sign up here</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
