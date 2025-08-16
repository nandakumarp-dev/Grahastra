// src/pages/dashboard/Navbar.jsx
import React from "react";
import defaultProfile from "../../assets/images/img01.png";


function Navbar() {
  const user = {
    profilePhoto: null,
    name: "John Doe"
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{ backgroundColor: "#0a0014" }}>
      <a href="/dashboard" className="navbar-brand brand-text">Grahastra</a>
      <div className="ms-auto d-flex align-items-center">
        <div className="dropdown">
          <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            <img
              src={user.profilePhoto || defaultProfile}
              width="32"
              height="32"
              className="rounded-circle"
              alt="Profile"
            />
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><a className="dropdown-item" href="#">My Account</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="/">Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
