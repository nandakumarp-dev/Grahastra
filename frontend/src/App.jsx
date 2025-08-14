// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Global Bootstrap
import Landing from './components/landingpage/Landing'; // Our landing page component
import './App.css'; // Any global overrides
import Login from './components/authenticationpage/Login';
import Signup from './components/authenticationpage/Signup';
import Dashboard from './components/dashboard/Dashboard';





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