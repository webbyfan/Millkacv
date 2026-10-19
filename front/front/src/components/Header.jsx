import React, { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";
import "../styles/Header.css";

export default function Header() {
  const [user, setUser] = useState({
    name: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile (dummy data for now)
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        console.error("Error loading user profile:", error);
        // Keep default user data
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        {/* Welcome Message */}
        <div className="header-left">
          <h1 className="welcome-text">Welcome back, {user.name}!</h1>
          <p className="header-subtitle">
            Create ATS-friendly resumes for internships and jobs.
          </p>
        </div>

      </div>
    </header>
  );
}
