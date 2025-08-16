// src/pages/dashboard/Dashboard.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom";


function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="dashboard-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
