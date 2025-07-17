<template>
  <div class="p-4">
    <h4 class="mb-3">年度更新CSVインポート</h4>

    <CForm @submit.prevent="handleImport">
      <CRow class="align-items-end">
        <CCol md="6">
          <CFormLabel for="csvFile">CSVファイル</CFormLabel>
          <CFormInput
            type="file"
            id="csvFile"
            accept=".csv"
            @change="handleFileChange"
          />
        </CCol>
        <CCol md="3">
          <CButton type="submit" color="primary" :disabled="!file">
            インポート実行
          </CButton>
        </CCol>
      </CRow>
    </CForm>

    <div class="mt-4">
      <CAlert color="success" v-if="successMessage">{{ successMessage }}</CAlert>
      <CAlert color="danger" v-if="errorMessage">{{ errorMessage }}</CAlert>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import {
  CForm, CFormInput, CFormLabel,
  CRow, CCol, CButton, CAlert
} from '@coreui/vue'

const file = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const handleImport = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!file.value) {
    errorMessage.value = 'ファイルが選択されていません。'
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    const response = await axios.post('http://localhost:8000/api/rankup/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })

    const data = response.data
    successMessage.value = ` インポート成功: ${data.imported} 件（スキップ: ${data.skipped} 件）`
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'インポート中にエラーが発生しました。'
  }
}
</script>