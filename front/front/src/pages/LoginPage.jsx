import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { validateLoginForm } from "../utils/validation";
import "../styles/AuthForms.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    markTouched(field);
    const errors = validateLoginForm({ email, password });
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] || "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    const errors = validateLoginForm({ email, password });
    setFieldErrors(errors);
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }

      navigate("/dashboard");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button
          type="button"
          className="auth-back-btn"
          onClick={() => navigate("/")}
        >
          Back
        </button>

        <div className="auth-header">
          <div className="auth-logo">M</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your MilkaaCV account</p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          <FormField
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) {
                const errors = validateLoginForm({
                  email: e.target.value,
                  password,
                });
                setFieldErrors((prev) => ({
                  ...prev,
                  email: errors.email || "",
                }));
              }
            }}
            onBlur={() => handleBlur("email")}
            error={fieldErrors.email}
            touched={touched.email}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched.password) {
                const errors = validateLoginForm({
                  email,
                  password: e.target.value,
                });
                setFieldErrors((prev) => ({
                  ...prev,
                  password: errors.password || "",
                }));
              }
            }}
            onBlur={() => handleBlur("password")}
            error={fieldErrors.password}
            touched={touched.password}
            placeholder="••••••••"
            required
            showPasswordToggle
            autoComplete="current-password"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#666",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "#DA291C",
                }}
              />
              Remember me
            </label>
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          {formError && (
            <div className="form-alert form-alert--error" role="alert">
              {formError}
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "24px 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
          <span style={{ color: "#999", fontSize: "12px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
        </div>

        <button
          type="button"
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #ddd",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            color: "#111",
            marginBottom: "24px",
          }}
        >
          Continue with Google
        </button>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </p>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#999",
            marginTop: "24px",
            lineHeight: "1.6",
          }}
        >
          By signing in, you agree to our{" "}
          <a href="#terms" style={{ color: "#DA291C", textDecoration: "none" }}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#privacy"
            style={{ color: "#DA291C", textDecoration: "none" }}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
