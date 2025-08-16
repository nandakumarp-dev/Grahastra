// src/pages/dashboard/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import defaultProfile from "../../assets/images/img01.png";

function Navbar() {
  const user = {
    profilePhoto: null,
    name: "John Doe",
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-3"
      style={{ backgroundColor: "#0a0014" }}
    >
      {/* Brand link */}
      <Link to="/dashboard" className="navbar-brand brand-text">
        Grahastra
      </Link>

      <div className="ms-auto d-flex align-items-center">
        <div className="dropdown">
          {/* Profile dropdown toggle */}
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
          >
            <img
              src={user.profilePhoto || defaultProfile}
              width="32"
              height="32"
              className="rounded-circle"
              alt="Profile"
            />
          </a>

          {/* Dropdown menu */}
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link className="dropdown-item" to="/dashboard/account">
                My Account
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/dashboard/settings">
                Settings
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="/">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
