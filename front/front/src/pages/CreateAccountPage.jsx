import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import PasswordStrength from "../components/PasswordStrength";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRegisterForm,
} from "../utils/validation";
import "../styles/AuthForms.css";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (field, values) => {
    const v = values || { email, password, confirm, firstName, lastName };
    let message = "";

    switch (field) {
      case "email":
        message = validateEmail(v.email);
        break;
      case "password":
        message = validatePassword(v.password);
        break;
      case "confirm":
        message = validateConfirmPassword(v.password, v.confirm);
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({ ...prev, [field]: message }));
    return message;
  };

  const handleBlur = (field) => {
    markTouched(field);
    validateField(field);
  };

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    const values = { email, password, confirm, firstName, lastName };
    const errors = validateRegisterForm(values);

    setFieldErrors(errors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirm: true,
    });

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Registration failed");
        return;
      }

      if (data.token) localStorage.setItem("jwt", data.token);
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
            <h1 className="split-auth-title">Create Account</h1>
            <p className="split-auth-subtitle">
              Sign up today and get your free ATS resume audit
            </p>
          </div>

          <form onSubmit={handleCreate} noValidate className="split-auth-form">
            <div className="auth-row">
              <FormField
                id="firstName"
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => handleBlur("firstName")}
                error={fieldErrors.firstName}
                touched={touched.firstName}
                placeholder="First name"
                autoComplete="given-name"
              />
              <FormField
                id="lastName"
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => handleBlur("lastName")}
                error={fieldErrors.lastName}
                touched={touched.lastName}
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>

            <FormField
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email)
                  validateField("email", { email: e.target.value });
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
                  validateField("password", {
                    email,
                    password: e.target.value,
                    confirm,
                  });
                }
                if (touched.confirm && confirm) {
                  validateField("confirm", {
                    email,
                    password: e.target.value,
                    confirm,
                  });
                }
              }}
              onBlur={() => handleBlur("password")}
              error={fieldErrors.password}
              touched={touched.password}
              placeholder="Create a password"
              required
              showPasswordToggle
              autoComplete="new-password"
            />
            <PasswordStrength password={password} />

            <FormField
              id="confirm"
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (touched.confirm) {
                  validateField("confirm", {
                    email,
                    password,
                    confirm: e.target.value,
                  });
                }
              }}
              onBlur={() => handleBlur("confirm")}
              error={fieldErrors.confirm}
              touched={touched.confirm}
              placeholder="Confirm your password"
              required
              showPasswordToggle
              autoComplete="new-password"
            />

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
              {loading ? "Creating..." : "Create account"}
            </button>

            <p className="split-auth-footer">
              Already have an account?{" "}
              <button
                type="button"
                className="split-auth-footer-link"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
