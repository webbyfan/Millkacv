import React from "react";
import "../styles/StatsCard.css";

// Reusable Statistics Card Component
export default function StatsCard({ icon, label, value, trend }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>

      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <h3 className="stats-value">{value}</h3>
      </div>

      {/* Trend indicator (optional) */}
      {trend && (
        <div className={`stats-trend ${trend.type}`}>
          <span className="trend-icon">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </span>
          <span className="trend-text">{trend.value}</span>
        </div>
      )}
    </div>
  );
}
