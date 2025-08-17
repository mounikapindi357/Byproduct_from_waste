import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/Layout'; // ✅ new
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonorDonationForm from './pages/DonorDonationForm';
import Logout from './pages/Logout';
import DonorDonations from './pages/DonorDonations';
import DonorWasteDonationForm from './pages/DonorWasteDonationForm';
import DonorWasteDonations from './pages/DonorWasteDonations';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Donor Routes */}
        <Route path="/donor" element={<Layout><DonorDashboard /></Layout>} />
        <Route path="/donate-food" element={<Layout><DonorDonationForm /></Layout>} />
        <Route path="/donations" element={<Layout><DonorDonations /></Layout>} />
        <Route path="/donate-waste" element={<Layout><DonorWasteDonationForm /></Layout>} />
        <Route path="/my-waste-donations" element={<Layout><DonorWasteDonations /></Layout>} />
        <Route path="/logout" element={<Layout><Logout /></Layout>} />

        {/* NGO/Admin */}
        <Route path="/ngo" element={<Layout><NGODashboard /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
      </Routes>
    </>
  );
}


  

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;
