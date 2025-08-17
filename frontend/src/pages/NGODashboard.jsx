import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function NGODashboard() {
  const [view, setView] = useState('menu');
  const [foodDonations, setFoodDonations] = useState([]);
  const [wasteDonations, setWasteDonations] = useState([]);
  const orgName = localStorage.getItem("username") || "NGO";

  useEffect(() => {
    // Optional preload if needed
  }, []);

  const fetchFoodDonations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/all_donations');
      setFoodDonations(res.data);
      setView('food');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWasteDonations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/all_waste_donations');
      setWasteDonations(res.data);
      setView('waste');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFoodAction = async (id, status) => {
    const reason = status === 'rejected' ? prompt("Enter rejection reason:") : '';
    if (status === 'rejected' && !reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:5000/api/update_donation/${id}`, { status, reason });
      alert("Status updated");
      fetchFoodDonations();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const markDelivered = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/update_donation/${id}`, { status: 'delivered' });
      alert("Marked as delivered");
      fetchFoodDonations();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleWasteUpdate = async (id) => {
    const factory_name = prompt("Factory Name:");
    const factory_location = prompt("Factory Location:");
    const byproduct = prompt("Final Byproduct:");
    if (!factory_name || !factory_location || !byproduct) {
      alert("All fields required.");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:5000/api/update_waste/${id}`, {
        factory_name,
        factory_location,
        byproduct
      });
      alert("Waste updated successfully");
      fetchWasteDonations();
    } catch (err) {
      alert("Failed to update waste");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-3 fw-bold">🏥 Welcome, {orgName}</h2>
      <p className="text-center text-muted">Manage food and waste donations</p>

      {view === 'menu' && (
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-success" onClick={fetchFoodDonations}>🍱 View Food Donations</button>
          <button className="btn btn-info" onClick={fetchWasteDonations}>♻️ View Waste Donations</button>
        </div>
      )}

      {view === 'food' && (
        <div className="mt-4">
          <button className="btn btn-secondary mb-3" onClick={() => setView('menu')}>🔙 Back</button>
          <h4>🍱 Food Donations</h4>
          {foodDonations.length === 0 ? (
            <p>No food donations found.</p>
          ) : (
            foodDonations.map(d => (
              <div key={d.id} className="card mb-3 p-3 shadow-sm">
                <p><strong>Name:</strong> {d.name}</p>
                <p><strong>Quantity:</strong> {d.quantity}</p>
                <p><strong>Comment:</strong> {d.comment || "N/A"}</p>
                {d.expiry && (
                  <p><strong>Expiry:</strong>{' '}
                    <span style={{ color: new Date(d.expiry) > new Date() ? 'green' : 'red' }}>
                      {new Date(d.expiry).toLocaleString()} {new Date(d.expiry) > new Date() ? '🟢 Fresh' : '🔴 Expired'}
                    </span>
                  </p>
                )}
                {d.photo && <img src={`http://127.0.0.1:5000${d.photo}`} alt="food" className="img-thumbnail mb-2" width="120" />}
                <p><strong>Status:</strong> {d.status || 'pending'}</p>

                {(!d.status || d.status === 'pending') && (
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-outline-success" onClick={() => handleFoodAction(d.id, 'picked_up')}>✅ Accept</button>
                    <button className="btn btn-outline-danger" onClick={() => handleFoodAction(d.id, 'rejected')}>❌ Reject</button>
                  </div>
                )}

                {d.status === 'rejected' && d.rejection_reason && (
                  <p><strong>Reason:</strong> {d.rejection_reason}</p>
                )}

                {d.status === 'picked_up' && (
                  <button className="btn btn-primary mt-2" onClick={() => markDelivered(d.id)}>📦 Mark Delivered</button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {view === 'waste' && (
        <div className="mt-4">
          <button className="btn btn-secondary mb-3" onClick={() => setView('menu')}>🔙 Back</button>
          <h4>♻️ Waste Donations</h4>
          {wasteDonations.length === 0 ? (
            <p>No waste donations found.</p>
          ) : (
            wasteDonations.map(d => (
              <div key={d.id} className="card mb-3 p-3 shadow-sm">
                <p><strong>Type:</strong> {d.name}</p>
                <p><strong>Quantity:</strong> {d.quantity}</p>
                <p><strong>Description:</strong> {d.description || "N/A"}</p>
                {d.photo && <img src={`http://127.0.0.1:5000${d.photo}`} alt="waste" className="img-thumbnail mb-2" width="120" />}
                <p><strong>Status:</strong> {d.status || 'Pending'}</p>
                {/* 1. Mark as picked_up */}
                {d.status === null || d.status === 'pending' ? (
                  <button
                    className="btn btn-outline-success"
                    onClick={async () => {
                      const confirm = window.confirm("Mark this donation as picked up?");
                      if (confirm) {
                        try {
                          await axios.put(`http://127.0.0.1:5000/api/update_waste/${d.id}`, {
                            mark_picked_up: true
                          });
                          alert("Marked as picked up");
                          fetchWasteDonations();
                        } catch (err) {
                          alert("Failed to update status");
                        }
                      }
                    }}
                  >
                    ✅ Mark as Picked Up
                  </button>
                ) : d.status === 'picked_up' ? (
                  <button
                    className="btn btn-outline-primary"
                    onClick={async () => {
                      const factory_name = prompt("Enter factory name:");
                      const factory_location = prompt("Enter factory location:");
                      if (!factory_name || !factory_location) {
                        alert("Both fields required");
                        return;
                      }
                      try {
                        await axios.put(`http://127.0.0.1:5000/api/update_waste/${d.id}`, {
                          factory_name,
                          factory_location
                          
                        });
                        alert("Factory info updated");
                        fetchWasteDonations();
                      } catch (err) {
                        alert("Failed to update factory info");
                      }
                    }}
                  >
                    🏭 Add Factory Info
                  </button>
                ) : d.status === 'processing' ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={async () => {
                      const byproduct = prompt("Enter byproduct:");
                      if (!byproduct) {
                        alert("Byproduct required");
                        return;
                      }
                      try {
                        await axios.put(`http://127.0.0.1:5000/api/update_waste/${d.id}`, {
                          byproduct
                        });
                        alert("Byproduct info updated");
                        fetchWasteDonations();
                      } catch (err) {
                        alert("Failed to update byproduct");
                      }
                    }}
                  >
                    🧪 Add Byproduct
                  </button>
                ) : (
                  <div className="mt-2">
                    <p><strong>Factory:</strong> {d.factory_name}</p>
                    <p><strong>Location:</strong> {d.factory_location}</p>
                    <p><strong>Byproduct:</strong> {d.byproduct}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NGODashboard;
