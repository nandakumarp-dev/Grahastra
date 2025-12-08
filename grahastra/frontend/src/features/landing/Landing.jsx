import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Landing.css';
import { ChevronRight, Check, Star, Menu, X, BarChart3, Cpu, User, Target, Shield, Globe, FlaskConical } from 'lucide-react';

function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "The personalized analysis based on my personality type gave me clear, actionable steps for career growth that traditional tests missed.",
      name: "Alex Johnson",
      role: "Marketing Director, Berlin",
      location: "Germany"
    },
    {
      quote: "Grahastra's scientific approach to self-discovery is exactly what I was looking for. It combines data with deep psychological understanding.",
      name: "Priya Sharma",
      role: "Data Scientist, Bangalore",
      location: "India"
    },
    {
      quote: "The platform's ability to provide globally relevant insights while still respecting cultural context is a major advantage.",
      name: "Kenji Tanaka",
      role: "UX Designer, Tokyo",
      location: "Japan"
    }
  ];

  const features = [
    {
      icon: <FlaskConical size={24} />,
      title: "Science-Backed Core",
      description: "Our core analysis uses validated psychological models (like MBTI) as a foundation for all deeper insights."
    },
    {
      icon: <Globe size={24} />,
      title: "Culturally Aware",
      description: "Get insights that are not only globally accurate but also adapted to your regional and cultural context."
    },
    {
      icon: <Shield size={24} />,
      title: "Data Privacy First",
      description: "Your data is secured with enterprise-grade encryption. We never share, sell, or compromise your personal information."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Actionable Reports",
      description: "Receive clear, simplified reports with practical recommendations for career matches and personal development."
    }
  ];

  const faqs = [
    {
      question: "Is the analysis purely scientific?",
      answer: "Our *Core Personality Analysis* is based on established psychological models. Deeper insights like Numerology and Astrology are offered as *optional expansions* for those seeking a richer perspective."
    },
    {
      question: "How long does the initial assessment take?",
      answer: "The core personality assessment typically takes about 10-15 minutes. There are no right or wrong answers—just answer honestly to get the most accurate profile."
    },
    {
      question: "How do you handle cultural differences?",
      answer: "Our AI analysis engine incorporates cultural intelligence to ensure that personality traits and behavioral patterns are interpreted with respect to regional norms."
    },
    {
      question: "What is the MVP concept for this project?",
      answer: "The Minimum Viable Product focuses on delivering a world-class, scientifically-backed Personality Analysis (Step 1). Other modules (Numerology, Astrology) are planned for later expansion."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <Link to="/" className="logo">
              <span className="logo__icon"><BarChart3 size={26} /></span>
              <span>Grahastra</span>
            </Link>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <nav className={`nav ${isMobileMenuOpen ? 'nav--mobile' : ''}`}>
              <Link to="/features" className="nav__link">Features</Link>
              <Link to="/science" className="nav__link">Science</Link>
              <Link to="/enterprise" className="nav__link">Enterprise</Link>
              <Link to="/blog" className="nav__link">Blog</Link>
              <Link to="/signup" className="nav__cta">Discover Your Type</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="badge">
              <Star size={16} />
              Know your blueprint.
            </div>
            
            <h1 className="hero__title">
              Your Personality, <span style={{ whiteSpace: 'nowrap' }}>Decoded.</span>
            </h1>
            
            <p className="hero__subtitle">
              Grahastra uses validated personality psychology and data science to provide simple, 
              actionable insights about who you are and unlock your potential.
            </p>
            
            <div className="button-group">
              <Link to="/assessment" className="button button--primary">
                Start Free Core Analysis <ChevronRight size={20} />
              </Link>
              <Link to="/demo" className="button button--secondary">
                Learn More
              </Link>
            </div>
            
            <div className="trust-metrics">
              <div className="metric">
                <div className="metric__value">50K+</div>
                <div className="metric__label">Global Users</div>
              </div>
              <div className="metric">
                <div className="metric__value">127</div>
                <div className="metric__label">Dimensions Analyzed</div>
              </div>
              <div className="metric">
                <div className="metric__value">96%</div>
                <div className="metric__label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">The Grahastra Foundation</h2>
            <p className="section__subtitle">
              A modern approach built on credibility, data, and cultural intelligence.
            </p>
          </div>
          
          <div className="grid grid--2col">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="card__icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p style={{ marginTop: '1rem', color: 'var(--color-light-text)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (MVP Flow) */}
      <section className="section" style={{ background: 'var(--color-surface-card)' }}>
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Simple Three-Step Discovery</h2>
            <p className="section__subtitle">
              Get your comprehensive profile in three easy steps.
            </p>
          </div>
          
          <div className="grid grid--3col">
            <div className="card">
              <div className="card__icon"><User size={24} /></div>
              <h3>1. Take the Core Assessment</h3>
              <p style={{ marginTop: '1rem', color: 'var(--color-light-text)' }}>
                Complete our scientifically-backed personality test to establish your unique profile base.
              </p>
            </div>
            
            <div className="card">
              <div className="card__icon"><Cpu size={24} /></div>
              <h3>2. AI-Powered Analysis</h3>
              <p style={{ marginTop: '1rem', color: 'var(--color-light-text)' }}>
                Our proprietary algorithms process your responses to accurately map your core traits and cognitive functions.
              </p>
            </div>
            
            <div className="card">
              <div className="card__icon"><Target size={24} /></div>
              <h3>3. Get Personalized Insights</h3>
              <p style={{ marginTop: '1rem', color: 'var(--color-light-text)' }}>
                Receive clear, personalized reports with practical recommendations for career and personal growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Testimonials */}
      <section className="section">
        <div className="container container--narrow">
          <div className="section__header">
            <h2 className="section__title">Trusted Worldwide</h2>
          </div>
          
          <div className="testimonial-carousel">
            <div className="testimonial-card">
              <div className="testimonial__quote">
                "{testimonials[activeTestimonial].quote}"
              </div>
              <div className="testimonial__author">
                <div className="author__avatar"></div>
                <div className="author__info">
                  <div className="author__name">{testimonials[activeTestimonial].name}</div>
                  <div className="author__role">{testimonials[activeTestimonial].role}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-muted-text)' }}>
                    {testimonials[activeTestimonial].location}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`testimonial-dot ${index === activeTestimonial ? 'testimonial-dot--active' : ''}`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing (Reflects MVP focus) */}
      <section className="section" style={{ background: 'var(--color-surface-card)' }}>
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Unlock Your Full Potential</h2>
            <p className="section__subtitle">
              Choose the plan that fits your journey to deeper self-understanding.
            </p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing__header">
                <h3 className="pricing__title">Basic</h3>
                <div className="pricing__amount">$0</div>
                <div className="pricing__period">Forever free</div>
              </div>
              
              <ul className="pricing__features">
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Core Personality Type Result</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Key Strengths and Weaknesses</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Essential Growth Tips</li>
              </ul>
              
              <Link to="/signup" className="button button--secondary" style={{ width: '100%' }}>
                Start Free Analysis
              </Link>
            </div>
            
            <div className="pricing-card pricing-card--featured">
              <div className="pricing__header">
                <h3 className="pricing__title">Premium</h3>
                <div className="pricing__amount">$19</div>
                <div className="pricing__period">per month</div>
              </div>
              
              <ul className="pricing__features">
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Everything in Basic</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Full Career & Relationship Reports</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> **Expanded Numerology Insights** (Phase 2 Teaser)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> **Astrology Correlation Modules** (Phase 3 Teaser)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Priority Support & Future Updates</li>
              </ul>
              
              <Link to="/signup" className="button button--primary" style={{ width: '100%' }}>
                Start Premium Trial
              </Link>
            </div>
            
            <div className="pricing-card">
              <div className="pricing__header">
                <h3 className="pricing__title">Enterprise</h3>
                <div className="pricing__amount">Custom</div>
                <div className="pricing__period">tailored for teams</div>
              </div>
              
              <ul className="pricing__features">
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Everything in Premium</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Team Analytics Dashboard</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Custom Assessment Modules</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Dedicated Account Manager</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> API Access & Integration</li>
              </ul>
              
              <Link to="/enterprise" className="button button--secondary" style={{ width: '100%' }}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container container--narrow">
          <div className="section__header">
            <h2 className="section__title">Frequently Asked Questions</h2>
          </div>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section final-cta-section">
        <div className="container container--narrow" style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            marginBottom: '1rem',
            color: 'white',
            fontWeight: '800'
          }}>
            Ready to Discover Your Blueprint?
          </h2>
          
          <p style={{ 
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2.5rem'
          }}>
            Start your free, science-backed personality analysis today.
          </p>
          
          <div className="button-group" style={{ justifyContent: 'center' }}>
            <Link to="/signup" className="button button--primary">
              Start Your Free Analysis
            </Link>
          </div>
          
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.875rem',
            marginTop: '2rem'
          }}>
            No credit card required • Secure & Private • Instant Access
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__column">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Grahastra</h3>
              <p style={{ color: '#94A3B8', lineHeight: '1.6', marginTop: '1rem' }}>
                Advanced personality analysis through the synthesis of psychology, data science, and cultural intelligence.
              </p>
            </div>
            
            <div className="footer__column">
              <h3>Product</h3>
              <ul className="footer__links">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/api">API</Link></li>
                <li><Link to="/documentation">Documentation</Link></li>
              </ul>
            </div>
            
            <div className="footer__column">
              <h3>Company</h3>
              <ul className="footer__links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/press">Press</Link></li>
              </ul>
            </div>
            
            <div className="footer__column">
              <h3>Legal</h3>
              <ul className="footer__links">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
                <li><Link to="/gdpr">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer__bottom">
            <p>© {new Date().getFullYear()} Grahastra. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem' }}>
              Driven by Data. Built for Clarity.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Landing;