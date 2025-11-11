import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const SECRET = "my_secret_key"; // bạn có thể đưa vào .env sau

// Đăng ký
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json(errorResponse("Vui lòng nhập đủ thông tin"));
    }

    const existedUser = await findUserByEmail(email);
    if (existedUser) {
      return res.status(400).json(errorResponse("Email đã tồn tại"));
    }

    const hash = await bcrypt.hash(password, 10);
    const userId = await createUser(username, email, hash);

    res.json(successResponse({ id: userId, username, email }, "Đăng ký thành công"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json(errorResponse("Email không tồn tại"));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json(errorResponse("Sai mật khẩu"));

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1d" });
    res.json(successResponse({ token }, "Đăng nhập thành công"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

// Logout (client chỉ cần xóa token)
export const logout = (req, res) => {
  res.json(successResponse({}, "Đã đăng xuất"));
};
