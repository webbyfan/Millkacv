import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ResumeCard from "../components/ResumeCard";
import ResumeTemplate from "../components/ResumeTemplate";
import { exportElementToPdf } from "../utils/pdf";
import { getResumes, deleteResume } from "../services/api";
import "../styles/MyResumes.css";

export default function MyResumesPage() {
  const navigate = useNavigate();

  // State management
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch resumes on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResumes();
      setResumes(data || []);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError("Failed to load resumes");
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter((resume) => {
      const matchesSearch = resume.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "atsScore":
          return (b.atsScore || 0) - (a.atsScore || 0);
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Handle edit resume
  const handleEditResume = (resumeId) => {
    // TODO: Navigate to edit resume page with ID when implemented
    navigate(`/edit-resume/${resumeId}`);
  };

  const pdfPreviewRef = useRef(null);
  const [resumeToExport, setResumeToExport] = useState(null);
  const [downloadError, setDownloadError] = useState("");

  // Handle delete resume
  const handleDeleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(resumeId);
        setResumes(resumes.filter((r) => r._id !== resumeId));
      } catch (error) {
        console.error("Error deleting resume:", error);
        alert("Failed to delete resume");
      }
    }
  };

  // Handle download resume
  const handleDownloadResume = async (resumeId) => {
    const resume = resumes.find((r) => r._id === resumeId || r.id === resumeId);

    if (!resume) {
      alert("Resume not found.");
      return;
    }

    setDownloadError("");
    setResumeToExport(resume);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const previewElement = pdfPreviewRef.current;
    if (!previewElement) {
      setDownloadError("Unable to generate PDF preview. Please try again.");
      setResumeToExport(null);
      return;
    }

    try {
      await exportElementToPdf(
        previewElement,
        `${resume.title ? resume.title.replace(/[^a-zA-Z0-9-_ ]/g, "") : "resume"}.pdf`,
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setDownloadError(
        error.message || "Failed to download PDF. Please try again.",
      );
    } finally {
      setResumeToExport(null);
    }
  };

  // Handle view resume
  const handleViewResume = (resumeId) => {
    // TODO: Navigate to view resume page with ID when implemented
    navigate(`/view-resume/${resumeId}`);
  };

  // Calculate statistics
  const stats = {
    total: resumes.length,
    avgAtsScore:
      resumes.length > 0
        ? Math.round(
            resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length,
          )
        : 0,
    highestScore:
      resumes.length > 0 ? Math.max(...resumes.map((r) => r.atsScore)) : 0,
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />

        <div className="my-resumes-container">
          {/* Header Section */}
          <div className="my-resumes-header">
            <div>
              <h1>My Resumes</h1>
              <p>View and manage all your resumes</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <p>Loading your resumes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>⚠️ {error}</p>
              <button onClick={fetchResumes}>Try Again</button>
            </div>
          )}

          {/* Statistics Cards */}
          {!loading && resumes.length > 0 && (
            <div className="statistics-section">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Resumes</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.avgAtsScore}%</div>
                  <div className="stat-label">Average ATS Score</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.highestScore}%</div>
                  <div className="stat-label">Highest ATS Score</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          {!loading && resumes.length > 0 && (
            <div className="filters-section">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search resumes by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="atsScore">Highest ATS Score</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="template-select">Template:</label>
                  <select
                    id="template-select"
                    value={filterTemplate}
                    onChange={(e) => setFilterTemplate(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Templates</option>
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="creative">Creative</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                <div className="view-mode-toggle">
                  <button
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    ⊞ Grid
                  </button>
                  <button
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="List view"
                  >
                    ≡ List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resumes Display */}
          {!loading && filteredResumes.length > 0 ? (
            <div className={`resumes-section view-${viewMode}`}>
              {viewMode === "grid" ? (
                <div className="resumes-grid">
                  {filteredResumes.map((resume) => (
                    <div key={resume._id} className="resume-grid-item">
                      <ResumeCard
                        resume={resume}
                        onView={handleViewResume}
                        onEdit={handleEditResume}
                        onDelete={handleDeleteResume}
                      />
                      <div className="resume-extra-actions">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleViewResume(resume._id)}
                          title="View resume"
                        >
                          👁️ View
                        </button>
                        <button
                          className="btn-action btn-download"
                          onClick={() => handleDownloadResume(resume._id)}
                          title="Download resume"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="resumes-list">
                  {filteredResumes.map((resume) => (
                    <div key={resume._id} className="resume-list-item">
                      <div className="list-item-header">
                        <div className="list-item-title">
                          <div className="resume-icon-large">📄</div>
                          <div className="list-item-info">
                            <h3>{resume.title}</h3>
                            <p>
                              Created:{" "}
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="list-item-score">
                          <div className="ats-score-display">
                            <div className="score-value">
                              {resume.atsScore || 0}%
                            </div>
                            <div className="score-label">ATS Score</div>
                          </div>
                        </div>

                        <div className="list-item-actions">
                          <button
                            className="btn-icon-small"
                            onClick={() => handleViewResume(resume._id)}
                            title="View resume"
                          >
                            👁️
                          </button>
                          <button
                            className="btn-icon-small"
                            onClick={() => handleEditResume(resume._id)}
                            title="Edit resume"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon-small"
                            onClick={() => handleDownloadResume(resume._id)}
                            title="Download resume"
                          >
                            ⬇️
                          </button>
                          <button
                            className="btn-icon-small btn-delete"
                            onClick={() => handleDeleteResume(resume._id)}
                            title="Delete resume"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : !loading && resumes.length === 0 ? (
            // Empty State
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h2>No Resumes Yet</h2>
              <p>Start creating your first resume to get started</p>
              <button
                className="btn-empty-create"
                onClick={() => navigate("/create-resume")}
              >
                Create Your First Resume
              </button>
            </div>
          ) : (
            // No Results
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h2>No Resumes Found</h2>
              <p>Try adjusting your search or filter criteria</p>
              <button
                className="btn-clear-filters"
                onClick={() => {
                  setSearchQuery("");
                  setFilterTemplate("all");
                  setSortBy("recent");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Off-screen preview for PDF export */}
          {resumeToExport && (
            <div
              ref={pdfPreviewRef}
              style={{ position: "fixed", left: "-9999px", top: 0, width: "850px", background: "#ffffff", zIndex: -9999 }}
            >
              <ResumeTemplate data={resumeToExport} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
