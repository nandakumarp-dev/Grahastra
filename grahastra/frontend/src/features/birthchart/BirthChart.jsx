// BirthChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BirthChart.module.css";

// Axios instance with interceptors
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Attach access token on each request
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Refresh logic on 401
let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If unauthorized and we haven't retried yet:
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refresh = localStorage.getItem("refresh");
          if (!refresh) throw new Error("No refresh token");

          const { data } = await axios.post(
            "http://127.0.0.1:8000/token/refresh/",
            { refresh }
          );
          localStorage.setItem("access", data.access);

          // Replay queued requests
          pendingRequests.forEach((cb) => cb(data.access));
          pendingRequests = [];
          isRefreshing = false;

          // Update header and retry original
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch (e) {
          isRefreshing = false;
          pendingRequests = [];
          // (Optional) redirect to login
          // window.location.href = "/login";
          return Promise.reject(e);
        }
      }

      // If a refresh is in-flight, queue the request
      return new Promise((resolve, reject) => {
        pendingRequests.push((newAccess) => {
          original.headers.Authorization = `Bearer ${newAccess}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(error);
  }
);

function BirthChart() {
  const [chartData, setChartData] = useState(null);
  const [user, setUser] = useState(null);
  const [bhavaChart, setBhavaChart] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/mychart/")
      .then((res) => {
        setUser(res.data.user);
        setChartData(res.data.chart);
        setBhavaChart(res.data.chart.Bhava);
      })
      .catch((err) => {
        console.error("Error fetching chart:", err);
        setError(err.response?.data?.error || "Failed to load chart");
      });
  }, []);

  // helper: numeric degree
  function toNumericDegree(p) {
    if (typeof p?.degree === "number") return p.degree;
    const s = p?.degree_str || p?.degree;
    if (!s) return 0;
    const m = String(s).match(/(\d+)[°]?\s*(\d+)?/);
    if (!m) return parseFloat(s) || 0;
    const deg = parseFloat(m[1] || 0);
    const min = parseFloat(m[2] || 0);
    return deg + min / 60.0;
  }

  useEffect(() => {
    if (!chartData?.Planets) return;

    const planets = chartData.Planets;
    const centerX = 200, centerY = 200, radius = 160;
    const svg = document.getElementById("zodiac-wheel");
    if (!svg) return;
    svg.innerHTML = "";

    const signs = [
      "♈ Aries","♉ Taurus","♊ Gemini","♋ Cancer",
      "♌ Leo","♍ Virgo","♎ Libra","♏ Scorpio",
      "♐ Sagittarius","♑ Capricorn","♒ Aquarius","♓ Pisces"
    ];

    const degToRad = (deg) => (deg - 90) * Math.PI / 180;

    // draw sign labels + radial lines
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

    // draw planets
    planets.forEach((p) => {
      const numericDeg = toNumericDegree(p);
      const angle = degToRad(numericDeg);
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

      <div className="section-box">
        <h4 className="section-title">🧑 User Info</h4>
        <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
        <p><strong>DOB:</strong> {user?.profile?.birth_date} at {user?.profile?.birth_time}</p>
        <p><strong>Place:</strong> {user?.profile?.birth_place}</p>
      </div>

      <div className="section-box text-center">
        <h4 className="section-title">🌀 Zodiac Wheel</h4>
        <svg id="zodiac-wheel" width="400" height="400" viewBox="0 0 400 400"></svg>
        <p className="text-muted mt-2">Planets are plotted on the wheel</p>
      </div>

      <div className="section-box">
        <h4 className="section-title">🌠 Planetary Positions</h4>
        <ul>
          {chartData.Planets.map((p, idx) => (
            <li key={idx}>
              <strong>{p.name}:</strong>{" "}
              {(p.degree_str ?? p.degree)} in {p.rasi} ({p.nakshatra}, lord: {p.nakshatra_lord})
            </li>
          ))}
        </ul>
      </div>

      <div className="section-box">
        <h4 className="section-title">🏠 Bhava Chart</h4>
        <table className="table table-dark table-striped">
          <thead>
            <tr><th>House</th><th>Planets</th></tr>
          </thead>
          <tbody>
            {Object.entries(chartData.Bhava).map(([house, planets]) => (
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
