import React, { useEffect, useRef, useState } from "react";
import "../styles/ResumeTemplates.css";

// Crisp inline SVGs for print & PDF fidelity
const IconPhone = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const IconMail = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IconLocation = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const IconLinkedin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
  </svg>
);

const IconWebsite = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const IconGithub = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
);

// Rating Dots Helper
const RatingDots = ({ score = 5, total = 5, filledColor = "#0d9488", emptyColor = "#e2e8f0" }) => (
  <span className="rt-rating-dots">
    {Array.from({ length: total }).map((_, i) => (
      <span
        key={i}
        className="rt-dot"
        style={{ backgroundColor: i < score ? filledColor : emptyColor }}
      />
    ))}
  </span>
);

// Progress Bar Helper
const RatingBar = ({ percent = 80, barColor = "#be123c", trackColor = "#fce7f3" }) => (
  <div className="rt-bar-track" style={{ backgroundColor: trackColor }}>
    <div
      className="rt-bar-fill"
      style={{ width: `${Math.min(100, Math.max(10, percent))}%`, backgroundColor: barColor }}
    />
  </div>
);

// Bullet points parser
const renderDescriptionBullets = (text) => {
  if (!text) return null;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return (
      <ul className="rt-entry-bullets">
        {lines.map((line, idx) => (
          <li key={idx}>{line.replace(/^[-*•]\s*/, "")}</li>
        ))}
      </ul>
    );
  }
  return <p className="entry-description">{text}</p>;
};

export default function ResumeTemplate({ data, templateId = "modern" }) {
  if (!data) {
    return <div className="resume-preview">No resume data</div>;
  }

  const {
    personalInfo = {},
    experiences = [],
    education = [],
    skills = [],
  } = data;

  const fileInputRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState(personalInfo.photo || "");
  const previousObjectUrl = useRef("");

  useEffect(() => {
    setPhotoUrl(personalInfo.photo || "");
  }, [personalInfo.photo]);

  useEffect(() => {
    if (
      previousObjectUrl.current &&
      previousObjectUrl.current.startsWith("blob:") &&
      previousObjectUrl.current !== photoUrl
    ) {
      URL.revokeObjectURL(previousObjectUrl.current);
    }
    previousObjectUrl.current = photoUrl;

    return () => {
      if (previousObjectUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(previousObjectUrl.current);
      }
    };
  }, [photoUrl]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  // Convert skills
  const skillList = Array.isArray(skills)
    ? skills.filter(Boolean)
    : typeof skills === "string"
    ? skills.split(/[\n,•]+/).map((s) => s.trim()).filter(Boolean)
    : [];

  const skillsText = skillList.join(" • ");

  // Normalizations for rich display
  const nameDisplay = personalInfo.fullName || "Taylor Parker";
  const titleDisplay = personalInfo.professionalTitle || "Senior Software Engineer | Product Team Lead";
  const phoneDisplay = personalInfo.phone || "321-554-8877";
  const emailDisplay = personalInfo.email || "taylor.parker@example.com";
  const locationDisplay = personalInfo.location || "San Francisco, CA";
  const cleanNameSlug = nameDisplay.toLowerCase().replace(/[^a-z0-9]/g, "");
  const linkedinDisplay = personalInfo.linkedin || `linkedin.com/in/${cleanNameSlug}`;
  const websiteDisplay = personalInfo.website || `${cleanNameSlug}.me`;
  const githubDisplay = personalInfo.github || `github.com/${cleanNameSlug}`;

  const summaryDisplay =
    personalInfo.summary ||
    "Passionate Software Engineer with 10+ years of experience in developing web applications and backend systems. Skilled at writing clear, concise code that is easy to maintain and troubleshoot. Experienced in working with both small and large teams across multiple projects and companies.";

  const skillsDisplay =
    skillList.length > 0
      ? skillList
      : [
          "Back-end development",
          "Front-end development",
          "Data Bases",
          "Machine Learning",
          "UX Design",
        ];

  const languagesDisplay =
    personalInfo.languages && personalInfo.languages.length > 0
      ? personalInfo.languages
      : [
          { name: "English", level: "Native", score: 5, percent: 100 },
          { name: "Spanish", level: "Fluent", score: 4, percent: 80 },
        ];

  const achievementsDisplay =
    personalInfo.achievements && personalInfo.achievements.length > 0
      ? personalInfo.achievements
      : [
          "Spearheaded a $12M software project from design to distribution as a senior software engineer in a 12-people team",
          "Coordinated a year-long release of a six-part platform project",
        ];

  const certificationsDisplay =
    personalInfo.certifications && personalInfo.certifications.length > 0
      ? personalInfo.certifications
      : [
          { title: "Certified Scrum Master by Atlassian", date: "Issued Jun 2017" },
          { title: "Certified React Native Developer", date: "Issued May 2019" },
          { title: "Certified Apple Developer", date: "Issued Apr 2021" },
        ];

  const experiencesDisplay =
    experiences.length > 0
      ? experiences
      : [
          {
            position: "Senior Software Engineer",
            company: "Google",
            startDate: "Jan 2020",
            endDate: "Present",
            location: "Mountain View, CA",
            description:
              "Developed design deliverables that elevated, differentiated, and functioned on-brand and on-strategy.\nManaged multiple design projects simultaneously, ensuring timely delivery within budget constraints.\nCreated compelling visual presentations to effectively communicate complex ideas to clients and stakeholders.\nDeveloped and maintained comprehensive library of design assets for easy access and reuse.",
          },
          {
            position: "Product Team Lead",
            company: "Dropbox",
            startDate: "Nov 2018",
            endDate: "Dec 2019",
            location: "San Francisco, CA",
            description:
              "Developed design deliverables that elevated, differentiated, and functioned on-brand and on-strategy.\nManaged multiple design projects simultaneously, ensuring timely delivery within budget constraints.\nCreated compelling visual presentations to effectively communicate complex ideas to clients and stakeholders.",
          },
        ];

  const educationDisplay =
    education.length > 0
      ? education
      : [
          {
            degree: "Master of Science in Computer Science",
            school: "Stanford University",
            graduationYear: "2016 - 2018",
            location: "Stanford, CA",
            field: "Artificial Intelligence & Distributed Systems",
          },
          {
            degree: "Bachelor of Science in Computer Science",
            school: "Carnegie Mellon University",
            graduationYear: "2013 - 2016",
            location: "Pittsburgh, PA",
            field: "Software Engineering",
          },
        ];

  // Photo Renderer Component
  const PhotoBlock = ({ className = "", shape = "rounded" }) => (
    <div
      className={`rt-photo-frame shape-${shape} ${photoUrl ? "has-photo" : ""} ${className}`}
      onClick={handlePhotoClick}
      title="Click to upload/change photo"
    >
      {photoUrl ? (
        <img src={photoUrl} alt="Candidate" className="rt-photo-img" />
      ) : (
        <div className="rt-photo-placeholder">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span className="rt-photo-badge">+</span>
        </div>
      )}
    </div>
  );

  // Hidden File Input
  const HiddenFileInput = () => (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handlePhotoChange}
    />
  );

  // ============================================
  // TEMPLATE 1: TEAL EXECUTIVE (Top Banner)
  // ============================================
  const TealBannerTemplate = () => (
    <div className="resume-template teal-banner-template">
      {/* Deep Teal Banner Header */}
      <div className="teal-header-banner">
        <div className="teal-header-text">
          <h1 className="teal-name">{nameDisplay}</h1>
          <p className="teal-title">{titleDisplay}</p>
          <div className="teal-contact-bar">
            <span><IconPhone /> {phoneDisplay}</span>
            <span><IconMail /> {emailDisplay}</span>
            <span><IconLocation /> {locationDisplay}</span>
            <span><IconLinkedin /> {linkedinDisplay}</span>
            <span><IconWebsite /> {websiteDisplay}</span>
          </div>
        </div>
        <div className="teal-header-photo">
          <PhotoBlock shape="rounded" className="teal-banner-photo" />
        </div>
      </div>

      {/* Two Column Content */}
      <div className="teal-body-grid">
        {/* Left Column */}
        <div className="teal-col-left">
          <div className="teal-section">
            <h2 className="teal-sec-title">Summary</h2>
            <p className="teal-summary-text">{summaryDisplay}</p>
          </div>

          <div className="teal-section">
            <h2 className="teal-sec-title">Skills</h2>
            <div className="teal-skills-wrap">
              {skillsDisplay.map((skill, i) => (
                <span key={i} className="teal-skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="teal-section">
            <h2 className="teal-sec-title">Languages</h2>
            <div className="teal-languages-list">
              {languagesDisplay.map((lang, i) => (
                <div key={i} className="teal-lang-item">
                  <div className="teal-lang-header">
                    <span className="teal-lang-name">{lang.name}</span>
                    <RatingDots score={lang.score || 5} total={5} filledColor="#006d77" emptyColor="#d1d5db" />
                  </div>
                  <span className="teal-lang-level">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="teal-section">
            <h2 className="teal-sec-title">Achievements</h2>
            <ul className="teal-achieve-list">
              {achievementsDisplay.map((ach, i) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="teal-col-right">
          <div className="teal-section">
            <h2 className="teal-sec-title">Experience</h2>
            {experiencesDisplay.map((exp, i) => (
              <div key={i} className="teal-entry">
                <div className="teal-entry-head">
                  <h3 className="teal-job-title">{exp.position}</h3>
                  <span className="teal-job-date">
                    {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                  </span>
                </div>
                <div className="teal-company-row">
                  <span className="teal-company-name">{exp.company}</span>
                  {exp.location && <span className="teal-company-loc">{exp.location}</span>}
                </div>
                {renderDescriptionBullets(exp.description)}
              </div>
            ))}
          </div>

          <div className="teal-section">
            <h2 className="teal-sec-title">Education</h2>
            {educationDisplay.map((edu, i) => (
              <div key={i} className="teal-entry">
                <div className="teal-entry-head">
                  <h3 className="teal-job-title">{edu.degree}</h3>
                  <span className="teal-job-date">{edu.graduationYear}</span>
                </div>
                <div className="teal-company-row">
                  <span className="teal-company-name">{edu.school}</span>
                  {edu.location && <span className="teal-company-loc">{edu.location}</span>}
                </div>
                {edu.field && <p className="teal-edu-field">{edu.field}</p>}
              </div>
            ))}
          </div>

          <div className="teal-section">
            <h2 className="teal-sec-title">Certifications</h2>
            <ul className="teal-cert-list">
              {certificationsDisplay.map((cert, i) => (
                <li key={i}>
                  <strong>{cert.title}</strong>
                  {cert.date && <span className="teal-cert-date"> • {cert.date}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // TEMPLATE 2: OBSIDIAN DARK SIDEBAR
  // ============================================
  const DarkSidebarTemplate = () => (
    <div className="resume-template dark-sidebar-template">
      {/* Left Dark Sidebar */}
      <div className="dark-sidebar-col">
        <div className="dark-sec">
          <h2 className="dark-sec-title">Contact Info</h2>
          <div className="dark-contact-list">
            <div className="dark-contact-item"><IconPhone /> <span>{phoneDisplay}</span></div>
            <div className="dark-contact-item"><IconMail /> <span>{emailDisplay}</span></div>
            <div className="dark-contact-item"><IconLocation /> <span>{locationDisplay}</span></div>
            <div className="dark-contact-item"><IconLinkedin /> <span>{linkedinDisplay}</span></div>
            <div className="dark-contact-item"><IconGithub /> <span>{githubDisplay}</span></div>
          </div>
        </div>

        <div className="dark-sec">
          <h2 className="dark-sec-title">Skills</h2>
          <div className="dark-skills-wrap">
            {skillsDisplay.map((skill, i) => (
              <span key={i} className="dark-skill-pill">{skill}</span>
            ))}
          </div>
        </div>

        <div className="dark-sec">
          <h2 className="dark-sec-title">Languages</h2>
          <div className="dark-lang-list">
            {languagesDisplay.map((lang, i) => (
              <div key={i} className="dark-lang-item">
                <div className="dark-lang-top">
                  <span>{lang.name}</span>
                  <RatingDots score={lang.score || 5} total={5} filledColor="#fb7185" emptyColor="#374151" />
                </div>
                <span className="dark-lang-sub">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dark-sec">
          <h2 className="dark-sec-title">Achievements</h2>
          <ul className="dark-bullet-list">
            {achievementsDisplay.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>

        <div className="dark-sec">
          <h2 className="dark-sec-title">Certifications</h2>
          <ul className="dark-bullet-list">
            {certificationsDisplay.map((cert, i) => (
              <li key={i}>
                <span>{cert.title}</span>
                {cert.date && <small className="dark-cert-date">{cert.date}</small>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Main Content */}
      <div className="dark-main-col">
        <div className="dark-header">
          <h1 className="dark-name">{nameDisplay}</h1>
          <p className="dark-title">{titleDisplay}</p>
        </div>

        <div className="dark-main-sec">
          <h2 className="dark-main-sec-title">Summary</h2>
          <p className="dark-main-text">{summaryDisplay}</p>
        </div>

        <div className="dark-main-sec">
          <h2 className="dark-main-sec-title">Experience</h2>
          {experiencesDisplay.map((exp, i) => (
            <div key={i} className="dark-entry">
              <div className="dark-entry-head">
                <h3 className="dark-job-pos">{exp.position}</h3>
                <span className="dark-job-date">
                  {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                </span>
              </div>
              <div className="dark-job-sub">
                <span className="dark-company">{exp.company}</span>
                {exp.location && <span className="dark-loc">{exp.location}</span>}
              </div>
              {renderDescriptionBullets(exp.description)}
            </div>
          ))}
        </div>

        <div className="dark-main-sec">
          <h2 className="dark-main-sec-title">Education</h2>
          {educationDisplay.map((edu, i) => (
            <div key={i} className="dark-entry">
              <div className="dark-entry-head">
                <h3 className="dark-job-pos">{edu.degree}</h3>
                <span className="dark-job-date">{edu.graduationYear}</span>
              </div>
              <div className="dark-job-sub">
                <span className="dark-company">{edu.school}</span>
                {edu.location && <span className="dark-loc">{edu.location}</span>}
              </div>
              {edu.field && <p className="dark-edu-field">{edu.field}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================
  // TEMPLATE 3: CLASSIC ROSE (Circular Photo)
  // ============================================
  const ClassicRoseTemplate = () => (
    <div className="resume-template classic-rose-template">
      {/* Header with Circular Avatar */}
      <div className="rose-header">
        <PhotoBlock shape="circle" className="rose-avatar" />
        <div className="rose-header-info">
          <h1 className="rose-name">{nameDisplay}</h1>
          <p className="rose-title">{titleDisplay}</p>
        </div>
      </div>

      <div className="rose-body-grid">
        {/* Left Column */}
        <div className="rose-col-left">
          <div className="rose-sec">
            <h2 className="rose-sec-title">Summary</h2>
            <p className="rose-sec-text">{summaryDisplay}</p>
          </div>

          <div className="rose-sec">
            <h2 className="rose-sec-title">Contact Info</h2>
            <div className="rose-contact-list">
              <div><IconPhone /> <span>{phoneDisplay}</span></div>
              <div><IconMail /> <span>{emailDisplay}</span></div>
              <div><IconLocation /> <span>{locationDisplay}</span></div>
              <div><IconLinkedin /> <span>{linkedinDisplay}</span></div>
              <div><IconGithub /> <span>{githubDisplay}</span></div>
            </div>
          </div>

          <div className="rose-sec">
            <h2 className="rose-sec-title">Skills</h2>
            <div className="rose-skills-wrap">
              {skillsDisplay.map((skill, i) => (
                <span key={i} className="rose-skill-pill">{skill}</span>
              ))}
            </div>
          </div>

          <div className="rose-sec">
            <h2 className="rose-sec-title">Languages</h2>
            <div className="rose-lang-list">
              {languagesDisplay.map((lang, i) => (
                <div key={i} className="rose-lang-item">
                  <div className="rose-lang-top">
                    <span>{lang.name}</span>
                    <small>{lang.level}</small>
                  </div>
                  <RatingBar percent={lang.percent || 80} barColor="#be123c" trackColor="#fce7f3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="rose-col-right">
          <div className="rose-sec">
            <h2 className="rose-sec-title">Experience</h2>
            {experiencesDisplay.map((exp, i) => (
              <div key={i} className="rose-entry">
                <div className="rose-entry-head">
                  <h3 className="rose-job-title">{exp.position}</h3>
                  <span className="rose-job-date">
                    {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                  </span>
                </div>
                <div className="rose-company-row">
                  <span className="rose-company">{exp.company}</span>
                  {exp.location && <span className="rose-loc">{exp.location}</span>}
                </div>
                {renderDescriptionBullets(exp.description)}
              </div>
            ))}
          </div>

          <div className="rose-sec">
            <h2 className="rose-sec-title">Education</h2>
            {educationDisplay.map((edu, i) => (
              <div key={i} className="rose-entry">
                <div className="rose-entry-head">
                  <h3 className="rose-job-title">{edu.degree}</h3>
                  <span className="rose-job-date">{edu.graduationYear}</span>
                </div>
                <div className="rose-company-row">
                  <span className="rose-company">{edu.school}</span>
                  {edu.location && <span className="rose-loc">{edu.location}</span>}
                </div>
                {edu.field && <p className="rose-edu-field">{edu.field}</p>}
              </div>
            ))}
          </div>

          <div className="rose-sec">
            <h2 className="rose-sec-title">Certifications</h2>
            <ul className="rose-bullet-list">
              {certificationsDisplay.map((cert, i) => (
                <li key={i}>
                  <strong>{cert.title}</strong>
                  {cert.date && <span> — {cert.date}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="rose-sec">
            <h2 className="rose-sec-title">Achievements</h2>
            <ul className="rose-bullet-list">
              {achievementsDisplay.map((ach, i) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // TEMPLATE 4: AZURE CORPORATE (Right Blue Sidebar)
  // ============================================
  const AzureSidebarTemplate = () => (
    <div className="resume-template azure-sidebar-template">
      {/* Left Main Content */}
      <div className="azure-main-col">
        <div className="azure-header">
          <h1 className="azure-name">{nameDisplay}</h1>
          <p className="azure-title">{titleDisplay}</p>
        </div>

        <div className="azure-main-sec">
          <h2 className="azure-main-sec-title">Experience</h2>
          {experiencesDisplay.map((exp, i) => (
            <div key={i} className="azure-entry">
              <div className="azure-entry-head">
                <h3 className="azure-job-title">{exp.position}</h3>
                <span className="azure-job-date">
                  {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                </span>
              </div>
              <div className="azure-company-row">
                <span className="azure-company">{exp.company}</span>
                {exp.location && <span className="azure-loc">{exp.location}</span>}
              </div>
              {renderDescriptionBullets(exp.description)}
            </div>
          ))}
        </div>

        <div className="azure-main-sec">
          <h2 className="azure-main-sec-title">Education</h2>
          {educationDisplay.map((edu, i) => (
            <div key={i} className="azure-entry">
              <div className="azure-entry-head">
                <h3 className="azure-job-title">{edu.degree}</h3>
                <span className="azure-job-date">{edu.graduationYear}</span>
              </div>
              <div className="azure-company-row">
                <span className="azure-company">{edu.school}</span>
                {edu.location && <span className="azure-loc">{edu.location}</span>}
              </div>
              {edu.field && <p className="azure-edu-field">{edu.field}</p>}
            </div>
          ))}
        </div>

        <div className="azure-main-sec">
          <h2 className="azure-main-sec-title">Certifications</h2>
          <ul className="azure-cert-list">
            {certificationsDisplay.map((cert, i) => (
              <li key={i}>
                <strong>{cert.title}</strong>
                {cert.date && <span> — {cert.date}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Azure Blue Sidebar */}
      <div className="azure-sidebar-col">
        <div className="azure-photo-wrap">
          <PhotoBlock shape="rounded" className="azure-profile-photo" />
        </div>

        <div className="azure-side-sec">
          <h2 className="azure-side-title">Summary</h2>
          <p className="azure-side-text">{summaryDisplay}</p>
        </div>

        <div className="azure-side-sec">
          <h2 className="azure-side-title">Contact Info</h2>
          <div className="azure-contact-list">
            <div><IconPhone /> <span>{phoneDisplay}</span></div>
            <div><IconMail /> <span>{emailDisplay}</span></div>
            <div><IconLocation /> <span>{locationDisplay}</span></div>
            <div><IconLinkedin /> <span>{linkedinDisplay}</span></div>
          </div>
        </div>

        <div className="azure-side-sec">
          <h2 className="azure-side-title">Skills</h2>
          <div className="azure-skills-list">
            {skillsDisplay.map((skill, i) => (
              <div key={i} className="azure-skill-item">
                <div className="azure-skill-row">
                  <span className="azure-skill-name">{skill}</span>
                  <RatingDots score={5 - (i % 2)} total={5} filledColor="#ffffff" emptyColor="rgba(255,255,255,0.3)" />
                </div>
                <small className="azure-skill-level">{i === 0 ? "Expert" : i < 3 ? "Advanced" : "Proficient"}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="azure-side-sec">
          <h2 className="azure-side-title">Achievements</h2>
          <ul className="azure-side-bullets">
            {achievementsDisplay.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // ============================================
  // TEMPLATE 5: CRIMSON CREATIVE (Left Magenta Sidebar)
  // ============================================
  const CrimsonSidebarTemplate = () => (
    <div className="resume-template crimson-sidebar-template">
      {/* Left Crimson Sidebar */}
      <div className="crimson-sidebar-col">
        <div className="crimson-sec">
          <h2 className="crimson-sec-title">Summary</h2>
          <p className="crimson-sec-text">{summaryDisplay}</p>
        </div>

        <div className="crimson-sec">
          <h2 className="crimson-sec-title">Contact Info</h2>
          <div className="crimson-contact-list">
            <div><IconPhone /> <span>{phoneDisplay}</span></div>
            <div><IconMail /> <span>{emailDisplay}</span></div>
            <div><IconLocation /> <span>{locationDisplay}</span></div>
            <div><IconLinkedin /> <span>{linkedinDisplay}</span></div>
          </div>
        </div>

        <div className="crimson-sec">
          <h2 className="crimson-sec-title">Skills</h2>
          <div className="crimson-skills-list">
            {skillsDisplay.map((skill, i) => {
              const proficiency = i === 0 ? "Expert" : i === 1 ? "Advanced" : i === 2 ? "Advanced" : "Proficient";
              const percent = i === 0 ? 95 : i === 1 ? 85 : i === 2 ? 80 : 65;
              return (
                <div key={i} className="crimson-skill-item">
                  <div className="crimson-skill-top">
                    <span className="crimson-skill-name">{skill}</span>
                    <span className="crimson-skill-level">{proficiency}</span>
                  </div>
                  <RatingBar percent={percent} barColor="#ffffff" trackColor="rgba(255,255,255,0.25)" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="crimson-sec">
          <h2 className="crimson-sec-title">Languages</h2>
          <div className="crimson-skills-list">
            {languagesDisplay.map((lang, i) => (
              <div key={i} className="crimson-skill-item">
                <div className="crimson-skill-top">
                  <span className="crimson-skill-name">{lang.name}</span>
                  <span className="crimson-skill-level">{lang.level}</span>
                </div>
                <RatingBar percent={lang.percent || 85} barColor="#ffffff" trackColor="rgba(255,255,255,0.25)" />
              </div>
            ))}
          </div>
        </div>

        <div className="crimson-sec">
          <h2 className="crimson-sec-title">Interests</h2>
          <ul className="crimson-bullet-list">
            {achievementsDisplay.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Main Content */}
      <div className="crimson-main-col">
        <div className="crimson-header">
          <h1 className="crimson-name">{nameDisplay}</h1>
          <p className="crimson-title">{titleDisplay}</p>
        </div>

        <div className="crimson-main-sec">
          <h2 className="crimson-main-sec-title">Experience</h2>
          {experiencesDisplay.map((exp, i) => (
            <div key={i} className="crimson-entry">
              <div className="crimson-entry-head">
                <h3 className="crimson-job-title">{exp.position}</h3>
                <span className="crimson-job-date">
                  {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                </span>
              </div>
              <div className="crimson-company-row">
                <span className="crimson-company">{exp.company}</span>
                {exp.location && <span className="crimson-loc">{exp.location}</span>}
              </div>
              {renderDescriptionBullets(exp.description)}
            </div>
          ))}
        </div>

        <div className="crimson-main-sec">
          <h2 className="crimson-main-sec-title">Education</h2>
          {educationDisplay.map((edu, i) => (
            <div key={i} className="crimson-entry">
              <div className="crimson-entry-head">
                <h3 className="crimson-job-title">{edu.degree}</h3>
                <span className="crimson-job-date">{edu.graduationYear}</span>
              </div>
              <div className="crimson-company-row">
                <span className="crimson-company">{edu.school}</span>
                {edu.location && <span className="crimson-loc">{edu.location}</span>}
              </div>
              {edu.field && <p className="crimson-edu-field">{edu.field}</p>}
            </div>
          ))}
        </div>

        <div className="crimson-main-sec">
          <h2 className="crimson-main-sec-title">Certifications</h2>
          <ul className="crimson-cert-list">
            {certificationsDisplay.map((cert, i) => (
              <li key={i}>
                <strong>{cert.title}</strong>
                {cert.date && <span> — {cert.date}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="crimson-main-sec">
          <h2 className="crimson-main-sec-title">Achievements</h2>
          <ul className="crimson-cert-list">
            {achievementsDisplay.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // ============================================
  // EXISTING TEMPLATES (Modern, Classic, Creative, Minimal)
  // ============================================
  const ModernTemplate = () => (
    <div className="resume-template modern-template">
      <div className="template-header modern-header">
        <div className="modern-header-left">
          <h1 className="candidate-name">{nameDisplay}</h1>
          <p className="professional-title">{titleDisplay}</p>
          <div className="contact-info-modern">
            <span>{emailDisplay}</span>
            <span>•</span>
            <span>{phoneDisplay}</span>
            <span>•</span>
            <span>{locationDisplay}</span>
          </div>
        </div>
        <PhotoBlock shape="circle" className="photo-upload-circle" />
      </div>

      {summaryDisplay && (
        <div className="template-section modern-section">
          <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
          <p className="section-content">{summaryDisplay}</p>
        </div>
      )}

      {experiencesDisplay.length > 0 && (
        <div className="template-section modern-section">
          <h2 className="section-title">WORK EXPERIENCE</h2>
          <div className="section-content">
            {experiencesDisplay.map((exp, idx) => (
              <div key={idx} className="entry modern-entry">
                <div className="entry-header">
                  <h3 className="entry-title">{exp.position}</h3>
                  <span className="entry-date">
                    {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                  </span>
                </div>
                <p className="entry-company">{exp.company}</p>
                {renderDescriptionBullets(exp.description)}
              </div>
            ))}
          </div>
        </div>
      )}

      {educationDisplay.length > 0 && (
        <div className="template-section modern-section">
          <h2 className="section-title">EDUCATION</h2>
          <div className="section-content">
            {educationDisplay.map((edu, idx) => (
              <div key={idx} className="entry modern-entry">
                <div className="entry-header">
                  <h3 className="entry-title">{edu.degree}</h3>
                  <span className="entry-date">{edu.graduationYear}</span>
                </div>
                <p className="entry-company">{edu.school}</p>
                <p className="entry-field">{edu.field}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillsDisplay.length > 0 && (
        <div className="template-section modern-section">
          <h2 className="section-title">SKILLS</h2>
          <p className="section-content skills-text">{skillsDisplay.join(" • ")}</p>
        </div>
      )}
    </div>
  );

  const ClassicTemplate = () => (
    <div className="resume-template classic-template">
      <div className="template-header classic-header">
        <div className="classic-header-top">
          <h1 className="candidate-name">{nameDisplay}</h1>
        </div>
        <div className="classic-header-divider"></div>
        <div className="classic-header-info">
          <p className="professional-title">{titleDisplay}</p>
          <div className="contact-info-classic">
            <span>{emailDisplay}</span>
            <span> | </span>
            <span>{phoneDisplay}</span>
            <span> | </span>
            <span>{locationDisplay}</span>
          </div>
        </div>
      </div>

      {summaryDisplay && (
        <div className="template-section classic-section">
          <h2 className="section-title classic-title">PROFESSIONAL SUMMARY</h2>
          <p className="section-content">{summaryDisplay}</p>
        </div>
      )}

      {experiencesDisplay.length > 0 && (
        <div className="template-section classic-section">
          <h2 className="section-title classic-title">EXPERIENCE</h2>
          <div className="section-content">
            {experiencesDisplay.map((exp, idx) => (
              <div key={idx} className="entry classic-entry">
                <div className="entry-header-classic">
                  <h3 className="entry-title">{exp.position}</h3>
                  <span className="entry-date">
                    {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                  </span>
                </div>
                <p className="entry-company classic-company">{exp.company}</p>
                {renderDescriptionBullets(exp.description)}
              </div>
            ))}
          </div>
        </div>
      )}

      {educationDisplay.length > 0 && (
        <div className="template-section classic-section">
          <h2 className="section-title classic-title">EDUCATION</h2>
          <div className="section-content">
            {educationDisplay.map((edu, idx) => (
              <div key={idx} className="entry classic-entry">
                <div className="entry-header-classic">
                  <h3 className="entry-title">{edu.degree}</h3>
                  <span className="entry-date">{edu.graduationYear}</span>
                </div>
                <p className="entry-company classic-company">{edu.school}</p>
                <p className="entry-field">{edu.field}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillsDisplay.length > 0 && (
        <div className="template-section classic-section">
          <h2 className="section-title classic-title">SKILLS</h2>
          <p className="section-content skills-text">{skillsDisplay.join(" • ")}</p>
        </div>
      )}
    </div>
  );

  const CreativeTemplate = () => (
    <div className="resume-template creative-template">
      <div className="template-header creative-header">
        <div className="creative-accent"></div>
        <h1 className="candidate-name">{nameDisplay}</h1>
        <p className="professional-title">{titleDisplay}</p>
        <div className="contact-info-creative">
          <span>{emailDisplay}</span>
          <span className="separator">✦</span>
          <span>{phoneDisplay}</span>
          <span className="separator">✦</span>
          <span>{locationDisplay}</span>
        </div>
      </div>

      {summaryDisplay && (
        <div className="template-section creative-section">
          <h2 className="section-title creative-title">ABOUT</h2>
          <div className="creative-accent-small"></div>
          <p className="section-content">{summaryDisplay}</p>
        </div>
      )}

      {experiencesDisplay.length > 0 && (
        <div className="template-section creative-section">
          <h2 className="section-title creative-title">EXPERIENCE</h2>
          <div className="creative-accent-small"></div>
          <div className="section-content">
            {experiencesDisplay.map((exp, idx) => (
              <div key={idx} className="entry creative-entry">
                <div className="creative-entry-marker"></div>
                <div className="entry-content">
                  <div className="entry-header-creative">
                    <h3 className="entry-title">{exp.position}</h3>
                    <span className="entry-date">
                      {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                    </span>
                  </div>
                  <p className="entry-company">{exp.company}</p>
                  {renderDescriptionBullets(exp.description)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {educationDisplay.length > 0 && (
        <div className="template-section creative-section">
          <h2 className="section-title creative-title">EDUCATION</h2>
          <div className="creative-accent-small"></div>
          <div className="section-content">
            {educationDisplay.map((edu, idx) => (
              <div key={idx} className="entry creative-entry">
                <div className="creative-entry-marker"></div>
                <div className="entry-content">
                  <div className="entry-header-creative">
                    <h3 className="entry-title">{edu.degree}</h3>
                    <span className="entry-date">{edu.graduationYear}</span>
                  </div>
                  <p className="entry-company">{edu.school}</p>
                  <p className="entry-field">{edu.field}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillsDisplay.length > 0 && (
        <div className="template-section creative-section">
          <h2 className="section-title creative-title">SKILLS</h2>
          <div className="creative-accent-small"></div>
          <p className="section-content skills-text">{skillsDisplay.join(" • ")}</p>
        </div>
      )}
    </div>
  );

  const MinimalTemplate = () => (
    <div className="resume-template minimal-template">
      <div className="template-header minimal-header">
        <h1 className="candidate-name">{nameDisplay}</h1>
        <p className="professional-title">{titleDisplay}</p>
        <div className="contact-info-minimal">
          <span>{emailDisplay}</span> • <span>{phoneDisplay}</span> • <span>{locationDisplay}</span>
        </div>
      </div>

      {summaryDisplay && (
        <div className="template-section minimal-section">
          <h2 className="section-title">SUMMARY</h2>
          <p className="section-content">{summaryDisplay}</p>
        </div>
      )}

      {experiencesDisplay.length > 0 && (
        <div className="template-section minimal-section">
          <h2 className="section-title">EXPERIENCE</h2>
          <div className="section-content">
            {experiencesDisplay.map((exp, idx) => (
              <div key={idx} className="entry minimal-entry">
                <h3 className="entry-title">{exp.position}</h3>
                <div className="entry-meta">
                  <span className="entry-company">{exp.company}</span>
                  <span className="entry-date">
                    {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || "Present"}
                  </span>
                </div>
                {renderDescriptionBullets(exp.description)}
              </div>
            ))}
          </div>
        </div>
      )}

      {educationDisplay.length > 0 && (
        <div className="template-section minimal-section">
          <h2 className="section-title">EDUCATION</h2>
          <div className="section-content">
            {educationDisplay.map((edu, idx) => (
              <div key={idx} className="entry minimal-entry">
                <h3 className="entry-title">{edu.degree}</h3>
                <div className="entry-meta">
                  <span className="entry-company">{edu.school}</span>
                  <span className="entry-date">{edu.graduationYear}</span>
                </div>
                <p className="entry-field">{edu.field}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillsDisplay.length > 0 && (
        <div className="template-section minimal-section">
          <h2 className="section-title">SKILLS</h2>
          <p className="section-content skills-text">{skillsDisplay.join(" • ")}</p>
        </div>
      )}
    </div>
  );

  // ============================================
  // TEMPLATE MAPPING WITH ALIASES
  // ============================================
  const templates = {
    modern: <ModernTemplate />,
    classic: <ClassicTemplate />,
    creative: <CreativeTemplate />,
    minimal: <MinimalTemplate />,

    // 5 New Reference Templates
    "teal-banner": <TealBannerTemplate />,
    teal: <TealBannerTemplate />,
    executive: <TealBannerTemplate />,

    "dark-sidebar": <DarkSidebarTemplate />,
    dark: <DarkSidebarTemplate />,
    obsidian: <DarkSidebarTemplate />,

    "classic-rose": <ClassicRoseTemplate />,
    rose: <ClassicRoseTemplate />,

    "azure-sidebar": <AzureSidebarTemplate />,
    azure: <AzureSidebarTemplate />,
    corporate: <AzureSidebarTemplate />,

    "crimson-sidebar": <CrimsonSidebarTemplate />,
    crimson: <CrimsonSidebarTemplate />,
  };

  const selectedKey = String(templateId || "modern").toLowerCase();

  return (
    <div className="resume-preview-container">
      <HiddenFileInput />
      {templates[selectedKey] || templates.modern}
    </div>
  );
}
