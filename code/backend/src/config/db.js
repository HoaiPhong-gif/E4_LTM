// src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "blog_app",
});

pool.getConnection()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch(err => console.error("❌ MySQL connection failed:", err));

export default pool;
