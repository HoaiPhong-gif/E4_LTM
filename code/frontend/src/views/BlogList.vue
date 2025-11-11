<template>
  <div class="container">
    <div class="header">
      <h2>Danh sách bài viết</h2>
      <!-- Hiển thị nút tạo mới nếu đã login -->
      <button v-if="isLoggedIn" @click="goCreate" class="btn-create">Tạo bài viết mới</button>
    </div>

    <!-- Search + Sort -->
    <div class="controls">
      <input v-model="search" type="text" placeholder="Tìm kiếm theo tiêu đề..." />
      <select v-model="sort">
        <option value="">Mặc định</option>
        <option value="asc">Cũ → Mới</option>
        <option value="desc">Mới → Cũ</option>
      </select>
      <button @click="fetchList">Tìm kiếm</button>
    </div>

    <!-- Danh sách blog -->
    <div class="blogs">
      <div v-for="blog in blogs" :key="blog.id" class="blog-card">
        <h3>{{ blog.title }}</h3>
        <p>By {{ blog.author }}</p>
        <router-link :to="`/blogs/${blog.id}`">Xem chi tiết</router-link>

        <!-- Hiển thị nút sửa/xóa nếu là tác giả -->
        <span v-if="isAuthor(blog)">
          <button @click="editBlog(blog.id)" class="btn-edit">Sửa</button>
          <button @click="deleteBlog(blog.id)" class="btn-delete">Xóa</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { fetchBlogs as apiFetchBlogs, deleteBlog as apiDeleteBlog } from "@/api/blog";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const auth = useAuthStore();

const blogs = ref([]);
const search = ref("");
const sort = ref("");

// Computed để nhận biết người dùng đã login chưa
const isLoggedIn = computed(() => !!auth.user);

// Lấy danh sách blog từ backend
const fetchList = async () => {
  try {
    const res = await apiFetchBlogs({ search: search.value, sort: sort.value });
    if (res.data.success) {
      blogs.value = res.data.data;
    }
  } catch (err) {
    console.error("❌ Lỗi fetch blogs:", err);
    alert("Không thể lấy danh sách blog");
  }
};

// Chuyển sang trang tạo blog
const goCreate = () => router.push("/blogs/create");

// Chỉnh sửa blog
const editBlog = (id) => router.push(`/blogs/${id}/edit`);

// Xóa blog
const deleteBlog = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
  try {
    await apiDeleteBlog(id);
    alert("Xóa bài viết thành công!");
    fetchList(); // refresh danh sách
  } catch (err) {
    console.error("❌ Lỗi xóa blog:", err);
    alert("Không thể xóa bài viết");
  }
};

// Kiểm tra xem người dùng có phải là tác giả blog
const isAuthor = (blog) => auth.user && blog.author_id === auth.user.id;

// Load blog khi component mounted
onMounted(() => {
  fetchList();
});
</script>

<style scoped>
.container { max-width: 800px; margin: 40px auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-create { padding: 6px 12px; background: #28a745; color: white; border-radius: 5px; border: none; cursor: pointer; }
.btn-create:hover { background: #218838; }

.controls { display: flex; gap: 10px; margin-bottom: 20px; }
input { flex: 1; padding: 6px 10px; border-radius: 4px; border: 1px solid #ccc; }
select { padding: 6px 10px; border-radius: 4px; border: 1px solid #ccc; }
button { cursor: pointer; }

.blogs { display: flex; flex-direction: column; gap: 10px; }
.blog-card { border: 1px solid #ccc; padding: 12px; border-radius: 5px; background: #f9f9f9; }
.blog-card h3 { margin: 0 0 6px 0; }
.blog-card p { margin: 0 0 6px 0; font-size: 0.9em; color: #555; }
.btn-edit { padding: 4px 8px; margin-right: 4px; background: #007bff; color: white; border-radius: 5px; border: none; cursor: pointer; }
.btn-edit:hover { background: #0056b3; }
.btn-delete { padding: 4px 8px; background: #dc3545; color: white; border-radius: 5px; border: none; cursor: pointer; }
.btn-delete:hover { background: #c82333; }
</style>
