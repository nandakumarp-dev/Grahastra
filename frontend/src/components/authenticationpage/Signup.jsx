import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../authenticationpage/css/Signup.css";

function Signup() {
  return (
    <div className="signup-body">
      <div className="auth-box">
        <h2>Create Your Grahastra Account</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input type="text" className="form-control" id="fullName" name="fullName" required />
          </div>

          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input type="date" className="form-control" id="dob" name="dob" required />
          </div>

          <div className="mb-3">
            <label htmlFor="tob" className="form-label">Time of Birth</label>
            <input type="time" className="form-control" id="tob" name="tob" required />
          </div>

          <div className="mb-3">
            <label htmlFor="pob" className="form-label">Place of Birth</label>
            <input
              type="text"
              className="form-control"
              id="pob"
              name="pob"
              placeholder="e.g. Thiruvananthapuram, Kerala"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select id="gender" name="gender" className="form-control" required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" required />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" required />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" required />
          </div>

          <button type="submit" className="btn btn-purple w-100 mt-2 pt-2 pb-2">Sign Up</button>
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
