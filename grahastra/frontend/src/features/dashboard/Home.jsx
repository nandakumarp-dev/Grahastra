// Home.jsx - Modern & Mobile-First
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const userStats = {
    insightsGenerated: 24,
    questionsAsked: 12,
    compatibilityChecks: 3
  };

  const recentActivity = [
    { 
      icon: "✨", 
      text: "Daily horoscope viewed", 
      time: "2 hours ago",
      color: "activity-purple"
    },
    { 
      icon: "🤖", 
      text: "AI consultation completed", 
      time: "1 day ago",
      color: "activity-blue"
    },
    { 
      icon: "💞", 
      text: "Compatibility analysis", 
      time: "2 days ago",
      color: "activity-pink"
    }
  ];

  const widgets = [
    {
      icon: "🌌",
      title: "Birth Chart",
      description: "Explore your complete astrological blueprint with detailed planetary positions.",
      link: "/dashboard/birthchart",
      buttonText: "View Chart",
      gradient: "gradient-purple"
    },
    {
      icon: "🤖",
      title: "AI Astrologer",
      description: "Get personalized answers to your life questions with AI-powered guidance.",
      link: "/dashboard/ask-astrology",
      buttonText: "Ask Now",
      gradient: "gradient-blue"
    },
    {
      icon: "📊",
      title: "Daily Horoscope",
      description: "Personalized daily predictions and transit alerts based on your birth chart.",
      link: "/dashboard/daily-horoscope",
      buttonText: "View Today",
      gradient: "gradient-orange"
    },
    {
      icon: "💞",
      title: "Compatibility",
      description: "Check relationship compatibility using advanced synastry analysis.",
      link: "/dashboard/compatibility",
      buttonText: "Check Match",
      gradient: "gradient-pink"
    },
    {
      icon: "🔢",
      title: "Numerology",
      description: "Discover your life path, expression, and soul urge numbers.",
      link: "/dashboard/numerology",
      buttonText: "View Report",
      gradient: "gradient-teal"
    },
    {
      icon: "📈",
      title: "Progressed Chart",
      description: "See how your chart evolves over time with progressions.",
      link: "/dashboard/progressed-chart",
      buttonText: "View Progressions",
      gradient: "gradient-indigo"
    }
  ];

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Cosmic <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="welcome-subtitle">
            Welcome back! Explore your astrological insights and continue your cosmic journey.
          </p>
        </div>
        <div className="welcome-graphic">
          <div className="cosmic-orb"></div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{userStats.insightsGenerated}</div>
            <div className="stat-label">Insights Generated</div>
            <div className="stat-trend">↑ 12%</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{userStats.questionsAsked}</div>
            <div className="stat-label">AI Sessions</div>
            <div className="stat-trend">↑ 8%</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{userStats.compatibilityChecks}</div>
            <div className="stat-label">Matches Made</div>
            <div className="stat-trend">↑ 5%</div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className={`activity-item ${activity.color}`}>
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <div className="activity-text">{activity.text}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
              <div className="activity-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Astrological Tools</h2>
          <p className="section-subtitle">Explore all cosmic insights</p>
        </div>
        <div className="features-grid">
          {widgets.map((widget, index) => (
            <div key={index} className="feature-card">
              <div className={`feature-icon ${widget.gradient}`}>
                {widget.icon}
              </div>
              <h3 className="feature-title">{widget.title}</h3>
              <p className="feature-description">{widget.description}</p>
              <Link to={widget.link} className={`feature-button ${widget.gradient}`}>
                {widget.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn primary">
            <span className="action-icon">🔮</span>
            <span className="action-text">Daily Reading</span>
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">⭐</span>
            <span className="action-text">Birth Chart</span>
          </button>
          <button className="action-btn tertiary">
            <span className="action-icon">💫</span>
            <span className="action-text">Transits</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;