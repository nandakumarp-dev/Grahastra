// src/pages/dashboard/Home.jsx
import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link

function Home() {
  const widgets = [
    {
      title: "🌟 AI Astrologer",
      desc: "Ask real-time questions and receive intuitive, AI-powered astrological guidance 24/7.",
      link: "/dashboard/ask-astrology",
      btn: "Ask Now",
    },
    {
      title: "🪐 Birth Chart",
      desc: "Explore the cosmic blueprint of your soul. View planetary placements, ascendant, and house lords.",
      link: "/dashboard/mychart",
      btn: "View Chart",
    },
    {
      title: "📆 Numerology Chart",
      desc: "View major & minor planetary periods (Mahadasha, Antardasha) with interpretations and timelines.",
      link: "/dashboard/contact",
      btn: "Check Dasha",
    },
    {
      title: "📬 Contact Support",
      desc: "Need help? Get in touch with our support team or astrological experts for fast resolution.",
      link: "/dashboard/contact", // ✅ corrected route
      btn: "Get Help",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="dashboard-title">Your Celestial Command Center ✨</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {widgets.map((widget, i) => (
          <div className="col d-flex" key={i}>
            <div className="widget w-100">
              <h5 className="widget-title">{widget.title}</h5>
              <p>{widget.desc}</p>

              {/* If link is valid, render Link; otherwise disabled button */}
              {widget.link !== "#" ? (
                <Link to={widget.link} className="btn btn-glow mt-auto">
                  {widget.btn}
                </Link>
              ) : (
                <button className="btn btn-glow mt-auto" disabled>
                  {widget.btn}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
