<template>
  <div class="layout">
   <!-- サイドバー -->
<c-sidebar v-if="isUserLoggedIn" :visible="sidebarVisible" :unfoldable="false" class="sidebar">
  <c-sidebar-brand href="#">MAIN TITLE</c-sidebar-brand>
    <c-sidebar-nav>
      <c-nav-item href="/"><i class="cil-home nav-icon"></i> Home</c-nav-item>
      <!--<c-nav-item href="/about"><i class="cil-info nav-icon"></i> About</c-nav-item>
      <c-nav-item href="/contact"><i class="cil-phone nav-icon"></i> Contact</c-nav-item>
      <c-nav-item v-if="isAdmin" href="/admin"><i class="cil-settings nav-icon"></i> Admin</c-nav-item>
      <c-nav-item v-if="isOperator" href="/management"><i class="cil-task nav-icon"></i> Management</c-nav-item>-->
      <c-nav-item href="#" @click="handleLogout"><i class="cil-account-logout nav-icon"></i> Logout </c-nav-item>

      <!--  会員管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-people dropdown-icon"></i> 会員管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/members" class="dropdown-link">
              <i class="cil-search dropdown-item-icon"></i> <span>会員検索</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/families/search" class="dropdown-link">
              <i class="cil-people dropdown-item-icon"></i> <span>家族検索</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/members/create" class="dropdown-link">
              <i class="cil-user-follow dropdown-item-icon"></i> <span>新規会員登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/members/import" class="dropdown-link">
              <i class="cil-cloud-upload dropdown-item-icon"></i> <span>会員一括管理</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
              <router-link to="/rankup/import" class="dropdown-link">
                <i class="cil-arrow-thick-to-top dropdown-item-icon"></i> <span>年度更新管理</span>
              </router-link>
          </CDropdownItem>
        </CDropdownMenu>
        </CDropdown>

      <!--  大会管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-calendar dropdown-icon"></i> 大会管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/tournaments/create" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>大会登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/tournaments" class="dropdown-link">
              <i class="cil-list-rich dropdown-item-icon"></i> <span>大会一覧</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <!-- 試合管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-american-football dropdown-icon"></i> 試合管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/games" class="dropdown-link">
              <i class="cil-list dropdown-item-icon"></i> <span>試合一覧</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/games/select" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>試合登録</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <!--  チーム管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-group dropdown-icon"></i> チーム管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/teams/create" class="dropdown-link">
              <i class="cil-user-follow dropdown-item-icon"></i> <span>チーム登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/teams" class="dropdown-link">
              <i class="cil-list-rich dropdown-item-icon"></i> <span>チーム一覧</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/teams/import" class="dropdown-link">
              <i class="cil-cloud-upload dropdown-item-icon"></i> <span>チーム一括管理</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      <!-- 会場管理（追加部分） -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-building dropdown-icon"></i> 会場管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/venues/create" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>会場登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/venues" class="dropdown-link">
              <i class="cil-list dropdown-item-icon"></i> <span>会場一覧</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <!-- 資格管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-education dropdown-icon"></i> 資格管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/licenses/create" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>資格登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/licenses" class="dropdown-link">
              <i class="cil-list dropdown-item-icon"></i> <span>資格一覧</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <!-- イベント管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-calendar dropdown-icon"></i> イベント管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/events/create" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>イベント登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/events" class="dropdown-link">
              <i class="cil-list-rich dropdown-item-icon"></i> <span>イベント一覧</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <!-- 役職管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-briefcase dropdown-icon"></i> 役職管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/coach-kinds/create" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>役職登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/coach-kinds" class="dropdown-link">
              <i class="cil-list dropdown-item-icon"></i> <span>役職一覧</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <!-- 委員会種別 管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-briefcase dropdown-icon"></i> 委員会管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/committee-kinds/create" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>委員会登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/committee-kinds" class="dropdown-link">
              <i class="cil-list dropdown-item-icon"></i> <span>委員会一覧</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <!-- 協会担当種別 管理 -->
      <CDropdown inNav class="c-nav-item-dropdown" v-if="isMember">
        <CDropdownToggle class="c-dropdown-toggle">
          <i class="cil-briefcase dropdown-icon"></i> 協会担当管理
        </CDropdownToggle>
        <CDropdownMenu class="dropdown-menu-custom" style="border: none;">
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/a-position-kinds/create" class="dropdown-link">
              <i class="cil-plus dropdown-item-icon"></i> <span>協会担当登録</span>
            </router-link>
          </CDropdownItem>
          <CDropdownItem class="c-nav-item" style="padding: 0;">
            <router-link to="/a-position-kinds" class="dropdown-link">
              <i class="cil-list dropdown-item-icon"></i> <span>協会担当一覧</span>
            </router-link>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
  </c-sidebar-nav>
</c-sidebar>

    <!-- メインコンテンツ -->
    <div class="main-content">
      <c-header class="header">
        <c-button class="me-3 d-lg-none" color="primary" @click="toggleSidebar">
          <i class="cil-menu"></i>
        </c-button>
        <h1 class="header-title">{{ pageTitle }}</h1>
      </c-header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '@/utils/axios';

const router = useRouter();
const route = useRoute();
const sidebarVisible = ref(window.innerWidth >= 992); // PC: 常時表示
const pageTitle = ref(route.meta.title || 'デフォルトタイトル');

// 🔹 ユーザーの権限を取得
const authoritykinds_id = ref(parseInt(localStorage.getItem('authoritykinds_id'), 10) || 0);

const isAdmin = computed(() => authoritykinds_id.value === 1);
const isOperator = computed(() => authoritykinds_id.value <= 2);
const isMember = computed(() => authoritykinds_id.value <= 3);
const isUser = computed(() => authoritykinds_id.value <= 4);

const handleResize = () => {
  sidebarVisible.value = window.innerWidth >= 992;
};

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value; // スマホ用切り替え
};

//  ログアウト処理
const handleLogout = async () => {
  try {
    // CSRFトークンを明示的に取得
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });

    // ローカルストレージを削除
    localStorage.removeItem('token');
    localStorage.removeItem('authoritykinds_id');
    localStorage.removeItem('authoritykindsname');
    axios.defaults.headers.common['Authorization'] = '';

    router.push('/login');
  } catch (error) {
    console.error('ログアウトエラー詳細:', error);
    if (error.response) {
      console.error('レスポンス内容:', error.response.data);
    }
  }
};

// 🔎 ルート変更時にタイトル更新
watch(() => route.meta.title, (newTitle) => {
  pageTitle.value = newTitle || 'デフォルトタイトル';
});

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});


//  追加：ログイン状態を判定する computed
const isUserLoggedIn = computed(() => !!localStorage.getItem('token'));
</script>

<style scoped>

/*  CoreUI のデフォルトの枠線を強制削除 */
.c-dropdown-menu,
.c-dropdown-menu.show,
.c-dropdown-menu[aria-labelledby] {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

.layout {
  display: flex;
  height: 100vh;
}

/* サイドバー */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

/* 🔥 CDropdownToggle のデフォルトスタイルを統一 */
.c-dropdown-toggle {
  border: none !important;
  background: transparent !important;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  text-decoration: none;
  color: #212529;
}
.c-dropdown-toggle:hover {
  background-color: #e9ecef !important;
}

/* 🔥 ドリルダウンメニューの枠線・影を削除 */
.dropdown-menu-custom {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  transform: none !important;
  z-index: 1050 !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background-color: white !important;
  padding: 0 !important;
  margin: 0 !important;
}


/* 🔥 `CDropdownItem` の枠線や背景色を統一 */
.c-nav-item {
  text-decoration: none;
  color: #212529;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
}
.c-nav-item:hover {
  background-color: #e9ecef !important;
}

.dropdown-icon,
.dropdown-item-icon {
  margin-right: 8px; /* 文字との間隔 */
  font-size: 1.2em; /* アイコンサイズを統一 */
  vertical-align: middle; /* アイコンの位置調整 */
}




/* 🔥 ヘッダーのタイトル */
.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  flex: 1;
  text-align: center;
}

/* メインコンテンツ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

/* スマホ: オーバーレイ表示 */
@media (max-width: 991.98px) {
  .sidebar {
    position: fixed;
    height: 100%;
    z-index: 1050;
  }

  .main-content {
    margin-left: 0;
  }
}

/* PC: サイドバー常時表示 */
@media (min-width: 992px) {
  .sidebar {
    position: relative;
    display: block !important;
  }

  .main-content {
    margin-left: 20px;
  }
}

.dropdown-link {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #212529;
  text-decoration: none;
  width: 100%;
  font-weight: normal; /* ← これで太字回避 */
}

.dropdown-link:hover {
  background-color: #e9ecef;
}
</style>
