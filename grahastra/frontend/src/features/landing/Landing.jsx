// Landing.jsx - Premium Astrology & Numerology App
import React, { useEffect, useRef } from "react";
import "./Landing.css";
import { Link } from 'react-router-dom';

function Landing() {
  const starsRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    // Premium star field implementation
    const starsContainer = starsRef.current;
    const starCount = window.innerWidth < 768 ? 200 : 400;

    starsContainer.innerHTML = '';

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      
      const size = Math.random();
      let starClass = 'star--small';
      if (size > 0.85) starClass = 'star--large';
      else if (size > 0.6) starClass = 'star--medium';
      
      star.className = `star ${starClass}`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 8}s`;
      star.style.opacity = Math.random() * 0.8 + 0.2;
      
      starsContainer.appendChild(star);
    }

    // Canvas animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: `hsl(${210 + Math.random() * 60}, 60%, ${70 + Math.random() * 20}%)`,
        opacity: Math.random() * 0.1 + 0.05
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${entry.target.dataset.delay || '0'}ms`;
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '100px'
    });

    document.querySelectorAll('.card, .section__title, .section__subtitle, .button, .feature-highlight').forEach((el, index) => {
      el.dataset.delay = index * 150;
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Premium Background System */}
      <div className="background-container"></div>
      <canvas ref={canvasRef} className="cosmic-overlay"></canvas>
      <div ref={starsRef} className="stars-container"></div>

      {/* Premium Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title animate-fade-in">
              GRAHASTRA
            </h1>
            <p className="hero__subtitle animate-fade-in">
              Discover Your Life's Blueprint Through Advanced Numerology & Astrology
            </p>
            <p className="hero__description animate-fade-in">
              Unlock profound insights about your personality, career path, and life purpose 
              with our AI-powered astrological analysis platform
            </p>
            <div className="button-group">
              <Link to="/signup" className="button button--primary">
                <span className="button__icon">→</span>
                Discover Your Chart
              </Link>
              <Link to="/demo" className="button button--secondary">
                <span className="button__icon">▶</span>
                See Sample Reading
              </Link>
            </div>
            <div className="scroll-indicator">
              <div className="scroll-arrow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Transform Your Self-Understanding</h2>
            <p className="section__subtitle lead-text">
              Our advanced analysis platform combines ancient wisdom with modern technology 
              to deliver life-changing insights
            </p>
          </div>
          <div className="grid grid--3col">
            <div className="card">
              <div className="card__icon">
                NP
              </div>
              <h3 className="card__title">Numerology Profile</h3>
              <p className="card__description body-text">
                Discover your Life Path Number, Destiny Number, and Personality Number 
                with detailed interpretations that reveal your core strengths and life purpose
              </p>
            </div>
            <div className="card">
              <div className="card__icon">
                BC
              </div>
              <h3 className="card__title">Birth Chart Analysis</h3>
              <p className="card__description body-text">
                Comprehensive astrological chart reading with planetary positions, 
                aspects, and houses interpreted for your unique birth data
              </p>
            </div>
            <div className="card">
              <div className="card__icon">
                CA
              </div>
              <h3 className="card__title">Career Analysis</h3>
              <p className="card__description body-text">
                Identify your ideal career path, workplace strengths, and professional 
                challenges based on your astrological and numerological profile
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="feature-highlights">
            <div className="feature-highlight">
              <div className="feature-highlight__icon">
                CP
              </div>
              <h4 className="feature-highlight__title">Character Profile</h4>
              <p className="feature-highlight__description">
                Deep personality analysis revealing your strengths, weaknesses, and hidden potentials
              </p>
            </div>
            <div className="feature-highlight">
              <div className="feature-highlight__icon">
                RA
              </div>
              <h4 className="feature-highlight__title">Relationship Analysis</h4>
              <p className="feature-highlight__description">
                Compatibility insights and relationship patterns based on astrological synastry
              </p>
            </div>
            <div className="feature-highlight">
              <div className="feature-highlight__icon">
                LP
              </div>
              <h4 className="feature-highlight__title">Life Purpose</h4>
              <p className="feature-highlight__description">
                Discover your soul's mission and the lessons you're here to learn in this lifetime
              </p>
            </div>
            <div className="feature-highlight">
              <div className="feature-highlight__icon">
                PY
              </div>
              <h4 className="feature-highlight__title">Personal Year</h4>
              <p className="feature-highlight__description">
                Annual forecasts and monthly guidance based on your personal numerology cycles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ background: 'rgba(30, 27, 75, 0.3)' }}>
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Your Journey to Self-Discovery</h2>
            <p className="section__subtitle lead-text">
              Get your personalized reading in three simple steps
            </p>
          </div>
          <div className="grid grid--3col">
            <div className="card">
              <div className="card__icon">
                1
              </div>
              <h3 className="card__title">Enter Your Birth Details</h3>
              <p className="card__description body-text">
                Provide your complete birth information including date, time, and location 
                for accurate chart calculations
              </p>
            </div>
            <div className="card">
              <div className="card__icon">
                2
              </div>
              <h3 className="card__title">Receive Instant Analysis</h3>
              <p className="card__description body-text">
                Our AI system processes your data and generates comprehensive numerological 
                and astrological reports
              </p>
            </div>
            <div className="card">
              <div className="card__icon">
                3
              </div>
              <h3 className="card__title">Explore Your Insights</h3>
              <p className="card__description body-text">
                Dive deep into personalized interpretations about your personality, 
                career, relationships, and life path
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Life-Changing Insights</h2>
            <p className="section__subtitle lead-text">
              Join thousands who have discovered profound clarity about their life's direction
            </p>
          </div>
          <div className="grid grid--2col">
            <div className="card">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  The career analysis revealed why I felt unfulfilled in my corporate job. 
                  I've since transitioned to teaching, which aligns perfectly with my Life Path Number 3.
                </p>
                <div className="testimonial__author">Michael Thompson</div>
                <div className="testimonial__position">Former Marketing Director</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
            <div className="card">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  Understanding my Birth Chart helped me recognize my natural leadership abilities. 
                  I've since started my own business and never been happier.
                </p>
                <div className="testimonial__author">Sarah Johnson</div>
                <div className="testimonial__position">Entrepreneur</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
            <div className="card">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  The relationship analysis explained patterns in my love life I couldn't understand. 
                  I'm now in a healthy, fulfilling relationship for the first time.
                </p>
                <div className="testimonial__author">David Chen</div>
                <div className="testimonial__position">Software Engineer</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
            <div className="card">
              <div className="testimonial__quote">"</div>
              <div className="testimonial__content">
                <p className="testimonial__text">
                  Discovering I'm a Life Path 7 explained my lifelong search for meaning. 
                  The insights have transformed my spiritual journey and personal growth.
                </p>
                <div className="testimonial__author">Maria Rodriguez</div>
                <div className="testimonial__position">Yoga Instructor</div>
                <div className="testimonial__rating">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta">
        <div className="container container--narrow">
          <div className="cta__content">
            <h2 className="cta__title">
              Ready to Discover Your True Potential?
            </h2>
            <p className="cta__subtitle">
              Join thousands who have used our insights to transform their careers, 
              relationships, and understanding of themselves
            </p>
            <Link to="/signup" className="button button--primary cta__button">
              <span className="button__icon">→</span>
              Get My Free Analysis
            </Link>
            <div className="cta__features">
              <div className="cta__feature">
                <span>✓</span>
                <span>Free basic numerology report</span>
              </div>
              <div className="cta__feature">
                <span>✓</span>
                <span>Personalized career insights</span>
              </div>
              <div className="cta__feature">
                <span>✓</span>
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;