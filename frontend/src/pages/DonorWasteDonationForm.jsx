import React, { useState } from 'react';
import axios from 'axios';

function DonorWasteDonationForm() {
  const [form, setForm] = useState({
    waste_type: '',
    quantity: '',
    comment: ''
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
    data.append('name', form.waste_type);
    data.append('quantity', form.quantity);
    data.append('description', form.comment);
    data.append('photo', photo);
    data.append('donor_id', donor_id);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/waste_donation', data);
      alert(res.data.message || 'Waste donation submitted!');
    } catch (err) {
      alert(err.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">♻️ Donate Waste</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="waste_type" placeholder="Type of Waste" className="form-control mb-3" onChange={handleChange} required />
          <input type="number" name="quantity" placeholder="Quantity (kg)" className="form-control mb-3" onChange={handleChange} required />
          <textarea name="comment" placeholder="Comment (optional)" className="form-control mb-3" onChange={handleChange} />
          <input type="file" onChange={handlePhotoChange} className="form-control mb-3" accept="image/*" required />
          <button className="btn btn-primary w-100">Submit Waste Donation</button>
        </form>
      </div>
    </div>
  );
}

export default DonorWasteDonationForm;
