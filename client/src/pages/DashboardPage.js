import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ideasApi } from '../hooks/useApi';
import './DashboardPage.css';

const VERDICT_META = {
  'Strong Buy':   { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  icon: '🚀' },
  'Promising':    { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  icon: '✨' },
  'Risky':        { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  icon: '⚠️' },
  'Needs Pivot':  { color: '#f87171', bg: 'rgba(248,113,113,0.1)', icon: '🔄' },
};

const RISK_COLOR = {
  Low:    '#34d399',
  Medium: '#fbbf24',
  High:   '#f87171',
};

export default function DashboardPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const data = await ideasApi.getAll();
      setIdeas(data);
    } catch {
      setError('Could not load ideas. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIdeas(); }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this idea?')) return;
    setDeleting(id);
    try {
      await ideasApi.delete(id);
      setIdeas(prev => prev.filter(i => i.id !== id));
    } catch {
      alert('Could not delete idea.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard-page page">
      <div className="container">
        <header className="dashboard-header animate-fadeUp">
          <div>
            <h1 className="dashboard-title">Your Ideas</h1>
            <p className="dashboard-subtitle">
              {ideas.length} idea{ideas.length !== 1 ? 's' : ''} validated
            </p>
          </div>
          <Link to="/" className="dashboard-cta">+ Validate New Idea</Link>
        </header>

        {loading && (
          <div className="dashboard-loading animate-fadeIn">
            <div className="spinner spinner--large" />
            <p>Loading ideas…</p>
          </div>
        )}

        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && ideas.length === 0 && (
          <div className="dashboard-empty animate-fadeUp">
            <div className="empty-icon">💡</div>
            <h2>No ideas yet</h2>
            <p>Submit your first startup idea to get an AI-generated validation report.</p>
            <Link to="/" className="dashboard-cta">Get Started →</Link>
          </div>
        )}

        {!loading && ideas.length > 0 && (
          <div className="ideas-grid">
            {ideas.map((idea, i) => {
              const verdict = idea.verdict || 'Promising';
              const meta = VERDICT_META[verdict] || VERDICT_META['Promising'];
              const riskColor = RISK_COLOR[idea.risk_level] || '#8888aa';
              return (
                <Link
                  to={`/ideas/${idea.id}`}
                  key={idea.id}
                  className="idea-card animate-fadeUp"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="idea-card__header">
                    <div className="idea-card__verdict" style={{ color: meta.color, background: meta.bg }}>
                      {meta.icon} {verdict}
                    </div>
                    <button
                      className="idea-card__delete"
                      onClick={(e) => handleDelete(e, idea.id)}
                      disabled={deleting === idea.id}
                      title="Delete idea"
                    >
                      {deleting === idea.id ? '…' : '×'}
                    </button>
                  </div>

                  <h2 className="idea-card__title">{idea.title}</h2>

                  <div className="idea-card__meta">
                    {idea.profitability_score != null && (
                      <div className="idea-card__score">
                        <div
                          className="score-ring"
                          style={{ '--pct': `${idea.profitability_score}%`, '--color': meta.color }}
                        >
                          <span>{idea.profitability_score}</span>
                        </div>
                        <span className="score-label">Profit Score</span>
                      </div>
                    )}
                    <div className="idea-card__badges">
                      {idea.risk_level && (
                        <span className="badge" style={{ color: riskColor, borderColor: riskColor + '44', background: riskColor + '12' }}>
                          {idea.risk_level} Risk
                        </span>
                      )}
                      <span className="badge badge--date">{formatDate(idea.createdAt)}</span>
                    </div>
                  </div>

                  <div className="idea-card__arrow">View Report →</div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
