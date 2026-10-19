import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/ATSTips.css";

export default function ATSTipsPage() {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState("formatting");
  const [activeTab, setActiveTab] = useState("tips");

  // ATS Tips Data
  const tipCategories = {
    formatting: {
      title: "📐 Formatting Tips",
      icon: "📐",
      color: "#3b82f6",
      tips: [
        {
          id: 1,
          title: "Use Simple, Clean Formatting",
          description:
            "Avoid complex layouts, tables, columns, and fancy formatting. ATS systems parse text sequentially and may miss formatted content.",
          example: "✅ Use standard single-column layout",
          warning: "❌ Avoid: tables, text boxes, creative spacing",
        },
        {
          id: 2,
          title: "Stick to Standard Fonts",
          description:
            "Use common fonts like Arial, Calibri, Times New Roman, or Verdana. Avoid decorative fonts that ATS might not recognize.",
          example: "✅ Arial, Calibri, Verdana, Times New Roman",
          warning: "❌ Avoid: fancy fonts, scripts, decorative typefaces",
        },
        {
          id: 3,
          title: "Save as PDF or Word Doc",
          description:
            "Always save your resume as PDF or .docx format. Plain text is also acceptable but avoid image-based formats.",
          example: "✅ .pdf, .docx, .txt",
          warning: "❌ Avoid: .jpg, .png, .psd, .gif",
        },
        {
          id: 4,
          title: "Avoid Headers and Footers",
          description:
            "ATS systems often skip headers and footers. Put all important information in the main body of the resume.",
          example: "✅ Place all content in main body",
          warning: "❌ Avoid: Important info in headers/footers",
        },
        {
          id: 5,
          title: "Use Bullet Points, Not Text Blocks",
          description:
            "Organize information with bullets rather than dense paragraphs. It's easier for ATS to parse and for humans to read.",
          example: "✅ • Managed team of 5 engineers",
          warning: "❌ Avoid: Long paragraph descriptions",
        },
        {
          id: 6,
          title: "Keep Margins Consistent",
          description:
            "Use 1-inch margins on all sides. This ensures proper parsing and readability.",
          example: "✅ 1-inch margins all around",
          warning: "❌ Avoid: Tiny or extra-wide margins",
        },
      ],
    },
    keywords: {
      title: "🔑 Keywords & Content",
      icon: "🔑",
      color: "#ec4899",
      tips: [
        {
          id: 1,
          title: "Mirror Job Description Keywords",
          description:
            "Identify keywords from the job posting and incorporate them naturally into your resume. ATS systems score resumes based on keyword matches.",
          example: "✅ If job asks for 'React', use 'React' not 'ReactJS'",
          warning: "❌ Avoid: Keyword stuffing or irrelevant terms",
        },
        {
          id: 2,
          title: "Use Industry-Specific Terms",
          description:
            "Include relevant technical skills, certifications, and industry jargon that match the position.",
          example: "✅ Include: Python, AWS, Agile, Scrum, Machine Learning",
          warning: "❌ Avoid: Vague or generic job descriptions",
        },
        {
          id: 3,
          title: "Add a Skills Section",
          description:
            "Create a dedicated skills section listing key technical and professional skills. This is heavily weighted by ATS.",
          example: "✅ Skills: JavaScript, React, Node.js, AWS, Docker",
          warning: "❌ Avoid: Hiding skills in experience descriptions",
        },
        {
          id: 4,
          title: "Include Full Job Titles",
          description:
            "Use complete job titles and spell out acronyms. Include both abbreviated and full forms for clarity.",
          example:
            "✅ 'Full Stack Developer' not 'Dev', 'AWS' and 'Amazon Web Services'",
          warning: "❌ Avoid: Abbreviations that ATS can't recognize",
        },
        {
          id: 5,
          title: "Quantify Achievements",
          description:
            "Use numbers and percentages in your achievements. ATS recognizes quantifiable results better than vague statements.",
          example: "✅ 'Increased sales by 35%' or 'Led team of 8'",
          warning: "❌ Avoid: 'Did good work' or 'Improved performance'",
        },
        {
          id: 6,
          title: "Use Standard Section Headers",
          description:
            "Use conventional headers like 'Work Experience', 'Education', 'Skills' that ATS systems recognize.",
          example: "✅ Use standard headers",
          warning:
            "❌ Avoid: Creative names like 'Pro Journey' instead of 'Experience'",
        },
      ],
    },
    structure: {
      title: "🏗️ Structure & Layout",
      icon: "🏗️",
      color: "#f59e0b",
      tips: [
        {
          id: 1,
          title: "Organize by Section",
          description:
            "Keep your resume organized with clear, standard sections: Contact Info, Summary, Experience, Education, Skills, Certifications.",
          example: "✅ Well-organized sections in logical order",
          warning: "❌ Avoid: Random placement of information",
        },
        {
          id: 2,
          title: "Put Contact Info at the Top",
          description:
            "Include your name, phone number, email, and LinkedIn URL at the top. Avoid fancy formatting for contact details.",
          example: "✅ John Smith | (555) 123-4567 | john@email.com",
          warning: "❌ Avoid: Contact info in graphics or footers",
        },
        {
          id: 3,
          title: "One Page or Two Pages",
          description:
            "Keep it to 1 page if entry-level, 2 pages max if experienced. ATS handles both, but clarity is key.",
          example: "✅ 1-2 pages, well-organized content",
          warning: "❌ Avoid: 3+ pages or cramped text",
        },
        {
          id: 4,
          title: "Reverse Chronological Order",
          description:
            "List experiences and education from most recent to oldest. This is standard and what ATS expects.",
          example: "✅ Start with current/most recent roles",
          warning: "❌ Avoid: Jumping between dates randomly",
        },
        {
          id: 5,
          title: "Use Consistent Date Format",
          description:
            "Format all dates consistently (MM/YYYY or Month Year) throughout the document.",
          example: "✅ 'January 2023' or '01/2023' consistently",
          warning: "❌ Avoid: Mixed formats like 'Jan 2023' and '1-2023'",
        },
        {
          id: 6,
          title: "Keep Relevant Information",
          description:
            "Remove outdated or irrelevant experiences. Focus on what matters for the target position.",
          example: "✅ Include recent and relevant experiences",
          warning: "❌ Avoid: 10-year-old internships if senior role",
        },
      ],
    },
    technical: {
      title: "⚙️ Technical Details",
      icon: "⚙️",
      color: "#10b981",
      tips: [
        {
          id: 1,
          title: "Avoid Graphics and Images",
          description:
            "Don't use logos, photos, graphics, or images. ATS systems can't read visual elements and may skip them.",
          example: "✅ Text-based resume only",
          warning: "❌ Avoid: Company logos, profile photos, graphics",
        },
        {
          id: 2,
          title: "No Special Characters",
          description:
            "Avoid fancy symbols, special characters, or emojis. Stick to basic ASCII characters and standard punctuation.",
          example: "✅ • - , . : ; ( ) [ ] { }",
          warning: "❌ Avoid: ★ ✓ ● ► « » ™ ®",
        },
        {
          id: 3,
          title: "Check for Hidden Text",
          description:
            "Ensure no text is hidden using white font, tiny size, or transparency. ATS may flag or ignore hidden content.",
          example: "✅ All text visible and readable",
          warning: "❌ Avoid: White text on white background",
        },
        {
          id: 4,
          title: "Avoid Text Boxes and Fields",
          description:
            "Don't use text boxes, form fields, or shapes. Write plain text directly on the page.",
          example: "✅ Plain text layout",
          warning: "❌ Avoid: Inserting text boxes or shapes",
        },
        {
          id: 5,
          title: "No Hyperlinks (Usually)",
          description:
            "Most ATS systems don't follow hyperlinks. Include full URLs as text instead if needed.",
          example: "✅ 'Portfolio: www.example.com' instead of linked text",
          warning: "❌ Avoid: Clicking hyperlinks in parsed resumes",
        },
        {
          id: 6,
          title: "Test Before Submitting",
          description:
            "Convert your PDF to text and review. This simulates what the ATS sees and catches formatting issues.",
          example: "✅ Test your resume before submitting",
          warning: "❌ Avoid: Submitting without verification",
        },
      ],
    },
  };

  // FAQ Data
  const faqs = [
    {
      question: "What is an ATS (Applicant Tracking System)?",
      answer:
        "An ATS is software used by HR departments to parse, collect, and rank resumes. It scans resumes for keywords, formatting, and structure. If your resume doesn't pass the ATS screening, a human may never see it.",
    },
    {
      question: "What ATS score should I aim for?",
      answer:
        "Aim for an ATS score of 75%+. A score of 85%+ is excellent and means your resume is well-optimized for keyword matching and formatting. Different positions may require different focus areas.",
    },
    {
      question: "How do I improve my ATS score?",
      answer:
        "1. Include keywords from the job description, 2. Use standard formatting without tables or graphics, 3. Add a dedicated skills section, 4. Use clear section headers, 5. Quantify achievements, 6. Keep it concise and well-organized.",
    },
    {
      question: "Can I use colors in my resume?",
      answer:
        "While colors don't harm your ATS score, it's safer to stick with black text and white background. If you do use colors, keep them minimal and ensure high contrast for readability.",
    },
    {
      question: "Is a one-page resume better for ATS?",
      answer:
        "One page is ideal for entry-level, but 2 pages is fine for experienced professionals. ATS doesn't penalize longer resumes. Focus on quality content, not page count.",
    },
    {
      question: "Should I include a cover letter?",
      answer:
        "Cover letters aren't typically parsed by ATS. However, if requested, include one. Most ATS systems only scan resumes, not cover letters.",
    },
  ];

  // Best Practices
  const bestPractices = [
    {
      icon: "📋",
      title: "Customize for Each Job",
      description:
        "Tailor your resume for each application by including keywords from the job description.",
    },
    {
      icon: "✍️",
      title: "Use Action Verbs",
      description:
        "Start bullet points with strong action verbs like 'Developed', 'Managed', 'Led', 'Implemented'.",
    },
    {
      icon: "🎯",
      title: "Focus on Results",
      description:
        "Highlight quantifiable achievements and business impact, not just responsibilities.",
    },
    {
      icon: "🔍",
      title: "Keywords First",
      description:
        "Place important keywords near the top of your resume for higher ATS ranking.",
    },
    {
      icon: "📝",
      title: "Proofread Carefully",
      description:
        "Check for spelling and grammar errors. ATS systems may penalize typos.",
    },
    {
      icon: "💼",
      title: "Keep Professional Tone",
      description:
        "Maintain a formal, professional tone throughout. Avoid slang or casual language.",
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />

        <div className="ats-tips-container">

          {/* Tab Navigation */}
          <div className="ats-tabs">
            <button
              className={`tab-btn ${activeTab === "tips" ? "active" : ""}`}
              onClick={() => setActiveTab("tips")}
            >
              💡 Tips & Tricks
            </button>
            <button
              className={`tab-btn ${activeTab === "best-practices" ? "active" : ""}`}
              onClick={() => setActiveTab("best-practices")}
            >
              ⭐ Best Practices
            </button>
            <button
              className={`tab-btn ${activeTab === "faq" ? "active" : ""}`}
              onClick={() => setActiveTab("faq")}
            >
              ❓ FAQ
            </button>
          </div>

          {/* Tips Section */}
          {activeTab === "tips" && (
            <div className="tips-section">
              <div className="category-filter">
                {Object.entries(tipCategories).map(([key, category]) => (
                  <button
                    key={key}
                    className={`category-btn ${expandedCategory === key ? "active" : ""}`}
                    onClick={() =>
                      setExpandedCategory(expandedCategory === key ? null : key)
                    }
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.title}</span>
                  </button>
                ))}
              </div>

              {expandedCategory && (
                <div className="tips-grid">
                  {tipCategories[expandedCategory].tips.map((tip) => (
                    <div key={tip.id} className="tip-card">
                      <h3>{tip.title}</h3>
                      <p className="tip-description">{tip.description}</p>
                      <div className="tip-example">
                        <span className="example-label">{tip.example}</span>
                      </div>
                      <div className="tip-warning">
                        <span className="warning-label">{tip.warning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Best Practices Section */}
          {activeTab === "best-practices" && (
            <div className="best-practices-section">
              <h2>Essential ATS Best Practices</h2>
              <div className="practices-grid">
                {bestPractices.map((practice, index) => (
                  <div key={index} className="practice-card">
                    <div className="practice-icon">{practice.icon}</div>
                    <h3>{practice.title}</h3>
                    <p>{practice.description}</p>
                  </div>
                ))}
              </div>

              {/* ATS Score Guide */}
              <div className="score-guide">
                <h3>ATS Score Guide</h3>
                <div className="score-levels">
                  <div className="score-level excellent">
                    <div className="score-range">85-100%</div>
                    <div className="score-label">Excellent</div>
                    <div className="score-desc">
                      Very well optimized, high chance of passing ATS
                    </div>
                  </div>
                  <div className="score-level good">
                    <div className="score-range">70-84%</div>
                    <div className="score-label">Good</div>
                    <div className="score-desc">
                      Well optimized, likely to pass ATS
                    </div>
                  </div>
                  <div className="score-level fair">
                    <div className="score-range">50-69%</div>
                    <div className="score-label">Fair</div>
                    <div className="score-desc">
                      Moderate optimization needed
                    </div>
                  </div>
                  <div className="score-level poor">
                    <div className="score-range">Below 50%</div>
                    <div className="score-label">Needs Work</div>
                    <div className="score-desc">
                      Significant improvements recommended
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {activeTab === "faq" && (
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips Box */}
          <div className="quick-tips-box">
            <h3>🚀 Quick ATS Checklist</h3>
            <div className="checklist">
              <div className="checklist-item">
                <input type="checkbox" id="check1" defaultChecked />
                <label htmlFor="check1">Clean, single-column layout</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="check2" defaultChecked />
                <label htmlFor="check2">
                  Keywords from job description included
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="check3" />
                <label htmlFor="check3">
                  No tables, graphics, or special formatting
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="check4" defaultChecked />
                <label htmlFor="check4">Dedicated Skills section</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="check5" />
                <label htmlFor="check5">
                  Quantified achievements with numbers
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="check6" defaultChecked />
                <label htmlFor="check6">Consistent date formatting</label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="check7" />
                <label htmlFor="check7">
                  Standard fonts only (Arial, Calibri, etc.)
                </label>
              </div>
              <div className="checklist-item">
                <input type="checkbox" id="check8" />
                <label htmlFor="check8">Saved as PDF or .docx</label>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <h2>Ready to optimize your resume?</h2>
            <p>Create an ATS-friendly resume with our intelligent builder</p>
            <button
              className="btn-cta-main"
              onClick={() => navigate("/create-resume")}
            >
              Start Creating Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
