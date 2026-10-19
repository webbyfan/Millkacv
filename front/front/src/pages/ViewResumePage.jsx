import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ResumeTemplate from "../components/ResumeTemplate";
import AtsAnalyzerModal from "../components/AtsAnalyzerModal";
import { getResumeById } from "../services/api";
import { exportElementToPdf } from "../utils/pdf";
import "../styles/ViewResume.css";

export default function ViewResumePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [templateId, setTemplateId] = useState("modern");
  const [downloading, setDownloading] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);

  const previewRef = useRef(null);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getResumeById(id);
      setResume(data);
      if (data?.content?.template) {
        setTemplateId(data.content.template);
      }
    } catch (err) {
      console.error("Error loading resume:", err);
      setError(err.response?.data?.error || "Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const filename = `${resume?.title ? resume.title.replace(/[^a-zA-Z0-9-_ ]/g, "") : "resume"}.pdf`;
      await exportElementToPdf(previewRef.current, filename);
    } catch (err) {
      console.error("PDF Export error:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />

        <div className="view-resume-container">
          {/* Top Bar Navigation */}
          <div className="view-resume-nav">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </button>

            <div className="view-resume-actions">
              <button
                type="button"
                className="btn-action-ats"
                onClick={() => setShowAtsModal(true)}
                title="Run ATS analysis with AI"
              >
                ⚡ Check ATS Score with AI
              </button>
              <button
                type="button"
                className="btn-action-edit"
                onClick={() => navigate(`/edit-resume/${id}`)}
              >
                ✏️ Edit Resume
              </button>
              <button
                type="button"
                className="btn-action-download"
                onClick={handleDownloadPdf}
                disabled={downloading || !resume}
              >
                {downloading ? "Generating PDF..." : "⬇️ Download PDF"}
              </button>
            </div>
          </div>

          {/* Loading / Error States */}
          {loading && (
            <div className="view-loading-state">
              <div className="ats-spinner"></div>
              <p>Loading your resume...</p>
            </div>
          )}

          {error && (
            <div className="view-error-state">
              <p>⚠️ {error}</p>
              <button onClick={fetchResume}>Try Again</button>
            </div>
          )}

          {!loading && resume && (
            <div className="view-resume-content">
              {/* Header Info & Template Switcher */}
              <div className="view-resume-header-card">
                <div>
                  <h1 className="view-resume-title">{resume.title}</h1>
                  <p className="view-resume-meta">
                    Last updated:{" "}
                    {new Date(
                      resume.updatedAt || resume.createdAt
                    ).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {resume.atsScore !== undefined && (
                      <span className="view-ats-badge">
                        ATS Score: {resume.atsScore}%
                      </span>
                    )}
                  </p>
                </div>

                <div className="view-template-selector">
                  <label>Template Layout:</label>
                  <select
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                  >
                    <option value="modern">Modern Clean</option>
                    <option value="classic">Classic Serif</option>
                    <option value="teal-banner">Teal Executive (Top Banner)</option>
                    <option value="dark-sidebar">Obsidian Pro (Dark Sidebar)</option>
                    <option value="classic-rose">Classic Rose (2-Column)</option>
                    <option value="azure-sidebar">Azure Corporate (Blue Sidebar)</option>
                    <option value="crimson-sidebar">Crimson Creative (Burgundy Sidebar)</option>
                    <option value="minimal">Minimal Single Column</option>
                    <option value="creative">Creative Accent</option>
                  </select>
                </div>
              </div>

              {/* Rendered Resume Document */}
              <div className="view-resume-document-wrapper">
                <div
                  ref={previewRef}
                  id="resume-preview-document"
                  className="view-resume-paper"
                >
                  <ResumeTemplate
                    data={resume.content || {}}
                    templateId={templateId}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ATS Modal */}
        {resume && (
          <AtsAnalyzerModal
            isOpen={showAtsModal}
            onClose={() => setShowAtsModal(false)}
            resumeData={resume}
            resumeId={id}
            onScoreUpdated={(newScore) =>
              setResume((prev) => ({ ...prev, atsScore: newScore }))
            }
          />
        )}
      </div>
    </div>
  );
}
