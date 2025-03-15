<template>
  <div class="members">
    <h1>会員管理ページ</h1>
    <p>ここでは一般ユーザーが利用できる機能を提供します。</p>

    <!-- 会員一覧テーブル -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>氏名</th>
          <th>メールアドレス</th>
          <th>権限</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in members" :key="member.id">
          <td>{{ member.id }}</td>
          <td>{{ member.username_sei }} {{ member.username_mei }}</td>
          <td>{{ member.email }}</td>
          <td>{{ member.authoritykindsname }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const members = ref([]);

const fetchMembers = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/members', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    members.value = response.data;
  } catch (error) {
    console.error('会員データの取得エラー:', error);
  }
};

onMounted(fetchMembers);
</script>

<style scoped>
.members {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
