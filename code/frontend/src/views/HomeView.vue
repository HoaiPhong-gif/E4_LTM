<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Danh sách Blog</h1>

    <div class="flex gap-2 mb-4">
      <input
        v-model="search"
        placeholder="Tìm kiếm blog..."
        class="border p-2 rounded w-full"
      />
      <button @click="fetchBlogs" class="bg-blue-500 text-white px-4 py-2 rounded">
        Tìm
      </button>
      <select v-model="sort" @change="fetchBlogs" class="border p-2 rounded">
        <option value="">Sắp xếp</option>
        <option value="asc">Tăng dần</option>
        <option value="desc">Giảm dần</option>
      </select>
    </div>

    <div v-if="blogs.length === 0">Không có blog nào</div>
    <ul>
      <li
        v-for="blog in blogs"
        :key="blog.id"
        class="border p-4 rounded mb-2 hover:bg-gray-50"
      >
        <h2 class="text-xl font-semibold">{{ blog.title }}</h2>
        <p>{{ blog.content }}</p>
        <small class="text-gray-500">Tác giả: {{ blog.author }}</small>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getBlogs } from "../api/blog";

const blogs = ref([]);
const search = ref("");
const sort = ref("");

const fetchBlogs = async () => {
  const res = await getBlogs({ search: search.value, sort: sort.value });
  blogs.value = res.data.data;
};

onMounted(fetchBlogs);
</script>
