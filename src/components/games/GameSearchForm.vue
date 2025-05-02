<template>
    <div class="p-4">
      <!-- 🔍 検索トグル -->
      <CButton @click="toggleSearchForm" color="primary" class="mb-3">
        {{ showSearchForm ? '検索条件を隠す' : '検索条件を表示する' }}
      </CButton>
  
      <!-- 🔎 検索フォーム -->
      <CForm v-if="showSearchForm" @submit.prevent="submitSearch">
        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>カテゴリ</CFormLabel>
            <CFormSelect v-model="search.categoly" @change="onCategoryChange">
              <option value="">全て</option>
              <option v-for="cat in categoryList" :key="cat" :value="cat">{{ categoryLabel(cat) }}</option>
            </CFormSelect>
          </CCol>
          <CCol md="4">
            <CFormLabel>年度</CFormLabel>
            <CFormSelect v-model="search.year" @change="onYearChange">
              <option value="">全て</option>
              <option v-for="year in filteredYears" :key="year" :value="year">{{ year }}</option>
            </CFormSelect>
          </CCol>
          <CCol md="4">
            <CFormLabel>大会名</CFormLabel>
            <CFormSelect v-model="search.tournament_id">
              <option value="">全て</option>
              <option v-for="t in filteredTournaments" :key="t.tournament_id" :value="t.tournament_id">
                {{ t.name }}
              </option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>ディビジョン名</CFormLabel>
            <CFormInput v-model="search.division_name" />
          </CCol>
          <CCol md="4">
            <CFormLabel>開催日</CFormLabel>
            <CFormInput type="date" v-model="search.match_datetime" />
          </CCol>
          <CCol md="4">
            <CFormLabel>チーム名（左右いずれか）</CFormLabel>
            <CFormInput v-model="search.team_name" />
          </CCol>
        </CRow>
        <CButton type="submit" color="primary">検索</CButton>
      </CForm>
      
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { defineEmits } from 'vue'
  
  const showSearchForm = ref(false)
  const emit = defineEmits(['submit'])
  const search = ref({ categoly: '', year: '', tournament_id: '', division_name: '', match_datetime: '', team_name: '' })
  const games = ref([])
  
  const tournaments = ref([])
  const categoryList = ref([])
  const yearList = ref([])
  
  const toggleSearchForm = () => {
    showSearchForm.value = !showSearchForm.value
  }
  
  const fetchGames = async (page = 1) => {
    const params = { ...search.value, page }
    const res = await axios.get('http://localhost:8000/api/games', {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    games.value = res.data.data
  }
  
  const fetchTournaments = async () => {
    const res = await axios.get('http://localhost:8000/api/tournaments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    tournaments.value = res.data
    categoryList.value = [...new Set(res.data.map(t => t.categoly))]
    yearList.value = [...new Set(res.data.map(t => t.year))]
  }
  
  const filteredYears = computed(() => {
    return [...new Set(tournaments.value
      .filter(t => !search.value.categoly || t.categoly === Number(search.value.categoly))
      .map(t => t.year))]
  })
  
  const filteredTournaments = computed(() => {
    return tournaments.value.filter(t => {
      return (!search.value.categoly || t.categoly === Number(search.value.categoly)) &&
             (!search.value.year || t.year === search.value.year)
    })
  })
  
  const onCategoryChange = () => {
    search.value.year = ''
    search.value.tournament_id = ''
  }
  const onYearChange = () => {
    search.value.tournament_id = ''
  }
  
  onMounted(() => {
    fetchTournaments()
    fetchGames()
  })
  
  const categoryLabel = (val) => {
    const map = { 1: '有料試合', 2: '社会人', 3: 'クラブ', 4: '大学', 5: '高校', 6: '中学', 7: 'ラグビースクール', 8: 'タグラグビー', 9: '女子' }
    return map[val] || val
  }

  

  const submitSearch = () => {
    emit('submit', { ...search.value }) // 🔁 親に検索条件を渡す
  }
  </script>
  