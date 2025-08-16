// src/pages/dashboard/Home.jsx
import React from "react";

function Home() {
  const widgets = [
    { title: "🌟 AI Astrologer", desc: "Ask real-time questions and receive intuitive, AI-powered astrological guidance 24/7.", link: "/ask-astrology", btn: "Ask Now" },
    { title: "🪐 Birth Chart", desc: "Explore the cosmic blueprint of your soul. View planetary placements, ascendant, and house lords.", link: "/mychart", btn: "View Chart" },
    { title: "🔮 Yogas", desc: "Discover rare and powerful yogas influencing your personality, success, and destiny path.", link: "/yogas", btn: "Analyze Yogas" },
    { title: "📆 Dasha Timeline", desc: "View major & minor planetary periods (Mahadasha, Antardasha) with interpretations and timelines.", link: "#", btn: "Check Dasha" },
    { title: "🧘‍♂️ My Profile", desc: "Update your details, manage preferences, and personalize your spiritual dashboard experience.", link: "/profile", btn: "Edit Profile" },
    { title: "📬 Contact Support", desc: "Need help? Get in touch with our support team or astrological experts for fast resolution.", link: "/contact", btn: "Get Help" },
    { title: "💎 Upgrade", desc: "Unlock full astrological power, exclusive features, and lifetime access options.", link: "/upgrade", btn: "Upgrade Now" }
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
              <a href={widget.link} className="btn btn-glow mt-auto">{widget.btn}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
