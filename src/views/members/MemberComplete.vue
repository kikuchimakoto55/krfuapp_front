<template>
  <div class="complete-page">
    <h2>登録が完了しました！</h2>
    <p>ご登録ありがとうございます。</p>

    <div>
      <p>以下のメールアドレスでログインしてください：</p>
      <p><strong>{{ email }}</strong></p>

      <router-link to="/login">
        <CButton color="primary">ログイン画面へ</CButton>
      </router-link>
    </div>

    <!-- 🔽 トップへ戻る -->
    <div style="margin-top: 20px;">
      <CButton color="primary" @click="goToTop">新規登録画面へ戻る</CButton>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = route.query.email || '（取得できませんでした）'

const goToTop = () => {
  router.push('/members/create')
}
</script>

<style scoped>
.complete-page {
  text-align: center;
  padding: 40px;
}
.complete-page h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
</style>