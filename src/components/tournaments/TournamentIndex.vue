<template>
  <div class="p-4">
    <TournamentSearchForm @submit="handleSearch" />

    <div v-if="isLoading">読み込み中...</div>
    <div v-else>
      <CTable bordered>
        <thead>
          <tr>
            <th>大会名</th>
            <th>年度</th>
            <th>カテゴリ</th>
            <th>公開設定</th>
            <th>試合登録</th>
            <th>結果登録</th>
            <th>編集</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tournaments" :key="t.tournament_id">
            <td>{{ t.name }}</td>
            <td>{{ t.year }}</td>
            <td>{{ categoryLabel(t.categoly) }}</td>
            <td>{{ Number(t.publishing) === 0 ? '公開' : '非公開' }}</td>
            <td><CButton color="primary" size="sm" @click="goToGameCreate(t.tournament_id)">登録</CButton></td>
            <td><CButton color="primary" size="sm" @click="goToResultCreate(t.tournament_id)">登録</CButton></td>
            <td><CButton color="primary" size="sm" @click="goToEdit(t.tournament_id)">編集</CButton></td>
          </tr>
        </tbody>
      </CTable>
    </div>
  </div>
</template>

<script setup>
import TournamentSearchForm from '@/components/tournaments/TournamentSearchForm.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { categoryLabel } from '@/components/constants/labels'

const tournaments = ref([])
const isLoading = ref(false)


const fetchAllTournaments = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/tournaments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    tournaments.value = res.data
  } catch (e) {
    console.error('大会一覧取得失敗:', e)
    alert('大会一覧の取得に失敗しました')
  } finally {
    isLoading.value = false
  }
};

const handleSearch = async (criteria) => {
  isLoading.value = true
  try {
    const params = new URLSearchParams()
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== '') {
        params.append(key, value)
      }
    })

    const res = await axios.get(`http://127.0.0.1:8000/api/tournaments/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    tournaments.value = res.data.data
  } catch (error) {
    console.error('検索失敗:', error)
    alert('検索に失敗しました')
  } finally {
    isLoading.value = false
  }
};

onMounted(() => {
  fetchAllTournaments()
})

const formatPeriod = (start, end) => {
  return `${start?.substring(0, 10)} ～ ${end?.substring(0, 10)}`
};

const router = useRouter()

const goToEdit = (id) => {
  router.push(`/tournaments/edit/${id}`)
};

const goToGameCreate = (tournamentId) => {
  router.push({ name: 'GameCreate', query: { tournament_id: tournamentId } })
};

const goToResultCreate = (tournamentId) => {
  router.push(`/tournaments/${tournamentId}/results/create`)
};
</script>
