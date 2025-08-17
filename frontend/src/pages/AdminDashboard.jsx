import React, { useEffect, useState } from 'react';
import axios from 'axios';


function AdminDashboard() {
  const [stats, setStats] = useState({
    total_donors: 0,
    total_ngos: 0,
    total_food_donations: 0,
    total_waste_donations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const downloadCSV = (type) => {
    const url = `http://127.0.0.1:5000/api/admin/export_${type}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mt-4">
    
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="row text-center">
        <div className="col-md-3">
          <div className="card bg-light shadow p-3 mb-3 rounded">
            <h5>👥 Donors</h5>
            <p className="fw-bold fs-4">{stats.total_donors}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light shadow p-3 mb-3 rounded">
            <h5>🏥 NGOs</h5>
            <p className="fw-bold fs-4">{stats.total_ngos}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light shadow p-3 mb-3 rounded">
            <h5>🍱 Food Donations</h5>
            <p className="fw-bold fs-4">{stats.total_food_donations}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light shadow p-3 mb-3 rounded">
            <h5>♻️ Waste Donations</h5>
            <p className="fw-bold fs-4">{stats.total_waste_donations}</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <h5>📥 Export CSV Reports</h5>
        <button className="btn btn-primary me-2" onClick={() => downloadCSV('food')}>Download Food CSV</button>
        <button className="btn btn-secondary" onClick={() => downloadCSV('waste')}>Download Waste CSV</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
