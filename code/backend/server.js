// server.js
import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import blogRoutes from "./src/routes/blog.routes.js";

dotenv.config(); // Load biến môi trường

const app = express();

// ✅ Cấu hình CORS chuẩn cho frontend Vue
app.use(
  cors({
    origin: "http://localhost:5173", // cổng của Vite/Vue app
    credentials: true, // cho phép gửi cookie hoặc header Authorization
  })
);

// ✅ Middleware đọc body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve ảnh / file upload (nếu có)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// ✅ Route test kết nối DB
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    res.json({
      message: "✅ Server & Database đang hoạt động tốt!",
      current_time: rows[0].time,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Lỗi kết nối Database!" });
  }
});

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));
