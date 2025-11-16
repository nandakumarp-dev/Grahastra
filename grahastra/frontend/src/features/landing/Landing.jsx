// Landing.jsx - Professional Redesign
import React, { useEffect, useRef } from "react";
import "./Landing.css";
import { Link } from 'react-router-dom';

function Landing() {
  const starsRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    // Professional star field implementation
    const starsContainer = starsRef.current;
    const starCount = window.innerWidth < 768 ? 100 : 250;

    // Clear existing stars
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

    // Canvas background animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Subtle particle system for professional look
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: `hsl(${200 + Math.random() * 60}, 60%, ${60 + Math.random() * 20}%)`,
        opacity: Math.random() * 0.1 + 0.05
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check with smooth wrapping
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe all animatable elements
    document.querySelectorAll('.card, .section__title, .section__subtitle, .button').forEach(el => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Professional Background System */}
      <div className="background-container"></div>
      <canvas ref={canvasRef} className="cosmic-overlay"></canvas>
      <div ref={starsRef} className="stars-container"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title animate-fade-in">
              GRAHASTRA
            </h1>
            <p className="hero__subtitle animate-fade-in">
              AI-Powered Vedic Astrology & Numerology Platform
              <br />
              <span style={{ fontSize: '1rem', opacity: 0.8 }}>
                Discover your cosmic blueprint with cutting-edge technology
              </span>
            </p>
            <div className="button-group">
              <Link to="/signup" className="button button--primary">
                <span className="button__icon">✨</span>
                Start Free Journey
              </Link>
              <Link to="/demo" className="button button--secondary">
                <span className="button__icon">🔍</span>
                View Demo
              </Link>
            </div>
            <div className="scroll-indicator">
              <div className="scroll-arrow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title animate-fade-in">Advanced Features</h2>
            <p className="section__subtitle animate-fade-in">
              Harness the power of artificial intelligence with ancient Vedic wisdom
            </p>
          </div>
          <div className="grid grid--3col">
            <div className="card animate-fade-in">
              <div className="card__icon">
                <span>✨</span>
              </div>
              <h3 className="card__title">AI Insights</h3>
              <p className="card__description">
                Real-time answers to life questions powered by advanced machine learning algorithms
              </p>
            </div>
            <div className="card animate-fade-in">
              <div className="card__icon">
                <span>🌌</span>
              </div>
              <h3 className="card__title">Birth Chart Analysis</h3>
              <p className="card__description">
                Precise planetary positions with NASA-grade astronomical data accuracy
              </p>
            </div>
            <div className="card animate-fade-in">
              <div className="card__icon">
                <span>🔢</span>
              </div>
              <h3 className="card__title">Numerology</h3>
              <p className="card__description">
                Comprehensive life path analysis and destiny pattern recognition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Alternative */}
<section className="section" style={{ background: 'rgba(30, 27, 75, 0.3)' }}>
  <div className="container">
    <div className="section__header">
      <h2 className="section__title animate-fade-in">How It Works</h2>
      <p className="section__subtitle animate-fade-in">
        Simple three-step process to cosmic clarity
      </p>
    </div>
    <div className="steps-simple">
      <div className="grid grid--3col">
        <div className="card step animate-fade-in">
          <div className="step__number">1</div>
          <h3 className="card__title">Enter Details</h3>
          <p className="card__description">
            Provide your birth date, time, and location for precise calculations
          </p>
          <div className="card__icon">
            <span>📅</span>
          </div>
        </div>
        <div className="card step animate-fade-in">
          <div className="step__number">2</div>
          <h3 className="card__title">Ask Questions</h3>
          <p className="card__description">
            Inquire about career, relationships, health, or spiritual growth
          </p>
          <div className="card__icon">
            <span>💭</span>
          </div>
        </div>
        <div className="card step animate-fade-in">
          <div className="step__number">3</div>
          <h3 className="card__title">Receive Insights</h3>
          <p className="card__description">
            Get AI-powered astrological guidance in seconds
          </p>
          <div className="card__icon">
            <span>🌟</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title animate-fade-in">User Testimonials</h2>
            <p className="section__subtitle animate-fade-in">
              Join thousands of satisfied users worldwide
            </p>
          </div>
          <div className="grid grid--2col">
            <div className="card animate-fade-in">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  The AI accurately predicted my career transition months in advance. 
                  The insights were incredibly precise and helpful for planning.
                </p>
                <div className="testimonial__author">— Priya, Mumbai</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
            <div className="card animate-fade-in">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  As a business owner, the numerology insights transformed my 
                  decision-making process. Highly recommended for professionals.
                </p>
                <div className="testimonial__author">— Alex, New York</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
            <div className="card animate-fade-in">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  The relationship analysis was remarkably accurate. It provided 
                  clarity I hadn't found through traditional counseling.
                </p>
                <div className="testimonial__author">— Maria, London</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
            <div className="card animate-fade-in">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  The combination of Vedic wisdom and modern technology is 
                  revolutionary. The insights have been life-changing.
                </p>
                <div className="testimonial__author">— Raj, Dubai</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta">
        <div className="container container--narrow">
          <div className="cta__content">
            <h2 className="cta__title animate-fade-in">
              Begin Your Cosmic Journey
            </h2>
            <p className="cta__subtitle animate-fade-in">
              Discover your unique astrological blueprint with our AI-powered platform
            </p>
            <Link to="/signup" className="button button--primary cta__button">
              <span className="button__icon">🚀</span>
              Start Free Trial
            </Link>
            <p className="cta__note">
              ✨ 7-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;