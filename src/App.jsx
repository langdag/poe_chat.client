import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import SocialConnect from './components/SocialConnect';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/connect" element={<SocialConnect />} />
      </Routes>
    </Router>
  );
}

export default App;
