import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DonorWasteDonations() {
  const [wasteDonations, setWasteDonations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', description: '' });

  useEffect(() => {
    fetchWasteDonations();
  }, []);

  const fetchWasteDonations = async () => {
    const donorId = localStorage.getItem('userId');
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/waste_donations/${donorId}`);
      setWasteDonations(res.data);
    } catch (err) {
      console.error("Error fetching waste donations:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this waste donation?")) {
      await axios.delete(`http://127.0.0.1:5000/api/delete_waste/${id}`);
      fetchWasteDonations();
    }
  };

  const handleEdit = (d) => {
    setEditing(d.id);
    setForm({ name: d.name, quantity: d.quantity, description: d.description });
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await axios.put(`http://127.0.0.1:5000/api/update_waste_fields/${editing}`, form);
    setEditing(null);
    fetchWasteDonations();
  };

  const statusColors = {
    pending: 'secondary',
    picked_up: 'info',
    processing: 'warning',
    converted: 'success'
  };

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">♻️ My Waste Donations</h3>
      {wasteDonations.length === 0 ? (
        <p className="text-center">No waste donations yet.</p>
      ) : (
        wasteDonations.map(d => (
          <div key={d.id} className="card mb-4 p-3 shadow-sm">
            {editing === d.id ? (
              <>
                <input type="text" name="name" value={form.name} onChange={handleFormChange} className="form-control mb-2" />
                <input type="number" name="quantity" value={form.quantity} onChange={handleFormChange} className="form-control mb-2" />
                <textarea name="description" value={form.description} onChange={handleFormChange} className="form-control mb-2" />
                <button className="btn btn-success me-2" onClick={handleUpdate}>Update</button>
                <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Waste Type:</strong> {d.name}</p>
                <p><strong>Quantity:</strong> {d.quantity} kg</p>
                <p><strong>Description:</strong> {d.description}</p>
                {d.photo && <img src={`http://127.0.0.1:5000${d.photo}`} alt="waste photo" width="120" className="img-thumbnail mb-2" />}
                
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`badge bg-${statusColors[d.status] || 'dark'}`}>
                    {d.status || 'Pending'}
                  </span>
                </p>

                {d.status === 'processing' || d.status === 'converted' ? (
                  <>
                    <p><strong>🏭 Factory:</strong> {d.factory_name}</p>
                    <p><strong>📍 Location:</strong> {d.factory_location}</p>
                  </>
                ) : null}

                {d.status === 'converted' && d.byproduct && (
                  <p><strong>🧪 Byproduct:</strong> {d.byproduct}</p>
                )}

                {d.status === 'pending' && (
                  <div className="mt-2">
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(d)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(d.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default DonorWasteDonations;
