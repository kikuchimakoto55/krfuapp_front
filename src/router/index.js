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
import Teams from '../views/teams/Teams.vue'
import TournamentResultComplete from '../components/tournaments/TournamentResultComplete.vue'
import GameIndex from '../components/games/GameIndex.vue';
import GameCreate from '../components/games/GameCreate.vue';
import GameEdit from '../components/games/GameEdit.vue';
import VenueIndex from '../components/venues/VenueIndex.vue'
import LicensesIndex from '../components/licenses/LicensesIndex.vue';
import LicensesCreate from '../components/licenses/LicensesCreate.vue';
import TournamentResultEdit from '../components/tournaments/TournamentResultEdit.vue'
import MembersImport from '../views/members/MembersImport.vue'

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
      { path: 'members/edit/:id', name: 'MemberEdit', component: () => import('@/views/members/MembersEdit.vue'), meta: { title: '会員編集', requiresAuth: true, requiresOperation: true }},


      // 🔹 一般権限以上のページ (authoritykinds_id <= 3 のみ)
      { path: 'members', component: Members, meta: { title: '会員管理', requiresAuth: true, requiresGeneral: true } },
      { path: 'members/create', component: MembersCreate, meta: { title: '新規会員登録' } }, 
      { path: 'members/import', name: 'MembersImport', component: MembersImport,  meta: { title: '一括管理' } },
      { path: 'members/complete', component: MemberComplete, meta: { title: '登録完了' } },
      { path: 'members/show/:id', name: 'MembersShow', component: () => import('@/views/members/MembersShow.vue'), meta: { title: '会員詳細' } },
      { path: 'members/edit-password/:id', name: 'PasswordChange', component: () => import('@/views/members/PasswordChange.vue'), meta: { title: 'パスワード変更', requiresAuth: true } },
      { path: 'members/:id/credentials/edit', name: 'HCredentialsEdit', component: () => import('@/components/credentials/HCredentialsEdit.vue'), meta: { title: '保有資格編集', requiresAuth: true, requiresGeneral: true } },
      { path: 'families/search', name: 'FamiliesSearch', component: () => import('@/components/members/FamiliesSearch.vue'), meta: { title: '家族検索' } },
      { path: 'tournaments/create', name: 'TournamentCreate', component: () => import('@/components/tournaments/TournamentCreate.vue'), meta: { title: '大会情報登録' } },
      { path: 'tournaments', name: 'Tournaments', component: () => import('@/components/tournaments/TournamentIndex.vue'), meta: { title: '大会一覧' } },
      { path: 'tournaments/edit/:id', name: 'TournamentEdit', component: () => import('@/components/tournaments/TournamentEdit.vue'), meta: { requiresAuth: true, title: '大会編集'} },
      { path: 'teams', component: Teams, meta: { title: 'チーム一覧', requiresAuth: true, requiresGeneral: true } },
      { path: 'teams/edit/:id', name: 'TeamEdit', component: () => import('@/views/teams/TeamEdit.vue'), meta: { title: 'チーム編集', requiresAuth: true, requiresOperation: true } },
      { path: 'teams/create', name: 'TeamCreate', component: () => import('@/views/teams/TeamCreate.vue'), meta: { title: 'チーム新規登録' }, },
      { path: 'teams/complete', name: 'TeamComplete', component: () => import('@/views/teams/TeamComplete.vue'), meta: { title: 'チーム登録完了' }, },
      { path: 'teams/import', name: 'TeamsImport', component: () => import('@/views/teams/TeamsImport.vue'), meta: { title: 'チーム一括登録', requiresAuth: true } },
      { path: 'forbidden', name: 'Forbidden', component: () => import('@/views/errors/Forbidden.vue'), meta: { title: 'アクセス拒否' } },
      { path: 'tournaments/:id/results/create', name: 'TournamentResultCreate', component: () => import('@/components/tournaments/TournamentResultCreate.vue'), meta: { title: '大会結果登録', requiresAuth: true } },
      { path: 'tournaments/:id/results/complete', name: 'TournamentResultComplete', component: TournamentResultComplete, props: true, meta: { title: '大会結果 登録完了' }},
      { path: '/tournaments/:id/results/edit', name: 'TournamentResultEdit', component: TournamentResultEdit, meta: { title: '大会結果編集', requiresAuth: true } },
      { path: 'games', name: 'Games', component: GameIndex, meta: { title: '試合一覧', requiresAuth: true } },
      { path: 'games/create', name: 'GameCreate', component: GameCreate, meta: { title: '試合登録', requiresAuth: true } },
      { path: 'games/edit/:id', name: 'GameEdit', component: GameEdit, meta: { title: '試合編集', requiresAuth: true } },
      { path: 'games/select', name: 'GameSelect', component: () => import('@/components/games/GameSelect.vue'), meta: { title: '試合登録 - 大会選択', requiresAuth: true } },
      { path: 'venues/create', name: 'VenueCreate', component: () => import('@/components/venues/VenueCreate.vue'), meta: { title: '会場登録' } },
      { path: 'venues', name: 'VenueIndex', component: VenueIndex, meta: { title: '会場一覧' } },
      { path: 'venues/edit/:id', name: 'VenueEdit', component: () => import('@/components/venues/VenueEdit.vue'), meta: { title: '会場編集' } },
      { path: '/licenses', name: 'LicensesIndex', component: LicensesIndex, meta: { title: '資格一覧' } },
      { path: '/licenses/create', name: 'LicensesCreate', component: LicensesCreate, meta: { title: '資格登録' } },
      { path: '/licenses/edit/:id', name: 'LicensesEdit', component: () => import('@/components/licenses/LicensesEdit.vue'), meta: { title: '資格編集' } },
      { path: '/events/create', name: 'EventCreate', component: () => import('@/components/event/EventCreate.vue'), meta: { title: 'イベント登録' } },
      { path: '/events', name: 'EventIndex', component: () => import('@/components/event/EventIndex.vue'), meta: { title: 'イベント一覧' } },
      { path: '/events/edit/:id', name: 'EventEdit', component: () => import('@/components/event/EventEdit.vue'), meta: { title: 'イベント編集' } },
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
    return next('/forbidden');
  }

  // 🔹 運営権限以上 (authoritykinds_id <= 2) 以外は `/management` へアクセス不可
  if (to.meta.requiresOperation && authoritykindsId > 2) {
    return next('/forbidden');
  }

  // 🔹 一般権限以上 (authoritykinds_id <= 3) 以外は `/members` へアクセス不可
  if (to.meta.requiresGeneral && authoritykindsId > 3) {
    return next('/forbidden');
  }
  

  next();
});

export default router;
