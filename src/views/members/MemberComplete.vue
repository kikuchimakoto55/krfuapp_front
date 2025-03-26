<!-- MemberComplete.vue -->
<template>
    <div class="complete-page">
      <h2>登録が完了しました！</h2>
      <p>ご登録ありがとうございます。</p>
      <CButton color="primary" @click="goToTop">トップへ戻る</CButton>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const goToTop = () => {
    router.push('/dashboard') // またはトップページのパスに変更
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
  