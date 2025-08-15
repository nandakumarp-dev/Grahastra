import React, { useEffect } from "react";
import "./css/Landing.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from 'react-router-dom';


function Landing() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      {/* HEADER / HERO SECTION */}
      <header className="text-center hero-with-stars">
        <h1 className="logo-glow mb-3">Grahastra</h1>
        <p className="lead mb-4">
          Not just predictions — cosmic clarity.
          <br /> Ask your stars. Understand your story.
        </p>
        <div className="text-center">
          <Link to="/login" className="cta-btn mt-3">Ask the Stars</Link>
        </div>
      </header>

      {/* WHY GRAHASTRA */}
      <section className="container" id="why">
        <h2 className="section-title">Why Choose Grahastra?</h2>
        <div className="row row-cols-1 row-cols-md-4 g-4">
          <div className="col" data-aos="fade-up">
            <div className="card text-center">
              <h5>🌠 Instant Answers</h5>
              <p>
                Real-time astrological insights powered by AI trained in ancient
                Jyotisha.
              </p>
            </div>
          </div>
          <div className="col" data-aos="fade-up" data-aos-delay="100">
            <div className="card text-center">
              <h5>🔭 Cosmic Precision</h5>
              <p>
                Accurate birth charts powered by NASA ephemeris data and Vedic
                principles.
              </p>
            </div>
          </div>
          <div className="col" data-aos="fade-up" data-aos-delay="200">
            <div className="card text-center">
              <h5>🔐 Total Privacy</h5>
              <p>
                Your questions and data are encrypted, sacred, and never shared.
              </p>
            </div>
          </div>
          <div className="col" data-aos="fade-up" data-aos-delay="300">
            <div className="card text-center">
              <h5>🧠 Ancient + AI</h5>
              <p>
                We blend 5000 years of Vedic wisdom with cutting-edge AI for
                unmatched clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container" id="how">
        <h2 className="section-title">How It Works</h2>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col" data-aos="fade-right">
            <div className="card text-center">
              <h4>💬 Ask Anything</h4>
              <p>
                Submit your birth details and ask any life question — love,
                career, karma, or health.
              </p>
            </div>
          </div>
          <div className="col" data-aos="fade-left">
            <div className="card text-center">
              <h4>🔮 AI Vedic Insights</h4>
              <p>
                We calculate your chart and apply astrological rules using
                intelligent models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container" id="testimonials">
        <h2 className="section-title">What Users Say</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col" data-aos="zoom-in">
            <div className="card text-center">
              <p>
                “Grahastra gave me clarity in minutes. The insights were eerily
                accurate.”
              </p>
              <p className="text-info fw-semibold">– Aditi, Mumbai</p>
            </div>
          </div>
          <div className="col" data-aos="zoom-in" data-aos-delay="100">
            <div className="card text-center">
              <p>
                “The Yogas section explained things no astrologer told me
                before!”
              </p>
              <p className="text-info fw-semibold">– Rahul, Kochi</p>
            </div>
          </div>
          <div className="col" data-aos="zoom-in" data-aos-delay="200">
            <div className="card text-center">
              <p>
                “Absolutely love the design and instant answers. I'm hooked!”
              </p>
              <p className="text-info fw-semibold">– Priya, Bangalore</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO CHAT */}
      <section className="container" id="demo">
        <h2 className="section-title">Interactive Experience</h2>
        <div className="interactive-box" data-aos="fade-up">
          <p className="lead">
            Try asking: <em>"Will I become successful in life?"</em>
          </p>
          <Link to="/signup" className="btn btn-purple mt-5">Try a Demo Chat →</Link>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="container text-center" id="join">
        <h2 className="section-title">Begin Your Journey</h2>
        <p className="lead">
          Your stars await. Create your account and start decoding your destiny.
        </p>
        <div className="text-center">
          <Link to="/signup" className="cta-btn btn-lg mt-5"> JOIN US →</Link>
        </div>
      </section>
    </>
  );
}

export default Landing;
