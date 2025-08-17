// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input className="form-control mb-3" type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="form-control mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <select className="form-control mb-3" name="role" onChange={handleChange}>
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-success w-100" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
