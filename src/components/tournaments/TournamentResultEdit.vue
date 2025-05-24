<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">大会結果 編集</h2>

    <div v-if="isLoading">
      <p>読み込み中...</p>
    </div>

    <div v-else>
      <div v-for="(division, index) in results" :key="index" class="mb-8">
        <h3 class="text-lg font-semibold mb-2">
          ディビジョン {{ division.division_order }}：{{ division.division_name }}
        </h3>
        <CFormInput
          v-model="division.rank_label"
          placeholder="順位名"
          class="mb-2"
        />
        <CFormSelect v-model="division.team_id" class="mb-2">
          <option disabled value="">チームを選択</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </CFormSelect>
        <CFormTextarea
          v-model="division.report"
          rows="4"
          placeholder="結果レポート"
        />
      </div>

      <div class="text-center mt-6">
        <CButton color="primary" @click="handleUpdate">更新</CButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const tournamentId = route.params.id

const isLoading = ref(true)
const results = ref([])
const teams = ref([])

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/tournament-results/${tournamentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    results.value = res.data.map(r => ({
      ...r,
      team_id: null // チームIDが必要であれば取得してマッピング
    }))

    const teamRes = await axios.get('http://localhost:8000/api/teams', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    teams.value = teamRes.data
  } catch (e) {
    console.error(e)
    alert('データの取得に失敗しました')
  } finally {
    isLoading.value = false
  }
})

const handleUpdate = async () => {
  try {
    await axios.put(`http://localhost:8000/api/tournament-results/${tournamentId}`, {
      results: results.value
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    alert('更新が完了しました')
    router.push('/tournaments')
  } catch (e) {
    console.error(e)
    alert('更新に失敗しました')
  }
}
</script>
