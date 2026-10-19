import React from "react";
import Navbar from "../components/landingP/Navbar";
import Hero from "../components/landingP/Hero";
import Footer from "../components/landingP/Footer";
import "../App.css";

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = React.useState(null);

  return (
    <div>
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              style={{
                fontSize: "44px",
                fontWeight: "800",
                color: "#1e1b4b",
                marginBottom: "16px",
                letterSpacing: "-0.5px",
              }}
            >
              Powerful Features
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
                maxWidth: "672px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Everything you need to create a professional resume that gets you
              hired
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                title: "AI-Powered Writing",
                desc: "Let AI improve your bullet points and achievements professionally",
              },
              {
                title: "Smart ATS Optimization",
                desc: "100% compliance with modern Applicant Tracking Systems",
              },
              {
                title: "Clean Modern Templates",
                desc: "Recruiter-approved templates designed to maximize readability",
              },
              {
                title: "Easy Resume Builder",
                desc: "Intuitive interface that lets you customize fields in minutes",
              },
              {
                title: "ATS-Safe Guarantee",
                desc: "Eliminates unreadable formatting, complex tables, and broken parsers",
              },
              {
                title: "Real-time Feedback",
                desc: "Get instant scoring and smart suggestions to enhance your CV",
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: "28px",
                  border: "1.5px solid #ede9fe",
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 4px 14px rgba(124, 58, 237, 0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#7c3aed";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(124, 58, 237, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ede9fe";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(124, 58, 237, 0.04)";
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: "#1e1b4b",
                    marginBottom: "8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: "14.5px", color: "#6b7280", lineHeight: "1.5" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Checker Section */}
      <section
        id="ats"
        style={{ padding: "80px 24px", backgroundColor: "#fbfbfe" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "44px",
                  fontWeight: "800",
                  color: "#1e1b4b",
                  marginBottom: "20px",
                  letterSpacing: "-0.5px",
                }}
              >
                ATS-Optimized for Success
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: "#6b7280",
                  marginBottom: "32px",
                  lineHeight: "1.65",
                }}
              >
                Over 75% of resumes are filtered out before reaching a human recruiter. Our intelligent scanner ensures your resume scores top marks across all Applicant Tracking Systems.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {[
                  {
                    title: "No Complex Formatting",
                    desc: "Clean, linear structures that every parsing engine reads effortlessly",
                  },
                  {
                    title: "Keyword Optimization",
                    desc: "Intelligent keyword extraction matching your target role",
                  },
                  {
                    title: "Layout Structure Analysis",
                    desc: "Validates headings, contact metadata, and chronologies",
                  },
                  {
                    title: "Real-time Compatibility Score",
                    desc: "Live scoring feedback with actionable instant recommendations",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        color: "#7c3aed",
                        fontWeight: "bold",
                        fontSize: "20px",
                        lineHeight: "1.2",
                      }}
                    >
                      ✓
                    </span>
                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          color: "#1e1b4b",
                          marginBottom: "4px",
                          fontSize: "16px",
                        }}
                      >
                        {item.title}
                      </p>
                      <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                border: "1.5px solid #ede9fe",
                boxShadow: "0 20px 45px rgba(124, 58, 237, 0.08)",
                padding: "32px",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#1e1b4b",
                  marginBottom: "24px",
                }}
              >
                ATS Compatibility
              </h3>
              <div
                style={{
                  background: "#f5f3ff",
                  borderRadius: "14px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1.5px solid #ddd6fe",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6d28d9",
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Your ATS Score
                </p>
                <div
                  style={{
                    fontSize: "52px",
                    fontWeight: "800",
                    color: "#7c3aed",
                    marginBottom: "8px",
                    letterSpacing: "-1px",
                  }}
                >
                  98%
                </div>
                <p style={{ fontSize: "14.5px", color: "#6d28d9", fontWeight: "700", margin: 0 }}>
                  Excellent — Ready to Land Interviews!
                </p>
              </div>
              {[
                { label: "Format & Structure", score: 100 },
                { label: "Keyword Matching", score: 94 },
                { label: "Readability & Contact Info", score: 98 },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      fontWeight: "700",
                      marginBottom: "6px",
                      color: "#1e1b4b",
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ color: "#7c3aed" }}>{item.score}%</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#f5f3ff",
                      border: "1px solid #ede9fe",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: item.score + "%",
                        height: "100%",
                        background: "linear-gradient(90deg, #8b5cf6, #7c3aed)",
                        borderRadius: "9999px",
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        style={{ padding: "80px 24px", backgroundColor: "#fff" }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "44px",
                fontWeight: "800",
                color: "#1e1b4b",
                marginBottom: "16px",
                letterSpacing: "-0.5px",
              }}
            >
              Affordable Plans for Students
            </h2>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>
              Get started free. Upgrade only when you're ready.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              alignItems: "stretch",
            }}
          >
            {[
              {
                name: "Starter",
                price: "Free",
                features: [
                  "1 Resume",
                  "Basic Templates",
                  "PDF Export",
                  "Basic ATS Checker",
                  "Perfect for Students",
                ],
              },
              {
                name: "Professional",
                price: "200ETB",
                featured: true,
                features: [
                  "Unlimited Resumes",
                  "All Templates",
                  "AI Writing Assistance",
                  "Advanced ATS Checker",
                  "Real-time Feedback",
                  "Priority Support",
                ],
              },
              {
                name: "Elite",
                price: "500ETB",
                features: [
                  "Everything in Pro",
                  "Portfolio Generator",
                  "LinkedIn Optimization",
                  "Interview Prep",
                  "Resume Analytics",
                  "1-on-1 Support",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                style={{
                  padding: "36px 30px",
                  border: plan.featured ? "none" : "1.5px solid #ede9fe",
                  borderRadius: "18px",
                  background: plan.featured
                    ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                    : "#ffffff",
                  color: plan.featured ? "#ffffff" : "#1e1b4b",
                  position: "relative",
                  transform: plan.featured ? "scale(1.04)" : "scale(1)",
                  boxShadow: plan.featured
                    ? "0 20px 45px rgba(124, 58, 237, 0.35)"
                    : "0 4px 14px rgba(124, 58, 237, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      marginBottom: "8px",
                      color: plan.featured ? "#ffffff" : "#1e1b4b",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "38px",
                      fontWeight: "800",
                      marginBottom: "24px",
                      letterSpacing: "-0.5px",
                      color: plan.featured ? "#ffffff" : "#1e1b4b",
                    }}
                  >
                    {plan.price}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => navigate("/login")}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "10px",
                      border: plan.featured ? "none" : "1.5px solid #ddd6fe",
                      fontWeight: "700",
                      fontSize: "15px",
                      cursor: "pointer",
                      marginBottom: "24px",
                      backgroundColor: plan.featured ? "#ffffff" : "#f5f3ff",
                      color: "#7c3aed",
                      boxShadow: plan.featured ? "0 4px 14px rgba(0, 0, 0, 0.15)" : "none",
                      transition: "all 0.25s ease",
                    }}
                  >
                    Get Started
                  </button>
                  {plan.features.map((feature, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "12px",
                        fontSize: "14px",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: plan.featured ? "#ffffff" : "#7c3aed", fontWeight: "bold" }}>✓</span>
                      <span style={{ color: plan.featured ? "rgba(255, 255, 255, 0.95)" : "#4b5563" }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}
      >
        <div style={{ maxWidth: "768px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              style={{
                fontSize: "44px",
                fontWeight: "800",
                color: "#1e1b4b",
                marginBottom: "16px",
                letterSpacing: "-0.5px",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>
              Find answers to common questions about Millka CV
            </p>
          </div>
          {[
            {
              q: "What makes Millka CV different?",
              a: "Millka CV combines AI-assisted writing with strict ATS optimization rules so you pass recruiter filtering systems and land more interviews.",
            },
            {
              q: "Is my personal data secure?",
              a: "Yes, all resumes and personal records are encrypted and stored securely. Your data is strictly private and never shared.",
            },
            {
              q: "Can I export as ATS-friendly PDF?",
              a: "Absolutely! Every resume can be exported directly as an ATS-compatible PDF with clean typography, no parsing blockers.",
            },
            {
              q: "Can I scan an existing CV made outside Millka?",
              a: "Yes! Our external CV Scanner allows you to upload any external resume or paste its text to get immediate ATS score analysis.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                border: "1.5px solid #ede9fe",
                borderRadius: "14px",
                marginBottom: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.03)",
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s ease",
                }}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <p style={{ fontWeight: "700", color: "#1e1b4b", fontSize: "16px", margin: 0 }}>{item.q}</p>
                <span
                  style={{
                    color: "#7c3aed",
                    fontSize: "20px",
                    fontWeight: "800",
                    transform:
                      expandedFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                >
                  +
                </span>
              </div>
              {expandedFaq === i && (
                <div
                  style={{
                    padding: "20px 24px",
                    backgroundColor: "#fbfbfe",
                    borderTop: "1.5px solid #ede9fe",
                  }}
                >
                  <p style={{ color: "#4b5563", lineHeight: "1.65", margin: 0, fontSize: "15px" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)",
          padding: "96px 24px",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: "800",
              marginBottom: "20px",
              letterSpacing: "-0.5px",
            }}
          >
            Ready to Land Your Dream Job?
          </h2>
          <p style={{ fontSize: "19px", marginBottom: "36px", opacity: 0.95, lineHeight: "1.6" }}>
            Join thousands of ambitious job seekers who have optimized their resumes to stand out to hiring managers.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 36px",
                backgroundColor: "#ffffff",
                color: "#7c3aed",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "16px",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                transition: "all 0.25s ease",
              }}
            >
              Start For Free
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 36px",
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "16px",
                transition: "all 0.25s ease",
              }}
            >
              View Templates
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
