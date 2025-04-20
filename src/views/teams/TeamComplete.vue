<template>
    <div class="complete-page">
      <h2>チーム登録が完了しました！</h2>
      <p>ご登録ありがとうございます。</p>
  
      <router-link to="/teams/create">
        <CButton color="primary" class="mt-3">続けて登録する</CButton>
      </router-link>
  
      <router-link to="/">
        <CButton color="secondary" class="mt-3 ms-2">トップに戻る</CButton>
      </router-link>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .complete-page {
    text-align: center;
    padding: 40px;
  }
  </style>
  