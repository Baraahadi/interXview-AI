import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    toast.error("Request error occurred");
    return Promise.reject(error);
  },
);

// Global response error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected error occurred";

    if (error?.message === "Network Error") {
      message = "Cannot reach server. Check your internet connection.";
    }

    toast.error(message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
