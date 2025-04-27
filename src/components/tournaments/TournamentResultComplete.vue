<template>
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">大会結果 登録完了</h2>
  
      <div v-if="isLoading">
        <p>読み込み中...</p>
      </div>
  
      <div v-else>
        <div v-for="division in groupedResults" :key="division.order" class="mb-6">
          <h3 class="text-lg font-semibold mb-2">ディビジョン {{ division.order }}：{{ division.name }}</h3>
          <table class="w-full table-auto border">
            <thead>
              <tr class="bg-gray-100">
                <th class="border px-4 py-2">順位名</th>
                <th class="border px-4 py-2">チーム名</th>
                <th class="border px-4 py-2">結果レポート</th>
                <th class="border px-4 py-2">対戦票</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in division.results" :key="index">
                <td class="border px-4 py-2">{{ result.rank_label }}</td>
                <td class="border px-4 py-2">{{ result.team_name || '（なし）' }}</td>
                <td class="border px-4 py-2">{{ result.report || '（なし）' }}</td>
                <td class="border px-4 py-2">
                  <a v-if="result.document_path" :href="`/storage/${result.document_path}`" target="_blank" class="text-blue-500 underline">ファイルを見る</a>
                  <span v-else>なし</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="flex space-x-4 mt-8">
          <CButton color="secondary" @click="goBackToEdit">修正する</CButton>
          <CButton color="primary" @click="goToList">大会一覧へ</CButton>
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      })
  
      results.value = response.data.results
  
      // ディビジョンごとにまとめる
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
  .p-4 {
    max-width: 1000px;
    margin: auto;
  }
  .table-auto th, .table-auto td {
    text-align: center;
  }
  </style>
  