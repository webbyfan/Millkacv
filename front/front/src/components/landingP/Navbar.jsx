import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [hoverLogin, setHoverLogin] = React.useState(false);
  const [hoverStart, setHoverStart] = React.useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1.5px solid #ede9fe",
        zIndex: 50,
        transition: "all 0.3s ease",
        boxShadow: "0 4px 20px rgba(124, 58, 237, 0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "16px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginLeft: "8px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Millka CV"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
            }}
          />
          <span
            style={{
              fontWeight: "800",
              fontSize: "22px",
              color: "#1e1b4b",
              letterSpacing: "-0.5px",
            }}
          >
            Millka<span style={{ color: "#7c3aed" }}>CV</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {[
            { label: "Features", href: "#features" },
            { label: "ATS Checker", href: "#ats" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              style={{
                color: "#475569",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#7c3aed")}
              onMouseLeave={(e) => (e.target.style.color = "#475569")}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "9px 20px",
              backgroundColor: hoverLogin ? "#f5f3ff" : "transparent",
              color: "#7c3aed",
              border: "1.5px solid #ddd6fe",
              borderRadius: "9999px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={() => setHoverLogin(true)}
            onMouseLeave={() => setHoverLogin(false)}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "9px 24px",
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "9999px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: hoverStart
                ? "0 10px 25px rgba(124, 58, 237, 0.38)"
                : "0 4px 14px rgba(124, 58, 237, 0.25)",
              transition: "all 0.25s ease",
              transform: hoverStart ? "translateY(-1px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHoverStart(true)}
            onMouseLeave={() => setHoverStart(false)}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
