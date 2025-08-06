import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // If using cookies for auth
});

// Response Interceptor: Handle expired token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login"; // Redirect
    }
    return Promise.reject(error);
  }
);

export default api;
