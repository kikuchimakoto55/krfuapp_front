<!-- MemberComplete.vue -->
<template>
  <div class="complete-page">
    <h2>登録が完了しました！</h2>
    <p>ご登録ありがとうございます。</p>

    <!-- 🔽 マイページリンクを表示（id が存在する場合のみ） -->
      <div v-if="memberId">
        <router-link :to="`/members/show/${memberId}`">
          <button class="custom-submit-button">マイページへ</button>
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
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// ✅ computed で取得しておく
const memberId = computed(() => route.query.id)

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

.custom-submit-button{
  background-color: #003366;
  color: #ffffff;
  border: none;
}
</style>