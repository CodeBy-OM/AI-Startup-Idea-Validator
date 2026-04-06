import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⬡</span>
          <span className="navbar__logo-text">IdeaForge</span>
        </Link>

        <div className="navbar__links">
          <Link
            to="/"
            className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Validate
          </Link>
          <Link
            to="/dashboard"
            className={`navbar__link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </div>

        <Link to="/" className="navbar__cta">
          New Idea
        </Link>
      </div>
    </nav>
  );
}
