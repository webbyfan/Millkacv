import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const [hoverStart, setHoverStart] = React.useState(false);
  const [hoverDemo, setHoverDemo] = React.useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%)",
        paddingTop: "108px",
        paddingBottom: "64px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "#f5f3ff",
              border: "1px solid #ddd6fe",
              color: "#7c3aed",
              fontSize: "13.5px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            <span>✦</span>
            <span>AI-Powered ATS Resume Builder</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 8vw, 68px)",
              fontWeight: "800",
              color: "#1e1b4b",
              marginBottom: "24px",
              lineHeight: "1.15",
              letterSpacing: "-1px",
            }}
          >
            Build Your Professional Resume
            <span
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {" "}
              in Minutes
            </span>
          </h1>

          <p
            style={{
              fontSize: "19px",
              color: "#4b5563",
              maxWidth: "680px",
              margin: "0 auto 36px",
              lineHeight: "1.65",
            }}
          >
            Built for students, fresh graduates, and ambitious professionals. Create an
            ATS-friendly resume that recruiters actually see. No design experience
            needed—our AI will optimize every word.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "56px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => navigate("/login")}
              onMouseEnter={() => setHoverStart(true)}
              onMouseLeave={() => setHoverStart(false)}
              style={{
                padding: "15px 32px",
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: hoverStart
                  ? "0 12px 28px rgba(124, 58, 237, 0.4)"
                  : "0 6px 18px rgba(124, 58, 237, 0.28)",
                transform: hoverStart ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.25s ease",
                fontSize: "16px",
              }}
            >
              Start Building Free →
            </button>

            <button
              onMouseEnter={() => setHoverDemo(true)}
              onMouseLeave={() => setHoverDemo(false)}
              style={{
                padding: "15px 32px",
                border: "1.5px solid #ddd6fe",
                backgroundColor: hoverDemo ? "#f5f3ff" : "#ffffff",
                color: "#7c3aed",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.05)",
              }}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "64px",
            textAlign: "center",
          }}
        >
          {[
            { value: "50K+", label: "Resumes Created" },
            { value: "98%", label: "ATS Pass Rate" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "14px",
                border: "1.5px solid #ede9fe",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(26px, 5vw, 38px)",
                  fontWeight: "800",
                  color: "#7c3aed",
                  letterSpacing: "-0.5px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: "#4b5563", fontSize: "15px", fontWeight: "600", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Hero Image/Preview */}
        <div
          style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(109, 40, 217, 0.03))",
            borderRadius: "20px",
            padding: "24px",
            border: "1.5px solid #ede9fe",
            boxShadow: "0 25px 60px -15px rgba(124, 58, 237, 0.12)",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "32px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#111",
                      marginBottom: "4px",
                    }}
                  >
                    John Doe
                  </h3>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Full Stack Developer | San Francisco, CA
                  </p>
                </div>

              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  borderTop: "1px solid #ddd",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    EXPERIENCE
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#111",
                    }}
                  >
                    5+ Years
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    SKILLS
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#111",
                    }}
                  >
                    15+
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    ATS SCORE
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#7c3aed",
                    }}
                  >
                    98%
                  </p>
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>Professional Summary:</strong> Experienced Full Stack
                  Developer with expertise in React, Node.js, and MongoDB.
                  Passionate about building scalable applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
