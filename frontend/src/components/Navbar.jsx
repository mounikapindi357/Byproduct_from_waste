import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const location = useLocation(); // triggers re-render on route change

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/"; // or use navigate("/")
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4 py-2">
      <Link className="navbar-brand fw-bold" to="/">
        ♻️ ByProduct from Waste
      </Link>

      <div className="ms-auto d-flex align-items-center gap-2">
        {username ? (
          <>
            {role === 'donor' && (
              <>
                <Link className="btn btn-outline-light" to="/donate-food">Donate Food</Link>
                <Link className="btn btn-outline-light" to="/donate-waste">Donate Waste</Link>
                <Link className="btn btn-outline-light" to="/donations">My Food Donations</Link>
                <Link className="btn btn-outline-light" to="/my-waste-donations">My Waste Donations</Link>
              </>
            )}
            {role === 'ngo' && (
              <Link className="btn btn-outline-light" to="/ngo">NGO Dashboard</Link>
            )}
            {role === 'admin' && (
              <Link className="btn btn-outline-light" to="/admin">Admin Dashboard</Link>
            )}
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                Hi, {username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light" to="/login">Login</Link>
            <Link className="btn btn-light" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
