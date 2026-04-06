import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ideasApi } from '../hooks/useApi';
import './HomePage.css';

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const idea = await ideasApi.create(title.trim(), description.trim());
      navigate(`/ideas/${idea.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong. Is the server running?');
      setLoading(false);
    }
  };

  const examples = [
    { title: 'AI Resume Screener', desc: 'An AI tool that automatically screens resumes for job postings and ranks candidates based on job fit, reducing recruiter workload by 80%.' },
    { title: 'Neighborhood Food Co-op App', desc: 'A platform connecting neighbors to buy groceries in bulk together, reducing costs and food waste through collective purchasing from local farms.' },
    { title: 'B2B SaaS for Dental Clinics', desc: 'Practice management software for small dental clinics that automates appointment reminders, billing, and insurance claims with a simple mobile interface.' },
  ];

  const fillExample = (ex) => {
    setTitle(ex.title);
    setDescription(ex.desc);
  };

  return (
    <div className="home-page page">
      <div className="container">
        {/* Hero */}
        <header className="hero animate-fadeUp">
          <div className="hero__badge">Powered by Claude AI</div>
          <h1 className="hero__title">
            Validate your startup idea<br />
            <span className="hero__title-accent">in seconds.</span>
          </h1>
          <p className="hero__subtitle">
            Get a detailed expert analysis: market size, competitors, risk level,
            profitability score, and a go-to-market strategy — instantly.
          </p>
        </header>

        {/* Form */}
        <form className="idea-form animate-fadeUp delay-2" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="title">
              Startup Idea Title
              <span className="form-label__count">{title.length}/200</span>
            </label>
            <input
              id="title"
              className="form-input"
              type="text"
              placeholder="e.g. AI-powered legal document review for SMBs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="description">
              Describe your idea
              <span className="form-label__count">{description.length}/2000</span>
            </label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="What problem does it solve? Who is the customer? How does it work? The more detail you give, the better the analysis."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={6}
              disabled={loading}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Analyzing with AI… (up to 30s)
              </>
            ) : (
              <>
                <span>⚡</span> Validate My Idea
              </>
            )}
          </button>
        </form>

        {/* Examples */}
        <div className="examples animate-fadeUp delay-3">
          <p className="examples__label">Try an example →</p>
          <div className="examples__list">
            {examples.map((ex, i) => (
              <button key={i} className="example-chip" onClick={() => fillExample(ex)} type="button">
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        {/* Features row */}
        <div className="features animate-fadeUp delay-4">
          {[
            { icon: '🎯', label: 'Customer Persona' },
            { icon: '📊', label: 'Market Overview' },
            { icon: '⚔️', label: '3 Competitors' },
            { icon: '🛠', label: 'Tech Stack' },
            { icon: '⚠️', label: 'Risk Assessment' },
            { icon: '💰', label: 'Profit Score' },
          ].map((f, i) => (
            <div className="feature-pill" key={i}>
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
