// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Global Bootstrap
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Landing from './features/landing/Landing';
import Dashboard from './features/dashboard/Dashboard';





function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;