<template>
  <div class="p-4">
    <CButton @click="toggleSearchForm" color="primary" class="mb-3">
      {{ showSearchForm ? '検索条件を隠す' : '検索条件を表示する' }}
    </CButton>

    <CForm v-if="showSearchForm" @submit.prevent="submitSearch">
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>カテゴリ</CFormLabel>
          <CFormSelect v-model="search.categoly" @change="onCategoryChange">
            <option value="">すべて</option>
            <option v-for="cat in categoryList" :key="cat" :value="cat">{{ categoryLabel(cat) }}</option>
          </CFormSelect>
        </CCol>
        <CCol md="4">
          <CFormLabel>年度（西暦）</CFormLabel>
          <CFormSelect v-model="search.year">
            <option value="">すべて</option>
            <option v-for="year in filteredYears" :key="year" :value="year">{{ year }}</option>
          </CFormSelect>
        </CCol>
        <CCol md="4">
          <CFormLabel>大会名</CFormLabel>
          <CFormInput v-model="search.name" placeholder="部分一致可" />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>開催開始日（以降）</CFormLabel>
          <CFormInput type="date" v-model="search.event_period_start" />
        </CCol>
        <CCol md="4">
          <CFormLabel>公開設定</CFormLabel>
          <CFormSelect v-model="search.publishing">
            <option value="">すべて</option>
            <option value="0">公開</option>
            <option value="1">非公開</option>
          </CFormSelect>
        </CCol>
        <CCol md="4">
          <CFormLabel>ディビジョン設定</CFormLabel>
          <CFormSelect v-model="search.divisionflg">
            <option value="">すべて</option>
            <option value="1">設定あり</option>
            <option value="0">設定なし</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <CRow class="mt-3">
        <CCol class="text-center">
          <CButton color="primary" type="submit">検索</CButton>
        </CCol>
      </CRow>
    </CForm>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { defineEmits } from 'vue'
import axios from 'axios'
import { categoryLabel } from '@/components/constants/labels'

const emit = defineEmits(['submit'])

const showSearchForm = ref(false)
const toggleSearchForm = () => {
  showSearchForm.value = !showSearchForm.value
}

const search = ref({
  categoly: '',
  year: '',
  name: '',
  event_period_start: '',
  publishing: '',
  divisionflg: '',
})

const tournaments = ref([])
const categoryList = ref([])
const yearList = ref([])

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

const onCategoryChange = () => {
  search.value.year = ''
}

onMounted(() => {
  fetchTournaments()
})

const submitSearch = () => {
  emit('submit', { ...search.value })
}
</script>
