"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "../lib/axios";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.replace("/login");
  }, [router]);

  // Init auth state on page load / refresh
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      if (typeof window === "undefined") return setLoading(false);

      const storedToken = localStorage.getItem("token");
      if (!storedToken) return setLoading(false);

      setToken(storedToken);
      axios.defaults.headers.Authorization = `Bearer ${storedToken}`;

      try {
        const res = await axios.get("auth/me");
        if (!cancelled) {
          setUser(res.data || null);
          localStorage.setItem("user", JSON.stringify(res.data || null));
        }
      } catch {
        logout(); // invalid token
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initAuth();
    return () => { cancelled = true; };
  }, [logout]);

  // Login function
  const login = async (email, password) => {
    try {
      // Flat payload
      const res = await axios.post("/auth/login", { email, password });
      const accessToken = res.data.access_token;
      if (!accessToken) throw new Error("No token returned");

      localStorage.setItem("token", accessToken);
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`;
      setToken(accessToken);

      const userRes = await axios.get("auth/me");
      setUser(userRes.data);
      localStorage.setItem("user", JSON.stringify(userRes.data));

      router.replace("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Login failed";
      throw new Error(message);
    }
  };

  // Register function
  const register = async (name, email, password, password_confirmation) => {
    try {
      await axios.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      router.replace("/login");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Registration failed";
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
