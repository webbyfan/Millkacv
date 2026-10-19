import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ResumeTemplate from "../components/ResumeTemplate";
import {
  createResume,
  improveSummaryWithAI,
  improveBulletWithAI,
  suggestSkillsWithAI,
  getAIStatus,
  generateCompleteResumeWithAI,
} from "../services/api";
import { exportElementToPdf } from "../utils/pdf";
import AtsAnalyzerModal from "../components/AtsAnalyzerModal";
import "../styles/CreateResume.css";

export default function CreateResumePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pdfOffscreenRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [formData, setFormData] = useState({
    // Resume Title/Name
    title: "",

    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    location: "",
    professionalTitle: "",

    // Professional Summary
    summary: "",

    // Work Experience
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],

    // Education
    education: [{ school: "", degree: "", field: "", graduationYear: "" }],

    // Skills
    skills: "",

    // Template Selection
    templateId: "modern",
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

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

    if (location.state?.importedResume) {
      const imp = location.state.importedResume;
      setFormData((prev) => ({
        ...prev,
        title: imp.title || prev.title || "Imported Resume",
        fullName: imp.fullName || prev.fullName,
        email: imp.email || prev.email,
        phone: imp.phone || prev.phone,
        location: imp.location || prev.location,
        professionalTitle: imp.professionalTitle || prev.professionalTitle,
        summary: imp.summary || prev.summary,
        experiences:
          Array.isArray(imp.experiences) && imp.experiences.length > 0
            ? imp.experiences
            : prev.experiences,
        education:
          Array.isArray(imp.education) && imp.education.length > 0
            ? imp.education
            : prev.education,
        skills: Array.isArray(imp.skills)
          ? imp.skills.join("\n")
          : imp.skills || prev.skills,
      }));
      setAiNotice(
        "✨ External CV successfully imported! Review your details, enhance them with AI, and download your ATS resume."
      );
    }
  }, [location.state]);

  // AI: Generate or Polish Summary
  const handleGenerateAiSummary = async () => {
    if (!formData.professionalTitle || !formData.professionalTitle.trim()) {
      alert("Please enter your Professional Title first so AI can tailor your summary!");
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
        setAiNotice(
          res.isFallback
            ? "✨ Summary generated! (Configure AI key in backend/.env for live AI generation)"
            : "✨ AI Professional Summary applied successfully!"
        );
      }
    } catch (err) {
      console.error("AI Summary generation failed:", err);
      alert("Failed to generate AI summary. Please check your backend connection.");
    } finally {
      setAiLoading((prev) => ({ ...prev, summary: false }));
    }
  };

  // AI: Polish bullet point for an experience
  const handlePolishBulletWithAi = async (index) => {
    const exp = formData.experiences[index];
    if (!exp.description || !exp.description.trim()) {
      alert("Please enter a few words or a draft of your responsibilities first!");
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
      alert("Failed to polish bullet with AI. Please check your connection.");
    } finally {
      setAiLoading((prev) => ({ ...prev, [`bullet_${index}`]: false }));
    }
  };

  // Apply chosen bullet suggestion
  const handleApplyBulletSuggestion = (index, text) => {
    handleExperienceChange(index, "description", text);
    setBulletAiSuggestions((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setAiNotice("✨ Polished bullet applied!");
  };

  // Dismiss bullet suggestions
  const handleDismissBulletSuggestions = (index) => {
    setBulletAiSuggestions((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  // AI: Suggest In-Demand Skills
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
        setAiNotice("✨ In-demand skills loaded! Click any skill to add it to your list.");
      }
    } catch (err) {
      console.error("AI Skills suggestion failed:", err);
      alert("Failed to fetch suggested skills.");
    } finally {
      setAiLoading((prev) => ({ ...prev, skills: false }));
    }
  };

  // Add individual skill from suggestions
  const handleAddSkill = (skill) => {
    setFormData((prev) => {
      const current = prev.skills ? prev.skills.trim() : "";
      const updated = current ? `${current}\n${skill}` : skill;
      return { ...prev, skills: updated };
    });
    setSuggestedSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Add all suggested skills
  const handleAddAllSkills = () => {
    setFormData((prev) => {
      const current = prev.skills ? prev.skills.trim() : "";
      const newItems = suggestedSkills.join("\n");
      const updated = current ? `${current}\n${newItems}` : newItems;
      return { ...prev, skills: updated };
    });
    setSuggestedSkills([]);
    setAiNotice("✨ All suggested skills added!");
  };

  // Full Resume AI Generation after user inputs info and chooses template
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
          title: prev.title || `${result.professionalTitle || prev.professionalTitle || "Professional"} Resume`,
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

        // Automatically open live preview so the user sees their generated resume immediately
        setShowPreview(true);
      }
    } catch (err) {
      console.error("AI Full Generation Error:", err);
      setSubmitError(
        err.response?.data?.error ||
          err.message ||
          "Failed to generate resume with AI",
      );
    } finally {
      setAiFullGenerating(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle experience changes
  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      experiences: newExperiences,
    }));
  };

  // Add new experience
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

  // Remove experience
  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      education: newEducation,
    }));
  };

  // Add new education
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", field: "", graduationYear: "" },
      ],
    }));
  };

  // Remove education
  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Validate form
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

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare resume data for backend
      const resumeData = {
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
            (exp) => exp.company || exp.position,
          ),
          education: formData.education.filter(
            (edu) => edu.school || edu.degree,
          ),
          skills: formData.skills
            .split("\n")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0),
          template: formData.templateId,
        },
      };

      // Call API to create resume
      const result = await createResume(resumeData);

      // Success
      alert("Resume created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating resume:", error);
      setSubmitError(
        error.response?.data?.error ||
          error.message ||
          "Failed to create resume. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setSubmitError("");

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

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />

        <div className="create-resume-container">
          {/* Header Section */}
          <div className="create-resume-header">
            <h1>Create New Resume</h1>
            <p>Build your professional resume step by step with AI-powered optimization</p>
            {aiStatus && (
              <div className={`ai-status-badge ${aiStatus.configured ? "" : "warning"}`}>
                <span>{aiStatus.configured ? "AI Assistant: Active" : "AI Assistant: Ready"}</span>
              </div>
            )}
            {aiNotice && (
              <div className="ai-notice-banner">
                <span>{aiNotice}</span>
                <button type="button" onClick={() => setAiNotice("")}>✕</button>
              </div>
            )}
          </div>

          {/* Top Actions: AI ATS Scan, Full AI Resume Generator & Preview Toggle */}
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
              title="Run AI ATS check against a job description"
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

          {/* Main Content - Split View */}
          <div
            className={`create-resume-wrapper ${showPreview ? "split-view" : ""}`}
          >
            {/* Form Section */}
            <div className="form-section">
              {/* Tab Navigation */}
              <div className="resume-tabs">
                <button
                  className={`tab ${activeTab === "personal" ? "active" : ""}`}
                  onClick={() => setActiveTab("personal")}
                >
                  👤 Personal Info
                </button>
                <button
                  className={`tab ${activeTab === "experience" ? "active" : ""}`}
                  onClick={() => setActiveTab("experience")}
                >
                  💼 Experience
                </button>
                <button
                  className={`tab ${activeTab === "education" ? "active" : ""}`}
                  onClick={() => setActiveTab("education")}
                >
                  🎓 Education
                </button>
                <button
                  className={`tab ${activeTab === "skills" ? "active" : ""}`}
                  onClick={() => setActiveTab("skills")}
                >
                  ⚡ Skills
                </button>
                <button
                  className={`tab ${activeTab === "template" ? "active" : ""}`}
                  onClick={() => setActiveTab("template")}
                >
                  🎨 Template
                </button>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="resume-form">
                {/* Submit Error Alert */}
                {submitError && (
                  <div className="alert alert-error">
                    <p>{submitError}</p>
                  </div>
                )}
                {/* Personal Information Tab */}
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
                        placeholder="e.g. Senior Software Engineer - 2024"
                        className={errors.title ? "error" : ""}
                      />
                      {errors.title && (
                        <span className="error-text">{errors.title}</span>
                      )}
                      <p className="helper-text">
                        Give your resume a name to distinguish multiple versions
                      </p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={errors.fullName ? "error" : ""}
                      />
                      {errors.fullName && (
                        <span className="error-text">{errors.fullName}</span>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className={errors.email ? "error" : ""}
                        />
                        {errors.email && (
                          <span className="error-text">{errors.email}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+251 91 234 5678"
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
                          placeholder="New York, NY"
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
                          placeholder="Senior Software Engineer"
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
                          title="Generate or polish professional summary using AI"
                        >
                          {aiLoading.summary ? "Crafting with AI..." : "Write with AI"}
                        </button>
                      </div>
                      <textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        placeholder="Brief overview of your professional background, core competencies, and career achievements..."
                        rows="4"
                      />
                      <p className="helper-text">
                        Tip: Click "Write with AI" above to automatically generate a tailored ATS summary from your title & skills.
                      </p>
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
                              title="Remove this experience"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "company",
                                  e.target.value,
                                )
                              }
                              placeholder="Tech Corp Inc."
                            />
                          </div>

                          <div className="form-group">
                            <label>Job Position</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "position",
                                  e.target.value,
                                )
                              }
                              placeholder="Software Engineer"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Start Date</label>
                            <input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "startDate",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="form-group">
                            <label>End Date</label>
                            <input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) =>
                                handleExperienceChange(
                                  index,
                                  "endDate",
                                  e.target.value,
                                )
                              }
                              placeholder="Leave blank if current"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="section-label-with-ai">
                            <label>Job Description / Achievements</label>
                            <button
                              type="button"
                              className="btn-ai-assist"
                              onClick={() => handlePolishBulletWithAi(index)}
                              disabled={aiLoading[`bullet_${index}`]}
                              title="Polish bullet points using action verbs and metrics"
                            >
                              {aiLoading[`bullet_${index}`] ? "✨ Polishing..." : "✨ Polish with AI"}
                            </button>
                          </div>
                          <textarea
                            value={exp.description}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="• Describe your responsibilities and achievements&#10;• Use bullet points for clarity"
                            rows="4"
                          />

                          {/* AI Bullet Suggestions Card */}
                          {bulletAiSuggestions[index] && (
                            <div className="ai-suggestions-container">
                              <div className="ai-suggestions-header">
                                <h4>AI Recommendations</h4>
                                <button
                                  type="button"
                                  className="btn-dismiss-ai"
                                  onClick={() => handleDismissBulletSuggestions(index)}
                                >
                                  Dismiss ✕
                                </button>
                              </div>

                              <div className="ai-suggestion-card primary">
                                <span className="badge-type">Recommended (High Impact)</span>
                                <p>{bulletAiSuggestions[index].improved}</p>
                                <button
                                  type="button"
                                  className="btn-apply-suggestion"
                                  onClick={() =>
                                    handleApplyBulletSuggestion(
                                      index,
                                      bulletAiSuggestions[index].improved,
                                    )
                                  }
                                >
                                  ✓ Use This Version
                                </button>
                              </div>

                              {bulletAiSuggestions[index].alternatives &&
                                bulletAiSuggestions[index].alternatives.map((alt, altIdx) => (
                                  <div key={altIdx} className="ai-suggestion-card">
                                    <span className="badge-type">Variation {altIdx + 1}</span>
                                    <p>{alt}</p>
                                    <button
                                      type="button"
                                      className="btn-apply-suggestion"
                                      onClick={() => handleApplyBulletSuggestion(index, alt)}
                                    >
                                      ✓ Use Variation {altIdx + 1}
                                    </button>
                                  </div>
                                ))}
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
                      + Add Another Position
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
                          <h3>Education {index + 1}</h3>
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => removeEducation(index)}
                              title="Remove this education"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>School / University</label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "school",
                                  e.target.value,
                                )
                              }
                              placeholder="Harvard University"
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
                                  e.target.value,
                                )
                              }
                              placeholder="Bachelor of Science"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Field of Study</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "field",
                                  e.target.value,
                                )
                              }
                              placeholder="Computer Science"
                            />
                          </div>

                          <div className="form-group">
                            <label>Graduation Year</label>
                            <input
                              type="number"
                              value={edu.graduationYear}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "graduationYear",
                                  e.target.value,
                                )
                              }
                              placeholder="2020"
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
                      + Add Another Education
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
                          title="Ask AI for in-demand ATS skills for your title"
                        >
                          {aiLoading.skills ? "Analyzing..." : "Suggest In-Demand Skills"}
                        </button>
                      </div>
                      <textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="Enter skills separated by commas or new lines&#10;Example: JavaScript, React, Node.js, Python, SQL, Docker, AWS"
                        rows="6"
                      />
                      <p className="helper-text">
                        Tip: Add relevant technical and soft skills that match
                        the job description
                      </p>

                      {/* AI Suggested Skills Pills */}
                      {suggestedSkills.length > 0 && (
                        <div className="ai-skills-container">
                          <div className="ai-skills-header">
                            <span>✨ Suggested ATS Skills for your role:</span>
                            <button
                              type="button"
                              className="btn-add-all-skills"
                              onClick={handleAddAllSkills}
                            >
                              + Add All Skills
                            </button>
                          </div>
                          <div className="ai-skills-pills">
                            {suggestedSkills.map((skill, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                className="ai-skill-pill"
                                onClick={() => handleAddSkill(skill)}
                                title="Click to add to your skills"
                              >
                                + {skill}
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
                    <h2>Choose Template</h2>

                    <div className="template-grid">
                      <div
                        className={`template-card ${formData.templateId === "modern" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "modern",
                          }))
                        }
                      >
                        <div className="template-preview modern-template">
                          <div className="template-line" style={{ background: "#7c3aed" }}></div>
                          <div className="template-line short"></div>
                          <div className="template-line"></div>
                          <div className="template-line short"></div>
                        </div>
                        <h3>Modern</h3>
                        <p>Clean purple header with balanced sections</p>
                      </div>

                      <div
                        className={`template-card ${formData.templateId === "classic" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "classic",
                          }))
                        }
                      >
                        <div className="template-preview classic-template">
                          <div className="template-header"></div>
                          <div className="template-line"></div>
                          <div className="template-line"></div>
                        </div>
                        <h3>Classic</h3>
                        <p>Traditional professional style</p>
                      </div>

                      {/* Template 1: Teal Executive */}
                      <div
                        className={`template-card ${formData.templateId === "teal-banner" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "teal-banner",
                          }))
                        }
                      >
                        <div className="template-preview teal-preview">
                          <div style={{ background: "#005f73", height: "32px", width: "100%", borderRadius: "4px 4px 0 0", marginBottom: "6px" }}></div>
                          <div style={{ display: "flex", gap: "6px", height: "60px" }}>
                            <div style={{ width: "35%", background: "#f0fdfa", borderRadius: "3px" }}></div>
                            <div style={{ width: "65%", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ height: "6px", background: "#cbd5e1", borderRadius: "2px" }}></div>
                              <div style={{ height: "6px", background: "#cbd5e1", borderRadius: "2px" }}></div>
                              <div style={{ height: "6px", background: "#cbd5e1", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h3>Teal Executive</h3>
                        <p>Deep teal top banner with executive photo & 2-column body</p>
                      </div>

                      {/* Template 2: Obsidian Pro */}
                      <div
                        className={`template-card ${formData.templateId === "dark-sidebar" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "dark-sidebar",
                          }))
                        }
                      >
                        <div className="template-preview dark-preview">
                          <div style={{ display: "flex", height: "98px", width: "100%" }}>
                            <div style={{ width: "35%", background: "#111827", height: "100%", borderRadius: "4px 0 0 4px", padding: "6px" }}>
                              <div style={{ height: "5px", background: "#fb7185", width: "60%", borderRadius: "2px", marginBottom: "6px" }}></div>
                              <div style={{ height: "4px", background: "#4b5563", width: "80%", borderRadius: "2px", marginBottom: "4px" }}></div>
                              <div style={{ height: "4px", background: "#4b5563", width: "70%", borderRadius: "2px" }}></div>
                            </div>
                            <div style={{ width: "65%", background: "#ffffff", padding: "6px", display: "flex", flexDirection: "column", gap: "5px" }}>
                              <div style={{ height: "8px", background: "#0f172a", width: "70%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#be123c", width: "50%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#e2e8f0", width: "90%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#e2e8f0", width: "80%", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h3>Obsidian Pro</h3>
                        <p>Black left sidebar, rose accents, dark pill skills</p>
                      </div>

                      {/* Template 3: Classic Rose */}
                      <div
                        className={`template-card ${formData.templateId === "classic-rose" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "classic-rose",
                          }))
                        }
                      >
                        <div className="template-preview rose-preview">
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px", borderBottom: "1px solid #fecdd3", marginBottom: "6px" }}>
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fda4af" }}></div>
                            <div style={{ flex: 1, height: "7px", background: "#1e1b4b", borderRadius: "2px" }}></div>
                          </div>
                          <div style={{ display: "flex", gap: "6px", flex: 1 }}>
                            <div style={{ width: "35%", background: "#fff1f2", borderRadius: "2px", height: "60px" }}></div>
                            <div style={{ width: "65%", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ height: "6px", background: "#be123c", width: "50%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#cbd5e1", width: "90%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#cbd5e1", width: "75%", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h3>Classic Rose</h3>
                        <p>Circular photo header with elegant rose accents</p>
                      </div>

                      {/* Template 4: Azure Corporate */}
                      <div
                        className={`template-card ${formData.templateId === "azure-sidebar" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "azure-sidebar",
                          }))
                        }
                      >
                        <div className="template-preview azure-preview">
                          <div style={{ display: "flex", height: "98px", width: "100%" }}>
                            <div style={{ width: "65%", background: "#ffffff", padding: "6px", display: "flex", flexDirection: "column", gap: "5px" }}>
                              <div style={{ height: "8px", background: "#0f172a", width: "60%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#0284c7", width: "45%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#e2e8f0", width: "90%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#e2e8f0", width: "80%", borderRadius: "2px" }}></div>
                            </div>
                            <div style={{ width: "35%", background: "#0284c7", height: "100%", borderRadius: "0 4px 4px 0", padding: "6px", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                              <div style={{ width: "18px", height: "20px", background: "rgba(255,255,255,0.7)", borderRadius: "3px" }}></div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.8)", width: "80%", borderRadius: "1px" }}></div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.6)", width: "60%", borderRadius: "1px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h3>Azure Corporate</h3>
                        <p>Corporate layout with deep azure blue right sidebar</p>
                      </div>

                      {/* Template 5: Crimson Creative */}
                      <div
                        className={`template-card ${formData.templateId === "crimson-sidebar" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "crimson-sidebar",
                          }))
                        }
                      >
                        <div className="template-preview crimson-preview">
                          <div style={{ display: "flex", height: "98px", width: "100%" }}>
                            <div style={{ width: "35%", background: "#9f1239", height: "100%", borderRadius: "4px 0 0 4px", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ height: "5px", background: "#ffffff", width: "70%", borderRadius: "2px" }}></div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.6)", width: "90%", borderRadius: "1px" }}></div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.6)", width: "75%", borderRadius: "1px" }}></div>
                            </div>
                            <div style={{ width: "65%", background: "#ffffff", padding: "6px", display: "flex", flexDirection: "column", gap: "5px" }}>
                              <div style={{ height: "8px", background: "#0f172a", width: "65%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#0891b2", width: "45%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#e2e8f0", width: "90%", borderRadius: "2px" }}></div>
                              <div style={{ height: "5px", background: "#e2e8f0", width: "75%", borderRadius: "2px" }}></div>
                            </div>
                          </div>
                        </div>
                        <h3>Crimson Creative</h3>
                        <p>Rich crimson sidebar with level bars & cyan accents</p>
                      </div>

                      <div
                        className={`template-card ${formData.templateId === "minimal" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "minimal",
                          }))
                        }
                      >
                        <div className="template-preview minimal-template">
                          <div className="template-line"></div>
                          <div className="template-line"></div>
                          <div className="template-line"></div>
                        </div>
                        <h3>Minimal</h3>
                        <p>Single column ATS-optimized clean layout</p>
                      </div>

                      <div
                        className={`template-card ${formData.templateId === "creative" ? "selected" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            templateId: "creative",
                          }))
                        }
                      >
                        <div className="template-preview creative-template">
                          <div className="template-accent" style={{ background: "#7c3aed" }}></div>
                          <div className="template-line"></div>
                          <div className="template-line short"></div>
                        </div>
                        <h3>Creative</h3>
                        <p>Bold styling with timeline markers</p>
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

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate("/dashboard")}
                        disabled={loading || aiFullGenerating || downloadingPdf}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-download-pdf-action"
                        onClick={handleDownloadPdf}
                        disabled={downloadingPdf || loading || aiFullGenerating}
                        title="Download resume as PDF immediately"
                      >
                        {downloadingPdf ? "⏳ Generating PDF..." : "⬇️ Download PDF"}
                      </button>
                      <button
                        type="button"
                        className="btn-ai-generate-action"
                        onClick={handleAiGenerateResume}
                        disabled={aiFullGenerating || loading || downloadingPdf}
                      >
                        {aiFullGenerating ? "⏳ Generating with AI..." : "✨ Generate with AI"}
                      </button>
                      <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading || aiFullGenerating || downloadingPdf}
                      >
                        {loading ? "Creating..." : "✓ Create Resume"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Preview Section */}
            {showPreview && (
              <div className="preview-section">
                <div className="preview-header">
                  <div>
                    <h3>Resume Preview</h3>
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
                  <button
                    type="button"
                    className="btn-secondary download-preview-btn"
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                  >
                    {downloadingPdf ? "⏳ Generating PDF..." : "⬇️ Download PDF"}
                  </button>
                </div>
                <div className="preview-content" id="resume-preview-pdf">
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
          onAddMissingSkill={handleAddSkill}
        />
      </div>
    </div>
  );
}
