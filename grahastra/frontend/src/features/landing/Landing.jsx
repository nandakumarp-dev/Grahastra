// Landing.jsx - Clean & Aligned
import React, { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const starsRef = useRef();

  useEffect(() => {
    // Simple star field
    const starsContainer = starsRef.current;
    const starCount = 150;

    starsContainer.innerHTML = '';

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random();
      let starClass = 'star--small';
      if (size > 0.7) starClass = 'star--large';
      else if (size > 0.4) starClass = 'star--medium';
      
      star.className = `star ${starClass}`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      starsContainer.appendChild(star);
    }

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .section__title, .section__subtitle, .step').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Background */}
      <div className="background-container"></div>
      <div className="cosmic-overlay"></div>
      <div ref={starsRef} className="stars-container"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title animate-fade-in">
              Discover Your Hidden Blueprint
            </h1>
            <p className="hero__subtitle animate-fade-in">
              AI-powered self-understanding through numerology, astrology, and character analysis
            </p>
            
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-number">50,000+</span>
                <span className="trust-label">Users</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">127+</span>
                <span className="trust-label">Data Points</span>
              </div>
              <div className="trust-item">
                <span className="trust-number">98%</span>
                <span className="trust-label">Accuracy</span>
              </div>
            </div>

            <div className="button-group">
              <Link to="/signup" className="button button--primary">
                Start Free Analysis
              </Link>
              {/* <Link to="/login" className="button button--secondary">
                Already a User? Login
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="section section--light">
        <div className="container container--narrow">
          <div className="section__header">
            <h2 className="section__title">Traditional self-help is generic. Astrology apps give vague predictions.</h2>
            <p className="section__subtitle">
              You're left with more questions than answers. What if you could understand exactly WHY you think and act the way you do?
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">How Grahastra Works</h2>
            <p className="section__subtitle">
              Simple three-step process to understanding your unique blueprint
            </p>
          </div>
          
          <div className="grid grid--3col">
            <div className="card step animate-fade-in">
              <div className="step__number">1</div>
              <div className="step__visual">
                <div className="form-mockup">
                  <div className="form-line"></div>
                  <div className="form-line short"></div>
                  <div className="form-line"></div>
                </div>
              </div>
              <h3 className="card__title">Input Your Data</h3>
              <p className="card__description">
                Share your birth details and personality insights. No birth time required.
              </p>
            </div>
            
            <div className="card step animate-fade-in">
              <div className="step__number">2</div>
              <div className="step__visual">
                <div className="ai-visualization">
                  <div className="data-point"></div>
                  <div className="data-point"></div>
                  <div className="data-point"></div>
                  <div className="connecting-line"></div>
                </div>
              </div>
              <h3 className="card__title">AI Analysis</h3>
              <p className="card__description">
                Our AI analyzes 127+ data points across numerology, astrology, and psychology.
              </p>
            </div>
            
            <div className="card step animate-fade-in">
              <div className="step__number">3</div>
              <div className="step__visual">
                <div className="insight-card-mockup">
                  <div className="insight-line"></div>
                  <div className="insight-line"></div>
                  <div className="insight-line short"></div>
                </div>
              </div>
              <h3 className="card__title">Get Insights</h3>
              <p className="card__description">
                Receive personalized guidance tailored to your unique patterns and potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">What You'll Discover</h2>
            <p className="section__subtitle">
              Uncover insights about yourself that transform how you approach life
            </p>
          </div>
          
          <div className="grid grid--2col">
            <div className="card animate-fade-in">
              <div className="benefit-icon">🎯</div>
              <h3 className="card__title">Life Purpose & Career</h3>
              <p className="card__description">
                Identify your natural talents and ideal career paths based on your unique blueprint.
              </p>
            </div>
            
            <div className="card animate-fade-in">
              <div className="benefit-icon">💞</div>
              <h3 className="card__title">Relationships</h3>
              <p className="card__description">
                Understand your communication style and build deeper, more meaningful connections.
              </p>
            </div>
            
            <div className="card animate-fade-in">
              <div className="benefit-icon">📈</div>
              <h3 className="card__title">Personal Growth</h3>
              <p className="card__description">
                Break through limiting patterns with AI-guided personal development plans.
              </p>
            </div>
            
            <div className="card animate-fade-in">
              <div className="benefit-icon">🧠</div>
              <h3 className="card__title">Mind & Behavior</h3>
              <p className="card__description">
                Discover why you think the way you do and optimize your decision-making process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Difference */}
      <section className="section">
        <div className="container container--narrow">
          <div className="section__header">
            <h2 className="section__title">Beyond Generic Horoscopes</h2>
            <p className="section__subtitle">
              Traditional astrology gives the same reading to millions. Grahastra creates truly personalized insights.
            </p>
          </div>
          
          <div className="comparison-grid">
            <div className="comparison-item traditional">
              <h4>Traditional Approach</h4>
              <ul>
                <li>Generic horoscopes for millions</li>
                <li>Vague predictions</li>
                <li>Static interpretations</li>
                <li>One-size-fits-all advice</li>
              </ul>
            </div>
            
            <div className="comparison-item grahastra">
              <h4>Grahastra AI</h4>
              <ul>
                <li>Personalized insights for you</li>
                <li>Data-driven pattern recognition</li>
                <li>Dynamic learning from feedback</li>
                <li>Actionable, specific guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Trusted by 50,000+ Users</h2>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card animate-fade-in">
              <div className="testimonial-content">
                "The AI accurately identified career patterns I hadn't noticed. The insights helped me transition into a role that perfectly matches my natural abilities."
              </div>
              <div className="testimonial-author">Sarah Chen, Product Manager</div>
            </div>
            
            <div className="testimonial-card animate-fade-in">
              <div className="testimonial-content">
                "As someone skeptical of traditional astrology, I appreciate the data-driven approach. The behavioral insights are remarkably accurate and practical."
              </div>
              <div className="testimonial-author">Michael Torres, Software Engineer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Choose Your Plan</h2>
            <p className="section__subtitle">
              Start with our free analysis and upgrade for deeper insights
            </p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card animate-fade-in">
              <div className="pricing-header">
                <h3>Free Analysis</h3>
                <div className="price">$0</div>
              </div>
              <ul className="features-list">
                <li>Basic numerology report</li>
                <li>Sun sign insights</li>
                <li>Personality overview</li>
                <li>3 daily insights</li>
              </ul>
              <Link to="/signup" className="button button--secondary">Start Free</Link>
            </div>
            
            <div className="pricing-card featured animate-fade-in">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Premium</h3>
                <div className="price">$19<span>/month</span></div>
              </div>
              <ul className="features-list">
                <li>Full astrological analysis</li>
                <li>Advanced numerology</li>
                <li>Relationship compatibility</li>
                <li>Career path recommendations</li>
                <li>Unlimited daily insights</li>
              </ul>
              <Link to="/signup" className="button button--primary">Start Premium</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta">
        <div className="container container--narrow">
          <div className="cta__content">
            <h2 className="cta__title animate-fade-in">Ready to Understand Your Operating System?</h2>
            <p className="cta__subtitle animate-fade-in">
              Join thousands of users discovering their unique blueprint with AI-powered insights
            </p>
            
            <div className="button-group">
              <Link to="/signup" className="button button--primary">
                Start Your Free Analysis
              </Link>
              <Link to="/login" className="button button--secondary">
                Already Registered? Login
              </Link>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
              30-second setup • No birth time required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;