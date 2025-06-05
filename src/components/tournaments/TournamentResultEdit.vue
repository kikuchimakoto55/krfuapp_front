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
        <select v-model="division.team_id" class="form-select mb-2">
          <option value="">-- チームを選択 --</option>
          <option v-for="team in teams" :key="team.id" :value="String(team.id)">
            {{ team.name }}
          </option>
        </select>
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
      division_order: r.division_order,
      division_name: r.division_name,
      rank_order: r.rank_order,
      rank_label: r.rank_label,
      team_id: r.team_id != null ? String(r.team_id) : '',
      report: r.report,
      document_path: r.document_path, // 必要に応じて,

    }))

    const teamRes = await axios.get('http://localhost:8000/api/teams', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    teams.value = teamRes.data.map(t => ({
      id: Number(t.id), // ← t_teams.id がここに来ていることを前提
      name: t.team_name || t.name // ← カラム名に応じて補正
    }))
  } catch (e) {
    console.error(e)
    alert('データの取得に失敗しました')
  } finally {
    isLoading.value = false
  }

  console.log('team_id 初期値:', results.value.map(r => r.team_id))
  console.log('typeof team_id:', typeof results.value[0]?.team_id)
})

const getProcessedResults = () => {
  return results.value.map(item => ({
    ...item,
    team_id: item.team_id === "" ? null : Number(item.team_id)
  }))
}

const handleUpdate = async () => {
  try {
    const payload = results.value.map(item => ({
      ...item,
      team_id: item.team_id === '' ? null : Number(item.team_id)
    }))

    await axios.put(`http://localhost:8000/api/tournament-results/${tournamentId}`, {
      results: payload
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })

    alert('更新が完了しました')
    router.push('/tournaments')
  } catch (e) {
    console.error('Validation Errors:', e.response?.data?.errors)
    alert('更新に失敗しました')
  }
}
</script>
