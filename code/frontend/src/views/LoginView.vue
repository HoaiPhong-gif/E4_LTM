<template>
  <div class="container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng nhập</button>
    </form>

    <p>Chưa có tài khoản? <router-link to="/register">Đăng ký</router-link></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axiosInstance";
import { useAuthStore } from "@/store/auth";

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
  try {
    const res = await axios.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    if (res.data.success) {
      // ✅ Lưu token + user vào Pinia & localStorage
      auth.setAuth(res.data.token, res.data.user);

      alert("✅ Đăng nhập thành công!");
      console.log("Thông tin trả về:", res.data);

      // ✅ Chuyển hướng sang trang blog
      router.push("/blogs");
    } else {
      alert(res.data.message || "Sai tài khoản hoặc mật khẩu!");
    }
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    alert("Đăng nhập thất bại! Vui lòng thử lại.");
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 80px auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
input {
  width: 100%;
  margin: 8px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
p {
  text-align: center;
  margin-top: 10px;
}
</style>
