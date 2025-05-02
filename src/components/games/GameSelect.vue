<template>
    <div class="p-4">
      
  
      <div v-if="isLoading">
        読み込み中...
      </div>
  
      <div v-else class="form-container">
        <!-- 年度 -->
        <div class="form-group">
          <label>年度*</label>
          <select v-model="selectedYear" class="form-control">
            <option value="">年度を選択</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
          </select>
        </div>
  
        <!-- カテゴリ -->
        <div class="form-group">
          <label>カテゴリ*</label>
          <select v-model="selectedCategory" class="form-control">
            <option value="">カテゴリを選択</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ categoryLabel(cat) }}</option>
          </select>
        </div>
  
        <!-- 大会 -->
        <div class="form-group">
          <label>大会*</label>
          <select v-model="selectedTournament" class="form-control">
            <option value="">大会を選択</option>
            <option v-for="tournament in filteredTournaments" :key="tournament.tournament_id" :value="tournament.tournament_id">
              {{ tournament.name }}
            </option>
          </select>
        </div>
  
        <div class="button-area">
          <button @click="goNext" class="btn-next">次へ</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const selectedYear = ref('')
  const selectedCategory = ref('')
  const selectedTournament = ref('')
  
  // 次へ進む処理
  const goNext = () => {
    if (!selectedYear.value || !selectedCategory.value || !selectedTournament.value) {
      alert('年度・カテゴリ・大会を選択してください')
      return
    }
    router.push(`/games/create?tournament_id=${selectedTournament.value}`)
  }
  
  // 大会一覧データ
  const tournaments = ref([])
  const isLoading = ref(true)
  
  onMounted(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tournaments/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      })
      tournaments.value = res.data
    } catch (error) {
      console.error('大会リスト取得失敗:', error)
      alert('大会リストの取得に失敗しました')
    } finally {
      isLoading.value = false
    }
  })
  
  // 年度一覧
  const years = computed(() => {
    const unique = new Set(tournaments.value.map(t => t.year))
    return Array.from(unique).sort((a, b) => b.localeCompare(a))
  })
  
  // カテゴリ一覧
  const categories = computed(() => {
    const unique = new Set(tournaments.value.map(t => t.categoly))
    return Array.from(unique).sort((a, b) => a - b)
  })
  
  // フィルタリング
  const filteredTournaments = computed(() => {
    if (!selectedYear.value || !selectedCategory.value) return []
    return tournaments.value.filter(t => t.year === selectedYear.value && t.categoly === Number(selectedCategory.value))
  })
  
  // カテゴリのラベル変換
  const categoryLabel = (value) => {
    const mapping = {
      1: '有料試合',
      2: '社会人',
      3: 'クラブ',
      4: '大学',
      5: '高校',
      6: '中学',
      7: 'ラグビースクール',
      8: 'タグラグビー',
      9: '女子'
    }
    return mapping[value] || 'その他'
  }
  </script>
  
  <style scoped>
  .p-4 {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }
  
  .page-title {
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 24px;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    font-weight: bold;
    margin-bottom: 6px;
  }
  
  .form-control {
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  .button-area {
    margin-top: 24px;
    text-align: center;
  }
  
  .btn-next {
    background-color: #4f46e5;
    color: #fff;
    padding: 10px 32px;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
  }
  
  .btn-next:hover {
    background-color: #4338ca;
  }
  </style>
  