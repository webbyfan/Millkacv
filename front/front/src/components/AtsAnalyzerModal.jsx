import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResumeWithAI, scanExternalCvWithAI } from "../services/api";
import "../styles/AtsAnalyzer.css";

export default function AtsAnalyzerModal({
  isOpen,
  onClose,
  resumeData,
  resumeId,
  initialMode = "current",
  onScoreUpdated,
  onAddMissingSkill,
}) {
  const navigate = useNavigate();

  // Mode: "current" or "external"
  const [activeMode, setActiveMode] = useState(
    resumeData ? initialMode : "external"
  );

  // Common targeting state
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJobInput, setShowJobInput] = useState(false);

  // External CV state
  const [externalText, setExternalText] = useState("");
  const [externalFile, setExternalFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [fileMimeType, setFileMimeType] = useState("");
  const [inputSubTab, setInputSubTab] = useState("file"); // "file" or "paste"

  // Results state
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [error, setError] = useState("");
  const [addedSkills, setAddedSkills] = useState({});

  useEffect(() => {
    if (isOpen) {
      setError("");
      setAddedSkills({});

      if (resumeData && activeMode === "current") {
        const initialTitle =
          resumeData.professionalTitle ||
          resumeData.title ||
          resumeData.content?.personalInfo?.professionalTitle ||
          "";
        setTargetJobTitle(initialTitle);
        if (!analysis) {
          handleRunCurrentAnalysis(initialTitle, "");
        }
      } else if (!resumeData) {
        setActiveMode("external");
      }
    }
  }, [isOpen, resumeData, activeMode]);

  if (!isOpen) return null;

  // Handle Current Resume Analysis
  const handleRunCurrentAnalysis = async (titleOverride, descOverride) => {
    setLoading(true);
    setError("");

    try {
      const content = resumeData?.content
        ? resumeData.content
        : {
            personalInfo: {
              fullName: resumeData?.fullName,
              email: resumeData?.email,
              phone: resumeData?.phone,
              location: resumeData?.location,
              professionalTitle: resumeData?.professionalTitle,
              summary: resumeData?.summary,
            },
            experiences: resumeData?.experiences || [],
            education: resumeData?.education || [],
            skills: resumeData?.skills || [],
          };

      const title = titleOverride !== undefined ? titleOverride : targetJobTitle;
      const desc = descOverride !== undefined ? descOverride : jobDescription;

      const res = await analyzeResumeWithAI({
        resumeId: resumeId || resumeData?._id || resumeData?.id,
        resumeContent: content,
        targetJobTitle: title,
        jobDescription: desc,
      });

      if (res.analysis) {
        setAnalysis(res.analysis);
        setParsedResume(null);
        if (onScoreUpdated && res.analysis.score !== undefined) {
          onScoreUpdated(res.analysis.score);
        }
      }
    } catch (err) {
      console.error("ATS analysis error:", err);
      setError("Failed to complete ATS analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle External CV file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setExternalFile(file);
    setFileMimeType(file.type || "application/pdf");

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setExternalText(event.target.result || "");
        setFileBase64(null);
      };
      reader.readAsText(file);
    } else {
      // PDF or binary file: read as Data URL base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileBase64(event.target.result || "");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle External CV Scan
  const handleRunExternalScan = async () => {
    if (!fileBase64 && (!externalText || !externalText.trim())) {
      setError("Please upload a CV document (PDF/TXT) or paste your resume text.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await scanExternalCvWithAI({
        resumeText: externalText,
        fileBase64: fileBase64,
        mimeType: fileMimeType,
        targetJobTitle: targetJobTitle,
        jobDescription: jobDescription,
      });

      if (res.analysis) {
        setAnalysis(res.analysis);
        setParsedResume(res.parsedResume || null);
      }
    } catch (err) {
      console.error("External CV scan error:", err);
      setError("Failed to scan external CV. Please check file format and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Import into Builder
  const handleImportIntoBuilder = () => {
    if (!parsedResume) return;
    onClose();
    navigate("/create-resume", {
      state: {
        importedResume: parsedResume,
      },
    });
  };

  const handleAddKeyword = (keyword) => {
    if (onAddMissingSkill) {
      onAddMissingSkill(keyword);
      setAddedSkills((prev) => ({ ...prev, [keyword]: true }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Green
    if (score >= 60) return "#f59e0b"; // Orange/Yellow
    return "#ef4444"; // Red
  };

  const getScoreBadgeText = (score) => {
    if (score >= 80) return "High ATS Match (Interview Ready)";
    if (score >= 60) return "Moderate ATS Match (Needs Optimization)";
    return "Low ATS Match (High Risk of Rejection)";
  };

  return (
    <div className="ats-modal-backdrop" onClick={onClose}>
      <div className="ats-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ats-modal-header">
          <div className="ats-modal-title-wrap">
            <span className="ats-modal-badge">AI ATS Engine</span>
            <h2>Real-Time ATS Resume Scanner</h2>
            <p>Scan any resume—built here or uploaded externally—for instant ATS grading & keyword matching</p>
          </div>
          <button className="ats-modal-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="ats-mode-tabs">
          {resumeData && (
            <button
              type="button"
              className={`ats-mode-tab ${activeMode === "current" ? "active" : ""}`}
              onClick={() => {
                setActiveMode("current");
                setAnalysis(null);
                setParsedResume(null);
              }}
            >
              📄 Current Builder Resume
            </button>
          )}
          <button
            type="button"
            className={`ats-mode-tab ${activeMode === "external" ? "active" : ""}`}
            onClick={() => {
              setActiveMode("external");
              setAnalysis(null);
              setParsedResume(null);
            }}
          >
            📤 Upload & Scan External CV (PDF / Text)
          </button>
        </div>

        {/* External CV Input Form (shown when in external mode) */}
        {activeMode === "external" && !analysis && !loading && (
          <div className="ats-external-input-container">
            <div className="ats-subtabs">
              <button
                type="button"
                className={`ats-subtab ${inputSubTab === "file" ? "active" : ""}`}
                onClick={() => setInputSubTab("file")}
              >
                📎 Upload PDF / TXT
              </button>
              <button
                type="button"
                className={`ats-subtab ${inputSubTab === "paste" ? "active" : ""}`}
                onClick={() => setInputSubTab("paste")}
              >
                📝 Paste Resume Text
              </button>
            </div>

            {inputSubTab === "file" && (
              <div className="ats-dropzone">
                <input
                  type="file"
                  id="external-cv-file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="ats-file-hidden"
                />
                <label htmlFor="external-cv-file" className="ats-dropzone-label">
                  <div className="ats-dropzone-icon">📄</div>
                  <h4>{externalFile ? externalFile.name : "Choose a CV or Drag & Drop here"}</h4>
                  <p>Supports PDF and plain text documents (Up to 15MB)</p>
                  <span className="btn-browse-file">Browse File</span>
                </label>
                {externalFile && (
                  <div className="ats-file-selected">
                    <span>✓ Ready to scan: <strong>{externalFile.name}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setExternalFile(null);
                        setFileBase64(null);
                        setExternalText("");
                      }}
                    >
                      Remove ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            {inputSubTab === "paste" && (
              <div className="ats-paste-zone">
                <label>Paste your existing CV or LinkedIn text below:</label>
                <textarea
                  rows="6"
                  value={externalText}
                  onChange={(e) => setExternalText(e.target.value)}
                  placeholder="Paste your CV text here (Full Name, Experience, Education, Skills)..."
                />
              </div>
            )}

            <div className="ats-targeting-body inline">
              <div className="ats-input-group">
                <label>Target Role / Job Title (Optional)</label>
                <input
                  type="text"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="ats-input-group">
                <label>Target Job Description (Optional for Keyword Gap Match)</label>
                <textarea
                  rows="3"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job posting requirements to compare keywords..."
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-scan-external-large"
              onClick={handleRunExternalScan}
              disabled={loading || (!fileBase64 && !externalText.trim())}
            >
              Scan External CV with AI
            </button>
          </div>
        )}

        {/* Current Resume Targeting Box */}
        {activeMode === "current" && (
          <div className="ats-targeting-box">
            <div
              className="ats-targeting-header"
              onClick={() => setShowJobInput(!showJobInput)}
            >
              <span>
                🎯 Target Role: <strong>{targetJobTitle || "General Role"}</strong>
                {jobDescription ? " (Custom Job Description Active)" : ""}
              </span>
              <button type="button" className="btn-toggle-targeting">
                {showJobInput ? "Hide Job Targeting ▲" : "Customize Target Job / Paste JD ▼"}
              </button>
            </div>

            {showJobInput && (
              <div className="ats-targeting-body">
                <div className="ats-input-group">
                  <label>Target Job Title</label>
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>

                <div className="ats-input-group">
                  <label>Paste Target Job Description (Optional for Keyword Matching)</label>
                  <textarea
                    rows="4"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job requirements or posting here to match specific keywords..."
                  />
                </div>

                <button
                  type="button"
                  className="btn-reanalyze"
                  onClick={() => handleRunCurrentAnalysis()}
                  disabled={loading}
                >
                  {loading ? "Re-Analyzing..." : "⚡ Re-Scan with this Job Description"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && <div className="ats-error-banner">{error}</div>}

        {/* Loading State */}
        {loading && (
          <div className="ats-loading-state">
            <div className="ats-spinner"></div>
            <h3>Scanning Resume against ATS Standards with AI...</h3>
            <p>
              {activeMode === "external"
                ? "Extracting candidate details, detecting missing keywords, and grading structure"
                : "Evaluating keyword frequency, XYZ impact metrics, and parser readability"}
            </p>
          </div>
        )}

        {/* Results Body */}
        {!loading && analysis && (
          <div className="ats-results-scroll">
            {/* If External CV, show Import into Builder Banner */}
            {parsedResume && (
              <div className="ats-import-banner">
                <div className="ats-import-info">
                  <h4>✨ External CV Successfully Parsed!</h4>
                  <p>
                    We extracted <strong>{parsedResume.fullName || "Candidate"}</strong>'s
                    experiences, skills, and details. You can import this directly into
                    MilkaaCV's builder to polish it and export an ATS-safe PDF.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-import-builder"
                  onClick={handleImportIntoBuilder}
                >
                  ✨ Import & Edit in Builder →
                </button>
              </div>
            )}

            {/* Top Score Section */}
            <div className="ats-score-hero">
              <div
                className="ats-score-circle"
                style={{ borderColor: getScoreColor(analysis.score) }}
              >
                <span
                  className="ats-score-number"
                  style={{ color: getScoreColor(analysis.score) }}
                >
                  {analysis.score}
                </span>
                <span className="ats-score-denom">/100</span>
              </div>

              <div className="ats-score-info">
                <div
                  className="ats-verdict-badge"
                  style={{
                    backgroundColor: `${getScoreColor(analysis.score)}15`,
                    color: getScoreColor(analysis.score),
                  }}
                >
                  {getScoreBadgeText(analysis.score)}
                </div>
                <p className="ats-summary-text">{analysis.summary}</p>
              </div>
            </div>

            {/* Breakdown Metrics */}
            {analysis.breakdown && (
              <div className="ats-breakdown-grid">
                <div className="ats-breakdown-item">
                  <div className="ats-breakdown-label">
                    <span>Keyword Match</span>
                    <strong>{analysis.breakdown.keywordMatch}%</strong>
                  </div>
                  <div className="ats-progress-bar">
                    <div
                      className="ats-progress-fill"
                      style={{
                        width: `${analysis.breakdown.keywordMatch}%`,
                        backgroundColor: getScoreColor(analysis.breakdown.keywordMatch),
                      }}
                    ></div>
                  </div>
                </div>

                <div className="ats-breakdown-item">
                  <div className="ats-breakdown-label">
                    <span>Impact & Metrics</span>
                    <strong>{analysis.breakdown.impactAndMetrics}%</strong>
                  </div>
                  <div className="ats-progress-bar">
                    <div
                      className="ats-progress-fill"
                      style={{
                        width: `${analysis.breakdown.impactAndMetrics}%`,
                        backgroundColor: getScoreColor(analysis.breakdown.impactAndMetrics),
                      }}
                    ></div>
                  </div>
                </div>

                <div className="ats-breakdown-item">
                  <div className="ats-breakdown-label">
                    <span>ATS Formatting</span>
                    <strong>{analysis.breakdown.atsFormatting}%</strong>
                  </div>
                  <div className="ats-progress-bar">
                    <div
                      className="ats-progress-fill"
                      style={{
                        width: `${analysis.breakdown.atsFormatting}%`,
                        backgroundColor: getScoreColor(analysis.breakdown.atsFormatting),
                      }}
                    ></div>
                  </div>
                </div>

                <div className="ats-breakdown-item">
                  <div className="ats-breakdown-label">
                    <span>Completeness</span>
                    <strong>{analysis.breakdown.completeness}%</strong>
                  </div>
                  <div className="ats-progress-bar">
                    <div
                      className="ats-progress-fill"
                      style={{
                        width: `${analysis.breakdown.completeness}%`,
                        backgroundColor: getScoreColor(analysis.breakdown.completeness),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Missing In-Demand Keywords */}
            {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
              <div className="ats-section-card">
                <h4>
                  <span>⚠️</span> Missing In-Demand Keywords
                </h4>
                <p className="ats-section-sub">
                  ATS parsers filter out candidates lacking these keywords.
                  {onAddMissingSkill
                    ? " Click to add them to your skills list:"
                    : " Consider adding these to your resume:"}
                </p>
                <div className="ats-keywords-cloud">
                  {analysis.missingKeywords.map((keyword, kIdx) => (
                    <button
                      key={kIdx}
                      type="button"
                      className={`ats-keyword-pill ${addedSkills[keyword] ? "added" : ""}`}
                      onClick={() => handleAddKeyword(keyword)}
                      disabled={addedSkills[keyword] || !onAddMissingSkill}
                      title={onAddMissingSkill ? "Click to add to your skills" : "Missing keyword"}
                    >
                      {addedSkills[keyword] ? `✓ ${keyword} (Added)` : `+ ${keyword}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Improvements 2-Column Grid */}
            <div className="ats-feedback-grid">
              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="ats-feedback-col strengths">
                  <h4>
                    <span>✅</span> What The CV Does Well
                  </h4>
                  <ul>
                    {analysis.strengths.map((str, sIdx) => (
                      <li key={sIdx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Improvements */}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="ats-feedback-col improvements">
                  <h4>
                    <span>🚀</span> Actionable Fixes to Boost Score
                  </h4>
                  <ul>
                    {analysis.improvements.map((imp, iIdx) => (
                      <li key={iIdx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="ats-modal-footer">
          {analysis && activeMode === "external" && (
            <button
              type="button"
              className="btn-reupload-ats"
              onClick={() => {
                setAnalysis(null);
                setParsedResume(null);
              }}
            >
              ← Scan Another External CV
            </button>
          )}
          <button type="button" className="btn-close-modal" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
