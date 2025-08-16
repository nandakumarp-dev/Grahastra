// src/pages/dashboard/Dashboard.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";

import Navbar from "./Navbar";
import Home from "./Home";
import Footer from "./Footer";

function Dashboard() {
  return (
    <div className="dashboard-body">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default Dashboard;
