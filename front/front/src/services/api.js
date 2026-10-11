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

export default apiClient;
