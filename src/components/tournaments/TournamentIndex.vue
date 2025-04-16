<template>
    <div class="p-4">
      <h4>大会一覧</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>大会名</th>
            <th>年度</th>
            <th>カテゴリ</th>
            <th>開催期間</th>
            <th>公開設定</th>
            <th>編集</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tournaments" :key="t.tournament_id">
            <td>{{ t.name }}</td>
            <td>{{ t.year }}</td>
            <td>{{ categoryLabel(t.categoly) }}</td>
            <td>{{ formatPeriod(t.event_period_start, t.event_period_end) }}</td>
            <td>{{ Number(t.publishing) === 0 ? '公開' : '非公開' }}</td>
            <td><CButton color="primary" size="sm" @click="goToEdit(t.tournament_id)">編集</CButton></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const tournaments = ref([])
  
  const categoryLabel = (id) => {
    const map = {
      1: '有料試合', 2: '社会人', 3: 'クラブ', 4: '大学',
      5: '高校', 6: '中学', 7: 'ラグビースクール',
      8: 'タグラグビー', 9: '女子'
    }
    return map[id] || '-'
  }
  
  const formatPeriod = (start, end) => {
    return `${start?.substring(0, 10)} ～ ${end?.substring(0, 10)}`
  }
  
  onMounted(async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/tournaments', {
      withCredentials: true,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    tournaments.value = res.data
  })

  //編集処理
  const router = useRouter()

  const goToEdit = (id) => {
  router.push(`/tournaments/edit/${id}`)
  }
  </script>
  