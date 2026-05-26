import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((req) => {
  try {
    const raw = localStorage.getItem("logi-auth");
    if (raw) {
      const token = JSON.parse(raw)?.state?.token;
      if (token) req.headers.Authorization = `Bearer ${token}`;
    }
  } catch { /* ignore parse errors */ }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      toast.error(" Server unreachable — check your backend is running.", {
        toastId: "network-error",   
      });
    } else if (err.response.status === 400) {
    } else if (err.response.status === 401) {
      localStorage.removeItem("logi-auth");
      toast.info("Session expired. Please sign in again.");
      setTimeout(() => { window.location.href = "/"; }, 1500);
    } else if (err.response.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (err.response.status >= 500) {
      toast.error("Internal server error. Please try again later.");
    }
    return Promise.reject(err);
  }
);

export default API;

