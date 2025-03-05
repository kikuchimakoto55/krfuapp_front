import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue'; // ✅ これが必要
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import Login from '../views/Login.vue';

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
      { path: 'contact', component: Contact, meta: { title: 'Contact' } }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // 未ログインならログイン画面へリダイレクト
  } else {
    next();
  }
});

export default router;