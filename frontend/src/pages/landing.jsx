import React from "react";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing">
      {/* Header */}
      <header className="header">
        <div className="logo">ARTISAN</div>
        <nav>
          <ul>
            <li>Home</li>
            <li>Services</li>
            <li>About</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </nav>
        <div className="header-icons">
          <span className="search">🔍</span>
          <span className="user">👤</span>
          <span className="cart">🛒</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>The Art of Handcrafted Excellence</h1>
          <p>
            Discover skilled artisans and their unique creations for your home
            and lifestyle.
          </p>
          <button className="hero-btn">Explore Artisans</button>
        </div>
      </section>

      {/* Features / Quick Info */}
      <section className="features">
        <div className="feature-card">Verified Artisans</div>
        <div className="feature-card">Easy Booking</div>
        <div className="feature-card">Trusted Quality</div>
        <div className="feature-card">Support 24/7</div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="category-card">Furniture</div>
        <div className="category-card">Decor</div>
        <div className="category-card">Lighting</div>
        <div className="category-card">Accessories</div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to hire an artisan?</h2>
        <button className="cta-btn">Get Started</button>
      </section>
    </div>
  );
};

export default Landing;
