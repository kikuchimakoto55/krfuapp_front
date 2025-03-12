import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue'; // ✅ 管理画面の追加

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { title: 'ログイン' }
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', component: Home, meta: { title: 'ダッシュボード', requiresAuth: true } },
      { path: 'about', component: About, meta: { title: 'About Us' } },
      { path: 'contact', component: Contact, meta: { title: 'Contact' } },
      { path: 'admin', component: Admin, meta: { title: '管理画面', requiresAuth: true, requiresAdmin: true } } // ✅ 管理者のみアクセス可能
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const authoritykindsId = parseInt(localStorage.getItem('authoritykinds_id'), 10); // 数値として取得

  // 🔹 未ログインの場合、認証が必要なページはログイン画面へリダイレクト
  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  // 🔹 管理者 (`authoritykinds_id = 1`) 以外は `/admin` へアクセス不可
  if (to.meta.requiresAdmin && authoritykindsId !== 1) {
    return next('/'); // ホームへリダイレクト
  }

  next();
});

export default router;
