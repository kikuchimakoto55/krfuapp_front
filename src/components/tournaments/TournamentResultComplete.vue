<template>
  <div class="result-wrapper">

    <div v-if="isLoading">
      <p>読み込み中...</p>
    </div>

    <div v-else>
      <div v-for="division in groupedResults" :key="division.order" class="division-block">
        <h3 class="subtitle">ディビジョン {{ division.order }}：{{ division.name }}</h3>

        <div class="table-container">
          <table class="result-table">
            <colgroup>
              <col style="width: 10%" />
              <col style="width: 25%" />
              <col style="width: 45%" />
              <col style="width: 20%" />
            </colgroup>
            <thead>
              <tr>
                <th>順位名</th>
                <th>チーム名</th>
                <th>結果レポート</th>
                <th>対戦表</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in division.results" :key="index">
                <td>{{ result.rank_label }}</td>
                <td>{{ result.team_name || '（なし）' }}</td>
                <td class="text-left">{{ result.report || '（なし）' }}</td>
                <td>
                  <a v-if="result.document_path" :href="`/storage/${result.document_path}`" target="_blank" class="link">
                    ファイルを見る
                  </a>
                  <span v-else>なし</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="button-wrapper">
        <CButton color="secondary" @click="goBackToEdit" class="custom-button">修正する</CButton>
        <CButton color="primary" @click="goToList" class="custom-button">大会一覧へ</CButton>
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

const results = ref([])
const groupedResults = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/tournament-results/${tournamentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })

    if (!Array.isArray(response.data)) {
      console.error('API から配列でないデータが返却されました:', response.data)
      return
    }

    results.value = response.data

    const grouped = {}
    results.value.forEach(result => {
      if (!grouped[result.division_order]) {
        grouped[result.division_order] = {
          order: result.division_order,
          name: result.division_name,
          results: []
        }
      }
      grouped[result.division_order].results.push(result)
    })

    groupedResults.value = Object.values(grouped)
  } catch (err) {
    console.error('結果取得失敗:', err)
    alert('大会結果の取得に失敗しました')
  } finally {
    isLoading.value = false
  }
})

const goBackToEdit = () => {
  router.push(`/tournaments/${tournamentId}/results/create`)
}

const goToList = () => {
  router.push('/tournaments')
}
</script>

<style scoped>
.result-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.subtitle {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.table-container {
  overflow-x: auto;
}
.result-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}
.result-table th,
.result-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
.result-table td.text-left {
  text-align: left;
}
.link {
  color: #3b82f6;
  text-decoration: underline;
}
.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1.5rem;
}
</style>
