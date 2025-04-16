import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import Management from '../views/Management.vue';
import Members from '../views/members/Members.vue';
import MembersCreate from '../views/members/MembersCreate.vue';
import MemberComplete from '../views/members/MemberComplete.vue';

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

      // 🔹 管理者専用ページ (authoritykinds_id = 1 のみ)
      { path: 'admin', component: Admin, meta: { title: '管理画面', requiresAuth: true, requiresAdmin: true } },
 
      // 🔹 運営権限以上のページ (authoritykinds_id <= 2 のみ)
      { path: 'management', component: Management, meta: { title: '運営管理', requiresAuth: true, requiresOperation: true } },

      // 🔹 一般権限以上のページ (authoritykinds_id <= 3 のみ)
      { path: 'members', component: Members, meta: { title: '会員管理', requiresAuth: true, requiresGeneral: true } },
      { path: 'members/create', component: MembersCreate, meta: { title: '新規会員登録' } }, 
      { path: 'members/complete', component: MemberComplete, meta: { title: '登録完了' } },
      { path: 'members/edit/:id', name: 'MemberEdit', component: () => import('@/views/members/MembersEdit.vue'), meta: { title: '会員編集' } },
      { path: 'members/show/:id', name: 'MembersShow', component: () => import('@/views/members/MembersShow.vue'), meta: { title: '会員詳細' } },
      { path: 'members/edit-password/:id', name: 'PasswordChange', component: () => import('@/views/members/PasswordChange.vue'), meta: { title: 'パスワード変更', requiresAuth: true } },
      { path: '/families/search', name: 'FamiliesSearch', component: () => import('@/components/members/FamiliesSearch.vue'), meta: { title: '家族検索' } },
      { path: '/tournaments/create', name: 'TournamentCreate', component: () => import('@/components/tournaments/TournamentCreate.vue'), meta: { title: '大会情報登録' } },
      { path: '/tournaments', name: 'Tournaments', component: () => import('@/components/tournaments/TournamentIndex.vue'), meta: { title: '大会一覧' } },
      { path: '/tournaments/edit/:id', name: 'TournamentEdit', component: () => import('@/components/tournaments/TournamentEdit.vue'), meta: { requiresAuth: true } },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const authoritykindsId = parseInt(localStorage.getItem('authoritykinds_id'), 10) || 4; // 権限IDを取得 (未設定なら 4 = 使用者)

  // 🔹 未ログインの場合、requiresAuth が true のページはログイン画面へリダイレクト
  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  // 🔹 管理者 (authoritykinds_id = 1) 以外は `/admin` へアクセス不可
  if (to.meta.requiresAdmin && authoritykindsId !== 1) {
    return next('/');
  }

  // 🔹 運営権限以上 (authoritykinds_id <= 2) 以外は `/management` へアクセス不可
  if (to.meta.requiresOperation && authoritykindsId > 2) {
    return next('/');
  }

  // 🔹 一般権限以上 (authoritykinds_id <= 3) 以外は `/members` へアクセス不可
  if (to.meta.requiresGeneral && authoritykindsId > 3) {
    return next('/');
  }

  next();
});

export default router;
