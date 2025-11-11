<template>
  <div class="container">
    <h2>Đăng ký tài khoản</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="username" type="text" placeholder="Tên đăng nhập" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng ký</button>
    </form>

    <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
  </div>
</template>

<script setup>
import axios from "@/api/axiosInstance";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();

const handleRegister = async () => {
  try {
    const res = await axios.post("/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    alert(res.data.message);
    router.push("/login");
  } catch (err) {
    alert("Đăng ký thất bại!");
    console.error(err);
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
</style>
