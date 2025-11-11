<template>
  <div class="container">
    <h2>{{ isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới" }}</h2>

    <form @submit.prevent="handleSubmit">
      <input v-model="title" type="text" placeholder="Tiêu đề" required />
      <textarea v-model="content" placeholder="Nội dung" required></textarea>

      <label>Ảnh (tùy chọn):</label>
      <input type="file" @change="handleFile" />

      <button type="submit">{{ isEdit ? "Cập nhật" : "Tạo mới" }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createBlog, updateBlog, fetchBlog } from "@/api/blog";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const blogId = route.params.id || null;
const isEdit = ref(!!blogId);

const title = ref("");
const content = ref("");
const file = ref(null);

// Nếu là edit, load dữ liệu blog
onMounted(async () => {
  if (isEdit.value) {
    try {
      const res = await fetchBlog(blogId);
      title.value = res.data.data.title;
      content.value = res.data.data.content;
    } catch (err) {
      console.error("❌ Lỗi fetch blog:", err);
      alert("Không thể load blog này.");
    }
  }
});

// Lấy file ảnh
const handleFile = (e) => {
  file.value = e.target.files[0];
};

// Gửi form
const handleSubmit = async () => {
  if (!auth.user || !auth.user.id) {
    alert("Vui lòng đăng nhập trước khi tạo/sửa bài viết!");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("content", content.value);
    formData.append("author_id", auth.user.id); // bắt buộc backend
    if (file.value) formData.append("image", file.value);

    if (isEdit.value) {
      await updateBlog(blogId, formData);
      alert("Cập nhật bài viết thành công!");
    } else {
      await createBlog(formData);
      alert("Tạo bài viết thành công!");
    }

    router.push("/blogs");
  } catch (err) {
    console.error("❌ Lỗi tạo/cập nhật blog:", err);
    alert("Không thể tạo/cập nhật bài viết. Vui lòng thử lại.");
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
input, textarea { width: 100%; margin: 10px 0; padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
button:hover { background: #0056b3; }
</style>
