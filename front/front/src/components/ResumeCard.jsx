import React from "react";
import "../styles/ResumeCard.css";

// Reusable Resume Card Component
export default function ResumeCard({ resume, onView, onEdit, onDelete }) {
  if (!resume) return null;

  const resumeId = resume._id || resume.id;
  const score = typeof resume.atsScore === "number" ? resume.atsScore : 0;

  // Format date to readable format with safe fallback
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Recently";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return d.toLocaleDateString(undefined, options);
  };

  return (
    <div className="resume-card">
      {/* Resume Icon & Title */}
      <div className="resume-header">
        <div className="resume-icon">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div className="resume-info">
          <h4 className="resume-title">{resume.title || "Untitled Resume"}</h4>
          <p className="resume-date">
            Updated: {formatDate(resume.updatedAt || resume.createdAt || resume.lastUpdated)}
          </p>
        </div>
      </div>

      {/* ATS Score */}
      <div className="resume-ats">
        <span className="ats-label">ATS Score:</span>
        <div className="ats-score-container">
          <div className="ats-progress">
            <div
              className="ats-progress-bar"
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            ></div>
          </div>
          <span className="ats-value">{score}%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="resume-actions">
        <button
          type="button"
          className="btn btn-view"
          onClick={() => onView && onView(resumeId)}
          title="View and preview this resume"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>View</span>
        </button>
        <button
          type="button"
          className="btn btn-edit"
          onClick={() => onEdit && onEdit(resumeId)}
          title="Edit this resume"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit</span>
        </button>
        <button
          type="button"
          className="btn btn-delete"
          onClick={() => onDelete && onDelete(resumeId)}
          title="Delete this resume"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
