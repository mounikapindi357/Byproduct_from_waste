import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DonorDonation() {
  const [donations, setDonations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', comment: '' });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const donorId = localStorage.getItem('userId');
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/food_donations/${donorId}`);
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      await axios.delete(`http://127.0.0.1:5000/api/delete_donation/${id}`);
      fetchDonations();
    }
  };

  const handleEdit = (d) => {
    setEditing(d.id);
    setForm({ name: d.name, quantity: d.quantity, comment: d.comment });
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await axios.put(`http://127.0.0.1:5000/api/update_donation_fields/${editing}`, form);
    setEditing(null);
    fetchDonations();
  };

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">📋 My Food Donations</h3>
      {donations.length === 0 ? (
        <p className="text-center">You haven't made any donations yet.</p>
      ) : (
        donations.map(d => (
          <div key={d.id} className="card p-3 mb-4 shadow-sm">
            {editing === d.id ? (
              <>
                <input type="text" name="name" value={form.name} onChange={handleFormChange} className="form-control mb-2" />
                <input type="number" name="quantity" value={form.quantity} onChange={handleFormChange} className="form-control mb-2" />
                <textarea name="comment" value={form.comment} onChange={handleFormChange} className="form-control mb-2" />
                <button className="btn btn-success me-2" onClick={handleUpdate}>Update</button>
                <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Food:</strong> {d.name}</p>
                <p><strong>Quantity:</strong> {d.quantity}</p>
                {d.expiry ? (
                  <p>
                    <strong>Expiry:</strong>{' '}
                    <span style={{ color: new Date(d.expiry) > new Date() ? 'green' : 'red' }}>
                      {new Date(d.expiry).toLocaleString()}
                      {' '}
                      {new Date(d.expiry) > new Date() ? '🟢 Fresh' : '🔴 Expired'}
                    </span>
                  </p>
                ) : (
                  <p><strong>Expiry:</strong> Not available</p>
                )}

                <p><strong>Comment:</strong> {d.comment}</p>
                {d.photo && <img src={`http://127.0.0.1:5000${d.photo}`} width="120" alt="donated" className="img-thumbnail mb-2" />}
                <p><strong>Status:</strong> {d.status || 'Pending'}</p>
                {d.status === 'rejected' && (
                  <p className="text-danger"><strong>Reason:</strong> {d.rejection_reason}</p>
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

export default DonorDonation;