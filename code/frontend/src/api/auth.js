import api from "./axiosInstance";

/**
 * 🟢 Đăng ký người dùng mới
 * @param {Object} data - { username, email, password }
 */
export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi server" };
  }
};

/**
 * 🟢 Đăng nhập
 * @param {Object} data - { email, password }
 */
export const loginUser = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi server" };
  }
};

/**
 * 🟢 Đăng xuất (tùy chọn, nếu có API logout ở backend)
 */
export const logoutUser = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi đăng xuất:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi server" };
  }
};
