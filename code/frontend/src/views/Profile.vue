<template>
  <div class="page">
    <h2>Profile</h2>
    <div v-if="auth.user">
      <p>Username: {{ auth.user.username }}</p>
      <p>Email: {{ auth.user.email }}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
const auth = useAuthStore();
const logout = () => { auth.logout(); window.location.href = "/login"; };
</script>
