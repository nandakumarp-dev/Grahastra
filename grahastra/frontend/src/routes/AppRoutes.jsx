// src/routes/AppRoutes.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Landing from "../features/landing/Landing";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Dashboard from "../features/dashboard/Dashboard";
import Home from "../features/dashboard/Home";
import Contact from "../features/contact/Contact";
import BirthChart from "../features/birthchart/BirthChart";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="birthchart" element={<BirthChart />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
