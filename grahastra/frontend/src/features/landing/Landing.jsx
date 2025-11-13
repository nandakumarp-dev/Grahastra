// Landing.jsx
import React, { useEffect, useRef } from "react";
import "./Landing.css";
import { Link } from 'react-router-dom';

function Landing() {
  const starsRef = useRef();
  const cosmicCanvasRef = useRef();

  useEffect(() => {
    // Enhanced floating stars with constellations
    const stars = starsRef.current;
    const starCount = window.innerWidth < 768 ? 80 : 200;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const size = Math.random() * 4;
      const duration = 3 + Math.random() * 4;
      const brightness = 0.3 + Math.random() * 0.7;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = brightness;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.animationDelay = `${Math.random() * 8}s`;
      
      // Add twinkle effect
      if (Math.random() > 0.7) {
        star.classList.add('twinkle-star');
      }
      
      stars.appendChild(star);
    }

    // Cosmic canvas animation
    const canvas = cosmicCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Nebula particles
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `hsl(${Math.random() * 60 + 200}, 70%, ${50 + Math.random() * 30}%)`,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();

    // Enhanced Intersection Observer with parallax
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          entry.target.classList.add('animate-in');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.feature-card, .testimonial-card, .section-title, .cosmic-btn').forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });

    // Mobile touch effects
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const stars = document.querySelectorAll('.star');
      stars.forEach((star, index) => {
        const speed = (index % 3) * 0.5;
        star.style.transform = `translate(${(touch.clientX - window.innerWidth/2) * speed}px, ${(touch.clientY - window.innerHeight/2) * speed}px)`;
      });
    };

    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      {/* Enhanced Cosmic Background */}
      <canvas ref={cosmicCanvasRef} className="cosmic-canvas"></canvas>
      <div className="cosmic-bg"></div>
      <div ref={starsRef} className="stars"></div>
      
      {/* Animated Nebula Orbs */}
      <div className="nebula-orb orb-1"></div>
      <div className="nebula-orb orb-2"></div>
      <div className="nebula-orb orb-3"></div>

      {/* Floating Planets with Rings */}
      <div className="planet-system system-1">
        <div className="planet planet-with-ring"></div>
        <div className="planet-ring"></div>
      </div>
      <div className="planet-system system-2">
        <div className="planet gas-giant"></div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="cosmic-gate"></div>
        <div className="hero-content">
          <div className="title-container">
            <h1 className="main-title cosmic-glow">GRAHASTRA</h1>
            <div className="title-underline"></div>
          </div>
          <p className="tagline cosmic-subtitle">
            Where Stars Speak Your Truth
            <span className="subtitle-line">AI-Powered Vedic Astrology & Numerology</span>
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cosmic-btn primary-glow">
              <span className="btn-icon">🌌</span>
              Start Free Journey
            </Link>
            <Link to="/demo" className="cosmic-btn secondary-glow">
              <span className="btn-icon">🔮</span>
              Live Demo
            </Link>
          </div>
          <div className="scroll-indicator">
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title cosmic-text">Cosmic Superpowers</h2>
          <p className="section-subtitle">Harness the power of ancient wisdom with cutting-edge AI technology</p>
        </div>
        <div className="features-grid">
          <div className="feature-card cosmic-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon cosmic-icon">✨</span>
              <div className="icon-glow"></div>
            </div>
            <h3>Instant AI Insights</h3>
            <p>Get real-time answers to your life questions powered by ancient Vedic wisdom</p>
            <div className="feature-underline"></div>
          </div>
          <div className="feature-card cosmic-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon cosmic-icon">🌌</span>
              <div className="icon-glow"></div>
            </div>
            <h3>Birth Chart Magic</h3>
            <p>Precise planetary positions with NASA data accuracy</p>
            <div className="feature-underline"></div>
          </div>
          <div className="feature-card cosmic-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon cosmic-icon">🔢</span>
              <div className="icon-glow"></div>
            </div>
            <h3>Numerology Secrets</h3>
            <p>Discover your life path number and destiny patterns</p>
            <div className="feature-underline"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section cosmic-section">
        <div className="section-header">
          <h2 className="section-title cosmic-text">3 Steps to Cosmic Clarity</h2>
          <p className="section-subtitle">Your journey to self-discovery starts here</p>
        </div>
        <div className="steps-container">
          <div className="step-line"></div>
          <div className="features-grid">
            <div className="feature-card step-card">
              <div className="step-number">1</div>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📅</span>
                <div className="icon-glow"></div>
              </div>
              <h3>Enter Birth Details</h3>
              <p>Share your birth date, time, and place</p>
            </div>
            <div className="feature-card step-card">
              <div className="step-number">2</div>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">💭</span>
                <div className="icon-glow"></div>
              </div>
              <h3>Ask Anything</h3>
              <p>Career, love, health, or spiritual growth</p>
            </div>
            <div className="feature-card step-card">
              <div className="step-number">3</div>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🌟</span>
                <div className="icon-glow"></div>
              </div>
              <h3>Receive Wisdom</h3>
              <p>AI-powered insights in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title cosmic-text">Stellar Reviews</h2>
          <p className="section-subtitle">Join thousands of cosmic explorers</p>
        </div>
        <div className="testimonial-grid">
          <div className="testimonial-card cosmic-card">
            <div className="testimonial-quote">"</div>
            <p>The AI predicted my job change 2 months before it happened! Mind-blowing accuracy!</p>
            <div className="testimonial-author">
              <strong>— Priya, Mumbai</strong>
            </div>
            <div className="rating-stars">★★★★★</div>
          </div>
          <div className="testimonial-card cosmic-card">
            <div className="testimonial-quote">"</div>
            <p>Finally, astrology that makes sense! The numerology insights transformed my business decisions.</p>
            <div className="testimonial-author">
              <strong>— Alex, New York</strong>
            </div>
            <div className="rating-stars">★★★★★</div>
          </div>
          <div className="testimonial-card cosmic-card">
            <div className="testimonial-quote">"</div>
            <p>As a skeptic, I was shocked by how accurate the relationship analysis was. Game-changer!</p>
            <div className="testimonial-author">
              <strong>— Maria, London</strong>
            </div>
            <div className="rating-stars">★★★★★</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-content">
          <h2 className="glow-text cosmic-glow">Ready to Meet Your Stars?</h2>
          <p className="cta-subtitle">
            Join thousands discovering their cosmic blueprint
          </p>
          <Link to="/signup" className="cosmic-btn cta-glow">
            <span className="btn-icon">🚀</span>
            Launch My Journey
          </Link>
          <p className="cta-note">
            ✨ Free 7-day trial • No credit card needed
          </p>
        </div>
      </section>
    </>
  );
}

export default Landing;