// This file prepares the API structure for future backend integration
// Currently using dummy data, but structure is ready for real API calls

import axios from "axios";

// Create axios instance with base URL
// TODO: Update this to your actual backend URL when ready
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to all requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// AUTH ENDPOINTS
// =====================================================

// Get user profile from /api/users/me
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Return dummy data during development if API fails
    return {
      id: "1",
      email: "user@example.com",
      firstName: "User",
      lastName: "Profile",
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // TODO: Implement when backend is ready
    // await apiClient.post("/auth/logout");
    localStorage.removeItem("jwt");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// =====================================================
// RESUME ENDPOINTS
// =====================================================

// Get all resumes
export const getResumes = async () => {
  try {
    const response = await apiClient.get("/resumes");
    console.log("Resumes fetched:", response.data);
    return response.data.resumes || [];
  } catch (error) {
    console.error(
      "Error fetching resumes - Full error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get single resume
export const getResumeById = async (id) => {
  try {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data.resume;
  } catch (error) {
    console.error("Error fetching resume:", error);
    throw error;
  }
};

// Create new resume
export const createResume = async (resumeData) => {
  try {
    const response = await apiClient.post("/resumes", resumeData);
    return response.data.resume;
  } catch (error) {
    console.error("Error creating resume:", error);
    throw error;
  }
};

// Update resume
export const updateResume = async (id, resumeData) => {
  try {
    const response = await apiClient.put(`/resumes/${id}`, resumeData);
    return response.data.resume;
  } catch (error) {
    console.error("Error updating resume:", error);
    throw error;
  }
};

// Delete resume
export const deleteResume = async (id) => {
  try {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};

// TODO: Download resume PDF export functionality

// =====================================================
// ATS SCORE ENDPOINTS
// =====================================================

// Get ATS score for a resume
export const getAtsScore = async (id) => {
  try {
    // TODO: Implement when backend is ready
    // const response = await apiClient.get(`/resumes/${id}/ats-score`);
    // return response.data;
    return { score: 85, details: [] };
  } catch (error) {
    console.error("Error fetching ATS score:", error);
    throw error;
  }
};

// Get ATS tips
export const getAtsTips = async () => {
  try {
    const response = await apiClient.get("/meta/ats-tips");
    console.log("ATS Tips fetched:", response.data);
    return response.data.tips || response.data;
  } catch (error) {
    console.error(
      "Error fetching ATS tips - Full error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// =====================================================
// AI ASSISTANT ENDPOINTS
// =====================================================

// Check AI status
export const getAIStatus = async () => {
  try {
    const response = await apiClient.get("/ai/status");
    return response.data;
  } catch (error) {
    console.error("Error fetching AI status:", error);
    return { configured: false, provider: "MilkaaCV AI" };
  }
};

// Generate or improve professional summary
export const improveSummaryWithAI = async (data) => {
  try {
    const response = await apiClient.post("/ai/improve-summary", data);
    return response.data;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    throw error;
  }
};

// Polish resume bullet point
export const improveBulletWithAI = async (data) => {
  try {
    const response = await apiClient.post("/ai/improve-bullet", data);
    return response.data;
  } catch (error) {
    console.error("Error polishing AI bullet:", error);
    throw error;
  }
};

// Suggest ATS keywords and skills
export const suggestSkillsWithAI = async (data) => {
  try {
    const response = await apiClient.post("/ai/suggest-skills", data);
    return response.data;
  } catch (error) {
    console.error("Error getting AI skills:", error);
    throw error;
  }
};

// Real ATS analysis and Job Description Keyword Matcher
export const analyzeResumeWithAI = async (data) => {
  try {
    const response = await apiClient.post("/ai/analyze-ats", data);
    return response.data;
  } catch (error) {
    console.error("Error analyzing ATS with AI:", error);
    throw error;
  }
};

// Scan External CV (PDF or raw text) with AI
export const scanExternalCvWithAI = async (data) => {
  try {
    const response = await apiClient.post("/ai/scan-external-cv", data);
    return response.data;
  } catch (error) {
    console.error("Error scanning external CV with AI:", error);
    throw error;
  }
};

// Generate complete polished resume with AI
export const generateCompleteResumeWithAI = async (resumeData) => {
  try {
    const response = await apiClient.post("/ai/generate-complete-resume", resumeData);
    return response.data;
  } catch (error) {
    console.error("Error generating complete resume with AI:", error);
    throw error;
  }
};

export default apiClient;

