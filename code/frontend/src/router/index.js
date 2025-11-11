import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import BlogList from "../views/BlogList.vue";
import BlogDetail from "../views/BlogDetail.vue";
import BlogForm from "../views/BlogForm.vue";
import Profile from "../views/Profile.vue";
import { useAuthStore } from "@/store/auth";

const routes = [
  { path: "/", redirect: "/blogs" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/blogs", component: BlogList },
  { path: "/blogs/:id", component: BlogDetail },
  { path: "/blogs/create", component: BlogForm, meta: { requiresAuth: true } },
  { path: "/blogs/:id/edit", component: BlogForm, meta: { requiresAuth: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isLoggedIn = !!auth.token;

  // Nếu cần auth mà chưa login
  if (to.meta.requiresAuth && !isLoggedIn) return next("/login");

  // Nếu đã login mà vào login/register
  if ((to.path === "/login" || to.path === "/register") && isLoggedIn) return next("/blogs");

  next();
});

export default router;
