import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BirthChart.module.css";

function BirthChart() {
  const [chartData, setChartData] = useState(null);
  const [user, setUser] = useState(null);
  const [bhavaChart, setBhavaChart] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/mychart/", { withCredentials: true })
      .then((res) => {
        // response structure matches your DRF serializer view
        setUser(res.data.user);
        setChartData(res.data.chart);
        setBhavaChart(res.data.chart.Bhava);
      })
      .catch((err) => {
        console.error("Error fetching chart:", err);
        setError(err.response?.data?.error || "Failed to load chart");
      });
  }, []);

  useEffect(() => {
    if (!chartData?.Planets) return;

    const planets = chartData.Planets;
    const centerX = 200,
      centerY = 200,
      radius = 160;
    const svg = document.getElementById("zodiac-wheel");

    if (!svg) return;
    svg.innerHTML = ""; // clear old chart before re-drawing

    const signs = [
      "♈ Aries", "♉ Taurus", "♊ Gemini", "♋ Cancer",
      "♌ Leo", "♍ Virgo", "♎ Libra", "♏ Scorpio",
      "♐ Sagittarius", "♑ Capricorn", "♒ Aquarius", "♓ Pisces"
    ];

    function degToRad(deg) {
      return (parseFloat(deg) - 90) * Math.PI / 180;
    }

    // Draw zodiac signs + dividing lines
    for (let i = 0; i < 12; i++) {
      const angle = degToRad(i * 30 + 15);
      const x = centerX + (radius - 40) * Math.cos(angle);
      const y = centerY + (radius - 40) * Math.sin(angle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("fill", "#ffffff");
      text.setAttribute("font-size", "10");
      text.setAttribute("text-anchor", "middle");
      text.textContent = signs[i];
      svg.appendChild(text);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const angleLine = degToRad(i * 30);
      const x1 = centerX + radius * Math.cos(angleLine);
      const y1 = centerY + radius * Math.sin(angleLine);
      line.setAttribute("x1", centerX);
      line.setAttribute("y1", centerY);
      line.setAttribute("x2", x1);
      line.setAttribute("y2", y1);
      line.setAttribute("stroke", "#8e44ad");
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);
    }

    // Draw planets
    planets.forEach((p) => {
      if (!p.degree) return;
      const angle = degToRad(p.degree);
      const x = centerX + (radius - 20) * Math.cos(angle);
      const y = centerY + (radius - 20) * Math.sin(angle);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 6);
      circle.setAttribute("fill", "#f1c40f");
      circle.style.cursor = "pointer";
      svg.appendChild(circle);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x + 10);
      label.setAttribute("y", y);
      label.setAttribute("fill", "#ffffff");
      label.setAttribute("font-size", "10");
      label.textContent = p.name;
      svg.appendChild(label);
    });
  }, [chartData]);

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!chartData) {
    return <div className="loading-text">Loading your chart...</div>;
  }

  return (
    <div className="birthchart-container container py-4">
      <h2 className="text-center brand-text">🌌 Your Birth Chart</h2>

      {/* User Info */}
      <div className="section-box">
        <h4 className="section-title">🧑 User Info</h4>
        <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
        <p><strong>DOB:</strong> {user?.profile?.birth_date} at {user?.profile?.birth_time}</p>
        <p><strong>Place:</strong> {user?.profile?.birth_place}</p>
      </div>

      {/* Zodiac Wheel */}
      <div className="section-box text-center">
        <h4 className="section-title">🌀 Zodiac Wheel</h4>
        <svg id="zodiac-wheel" width="400" height="400" viewBox="0 0 400 400"></svg>
        <p className="text-muted mt-2">Planets are plotted on the wheel</p>
      </div>

      {/* Planetary Data */}
      <div className="section-box">
        <h4 className="section-title">🌠 Planetary Positions</h4>
        <ul>
          {chartData.Planets.map((p, idx) => (
            <li key={idx}>
              <strong>{p.name}:</strong> {p.degree}° in {p.rasi} (
              {p.nakshatra}, lord: {p.nakshatra_lord})
            </li>
          ))}
        </ul>
      </div>

      {/* Bhava Chart */}
      <div className="section-box">
        <h4 className="section-title">🏠 Bhava Chart</h4>
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>House</th>
              <th>Planets</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(bhavaChart).map(([house, planets]) => (
              <tr key={house}>
                <td>{house}</td>
                <td>{planets?.length ? planets.join(", ") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BirthChart;
