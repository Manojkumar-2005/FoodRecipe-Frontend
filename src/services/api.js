import axios from "axios";

const api = axios.create({
  baseURL: "https://foodrecipebackend-hpdt.onrender.com",
  withCredentials: true, // for session cookies
});

export default api;
