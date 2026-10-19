import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import ResumeCard from "../components/ResumeCard";
import ATSCard from "../components/ATSCard";
import {
  getResumes,
  getAtsTips,
  deleteResume,
  getUserProfile,
} from "../services/api";
import AtsAnalyzerModal from "../components/AtsAnalyzerModal";
import "../styles/Dashboard.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  // State management
  const [resumes, setResumes] = useState([]);
  const [tips, setTips] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResumeForAi, setSelectedResumeForAi] = useState(null);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [atsModalMode, setAtsModalMode] = useState("current");

  // Check token and fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch user, resumes, and ATS tips
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await getUserProfile();
      const resumesData = await getResumes();
      const tipsData = await getAtsTips();

      setUser(userData);
      setResumes(resumesData || []);
      setTips(tipsData || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate average ATS score
  const averageAtsScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length,
        )
      : 0;

  // Handle create new resume
  const handleCreateResume = () => {
    // TODO: Navigate to create resume page when implemented
    navigate("/create-resume");
  };

  // Handle view resume
  const handleViewResume = (resumeId) => {
    navigate(`/view-resume/${resumeId}`);
  };

  // Handle edit resume
  const handleEditResume = (resumeId) => {
    navigate(`/edit-resume/${resumeId}`);
  };

  // Handle delete resume
  const handleDeleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(resumeId);
        setResumes(resumes.filter((r) => r._id !== resumeId && r.id !== resumeId));
      } catch (error) {
        console.error("Error deleting resume:", error);
        alert("Failed to delete resume");
      }
    }
  };

  // Handle download resume
  const handleDownloadResume = (resumeId) => {
    // TODO: Implement download functionality when backend is ready
    alert("Download feature coming soon!");
  };

  // Handle improve with AI
  const handleImproveWithAI = (resume = null) => {
    if (resumes.length === 0) {
      // If no resumes created yet, open directly in external CV scanning mode
      setSelectedResumeForAi(null);
      setAtsModalMode("external");
      setIsAtsModalOpen(true);
      return;
    }
    const target = resume || resumes[0];
    setSelectedResumeForAi(target);
    setAtsModalMode("current");
    setIsAtsModalOpen(true);
  };

  // Handle direct external CV scan
  const handleScanExternalCv = () => {
    setSelectedResumeForAi(null);
    setAtsModalMode("external");
    setIsAtsModalOpen(true);
  };

  const handleScoreUpdated = (newScore) => {
    if (!selectedResumeForAi) return;
    const targetId = selectedResumeForAi._id || selectedResumeForAi.id;
    setResumes((prev) =>
      prev.map((r) =>
        r._id === targetId || r.id === targetId ? { ...r, atsScore: newScore } : r
      )
    );
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <p>⚠️ {error}</p>
        <button onClick={fetchDashboardData}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="dashboard-content">

          {/* Statistics Section */}
          <section className="stats-section">
            <h3 className="section-title">Your Resume Statistics</h3>
            <div className="stats-grid">
              <StatsCard
                icon={
                  <svg
                    width="24"
                    height="24"
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
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                }
                label="Total Resumes"
                value={resumes.length}
                trend={{ type: "up", value: "+2 this month" }}
              />
              <StatsCard
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                }
                label="Average ATS Score"
                value={`${averageAtsScore}%`}
                trend={{ type: "up", value: "+5% improvement" }}
              />
              <StatsCard
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
                label="ATS Ready Resumes"
                value={resumes.filter((r) => (r.atsScore || 0) >= 70).length}
                trend={{ type: "up", value: "Score ≥ 70%" }}
              />
            </div>
          </section>

          {/* Recent Resumes Section */}
          <section className="resumes-section">
            <h3 className="section-title">Your Recent Resumes</h3>
            {loading ? (
              <div className="loading-spinner">Loading resumes...</div>
            ) : resumes.length > 0 ? (
              <div className="resumes-grid">
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume._id || resume.id}
                    resume={resume}
                    onView={handleViewResume}
                    onEdit={handleEditResume}
                    onDelete={handleDeleteResume}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <h4 className="empty-state-title">No resumes yet</h4>
                <p className="empty-state-desc">
                  Start creating your first ATS-optimized resume now
                </p>
                <button className="btn-secondary" onClick={handleCreateResume}>
                  Create your first resume
                </button>
              </div>
            )}
          </section>

          {/* ATS Tips Section */}
          <section className="tips-section">
            <h3 className="section-title">ATS Tips & Best Practices</h3>
            <div className="tips-grid">
              {tips.map((tip) => (
                <ATSCard key={tip.id} tip={tip} />
              ))}
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              <button
                className="quick-action-btn create-btn"
                onClick={handleCreateResume}
              >
                <span className="action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
                <span className="action-label">Create Resume</span>
              </button>
              <button
                className="quick-action-btn improve-btn"
                onClick={() => handleImproveWithAI()}
              >
                <span className="action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                  </svg>
                </span>
                <span className="action-label">Improve with AI</span>
              </button>
              <button
                className="quick-action-btn scan-external-btn"
                onClick={handleScanExternalCv}
                title="Scan any CV document (PDF or Text) built outside MilkaaCV"
              >
                <span className="action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 12 15 15" />
                  </svg>
                </span>
                <span className="action-label">Scan External CV</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Real-time AI ATS Analyzer Modal */}
      <AtsAnalyzerModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resumeData={selectedResumeForAi}
        resumeId={selectedResumeForAi?._id || selectedResumeForAi?.id}
        initialMode={atsModalMode}
        onScoreUpdated={handleScoreUpdated}
      />
    </div>
  );
}
