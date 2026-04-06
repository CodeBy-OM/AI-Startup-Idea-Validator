import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ideasApi } from '../hooks/useApi';
import './IdeaDetailPage.css';

const VERDICT_META = {
  'Strong Buy':  { color: '#34d399', icon: '🚀', desc: 'Exceptional opportunity' },
  'Promising':   { color: '#60a5fa', icon: '✨', desc: 'Solid potential' },
  'Risky':       { color: '#fbbf24', icon: '⚠️', desc: 'Proceed with caution' },
  'Needs Pivot': { color: '#f87171', icon: '🔄', desc: 'Significant changes needed' },
};

const RISK_COLOR = { Low: '#34d399', Medium: '#fbbf24', High: '#f87171' };

function ScoreGauge({ score }) {
  const color = score >= 70 ? '#34d399' : score >= 45 ? '#fbbf24' : '#f87171';
  return (
    <div className="score-gauge">
      <div
        className="score-gauge__ring"
        style={{
          background: `conic-gradient(${color} ${score}%, #1c1c28 0%)`,
        }}
      >
        <div className="score-gauge__inner">
          <span className="score-gauge__number">{score}</span>
          <span className="score-gauge__label">/ 100</span>
        </div>
      </div>
      <p className="score-gauge__caption">Profitability Score</p>
    </div>
  );
}

function Section({ title, icon, children, delay = 0 }) {
  return (
    <div className="report-section animate-fadeUp" style={{ animationDelay: `${delay}s` }}>
      <h2 className="section-title">
        <span className="section-icon">{icon}</span>
        {title}
      </h2>
      <div className="section-body">{children}</div>
    </div>
  );
}

export default function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ideasApi.getById(id)
      .then(setIdea)
      .catch(() => setError('Idea not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this idea permanently?')) return;
    await ideasApi.delete(id);
    navigate('/dashboard');
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) return (
    <div className="detail-loading">
      <div className="spinner spinner--large" />
      <p>Loading report…</p>
    </div>
  );

  if (error) return (
    <div className="detail-error">
      <p>{error}</p>
      <Link to="/dashboard">← Back to dashboard</Link>
    </div>
  );

  const { title, description, report, createdAt } = idea;
  const verdict = report.verdict || 'Promising';
  const verdictMeta = VERDICT_META[verdict] || VERDICT_META['Promising'];
  const riskColor = RISK_COLOR[report.risk_level] || '#888';

  return (
    <div className="detail-page page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="breadcrumb animate-fadeIn">
          <Link to="/dashboard">Dashboard</Link>
          <span>/</span>
          <span>{title}</span>
        </nav>

        {/* Header */}
        <header className="detail-header animate-fadeUp">
          <div className="detail-header__left">
            <div
              className="detail-verdict"
              style={{ color: verdictMeta.color, borderColor: verdictMeta.color + '44', background: verdictMeta.color + '12' }}
            >
              {verdictMeta.icon} {verdict} — {verdictMeta.desc}
            </div>
            <h1 className="detail-title">{title}</h1>
            <p className="detail-desc">{description}</p>
            <p className="detail-date">Analyzed on {formatDate(createdAt)}</p>
          </div>
          <div className="detail-header__right">
            <ScoreGauge score={report.profitability_score} />
          </div>
        </header>

        {/* Divider */}
        <div className="divider" />

        {/* Report sections */}
        <div className="report-grid">

          {/* Problem */}
          <Section title="Problem Statement" icon="🎯" delay={0.1}>
            <p className="prose">{report.problem}</p>
          </Section>

          {/* Customer */}
          <Section title="Customer Persona" icon="👤" delay={0.15}>
            <div className="customer-card">
              <div className="customer-primary">
                <span className="tag">Primary Segment</span>
                <p>{report.customer?.primary}</p>
              </div>
              <div className="customer-row">
                <div>
                  <span className="tag">Pain Points</span>
                  <ul className="bullet-list">
                    {(report.customer?.pain_points || []).map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="tag">Willingness to Pay</span>
                  <p className="wtp">{report.customer?.willingness_to_pay}</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Market */}
          <Section title="Market Overview" icon="📊" delay={0.2}>
            <div className="market-stats">
              <div className="stat-box">
                <span className="stat-label">Market Size (TAM)</span>
                <span className="stat-value">{report.market?.size}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Annual Growth</span>
                <span className="stat-value">{report.market?.growth_rate}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Maturity</span>
                <span className="stat-value">{report.market?.maturity}</span>
              </div>
            </div>
            <p className="prose" style={{ marginTop: 16 }}>{report.market?.summary}</p>
          </Section>

          {/* Competitors */}
          <Section title="Competitor Analysis" icon="⚔️" delay={0.25}>
            <div className="competitors-list">
              {(report.competitors || []).map((c, i) => (
                <div className="competitor-item" key={i}>
                  <div className="competitor-rank">#{i + 1}</div>
                  <div>
                    <p className="competitor-name">{c.name}</p>
                    <p className="competitor-diff">{c.differentiation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Tech Stack */}
          <Section title="Recommended Tech Stack" icon="🛠" delay={0.3}>
            <div className="tech-stack">
              {(report.tech_stack || []).map((tech, i) => (
                <span className="tech-badge" key={i}>{tech}</span>
              ))}
            </div>
          </Section>

          {/* Risk */}
          <Section title="Risk Assessment" icon="⚠️" delay={0.35}>
            <div className="risk-header">
              <span className="risk-level-badge" style={{ color: riskColor, borderColor: riskColor + '55', background: riskColor + '15' }}>
                {report.risk_level} Risk
              </span>
            </div>
            <ul className="bullet-list" style={{ marginTop: 16 }}>
              {(report.risk_factors || []).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Section>

          {/* Go-to-Market */}
          {report.go_to_market && (
            <Section title="Go-to-Market Strategy" icon="📣" delay={0.4}>
              <p className="prose">{report.go_to_market}</p>
            </Section>
          )}

          {/* Justification / Verdict */}
          <Section title="Expert Justification" icon="💡" delay={0.45}>
            <p className="prose">{report.justification}</p>
          </Section>
        </div>

        {/* Actions */}
        <div className="detail-actions animate-fadeUp" style={{ animationDelay: '0.5s' }}>
          <Link to="/" className="btn btn--primary">+ Validate Another Idea</Link>
          <Link to="/dashboard" className="btn btn--ghost">← All Ideas</Link>
          <button className="btn btn--danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
