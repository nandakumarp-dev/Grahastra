// source src/landing/landing.jsx 
import React, { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import './Landing.css';
import { 
  Sparkles, 
  ArrowRight,
  Eye,
  Activity,
  Moon,
  Star,
  Target,
  Zap,
  Users,
  BarChart3,
  Globe,
  Shield,
  Clock
} from 'lucide-react';

function Landing() {
  // Intersection Observer for fade-in animations on scroll
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.fade-scroll');
    hiddenElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <div className="app-wrapper">
      
      {/* Ambient Background Lights */}
      <div className="ambient-light top-left"></div>
      <div className="ambient-light bottom-right"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-symbol">
            <Eye size={48} strokeWidth={1} />
          </div>
          
          <h1 className="hero-title text-gradient">
            See What Others <br /> Cannot See.
          </h1>
          
          <p className="hero-subtitle">
            Your personality is not random. It is a calculated architecture 
            of stardust, numbers, and psychological archetypes. 
            Are you ready to view the blueprint?
          </p>

          <div className="stats-preview">
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Profiles Analyzed</span>
            </div>
            <div className="stat">
              <span className="stat-number">98.7%</span>
              <span className="stat-label">Accuracy Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">27</span>
              <span className="stat-label">Archetypes</span>
            </div>
          </div>

          <div className="btn-group">
            <Link to="/signup" className="btn btn-mystic">
              Begin Analysis <ArrowRight size={16} className="ml-2" style={{marginLeft: '8px'}}/>
            </Link>
            <a href="#discover" className="btn btn-ghost">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="discover" className="grid-section">
        <div className="container">
          <div className="section-header fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
            <h2>The Architecture of Identity</h2>
            <p className="section-subtitle">
              We decode the hidden patterns that shape your destiny through three interconnected lenses
            </p>
          </div>
          
          <div className="grid">
            
            {/* Card 1 */}
            <div className="card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
              <div className="card-icon"><Sparkles size={28} strokeWidth={1} /></div>
              <h3>The Hidden Self</h3>
              <p>
                Beneath your social mask lies a core frequency. We use advanced Jungian 
                analysis to separate who you are from who you were told to be.
              </p>
              <div className="card-tags">
                <span>Jungian Psychology</span>
                <span>Shadow Work</span>
                <span>Core Frequency</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.2s' }}>
              <div className="card-icon"><Moon size={28} strokeWidth={1} /></div>
              <h3>Cosmic Timing</h3>
              <p>
                The universe moves in cycles. We overlay your personal timeline with 
                planetary transits to predict your periods of high potential.
              </p>
              <div className="card-tags">
                <span>Planetary Transits</span>
                <span>Cyclical Patterns</span>
                <span>Optimal Timing</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.4s' }}>
              <div className="card-icon"><Activity size={28} strokeWidth={1} /></div>
              <h3>Pattern Recognition</h3>
              <p>
                Numerology isn't magic; it's mathematics. Discover the recurring numbers 
                that define your life path and destiny points.
              </p>
              <div className="card-tags">
                <span>Sacred Geometry</span>
                <span>Life Path Numbers</span>
                <span>Destiny Points</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="process-section">
        <div className="container">
          <div className="section-header fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
            <h2>The Decoding Process</h2>
            <p className="section-subtitle">
              A precise methodology for uncovering your hidden architecture
            </p>
          </div>
          
          <div className="timeline">
            <div className="timeline-step fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
              <div className="step-icon"><Target size={24} /></div>
              <div className="step-content">
                <h3>Data Collection</h3>
                <p>Submit your birth details and complete our psychological assessment. We analyze 47 distinct data points.</p>
              </div>
            </div>
            
            <div className="timeline-step fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.2s' }}>
              <div className="step-icon"><BarChart3 size={24} /></div>
              <div className="step-content">
                <h3>Pattern Analysis</h3>
                <p>Our algorithms cross-reference psychological, numerological, and astrological data to identify core patterns.</p>
              </div>
            </div>
            
            <div className="timeline-step fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.4s' }}>
              <div className="step-icon"><Globe size={24} /></div>
              <div className="step-content">
                <h3>Cosmic Alignment</h3>
                <p>We map your patterns against current and future planetary cycles to identify optimal timing.</p>
              </div>
            </div>
            
            <div className="timeline-step fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.6s' }}>
              <div className="step-icon"><Shield size={24} /></div>
              <div className="step-content">
                <h3>Report Generation</h3>
                <p>Receive your personalized 50+ page report with actionable insights and future projections.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Preview */}
      <section className="testimonial-section">
        <div className="container">
          <div className="section-header fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
            <h2>Voices from the Current</h2>
            <p className="section-subtitle">
              What others discovered about their hidden architecture
            </p>
          </div>
          
          <div className="testimonial-grid">
            <div className="testimonial-card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
              <div className="testimonial-content">
                "The timing predictions were unnervingly accurate. I launched my business during my identified 'expansion window' and tripled my revenue."
              </div>
              <div className="testimonial-author">
                <div className="author-name">Alex R.</div>
                <div className="author-title">Entrepreneur</div>
              </div>
            </div>
            
            <div className="testimonial-card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.2s' }}>
              <div className="testimonial-content">
                "Understanding my shadow archetypes transformed my relationships. I finally see the patterns I was repeating."
              </div>
              <div className="testimonial-author">
                <div className="author-name">Maya S.</div>
                <div className="author-title">Therapist</div>
              </div>
            </div>
            
            <div className="testimonial-card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.4s' }}>
              <div className="testimonial-content">
                "The life path number analysis revealed career directions I'd never considered. I'm now in my ideal vocation."
              </div>
              <div className="testimonial-author">
                <div className="author-name">David K.</div>
                <div className="author-title">Software Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-minimal">
        <div className="container fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div className="cta-icon"><Clock size={48} /></div>
          <h2>The signals are waiting.</h2>
          <p className="cta-subtitle">
            Your optimal timing window begins in 3 days. Begin your analysis now to align with upcoming cosmic cycles.
          </p>
          <div className="btn-group">
            <Link to="/signup" className="btn btn-mystic">
              Unlock Your Profile
            </Link>
            <a href="#discover" className="btn btn-ghost">
              View Sample Report
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-symbol"><Eye size={24} /></div>
              <div className="footer-title">THIRD EYE SIGNALS</div>
              <p className="footer-tagline">Identity Architecture & Forecasting</p>
            </div>
            
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Protocol</a>
              <a href="#" className="footer-link">Research Methodology</a>
              <a href="#" className="footer-link">Academic Partners</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Third Eye Signals. All insights encrypted and confidential.</p>
            <p style={{ marginTop: '0.5rem', opacity: 0.5, fontSize: '0.75rem' }}>
              For educational and personal growth purposes only.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;