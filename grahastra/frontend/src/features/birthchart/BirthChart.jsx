// BirthChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BirthChart.module.css";

const api = axios.create({ baseURL: "http://127.0.0.1:8000" });

api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refresh = localStorage.getItem("refresh");
          if (!refresh) throw new Error("No refresh token");
          const { data } = await axios.post("http://127.0.0.1:8000/token/refresh/", { refresh });
          localStorage.setItem("access", data.access);

          pendingRequests.forEach((cb) => cb(data.access));
          pendingRequests = [];
          isRefreshing = false;

          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch (e) {
          isRefreshing = false;
          pendingRequests = [];
          return Promise.reject(e);
        }
      }
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
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/mychart/")
      .then((res) => {
        setUser(res.data.user);
        setChartData(res.data.chart);
      })
      .catch((err) => {
        console.error("Error fetching chart:", err);
        setError(err.response?.data?.error || "Failed to load chart");
      });
  }, []);

  if (error) return <div className={styles.errorBox}>{error}</div>;
  if (!chartData) return <div className={styles.loading}>✨ Calculating your cosmic map...</div>;

  return (
    <div className={styles.birthChart}>
      <h2 className={styles.title}>🌌 Your Birth Chart Insight</h2>

      {/* User Info */}
      <div className={styles.card}>
        <h4 className={styles.sectionTitle}>🧑 User Details</h4>
        <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
        <p><strong>DOB:</strong> {user?.profile?.birth_date} at {user?.profile?.birth_time}</p>
        <p><strong>Place:</strong> {user?.profile?.birth_place}</p>
      </div>

      {/* Zodiac Wheel */}
      <div className={`${styles.card} ${styles.center}`}>
        <h4 className={styles.sectionTitle}>🌀 Zodiac Wheel</h4>
        <svg id="zodiac-wheel" width="400" height="400" viewBox="0 0 400 400"></svg>
        <p className={styles.hint}>✨ Planets aligned in your cosmic map</p>
      </div>

      {/* Planetary Positions */}
      <div className={styles.card}>
        <h4 className={styles.sectionTitle}>🌠 Planetary Positions</h4>
        <ul className={styles.planetList}>
          {chartData.Planets.map((p, idx) => (
            <li key={idx}>
              <span className={styles.planetName}>{p.name}</span>:{" "}
              <span className={styles.highlight}>
                {(p.degree_str ?? p.degree)} in {p.rasi}
              </span>{" "}
              ({p.nakshatra}, lord: {p.nakshatra_lord})
            </li>
          ))}
        </ul>
      </div>

      {/* Bhava Chart */}
      <div className={styles.card}>
        <h4 className={styles.sectionTitle}>🏠 Bhava Chart</h4>
        <table className={styles.table}>
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

      {/* CTA */}
      <div className={styles.insightBox}>
        <h3>🌟 Unlock Your ₹2000 Insight</h3>
        <p>Get a **deep professional reading** with career, finance, love & life-path predictions based on this chart.</p>
        <button className={styles.ctaBtn}>🔮 Get Full Report</button>
      </div>
    </div>
  );
}

export default BirthChart;
