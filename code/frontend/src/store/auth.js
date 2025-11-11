import { defineStore } from "pinia";
import api from "@/api/axiosInstance";

export const useAuthStore = defineStore("auth", {
  state: () => {
    let user = null;
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") user = JSON.parse(stored);
    } catch (e) { user = null; }

    return {
      token: localStorage.getItem("token") || null,
      user,
    };
  },
  actions: {
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    async fetchProfile() {
      try {
        const resp = await api.get("/auth/me");
        this.user = resp.data.data;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (e) {
        console.warn("Không thể lấy thông tin người dùng:", e);
      }
    },
  },
});
