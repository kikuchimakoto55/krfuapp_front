<template>
  <div class="p-4">
    <!--  検索フォーム -->
    <GameSearchForm @submit="handleSearch" />
  </div>
  <div class="p-4">
    <div v-if="isLoading">読み込み中...</div>
    <div v-else>
      <CTable bordered>
        <thead>
          <tr>
            <th>大会名</th>
            <th>カテゴリ名</th>
            <th>ディビジョン名</th>
            <th>回戦</th>
            <th>開催日時</th>
            <th>会場</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="game in games" :key="game.game_id">
            <!-- 1段目 -->
            <tr class="game-block">
              <td>{{ game.tournament_name }}</td>
              <td>{{ categoryLabel(game.tournament_category) }}</td>
              <td>{{ game.division_name }}</td>
              <td>{{ getRoundLabel(game.round_label) }}</td>
              <td>{{ formatDateTime(game.game_date) }}</td>
              <td>{{ game.venue_name || '-' }}</td>
            </tr>

            <!-- 2段目 -->
            <tr class="game-block_2">
              <td colspan="4">
                <div class="team-block">
                  <div class="team">
                    <div class="team-name">
                      {{ game.team_name_a }}
                      <span class="result-mark">{{ displayResultMark(game, 'A') }}</span>
                    </div>
                    <div class="score">{{ teamScore(game.team1_score1st_point, game.team1_score2nd_point) }}</div>
                  </div>
                  <div class="team">
                    <div class="team-name">
                      {{ game.team_name_b }}
                      <span class="result-mark">{{ displayResultMark(game, 'B') }}</span>
                    </div>
                    <div class="score">{{ teamScore(game.team2_score1st_point, game.team2_score2nd_point) }}</div>
                  </div>
                </div>
              </td>
              <td class="button-cell">
                <CButton color="primary" size="sm" @click="goDetail(game.game_id)">詳細</CButton>
              </td>
              <td class="button-cell">
                <template v-if="game.document_path">
                  <CButton color="success" size="sm" style="color: white;" @click="() => downloadScoreFile(game.document_path)">スコアDL</CButton>
                </template>
                <template v-else>
                  -
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </CTable>
    </div>
  </div>
</template>

<script setup>
import GameSearchForm from '@/components/games/GameSearchForm.vue'
import { getRoundLabel, categoryLabel } from '@/components/constants/labels'
import { onMounted, watch, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const games = ref([])
const isLoading = ref(true)
const route = useRoute()
const router = useRouter()

// ファイルダウンロード関数（スコアブック）
const downloadScoreFile = (filePath) => {
  if (!filePath) return
  const url = `http://localhost:8000/storage/${filePath}`
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 試合一覧取得
const fetchGames = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/games', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    games.value = res.data
  } catch (error) {
    console.error('試合一覧取得失敗:', error)
    alert('試合データの取得に失敗しました')
  } finally {
    isLoading.value = false
  }
}

// 検索フォームからの取得
const handleSearch = async (criteria) => {
  isLoading.value = true
  try {
    const params = new URLSearchParams()
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== '') params.append(key, value)
    })

    const res = await axios.get(`http://localhost:8000/api/games/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })

    games.value = res.data.data
  } catch (error) {
    console.error('検索失敗:', error)
    alert('検索に失敗しました')
  } finally {
    isLoading.value = false
  }
}

// 詳細画面遷移
const goDetail = (id) => {
  router.push(`/games/edit/${id}`)
}

// 表示処理
const formatDateTime = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleString('ja-JP')
}
const displayResultMark = (game, team) => {
  const scoreA = (game.team1_score1st_point || 0) + (game.team1_score2nd_point || 0)
  const scoreB = (game.team2_score1st_point || 0) + (game.team2_score2nd_point || 0)
  if (team === 'A') return scoreA > scoreB ? '○' : scoreA < scoreB ? '●' : '△'
  if (team === 'B') return scoreB > scoreA ? '○' : scoreB < scoreA ? '●' : '△'
  return '△'
}
const teamScore = (score1st, score2nd) => (score1st || 0) + (score2nd || 0)

// 初回読み込み
onMounted(() => {
  fetchGames()
})

// URLが `/games` に戻ったとき再取得
watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath === '/games') fetchGames()
  }
)
</script>

<style scoped>
.p-4 {
  max-width: 1200px;
  margin: auto;
}
thead th {
  background-color: #990000;
  color: white;
  text-align: center;
  font-weight: bold;
  border-right: solid 2px #333;
  border-top: solid 2px #333;
  border-left: solid 2px #333;
}
.basic-info-row td {
  border-bottom: 1px solid #ccc !important;
}
.game-block {
  border-right: solid 2px #333;
  border-top: solid 2px #333;
  border-left: solid 2px #333;
  border-radius: 12px;
  margin-bottom: 24px;
}
.game-block_2 {
  border-right: solid 2px #333;
  border-bottom: solid 2px #333;
  border-left: solid 2px #333;
  border-radius: 12px;
  margin-bottom: 24px;
}
.game-block .info-line {
  border-top: 1px solid #ccc;
  margin: 0;
}
.team-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 8px;
}
.team {
  flex: 1;
  text-align: center;
  background: #fafafa;
  border: 2px solid #bbb;
  border-radius: 12px;
  padding: 12px;
}
.team-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 6px;
}
.result-mark {
  margin-left: 6px;
  font-size: 1.2rem;
}
.score {
  font-size: 1.4rem;
  font-weight: bold;
}
.button-cell {
  text-align: center;
  vertical-align: middle;
}
</style>
