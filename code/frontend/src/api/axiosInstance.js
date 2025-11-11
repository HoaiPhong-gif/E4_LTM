import axios from "axios";

// 🧩 Tạo instance axios riêng
const api = axios.create({
  baseURL: "http://localhost:5000/api", // URL backend chính
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookie nếu backend hỗ trợ
});

// 🧠 Request Interceptor — tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚙️ Response Interceptor — xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Nếu token hết hạn, có thể tự động logout hoặc refresh
      if (error.response.status === 401) {
        console.warn("⚠️ Token hết hạn hoặc không hợp lệ");
        localStorage.removeItem("token");
        // Tùy logic, có thể redirect về trang đăng nhập:
        // window.location.href = "/login";
      }
      console.error("❌ Lỗi API:", error.response.data);
    } else {
      console.error("🚫 Lỗi mạng hoặc server không phản hồi:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
