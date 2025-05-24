<template>
  <div class="p-4">
    <CForm @submit.prevent="handleSearch" class="mb-4 border rounded p-3">
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>年度</CFormLabel>
          <CFormInput v-model="searchForm.year" type="text" placeholder="例: 2025" />
        </CCol>
        <CCol md="4">
          <CFormLabel>カテゴリ</CFormLabel>
          <CFormSelect v-model="searchForm.category">
            <option value="">すべて</option>
            <option v-for="(label, key) in categoryOptions" :key="key" :value="key">
              {{ label }}
            </option>
          </CFormSelect>
        </CCol>
        <CCol md="4">
          <CFormLabel>チーム名</CFormLabel>
          <CFormInput v-model="searchForm.team_name" type="text" placeholder="部分一致可" />
        </CCol>
      </CRow>
      <CButton type="submit" color="primary">検索</CButton>
      <CButton color="secondary" class="ms-2" @click="resetSearch">リセット</CButton>
    </CForm>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>チーム名</th>
          <th>年度</th>
          <th>カテゴリ</th>
          <th>代表者名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in teams" :key="team.id">
          <td>{{ team.id }}</td>
          <td>{{ team.team_name }}</td>
          <td>{{ team.year }}</td>
          <td>{{ categoryOptions[team.category] || '-' }}</td>
          <td>{{ team.representative_name }}</td>
          <td>
            <CButton color="primary" size="sm" @click="goToEdit(team.id)">編集</CButton>
            <CButton color="danger" size="sm" class="ms-2" @click="confirmDelete(team.id)">削除</CButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { categoryOptions } from '@/components/constants/labels.js'

const teams = ref([])
const searchForm = ref({
  year: '',
  category: '',
  team_name: '',
})
const router = useRouter()

const fetchTeams = async () => {
  const res = await axios.get('http://localhost:8000/api/teams', {
    params: searchForm.value,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  teams.value = res.data
}

const handleSearch = async () => {
  await fetchTeams()
}

const resetSearch = async () => {
  searchForm.value = { year: '', category: '', team_name: '' }
  await fetchTeams()
}

const confirmDelete = async (id) => {
  if (confirm('本当に削除しますか？')) {
    try {
      await axios.delete(`http://localhost:8000/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      })
      alert('削除しました')
      await fetchTeams()
    } catch (err) {
      console.error('削除失敗:', err)
      alert('削除に失敗しました')
    }
  }
}

const goToEdit = (id) => {
  router.push(`/teams/edit/${id}`)
}

onMounted(fetchTeams)
</script>

<style scoped>
.p-4 {
  max-width: 1000px;
  margin: auto;
}
</style>
