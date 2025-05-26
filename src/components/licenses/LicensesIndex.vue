<template>
  <div class="p-4">

    <CForm @submit.prevent="fetchLicenses">
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>資格名</CFormLabel>
          <CFormInput v-model="search.keyword" placeholder="例: 衛生管理者" />
        </CCol>
        <CCol md="2" class="d-flex align-items-end">
          <CButton color="primary" type="submit">検索</CButton>
        </CCol>
      </CRow>
    </CForm>

    <CTable bordered hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>資格ID</CTableHeaderCell>
          <CTableHeaderCell>資格名</CTableHeaderCell>
          <CTableHeaderCell>資格保有期間</CTableHeaderCell>
          <CTableHeaderCell>操作</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="license in licenses" :key="license.id">
          <CTableDataCell>{{ license.license_id }}</CTableDataCell>
          <CTableDataCell>{{ license.licensekindsname }}</CTableDataCell>
          <CTableDataCell>{{ license.valid_period }} 日</CTableDataCell>
          <CTableDataCell>
            <CButton color="primary" size="sm" @click="editLicense(license.license_id)">編集</CButton>
            <CButton color="danger" size="sm" class="ms-2" style="color: white;" @click="deleteLicense(license.license_id)">削除</CButton>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'
import {
  CForm, CFormLabel, CFormInput, CButton, CRow, CCol,
  CTable, CTableHead, CTableHeaderCell, CTableRow, CTableBody, CTableDataCell
} from '@coreui/vue'

import { useRouter } from 'vue-router'

const search = ref({ keyword: '' })
const licenses = ref([])
const router = useRouter()

const fetchLicenses = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/licenses', {
      params: { keyword: search.value.keyword },
      withCredentials: true
    })
    licenses.value = response.data
  } catch (error) {
    console.error('取得失敗', error)
  }
}

const formatDate = (date) => new Date(date).toLocaleDateString()

onMounted(fetchLicenses)

const editLicense = (id) => {
  router.push(`/licenses/edit/${id}`)
}

const deleteLicense = async (id) => {
  if (!confirm('この資格を削除しますか？')) return

  try {
    await axios.delete(`http://localhost:8000/api/licenses/${id}`, {
      withCredentials: true
    })
    alert('削除しました')
    fetchLicenses() // 再取得
  } catch (err) {
    console.error('削除失敗', err)
    alert('削除に失敗しました')
  }
}
</script>
