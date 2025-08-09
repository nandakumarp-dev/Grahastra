import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../landingpage/css/Login.css"; // custom styles


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary validation (replace with API call)
    if (!email || !password) {
      setError("Please fill in all fields.");
      setMessage("");
    } else {
      setError("");
      setMessage("Login successful!"); // Replace with actual login logic
    }
  };

  return (
    <div className="login-page">
      <div className="auth-box">
        <h2>Login to Grahastra</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {message && <div className="alert alert-success mt-3">{message}</div>}

          <button type="submit" className="btn-purple mt-3 pt-2 pb-2">
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
