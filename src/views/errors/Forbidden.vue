<!-- src/views/errors/Forbidden.vue -->
<template>
    <div class="text-center p-5">
      <h1>403 Forbidden</h1>
      <p>このページにアクセスする権限がありません。</p>
      <router-link to="/">
        <CButton color="primary">ホームへ戻る</CButton>
      </router-link>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  h1 {
    font-size: 2rem;
    color: #dc3545;
  }
  </style>
  