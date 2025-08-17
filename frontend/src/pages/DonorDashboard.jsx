import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function DonorDashboard() {
  const username = localStorage.getItem("username") || "Donor";
  const donor_id = localStorage.getItem('userId');
  console.log("Using donor_id for submission:", donor_id);


  return (
    <div className="dashboard-container container py-4">
      <h2 className="text-center mb-2 fw-bold">👋 Welcome, {username}!</h2>
      <p className="text-center text-muted mb-4">Select an option below:</p>

      <div className="row g-4 justify-content-center">
        <div className="col-md-4">
          <Link to="/donate-food" className="dashboard-card card bg-light shadow-sm text-center p-3 text-decoration-none">
            <span className="fs-1">🍲</span>
            <h5 className="mt-2">Donate Food</h5>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/donations" className="dashboard-card card bg-light shadow-sm text-center p-3 text-decoration-none">
            <span className="fs-1">📋</span>
            <h5 className="mt-2">My Food Donations</h5>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/donate-waste" className="dashboard-card card bg-light shadow-sm text-center p-3 text-decoration-none">
            <span className="fs-1">♻️</span>
            <h5 className="mt-2">Donate Waste</h5>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/my-waste-donations" className="dashboard-card card bg-light shadow-sm text-center p-3 text-decoration-none">
            <span className="fs-1">📦</span>
            <h5 className="mt-2">My Waste Donations</h5>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
