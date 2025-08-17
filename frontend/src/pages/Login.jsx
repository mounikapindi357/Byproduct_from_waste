// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });

    const { role, id, username } = res.data; // 👈 make sure your backend returns `username`
    
    localStorage.setItem('role', role);
    localStorage.setItem('userId', id);
    localStorage.setItem('username', username); // 👈 required for Navbar display

    // ✅ TEMP DEBUG LOG:
    console.log("Saved userId:", localStorage.getItem("userId"));

    // Redirect based on role
    if (role === 'donor') navigate('/donor');
    else if (role === 'ngo') navigate('/ngo');
    else if (role === 'admin') navigate('/admin');
  } catch (err) {
    alert('Invalid credentials');
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="form-control mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn btn-success w-100" type="submit">Login</button>
          <p className="text-center mt-3">
            Don’t have an account? <a href="/register" className="text-decoration-none text-success fw-bold">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
