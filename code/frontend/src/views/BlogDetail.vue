<template>
  <div class="container" v-if="blog">
    <h2>{{ blog.title }}</h2>
    <p>Tác giả: {{ blog.author }}</p>
    <img v-if="blog.image" :src="`/uploads/${blog.image}`" alt="Ảnh blog" width="300"/>
    <p>{{ blog.content }}</p>

    <div v-if="auth.token">
      <router-link :to="`/blogs/${blog.id}/edit`" class="btn">Chỉnh sửa</router-link>
      <button @click="deleteBlogPost" class="btn-delete">Xóa bài</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchBlog, deleteBlog as apiDeleteBlog } from "@/api/blog";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const router = useRouter();
const blog = ref(null);
const auth = useAuthStore();

const fetchBlogDetail = async () => {
  try {
    const res = await fetchBlog(route.params.id);
    blog.value = res.data.data;
  } catch (e) {
    console.error("Lỗi fetch blog:", e);
  }
};

const deleteBlogPost = async () => {
  if (!confirm("Bạn có chắc muốn xóa bài này?")) return;
  try {
    await apiDeleteBlog(blog.value.id);
    alert("Xóa thành công!");
    router.push("/blogs");
  } catch (e) {
    console.error("Lỗi xóa blog:", e);
  }
};

onMounted(fetchBlogDetail);
</script>

<style scoped>
.btn { margin-right: 10px; background: #007bff; color: white; padding: 5px 10px; }
.btn-delete { background: red; color: white; padding: 5px 10px; }
</style>
