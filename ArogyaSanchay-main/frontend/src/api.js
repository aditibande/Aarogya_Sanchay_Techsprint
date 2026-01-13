import axios from "axios";

export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

export const IMAGE_BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";


const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createHealthId = (data) => api.post("/healthids", data);
export const getHealthIds = () => api.get("/healthids");
export const getHealthIdById = (id) => api.get(`/healthids/${id}`);
export const updateHealthId = (id, data) => api.put(`/healthids/${id}`, data);
export const deleteHealthId = (id) => api.delete(`/healthids/${id}`);

export default api;

