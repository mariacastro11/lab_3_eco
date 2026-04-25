import axios from "axios";

console.log("BACKEND URL (HARDCODED): http://127.0.0.1:8080/api");

export const api = axios.create({
  baseURL: "http://127.0.0.1:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
