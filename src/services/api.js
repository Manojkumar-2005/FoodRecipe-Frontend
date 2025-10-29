import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://foodrecipebackend-hpdt.onrender.com",
  withCredentials: true, // for session cookies
});

export default api;
