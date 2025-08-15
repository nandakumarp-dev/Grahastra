import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../authenticationpage/css/Signup.css";

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

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/signup/",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage(response.data.message || "Signup successful ✅");
        setError("");
        // Redirect to dashboard or login after short delay
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        // Handle serializer validation errors
        setError(
  response.data.errors
    ? Object.values(response.data.errors).flat().join(", ")   // convert object → string
    : response.data.message || "Signup failed ❌"
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
    <div className="signup-body">
      <div className="auth-box">
        <h2>Create Your Grahastra Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          {/* Time of Birth */}
          <div className="mb-3">
            <label htmlFor="tob" className="form-label">
              Time of Birth
            </label>
            <input
              type="time"
              className="form-control"
              id="tob"
              name="tob"
              value={formData.tob}
              onChange={handleChange}
              required
            />
          </div>

          {/* Place of Birth */}
          <div className="mb-3">
            <label htmlFor="pob" className="form-label">
              Place of Birth
            </label>
            <input
              type="text"
              className="form-control"
              id="pob"
              name="pob"
              value={formData.pob}
              onChange={handleChange}
              placeholder="e.g. Thiruvananthapuram, Kerala"
              required
            />
          </div>

          {/* Gender */}
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="form-control"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Alerts */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {message && <div className="alert alert-success mt-3">{message}</div>}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-purple w-100 mt-2 pt-2 pb-2"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer mt-4">
          <small>
            Already have an account? <a href="/login">Login here</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Signup;
