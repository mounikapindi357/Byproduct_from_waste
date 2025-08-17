import React, { useState } from 'react';
import axios from 'axios';

function DonorDonationForm() {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    valid_hours: '',
    comment: '',
    location: ''
  });
  const [photo, setPhoto] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = e => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const donor_id = localStorage.getItem('userId');
    const data = new FormData();
    data.append('name', form.name);
    data.append('quantity', form.quantity);
    data.append('valid_hours', form.valid_hours);
    data.append('comment', form.comment);
    data.append('location', form.location);
    data.append('photo', photo);
    data.append('donor_id', donor_id);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/food_donation', data);
      alert(res.data.message || 'Donation submitted!');
    } catch (err) {
      alert(err.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">🍱 Donate Food</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="name" placeholder="Food name" className="form-control mb-3" onChange={handleChange} required />
          <input type="number" name="quantity" placeholder="Quantity" className="form-control mb-3" onChange={handleChange} required />
          <input type="number" name="valid_hours" step="0.5" min="0.5" max="48" placeholder="Food is fresh for (in hours)" className="form-control mb-3" onChange={handleChange} required />
          <input type="text" name="location" placeholder="Google Maps Location URL" className="form-control mb-3" onChange={handleChange} required />
          <textarea name="comment" placeholder="Comments" className="form-control mb-3" onChange={handleChange} />
          <input type="file" onChange={handlePhotoChange} className="form-control mb-3" accept="image/*" required />
          <button className="btn btn-success w-100">Submit Donation</button>
        </form>
      </div>
    </div>
  );
}

export default DonorDonationForm;
