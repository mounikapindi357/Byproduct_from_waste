// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    
    <div className="home-container container mt-4">
      <div className="text-center mb-4">
        <h1 className="display-5 text-success fw-bold">
          ♻️ ByProduct from Waste
        </h1>
        <p className="fst-italic text-muted fs-5">
          “Don’t waste it — donate it. A better world starts with a small action.”
        </p>

     
      </div>

      {/* About Section */}
      <div className="mb-4">
        <h3 className="section-title">🌱 Why This Platform Matters</h3>
        <p>
          Every day, tons of food and recyclable materials are thrown away. Many people are unaware that leftover meals,
          used plastics, or old books can be redirected to serve the needy or be transformed into useful byproducts.
          This platform bridges the gap between those who have surplus and those who need it — making a real impact on
          hunger, pollution, and sustainability.
        </p>
        <p>
          Our mission is simple: <strong>Reduce Waste, Help the Needy, and Promote Recycling</strong>.
        </p>
      </div>

      {/* Donation Types */}
      <h3 className="section-title">🧺 What You Can Donate</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="card-hover bg-success text-white p-3 mb-3">
            <h5>🍲 Food Donations</h5>
            <ul>
              <li>Cooked meals (fresh and hygienic)</li>
              <li>Packaged food (not expired)</li>
              <li>Fruits & vegetables (in edible condition)</li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-hover bg-info text-white p-3 mb-3">
            <h5>♻️ Waste Donations</h5>
            <ul>
              <li>Plastic bottles, bags, containers</li>
              <li>Old newspapers, books, paper</li>
              <li>Broken electronics (phones, chargers, cables)</li>
              <li>Glass bottles, tin cans, metals</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ByProduct Information */}
      <h3 className="section-title">🏭 What Happens to Donated Waste?</h3>
      <div className="row text-center">
        <div className="col-md-4">
          <div className="card-hover donate-info">
            🍱 <strong>Food</strong><br />→ Served to Needy / Animals
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-hover donate-info">
            🧱 <strong>Plastic</strong><br />→ Recycled into Bricks, Pavement Blocks, Furniture
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-hover donate-info">
            📄 <strong>Paper</strong><br />→ Recycled into Notebooks, Packaging, Toilet Paper
          </div>
        </div>
        <div className="col-md-4 mt-3">
          <div className="card-hover donate-info">
            🔌 <strong>Electronics</strong><br />→ Refurbished or E-Waste Recovery
          </div>
        </div>
        <div className="col-md-4 mt-3">
          <div className="card-hover donate-info">
            🪟 <strong>Glass</strong><br />→ Melted into New Bottles or Tiles
          </div>
        </div>
        <div className="col-md-4 mt-3">
          <div className="card-hover donate-info">
            🧃 <strong>Metal/Tin</strong><br />→ Smelted & Reused in Industry
          </div>
        </div>
      </div>

      <div className="alert alert-warning text-center mt-4 fw-semibold">
        Unsure what to donate? Start with small things — a meal, a book, a bottle. <br />
        <span className="text-success">Every contribution reduces waste and creates impact!</span>
      </div>
    </div>
  );
}

export default Home;
