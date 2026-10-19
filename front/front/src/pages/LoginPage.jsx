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
    <div className="split-auth-container">
      {/* Left Visual Hero with Big Logo Only */}
      <div className="split-auth-left">
        <div
          className="split-auth-big-logo-wrapper"
          onClick={() => navigate("/")}
          title="Millka CV Home"
        >
          <div className="split-auth-big-logo-card">
            <img
              src="/logo.png"
              alt="Millka CV"
              className="split-auth-big-logo-img"
            />
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="split-auth-right">
        <div className="split-auth-top-actions">
          <button
            type="button"
            className="split-back-home-btn"
            onClick={() => navigate("/")}
            title="Back to Landing Page"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>

        <div className="split-auth-form-card">
          <div className="split-auth-header">
            <h1 className="split-auth-title">Login</h1>
            <p className="split-auth-subtitle">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} noValidate className="split-auth-form">
            <FormField
              id="email"
              label="Email"
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
              placeholder="aimerpaix@gmail.com"
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

            <div className="split-auth-remember-row">
              <label className="split-auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                className="split-auth-forgot-btn"
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

            <button
              type="submit"
              disabled={loading}
              className="split-auth-submit-btn"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="split-auth-footer">
              Not a member?{" "}
              <button
                type="button"
                className="split-auth-footer-link"
                onClick={() => navigate("/register")}
              >
                Create an account
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
