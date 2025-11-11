import pool from "../config/db.js";

// 🟢 Lấy tất cả blog (có thể search & sort)
export const getAllBlogs = async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = "SELECT b.*, u.username AS author FROM blogs b JOIN users u ON b.author_id = u.id";
    let params = [];

    if (search) {
      query += " WHERE b.title LIKE ?";
      params.push(`%${search}%`);
    }

    if (sort === "asc" || sort === "desc") {
      query += ` ORDER BY b.created_at ${sort.toUpperCase()}`;
    }

    const [blogs] = await pool.query(query, params);
    res.json({ success: true, data: blogs });
  } catch (error) {
    console.error("❌ Lỗi SQL:", error); // 👈 Thêm dòng này
    res.status(500).json({ success: false, message: error.message }); // 👈 In lỗi thật
  }
};


// 🟢 Lấy blog theo id
export const getBlogById = async (req, res) => {
  try {
    const [blog] = await pool.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    if (blog.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy blog" });
    }
    res.json({ success: true, data: blog[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 🟢 Tạo blog mới
export const createBlog = async (req, res) => {
  try {
    const { title, content, author_id } = req.body;
    const [result] = await pool.query(
      "INSERT INTO blogs (title, content, author_id) VALUES (?, ?, ?)",
      [title, content, author_id]
    );

    res.status(201).json({
      success: true,
      message: "Tạo blog thành công",
      data: { id: result.insertId, title, content, author_id },
    });
  } catch (error) {
    console.error("❌ Lỗi tạo blog:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 🟢 Cập nhật blog
export const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    await pool.query("UPDATE blogs SET title = ?, content = ? WHERE id = ?", [
      title,
      content,
      req.params.id,
    ]);
    res.json({ success: true, message: "Cập nhật blog thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 🟢 Xóa blog
export const deleteBlog = async (req, res) => {
  try {
    await pool.query("DELETE FROM blogs WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Xóa blog thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
