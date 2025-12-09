import React, { useEffect, useRef } from "react";
import './Landing.css';
import { 
  Sparkles, 
  ArrowRight,
  Eye,
  Activity,
  Moon
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

          <div className="btn-group">
            <a href="/start" className="btn btn-mystic">
              Begin Analysis <ArrowRight size={16} style={{marginLeft: '8px'}}/>
            </a>
            <a href="#discover" className="btn btn-ghost">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="discover" className="grid-section">
        <div className="container">
          <div className="grid">
            
            {/* Card 1 */}
            <div className="card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
              <div className="card-icon"><Sparkles size={28} strokeWidth={1} /></div>
              <h3>The Hidden Self</h3>
              <p>
                Beneath your social mask lies a core frequency. We use advanced Jungian 
                analysis to separate who you are from who you were told to be.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.2s' }}>
              <div className="card-icon"><Moon size={28} strokeWidth={1} /></div>
              <h3>Cosmic Timing</h3>
              <p>
                The universe moves in cycles. We overlay your personal timeline with 
                planetary transits to predict your periods of high potential.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease 0.4s' }}>
              <div className="card-icon"><Activity size={28} strokeWidth={1} /></div>
              <h3>Pattern Recognition</h3>
              <p>
                Numerology isn't magic; it's mathematics. Discover the recurring numbers 
                that define your life path and destiny points.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-minimal">
        <div className="container fade-scroll" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <h2>The signals are waiting.</h2>
          <div style={{ marginTop: '2rem' }}>
            <a href="/start" className="btn btn-mystic">
              Unlock Your Profile
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>THIRD EYE SIGNALS &copy; {new Date().getFullYear()}</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.5 }}>
            Identity Architecture & Forecasting
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Landing;