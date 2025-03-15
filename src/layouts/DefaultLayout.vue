<template>
  <div class="layout">
    <!-- サイドバー -->
    <c-sidebar :visible="sidebarVisible" :unfoldable="false" class="sidebar">
      <c-sidebar-brand href="#">MAIN TITLE</c-sidebar-brand>
      <c-sidebar-nav>
        <c-nav-item href="/" icon="cil-home">Home</c-nav-item>
        <c-nav-item href="/about" icon="cil-info">About</c-nav-item>
        <c-nav-item href="/contact" icon="cil-phone">Contact</c-nav-item>

        <!-- 🔹 管理者 (authoritykinds_id = 1) のみ表示 -->
        <c-nav-item v-if="isAdmin" href="/admin" icon="cil-settings">Admin</c-nav-item>

        <!-- 🔹 運営権限 (authoritykinds_id <= 2) のみ表示 -->
        <c-nav-item v-if="isOperator" href="/management" icon="cil-task">Management</c-nav-item>

        <!-- 🔹 一般権限 (authoritykinds_id <= 3) のみ表示 -->
        <c-nav-item v-if="isMember" href="/members" icon="cil-user">Members</c-nav-item>

        <!-- 🔹 ログアウト -->
        <c-nav-item href="#" @click.prevent="handleLogout" icon="cil-account-logout">Logout</c-nav-item>
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
import axios from 'axios';

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

// 🔥 ログアウト処理
const handleLogout = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    // ローカルストレージを削除
    localStorage.removeItem('token');
    localStorage.removeItem('authoritykinds_id'); // 権限も削除
    axios.defaults.headers.common['Authorization'] = '';

    // ログインページへリダイレクト
    router.push('/login');
  } catch (error) {
    console.error('ログアウトエラー:', error.response);
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
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

/* サイドバー */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

/* 🔥 ログアウトボタンを他のメニューと統一 */
.c-nav-item {
  text-decoration: none;
  color: #212529; /* デフォルトのテキストカラー */
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
}
.c-nav-item:hover {
  background-color: #e9ecef; /* ホバー時の背景色 */
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
</style>
