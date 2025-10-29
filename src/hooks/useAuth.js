import { useState, useEffect } from "react";
import api from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/user");
        setUser(res.data);
      } catch (error) {
        console.error('Auth check error:', error.response?.status, error.response?.data || error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);
      // Clear any stored tokens if any
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to recipes page
      window.location.href = "/recipes";
    } catch (error) {
      console.error("Logout failed", error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      window.location.href = "/recipes";
    }
  };

  return { user, loading, logout };
};
