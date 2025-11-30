// Home.jsx - Fully Responsive
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
      icon: "star", 
      text: "Daily horoscope viewed", 
      time: "2 hours ago",
      color: "activity-purple"
    },
    { 
      icon: "ai", 
      text: "AI consultation completed", 
      time: "1 day ago",
      color: "activity-blue"
    },
    { 
      icon: "heart", 
      text: "Compatibility analysis", 
      time: "2 days ago",
      color: "activity-pink"
    }
  ];

  const mainFeatures = [
    {
      icon: "chart",
      title: "Birth Chart",
      description: "Explore your complete astrological blueprint with detailed planetary positions and aspects.",
      link: "/dashboard/birthchart",
      buttonText: "View Chart",
      gradient: "gradient-purple"
    },
    {
      icon: "ai",
      title: "AI Astrologer",
      description: "Get personalized answers to your life questions with our advanced AI-powered guidance system.",
      link: "/dashboard/ask-astrology",
      buttonText: "Ask Now",
      gradient: "gradient-blue"
    },
    {
      icon: "horoscope",
      title: "Daily Horoscope",
      description: "Personalized daily predictions and transit alerts tailored to your unique birth chart.",
      link: "/dashboard/daily-horoscope",
      buttonText: "View Today",
      gradient: "gradient-orange"
    },
    {
      icon: "compatibility",
      title: "Compatibility",
      description: "Check relationship compatibility using advanced synastry and composite chart analysis.",
      link: "/dashboard/compatibility",
      buttonText: "Check Match",
      gradient: "gradient-pink"
    }
  ];

  const secondaryFeatures = [
    {
      icon: "numbers",
      title: "Numerology",
      description: "Discover your life path numbers",
      link: "/dashboard/numerology",
      buttonText: "View Report",
      gradient: "gradient-teal"
    },
    {
      icon: "progress",
      title: "Progressed Chart",
      description: "See how your chart evolves",
      link: "/dashboard/progressed-chart",
      buttonText: "View Progressions",
      gradient: "gradient-indigo"
    },
    {
      icon: "transit",
      title: "Current Transits",
      description: "Real-time planetary movements",
      link: "/dashboard/transits",
      buttonText: "View Transits",
      gradient: "gradient-purple"
    }
  ];

  const quickActions = [
    {
      icon: "reading",
      text: "Daily Reading",
      type: "primary"
    },
    {
      icon: "chart",
      text: "Birth Chart",
      type: "secondary"
    },
    {
      icon: "compatibility",
      text: "Compatibility",
      type: "tertiary"
    },
    {
      icon: "horoscope",
      text: "Horoscope",
      type: "primary"
    },
    {
      icon: "ai",
      text: "AI Consult",
      type: "secondary"
    },
    {
      icon: "numbers",
      text: "Numerology",
      type: "tertiary"
    }
  ];

  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
  };

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1 className="welcome-title">
              Welcome Back, <span className="gradient-text">Cosmic Explorer</span>!
            </h1>
            <p className="welcome-subtitle">
              Ready to continue your journey through the stars? Explore your latest insights and discover what the cosmos has in store for you today.
            </p>
          </div>
          <div className="welcome-stats">
            <div className="stat-card large">
              <div className="stat-icon insights-icon"></div>
              <div className="stat-info">
                <div className="stat-value">{userStats.insightsGenerated}</div>
                <div className="stat-label">Insights Generated</div>
                <div className="stat-trend up">+12% this month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="stats-grid-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-content">
              <div className="stat-value">{userStats.questionsAsked}</div>
              <div className="stat-label">AI Sessions</div>
            </div>
            <div className="stat-trend up">+8%</div>
          </div>
          <div className="stat-item">
            <div className="stat-content">
              <div className="stat-value">{userStats.compatibilityChecks}</div>
              <div className="stat-label">Matches Made</div>
            </div>
            <div className="stat-trend up">+5%</div>
          </div>
          <div className="stat-item">
            <div className="stat-content">
              <div className="stat-value">98%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-trend up">+2%</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-subtitle">Fast access to your most used features</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button key={index} className={`quick-action-btn ${action.type}`}>
              <div className="action-icon-wrapper">
                <div className={`action-icon icon-${action.icon}`}></div>
              </div>
              <span className="action-text">{action.text}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Features */}
      <section className="features-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Astrological Tools</h2>
            <p className="section-subtitle">Explore all cosmic insights and features</p>
          </div>
          <Link to="/dashboard/tools" className="view-all-link">
            View All Tools →
          </Link>
        </div>
        <div className="features-grid main-features">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-header">
                <div className={`feature-icon ${feature.gradient}`}>
                  <div className={`icon-${feature.icon}`}></div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
              </div>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-actions">
                <Link to={feature.link} className="feature-button primary">
                  {feature.buttonText}
                </Link>
                <button className="feature-button secondary">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary Features & Activity Sidebar */}
      <div className="content-grid">
        {/* Secondary Features */}
        <section className="secondary-features-section">
          <h3 className="subsection-title">More Tools</h3>
          <div className="secondary-features-grid">
            {secondaryFeatures.map((feature, index) => (
              <div key={index} className="secondary-feature-card">
                <div className="feature-icon-wrapper">
                  <div className={`feature-icon small ${feature.gradient}`}>
                    <div className={`icon-${feature.icon}`}></div>
                  </div>
                  <div className="feature-content">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
                <Link to={feature.link} className="feature-button compact">
                  {feature.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity Sidebar */}
        <section className="activity-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Recent Activity</h3>
            <button className="text-button">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-indicator ${activity.color}`}></div>
                <div className="activity-content">
                  <div className="activity-main">
                    <div className={`activity-icon icon-${activity.icon}`}></div>
                    <p className="activity-text">{activity.text}</p>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Tips */}
          <div className="tips-section">
            <h4 className="tips-title">Pro Tip</h4>
            <p className="tips-content">
              Check your daily horoscope in the morning to align your activities with cosmic energies.
            </p>
          </div>
        </section>
      </div>

      {/* Logout Section */}
      <section className="logout-section">
        <div className="logout-container">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon"></span>
            <span className="logout-text">Sign Out</span>
          </button>
          <p className="logout-note">
            Secure logout from your Grahastra account
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;