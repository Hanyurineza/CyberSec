import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // correct
});

// 🔐 Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
