import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createTalent = (data) => API.post("/talents", data);
export const getTalents = (params) => API.get("/talents", { params });
export const updateTalent = (id, data) => API.put(`/talents/${id}`, data);
export const deleteTalent = (id) => API.delete(`/talents/${id}`);
export const getTalentStats = () => API.get("/talents/stats");

// Notifications
export const getNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put("/notifications/read-all");

export const loginAdmin = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

export default API;
