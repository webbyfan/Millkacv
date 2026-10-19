import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ResumeTemplate from "../components/ResumeTemplate";
import AtsAnalyzerModal from "../components/AtsAnalyzerModal";
import {
  getResumeById,
  updateResume,
  improveSummaryWithAI,
  improveBulletWithAI,
  suggestSkillsWithAI,
  getAIStatus,
  generateCompleteResumeWithAI,
} from "../services/api";
import { exportElementToPdf } from "../utils/pdf";
import "../styles/CreateResume.css";

export default function EditResumePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pdfOffscreenRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    professionalTitle: "",
    summary: "",
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [{ school: "", degree: "", field: "", graduationYear: "" }],
    skills: "",
    templateId: "modern",
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState({});
  const [aiNotice, setAiNotice] = useState("");
  const [aiStatus, setAiStatus] = useState(null);
  const [bulletAiSuggestions, setBulletAiSuggestions] = useState({});
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [aiFullGenerating, setAiFullGenerating] = useState(false);
  const [aiFullSuccess, setAiFullSuccess] = useState(null);

  useEffect(() => {
    getAIStatus()
      .then((status) => setAiStatus(status))
      .catch((err) => console.log("AI status check error:", err));

    fetchResumeToEdit();
  }, [id]);

  const fetchResumeToEdit = async () => {
    try {
      setInitialLoading(true);
      setSubmitError("");
      const resume = await getResumeById(id);

      if (resume) {
        const c = resume.content || {};
        const p = c.personalInfo || {};

        setFormData({
          title: resume.title || "My Resume",
          fullName: p.fullName || "",
          email: p.email || "",
          phone: p.phone || "",
          location: p.location || "",
          professionalTitle: p.professionalTitle || "",
          summary: p.summary || "",
          experiences:
            Array.isArray(c.experiences) && c.experiences.length > 0
              ? c.experiences
              : [
                  {
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  },
                ],
          education:
            Array.isArray(c.education) && c.education.length > 0
              ? c.education
              : [{ school: "", degree: "", field: "", graduationYear: "" }],
          skills: Array.isArray(c.skills)
            ? c.skills.join("\n")
            : c.skills || "",
          templateId: c.template || "modern",
        });
      }
    } catch (err) {
      console.error("Error loading resume for edit:", err);
      setSubmitError(
        err.response?.data?.error || "Failed to load resume details."
      );
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      experiences: newExperiences,
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      education: newEducation,
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", field: "", graduationYear: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Resume title is required";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.professionalTitle.trim())
      newErrors.professionalTitle = "Professional title is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        title: formData.title,
        content: {
          personalInfo: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            professionalTitle: formData.professionalTitle,
            summary: formData.summary,
          },
          experiences: formData.experiences.filter(
            (exp) => exp.company || exp.position
          ),
          education: formData.education.filter(
            (edu) => edu.school || edu.degree
          ),
          skills: formData.skills
            .split("\n")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0),
          template: formData.templateId,
        },
      };

      await updateResume(id, updateData);
      alert("Resume updated successfully!");
      navigate(`/view-resume/${id}`);
    } catch (error) {
      console.error("Error updating resume:", error);
      setSubmitError(
        error.response?.data?.error ||
          error.message ||
          "Failed to update resume. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // AI Handlers
  const handleGenerateAiSummary = async () => {
    if (!formData.professionalTitle || !formData.professionalTitle.trim()) {
      alert("Please enter your Professional Title first!");
      return;
    }

    setAiLoading((prev) => ({ ...prev, summary: true }));
    setAiNotice("");

    try {
      const res = await improveSummaryWithAI({
        currentSummary: formData.summary,
        professionalTitle: formData.professionalTitle,
        skills: formData.skills,
      });

      if (res.summary) {
        setFormData((prev) => ({ ...prev, summary: res.summary }));
        setAiNotice("✨ AI Professional Summary updated!");
      }
    } catch (err) {
      console.error("AI Summary generation failed:", err);
      alert("Failed to generate AI summary.");
    } finally {
      setAiLoading((prev) => ({ ...prev, summary: false }));
    }
  };

  const handlePolishBulletWithAi = async (index) => {
    const exp = formData.experiences[index];
    if (!exp.description || !exp.description.trim()) {
      alert("Please enter a few words or draft bullets first!");
      return;
    }

    setAiLoading((prev) => ({ ...prev, [`bullet_${index}`]: true }));
    setAiNotice("");

    try {
      const res = await improveBulletWithAI({
        bullet: exp.description,
        position: exp.position,
        company: exp.company,
      });

      if (res.improved) {
        setBulletAiSuggestions((prev) => ({
          ...prev,
          [index]: {
            improved: res.improved,
            alternatives: res.alternatives || [],
          },
        }));
      }
    } catch (err) {
      console.error("AI Bullet polish failed:", err);
      alert("Failed to polish bullet with AI.");
    } finally {
      setAiLoading((prev) => ({ ...prev, [`bullet_${index}`]: false }));
    }
  };

  const handleApplyBulletSuggestion = (index, text) => {
    handleExperienceChange(index, "description", text);
    setBulletAiSuggestions((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setAiNotice("✨ Polished bullet applied!");
  };

  const handleSuggestSkills = async () => {
    setAiLoading((prev) => ({ ...prev, skills: true }));
    setAiNotice("");

    try {
      const res = await suggestSkillsWithAI({
        professionalTitle: formData.professionalTitle,
        existingSkills: formData.skills,
      });

      if (res.skills && Array.isArray(res.skills)) {
        setSuggestedSkills(res.skills);
        setAiNotice("✨ In-demand skills loaded!");
      }
    } catch (err) {
      console.error("AI Skills suggestion failed:", err);
      alert("Failed to fetch skills.");
    } finally {
      setAiLoading((prev) => ({ ...prev, skills: false }));
    }
  };

  const handleAddSkill = (skill) => {
    setFormData((prev) => {
      const current = prev.skills ? prev.skills.trim() : "";
      const updated = current ? `${current}\n${skill}` : skill;
      return { ...prev, skills: updated };
    });
    setSuggestedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleAddAllSkills = () => {
    setFormData((prev) => {
      const current = prev.skills ? prev.skills.trim() : "";
      const newItems = suggestedSkills.join("\n");
      const updated = current ? `${current}\n${newItems}` : newItems;
      return { ...prev, skills: updated };
    });
    setSuggestedSkills([]);
  };

  const handleAiGenerateResume = async () => {
    try {
      setAiFullGenerating(true);
      setAiNotice("");
      setSubmitError("");

      const result = await generateCompleteResumeWithAI({
        ...formData,
        templateId: formData.templateId || "modern",
      });

      if (result) {
        setFormData((prev) => ({
          ...prev,
          fullName: result.fullName || prev.fullName,
          professionalTitle: result.professionalTitle || prev.professionalTitle,
          email: result.email || prev.email,
          phone: result.phone || prev.phone,
          location: result.location || prev.location,
          summary: result.summary || prev.summary,
          experiences:
            Array.isArray(result.experiences) && result.experiences.length > 0
              ? result.experiences
              : prev.experiences,
          education:
            Array.isArray(result.education) && result.education.length > 0
              ? result.education
              : prev.education,
          skills: Array.isArray(result.skills)
            ? result.skills.join("\n")
            : result.skills || prev.skills,
          templateId: result.templateId || prev.templateId,
        }));

        setAiFullSuccess({
          score: result.atsScore || 95,
          highlights: result.aiHighlights || [
            "Tailored high-impact summary to your target title",
            "Crafted metrics-driven accomplishments for all experiences",
            "Added top-tier ATS keywords for maximum recruiter visibility",
            "Formatted everything cleanly into your selected template",
          ],
        });

        setShowPreview(true);
      }
    } catch (err) {
      console.error("AI Full Generation Error in Edit:", err);
      setSubmitError(
        err.response?.data?.error ||
          err.message ||
          "Failed to generate resume with AI",
      );
    } finally {
      setAiFullGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const visibleElement = document.getElementById("resume-preview-pdf");
      const targetElement = visibleElement || pdfOffscreenRef.current;

      if (!targetElement) {
        throw new Error("Unable to locate resume content for PDF export.");
      }

      const safeTitle = formData.title
        ? formData.title.replace(/[^a-zA-Z0-9-_ ]/g, "")
        : formData.fullName
        ? `${formData.fullName.replace(/[^a-zA-Z0-9-_ ]/g, "")}_Resume`
        : "resume";

      await exportElementToPdf(targetElement, `${safeTitle}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert(error.message || "Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <Header />
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="ats-spinner"></div>
            <p>Loading resume for editing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />

        <div className="create-resume-container">
          {/* Header */}
          <div className="create-resume-header">
            <h1>Edit Resume</h1>
            <p>Update your details, polish bullet points with AI, and re-export</p>

            {aiStatus && (
              <div
                className={`ai-status-badge ${
                  aiStatus.configured ? "" : "warning"
                }`}
              >
                <span>
                  {aiStatus.configured
                    ? "AI Assistant: Active"
                    : "AI Assistant: Ready"}
                </span>
              </div>
            )}

            {aiNotice && (
              <div className="ai-notice-banner">
                <span>{aiNotice}</span>
                <button type="button" onClick={() => setAiNotice("")}>
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="resume-top-actions">
            <button
              type="button"
              className="btn-ai-quick-generate"
              onClick={handleAiGenerateResume}
              disabled={aiFullGenerating}
              title="Generate complete resume with AI using your information and chosen template"
            >
              {aiFullGenerating ? "⏳ AI Working..." : "✨ Make Resume with AI"}
            </button>
            <button
              type="button"
              className="btn-ats-scan"
              onClick={() => setShowAtsModal(true)}
              title="Run AI ATS check"
            >
              Check ATS Score with AI
            </button>
            <button
              type="button"
              className={`btn-toggle-preview ${showPreview ? "active" : ""}`}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "📋 Hide Preview" : "👁️ Show Preview"}
            </button>
          </div>

          {/* Form and Preview Split View */}
          <div
            className={`create-resume-wrapper ${
              showPreview ? "split-view" : ""
            }`}
          >
            {/* Form Section */}
            <div className="form-section">
              <div className="resume-tabs">
                <button
                  type="button"
                  className={`tab ${activeTab === "personal" ? "active" : ""}`}
                  onClick={() => setActiveTab("personal")}
                >
                  👤 Personal
                </button>
                <button
                  type="button"
                  className={`tab ${
                    activeTab === "experience" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("experience")}
                >
                  💼 Experience
                </button>
                <button
                  type="button"
                  className={`tab ${
                    activeTab === "education" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("education")}
                >
                  🎓 Education
                </button>
                <button
                  type="button"
                  className={`tab ${activeTab === "skills" ? "active" : ""}`}
                  onClick={() => setActiveTab("skills")}
                >
                  ⚡ Skills
                </button>
                <button
                  type="button"
                  className={`tab ${activeTab === "template" ? "active" : ""}`}
                  onClick={() => setActiveTab("template")}
                >
                  🎨 Template
                </button>
              </div>

              <form onSubmit={handleSave} className="resume-form">
                {submitError && (
                  <div className="alert alert-error">
                    <p>{submitError}</p>
                  </div>
                )}

                {/* Personal Tab */}
                {activeTab === "personal" && (
                  <div className="tab-content personal-tab">
                    <h2>Personal Information</h2>

                    <div className="form-group">
                      <label htmlFor="title">Resume Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Software Engineer"
                        className={errors.title ? "error" : ""}
                      />
                      {errors.title && (
                        <span className="error-text">{errors.title}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={errors.fullName ? "error" : ""}
                      />
                      {errors.fullName && (
                        <span className="error-text">{errors.fullName}</span>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={errors.email ? "error" : ""}
                        />
                        {errors.email && (
                          <span className="error-text">{errors.email}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={errors.phone ? "error" : ""}
                        />
                        {errors.phone && (
                          <span className="error-text">{errors.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="location">Location *</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={errors.location ? "error" : ""}
                        />
                        {errors.location && (
                          <span className="error-text">{errors.location}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="professionalTitle">
                          Professional Title *
                        </label>
                        <input
                          type="text"
                          id="professionalTitle"
                          name="professionalTitle"
                          value={formData.professionalTitle}
                          onChange={handleInputChange}
                          className={errors.professionalTitle ? "error" : ""}
                        />
                        {errors.professionalTitle && (
                          <span className="error-text">
                            {errors.professionalTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="section-label-with-ai">
                        <label htmlFor="summary">Professional Summary</label>
                        <button
                          type="button"
                          className="btn-ai-assist"
                          onClick={handleGenerateAiSummary}
                          disabled={aiLoading.summary}
                        >
                          {aiLoading.summary
                            ? "✨ Crafting with AI..."
                            : "✨ Polish with AI"}
                        </button>
                      </div>
                      <textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-next"
                      onClick={() => setActiveTab("experience")}
                    >
                      Next: Experience →
                    </button>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                  <div className="tab-content experience-tab">
                    <h2>Work Experience</h2>

                    {formData.experiences.map((exp, index) => (
                      <div key={index} className="experience-block">
                        <div className="block-header">
                          <h3>Position {index + 1}</h3>
                          {formData.experiences.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => removeExperience(index)}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Role</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "position",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              placeholder="e.g. 2021-03"
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>End Date</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              placeholder="e.g. Present"
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="section-label-with-ai">
                            <label>Job Description / Bullets</label>
                            <button
                              type="button"
                              className="btn-ai-assist"
                              onClick={() => handlePolishBulletWithAi(index)}
                              disabled={aiLoading[`bullet_${index}`]}
                            >
                              {aiLoading[`bullet_${index}`]
                                ? "✨ Polishing..."
                                : "✨ Polish with AI"}
                            </button>
                          </div>
                          <textarea
                            value={exp.description}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows="4"
                          />

                          {bulletAiSuggestions[index] && (
                            <div className="ai-suggestions-container">
                              <div className="ai-suggestions-header">
                                <h4>AI Recommendations</h4>
                                <button
                                  type="button"
                                  className="btn-dismiss-ai"
                                  onClick={() =>
                                    setBulletAiSuggestions((prev) => {
                                      const c = { ...prev };
                                      delete c[index];
                                      return c;
                                    })
                                  }
                                >
                                  Dismiss ✕
                                </button>
                              </div>
                              <div className="ai-suggestion-card primary">
                                <span className="badge-type">
                                  Recommended (High Impact)
                                </span>
                                <p>{bulletAiSuggestions[index].improved}</p>
                                <button
                                  type="button"
                                  className="btn-apply-suggestion"
                                  onClick={() =>
                                    handleApplyBulletSuggestion(
                                      index,
                                      bulletAiSuggestions[index].improved
                                    )
                                  }
                                >
                                  ✓ Use This Version
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn-add"
                      onClick={addExperience}
                    >
                      + Add Position
                    </button>

                    <div className="tab-navigation">
                      <button
                        type="button"
                        className="btn-prev"
                        onClick={() => setActiveTab("personal")}
                      >
                        ← Previous
                      </button>
                      <button
                        type="button"
                        className="btn-next"
                        onClick={() => setActiveTab("education")}
                      >
                        Next: Education →
                      </button>
                    </div>
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === "education" && (
                  <div className="tab-content education-tab">
                    <h2>Education</h2>
                    {formData.education.map((edu, index) => (
                      <div key={index} className="education-block">
                        <div className="block-header">
                          <h3>School {index + 1}</h3>
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => removeEducation(index)}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>School</label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "school",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Field</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "field",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Year</label>
                            <input
                              type="text"
                              value={edu.graduationYear}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "graduationYear",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn-add"
                      onClick={addEducation}
                    >
                      + Add Education
                    </button>

                    <div className="tab-navigation">
                      <button
                        type="button"
                        className="btn-prev"
                        onClick={() => setActiveTab("experience")}
                      >
                        ← Previous
                      </button>
                      <button
                        type="button"
                        className="btn-next"
                        onClick={() => setActiveTab("skills")}
                      >
                        Next: Skills →
                      </button>
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === "skills" && (
                  <div className="tab-content skills-tab">
                    <h2>Skills</h2>
                    <div className="form-group">
                      <div className="section-label-with-ai">
                        <label htmlFor="skills">List Your Skills</label>
                        <button
                          type="button"
                          className="btn-ai-assist"
                          onClick={handleSuggestSkills}
                          disabled={aiLoading.skills}
                        >
                          {aiLoading.skills
                            ? "✨ Finding..."
                            : "✨ Suggest Skills with AI"}
                        </button>
                      </div>
                      <textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        rows="6"
                      />

                      {suggestedSkills.length > 0 && (
                        <div className="ai-skills-container">
                          <div className="ai-skills-header">
                            <span>✨ Suggested ATS Skills:</span>
                            <button
                              type="button"
                              className="btn-add-all-skills"
                              onClick={handleAddAllSkills}
                            >
                              + Add All
                            </button>
                          </div>
                          <div className="ai-skills-pills">
                            {suggestedSkills.map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="ai-skill-pill"
                                onClick={() => handleAddSkill(s)}
                              >
                                + {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="tab-navigation">
                      <button
                        type="button"
                        className="btn-prev"
                        onClick={() => setActiveTab("education")}
                      >
                        ← Previous
                      </button>
                      <button
                        type="button"
                        className="btn-next"
                        onClick={() => setActiveTab("template")}
                      >
                        Next: Template →
                      </button>
                    </div>
                  </div>
                )}

                {/* Template Tab */}
                {activeTab === "template" && (
                  <div className="tab-content template-tab">
                    <h2>Choose Resume Template</h2>
                    <div className="template-grid">
                      <div
                        className={`template-card ${
                          formData.templateId === "modern" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "modern" }))
                        }
                      >
                        <div className="template-preview modern-template">
                          <div className="template-line" style={{ background: "#7c3aed" }}></div>
                          <div className="template-line short"></div>
                          <div className="template-line"></div>
                        </div>
                        <h4>Modern Clean</h4>
                        <p>Purple header with balanced structure</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "classic" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "classic" }))
                        }
                      >
                        <div className="template-preview classic-template">
                          <div className="template-header"></div>
                          <div className="template-line"></div>
                          <div className="template-line"></div>
                        </div>
                        <h4>Classic Serif</h4>
                        <p>Traditional executive layout</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "teal-banner" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "teal-banner" }))
                        }
                      >
                        <div className="template-preview teal-preview">
                          <div style={{ background: "#005f73", height: "30px", width: "100%", borderRadius: "4px 4px 0 0", marginBottom: "4px" }}></div>
                          <div style={{ display: "flex", gap: "6px", height: "55px" }}>
                            <div style={{ width: "35%", background: "#f0fdfa", borderRadius: "3px" }}></div>
                            <div style={{ width: "65%", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <div style={{ height: "5px", background: "#cbd5e1", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#cbd5e1", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h4>Teal Executive</h4>
                        <p>Deep teal banner with photo & 2 columns</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "dark-sidebar" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "dark-sidebar" }))
                        }
                      >
                        <div className="template-preview dark-preview">
                          <div style={{ display: "flex", height: "90px", width: "100%" }}>
                            <div style={{ width: "35%", background: "#111827", height: "100%", borderRadius: "4px 0 0 4px", padding: "4px" }}>
                              <div style={{ height: "4px", background: "#fb7185", width: "60%", borderRadius: "2px", marginBottom: "4px" }}></div>
                              <div style={{ height: "3px", background: "#4b5563", width: "80%", borderRadius: "2px" }}></div>
                            </div>
                            <div style={{ width: "65%", background: "#ffffff", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ height: "6px", background: "#0f172a", width: "70%", borderRadius: "2px" }}></div>
                              <div style={{ height: "4px", background: "#be123c", width: "50%", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h4>Obsidian Pro</h4>
                        <p>Dark black left sidebar & rose accents</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "classic-rose" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "classic-rose" }))
                        }
                      >
                        <div className="template-preview rose-preview">
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px", borderBottom: "1px solid #fecdd3", marginBottom: "4px" }}>
                            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#fda4af" }}></div>
                            <div style={{ flex: 1, height: "5px", background: "#1e1b4b", borderRadius: "2px" }}></div>
                          </div>
                          <div style={{ display: "flex", gap: "6px", flex: 1 }}>
                            <div style={{ width: "35%", background: "#fff1f2", borderRadius: "2px", height: "50px" }}></div>
                            <div style={{ width: "65%", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <div style={{ height: "5px", background: "#be123c", width: "50%", borderRadius: "2px" }}></div>
                              <div style={{ height: "4px", background: "#cbd5e1", width: "90%", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h4>Classic Rose</h4>
                        <p>Circular avatar with rose accent pills</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "azure-sidebar" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "azure-sidebar" }))
                        }
                      >
                        <div className="template-preview azure-preview">
                          <div style={{ display: "flex", height: "90px", width: "100%" }}>
                            <div style={{ width: "65%", background: "#ffffff", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ height: "6px", background: "#0f172a", width: "60%", borderRadius: "2px" }}></div>
                              <div style={{ height: "4px", background: "#0284c7", width: "45%", borderRadius: "2px" }}></div>
                            </div>
                            <div style={{ width: "35%", background: "#0284c7", height: "100%", borderRadius: "0 4px 4px 0", padding: "4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                              <div style={{ width: "14px", height: "16px", background: "rgba(255,255,255,0.7)", borderRadius: "2px" }}></div>
                              <div style={{ height: "3px", background: "rgba(255,255,255,0.8)", width: "80%", borderRadius: "1px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h4>Azure Corporate</h4>
                        <p>Cobalt/azure blue right sidebar & photo</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "crimson-sidebar" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "crimson-sidebar" }))
                        }
                      >
                        <div className="template-preview crimson-preview">
                          <div style={{ display: "flex", height: "90px", width: "100%" }}>
                            <div style={{ width: "35%", background: "#9f1239", height: "100%", borderRadius: "4px 0 0 4px", padding: "4px", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <div style={{ height: "4px", background: "#ffffff", width: "70%", borderRadius: "2px" }}></div>
                              <div style={{ height: "3px", background: "rgba(255,255,255,0.6)", width: "80%", borderRadius: "1px" }}></div>
                            </div>
                            <div style={{ width: "65%", background: "#ffffff", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ height: "6px", background: "#0f172a", width: "65%", borderRadius: "2px" }}></div>
                              <div style={{ height: "4px", background: "#0891b2", width: "45%", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h4>Crimson Creative</h4>
                        <p>Rich crimson sidebar with proficiency bars</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "minimal" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "minimal" }))
                        }
                      >
                        <div className="template-preview minimal-preview"></div>
                        <h4>Minimal</h4>
                        <p>Clean single column layout</p>
                      </div>

                      <div
                        className={`template-card ${
                          formData.templateId === "creative" ? "selected" : ""
                        }`}
                        onClick={() =>
                          setFormData((p) => ({ ...p, templateId: "creative" }))
                        }
                      >
                        <div className="template-preview creative-template">
                          <div className="template-accent" style={{ background: "#7c3aed" }}></div>
                          <div className="template-line"></div>
                        </div>
                        <h4>Creative</h4>
                        <p>Accent style layout</p>
                      </div>
                    </div>

                    <div className="tab-navigation">
                      <button
                        type="button"
                        className="btn-prev"
                        onClick={() => setActiveTab("skills")}
                      >
                        ← Previous
                      </button>
                    </div>

                    {aiFullSuccess && (
                      <div className="ai-success-inline-notification">
                        <span>🎉 Resume polished by AI! ATS Score: <strong>{aiFullSuccess.score}%</strong></span>
                      </div>
                    )}
                  </div>
                )}

                {/* Save, AI, and Download Buttons */}
                <div className="form-actions" style={{ marginTop: "30px" }}>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={saving || aiFullGenerating}
                  >
                    {saving ? "Saving Changes..." : "💾 Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn-ai-generate-action"
                    onClick={handleAiGenerateResume}
                    disabled={aiFullGenerating || saving}
                  >
                    {aiFullGenerating ? "⏳ Generating with AI..." : "✨ Generate with AI"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => navigate(`/view-resume/${id}`)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-submit"
                    style={{ background: "#0f172a" }}
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf || saving || aiFullGenerating}
                  >
                    {downloadingPdf ? "⏳ Generating PDF..." : "⬇️ Download PDF"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Section */}
            {showPreview && (
              <div className="preview-section">
                <div className="preview-header">
                  <div>
                    <h3>Live Preview</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>Template:</span>
                      <select
                        value={formData.templateId}
                        onChange={(e) => setFormData((p) => ({ ...p, templateId: e.target.value }))}
                        style={{
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          color: "#1e293b",
                          fontWeight: "600",
                          background: "#fff",
                          cursor: "pointer"
                        }}
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
                </div>
                <div id="resume-preview-pdf" className="preview-content">
                  <ResumeTemplate
                    data={{
                      personalInfo: {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        professionalTitle: formData.professionalTitle,
                        summary: formData.summary,
                      },
                      experiences: formData.experiences,
                      education: formData.education,
                      skills: formData.skills,
                    }}
                    templateId={formData.templateId}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Off-screen template container for instant 1-click PDF download without opening preview */}
        <div
          ref={pdfOffscreenRef}
          style={{ position: "fixed", left: "-9999px", top: 0, width: "850px", background: "#ffffff", zIndex: -9999 }}
        >
          <ResumeTemplate
            data={{
              personalInfo: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                professionalTitle: formData.professionalTitle,
                summary: formData.summary,
              },
              experiences: formData.experiences,
              education: formData.education,
              skills: formData.skills,
            }}
            templateId={formData.templateId}
          />
        </div>

        {/* Real-time Gemini ATS Analyzer Modal */}
        <AtsAnalyzerModal
          isOpen={showAtsModal}
          onClose={() => setShowAtsModal(false)}
          resumeData={formData}
          resumeId={id}
          onAddMissingSkill={handleAddSkill}
        />
      </div>
    </div>
  );
}
