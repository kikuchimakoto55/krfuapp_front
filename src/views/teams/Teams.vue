<template>
    <div class="p-4">
      
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>チーム名</th>
            <th>年度</th>
            <th>カテゴリ</th>
            <th>代表者名</th>
            <!-- 必要に応じて追加 -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.id">
            <td>{{ team.id }}</td>
            <td>{{ team.team_name }}</td>
            <td>{{ team.year }}</td>
            <td>{{ getCategoryLabel(team.category) }}</td>
            <td>{{ team.representative_name }}</td>
            <td><CButton color="primary" size="sm" @click="goToEdit(team.id)">編集</CButton></td>
            <td><CButton color="primary" size="sm" @click="confirmDelete(team.id)">削除</CButton></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const teams = ref([])
  const router = useRouter()

 
  const getCategoryLabel = (val) => {
    const map = {
      1: '有料試合', 2: '社会人', 3: 'クラブ', 4: '大学',
      5: '高校', 6: '中学', 7: 'ラグビースクール',
      8: 'タグラグビー', 9: '女子'
    }
    return map[val] || '-'
  }
  
  const fetchTeams = async () => {
  const res = await axios.get('http://localhost:8000/api/teams', {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  teams.value = res.data;
}

// 初回マウント時に呼び出す
onMounted(fetchTeams);

  const confirmDelete = async (id) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await axios.delete(`http://localhost:8000/api/teams/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        })
        alert('削除しました')
        await fetchTeams() // 再読み込み
      } catch (err) {
        console.error('削除失敗:', err)
        alert('削除に失敗しました')
      }
    }
  }

  </script>
  