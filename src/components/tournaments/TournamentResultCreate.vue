<template>
  <div class="p-4">
    <div v-if="!isLoading && divisions.length === 0">
      <p>ディビジョン情報が見つかりません。</p>
    </div>

    <div v-for="division in divisions" :key="division.order" class="mb-5 p-3 border rounded">
      <h3 class="text-primary mb-3">
        ディビジョン {{ division.order }}：{{ division.name }}
      </h3>

      <CRow
        v-for="(result, rankIndex) in results[division.order]"
        :key="rankIndex"
        class="mb-3"
      >
        <CCol md="2">
          <CFormLabel>順位順</CFormLabel>
          <CFormInput v-model="result.rank_order" type="number" min="1" />
        </CCol>
        <CCol md="2">
          <CFormLabel>順位名</CFormLabel>
          <CFormInput v-model="result.rank_label" placeholder="例: 優勝" />
        </CCol>
        <CCol md="2">
          <CFormLabel>チーム</CFormLabel>
          <CFormSelect v-model="result.team_id">
            <option :value="null">選択してください</option>
            <option v-for="team in teams" :key="team.id" :value="Number(team.id)">
              {{ team.team_name }}
            </option>
          </CFormSelect>
        </CCol>
        <CCol md="3">
          <CFormLabel>対戦票ファイル</CFormLabel>
          <CFormInput
            type="file"
            @change="e => handleFileUpload(division.order, rankIndex, e)"
          />
        </CCol>
        <CCol md="3">
          <CFormLabel>結果レポート</CFormLabel>
          <CFormTextarea v-model="result.report" rows="2" />
        </CCol>
      </CRow>

      <CButton color="secondary" @click="addRankRow(division.order)">
        ＋順位行を追加
      </CButton>
    </div>

    <CButton v-if="!isLoading" color="primary" @click="submitResults">登録</CButton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const tournamentId = route.params.id

const divisions = ref([])
const teams = ref([])
const results = ref({})
const tournament = ref({})
const isLoading = ref(true)

onMounted(async () => {
  try {
    const tournamentRes = await axios.get(`http://localhost:8000/api/tournaments/${tournamentId}`)
    tournament.value = tournamentRes.data

    const teamsRes = await axios.get('http://localhost:8000/api/teams')
    teams.value = teamsRes.data

    if (tournament.value.divisionflg === 0) {
      divisions.value = [{ order: 1, name: 'メイン' }]
    } else {
      if (typeof tournament.value.divisions === 'string') {
        divisions.value = JSON.parse(tournament.value.divisions || '[]')
      } else if (Array.isArray(tournament.value.divisions)) {
        divisions.value = tournament.value.divisions
      } else {
        divisions.value = []
      }
    }

    results.value = {}
    divisions.value.forEach((division) => {
      results.value[division.order] = [
        { rank_order: 1, division_order: division.order, division_name: division.name, rank_label: '優勝', team_id: null, file: null, report: '' },
        { rank_order: 2, division_order: division.order, division_name: division.name, rank_label: '準優勝', team_id: null, file: null, report: '' }
      ]
    })
  } catch (error) {
    console.error('初期データ取得失敗:', error)
  } finally {
    isLoading.value = false
  }
})

const addRankRow = (divisionOrder) => {
  const nextOrder = results.value[divisionOrder].length + 1
  results.value[divisionOrder].push({
    rank_order: nextOrder,
    division_order: divisionOrder,
    division_name: divisions.value.find(d => d.order == divisionOrder)?.name || '',
    rank_label: '',
    team_id: null,
    file: null,
    report: ''
  })
}

const handleFileUpload = (divisionOrder, index, event) => {
  const file = event.target.files[0]
  results.value[divisionOrder][index].file = file
}

const submitResults = async () => {

  // バリデーション：空の rank_label がないか事前チェック
  for (const [divisionOrder, ranks] of Object.entries(results.value)) {
    for (const [index, entry] of ranks.entries()) {
      if (!entry.rank_label || entry.rank_label.trim() === '') {
        alert(`ディビジョン ${divisionOrder} の ${index + 1}番目の順位名が未入力です。すべて入力してください。`)
        return
      }
    }
  }
  const formData = new FormData()
  formData.append('tournament_id', tournamentId)

  for (const [divisionOrder, ranks] of Object.entries(results.value)) {
    ranks.forEach((entry, index) => {
      formData.append(`results[${divisionOrder}][${index}][division_order]`, divisionOrder)
      formData.append(`results[${divisionOrder}][${index}][rank_order]`, entry.rank_order)
      formData.append(`results[${divisionOrder}][${index}][division_name]`, entry.division_name)
      formData.append(`results[${divisionOrder}][${index}][rank_label]`, entry.rank_label)
      if (entry.team_id !== null && entry.team_id !== '') {
        formData.append(`results[${divisionOrder}][${index}][team_id]`, Number(entry.team_id))
      }
      formData.append(`results[${divisionOrder}][${index}][report]`, entry.report)
      if (entry.file) {
        formData.append(`results[${divisionOrder}][${index}][document]`, entry.file)
      }
    })
  }

  try {
    const response = await axios.post('http://localhost:8000/api/tournament-results', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true
    })

    const tournamentIdFromResponse = response.data.tournament_id || tournamentId
    router.push({ name: 'TournamentResultComplete', params: { id: tournamentIdFromResponse } })
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error('バリデーションエラー:', error.response.data.errors)
      alert('バリデーションエラーが発生しました。コンソールをご確認ください。')
    } else {
      console.error('登録失敗:', error)
      alert('登録に失敗しました。サーバーまたはネットワークエラーの可能性があります。')
    }
  }
}
</script>

<style scoped>
.p-4 {
  max-width: 1000px;
  margin: auto;
}
</style>
