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
     <hr class="my-4" />

    <div class="d-flex gap-3">
      <CButton color="success" style="color: white;" @click="handleProcess">
        年度更新を実行
      </CButton>
    </div>

    <div class="mt-4">
      <CAlert color="success" v-if="successMessage">{{ successMessage }}</CAlert>
      <CAlert color="danger" v-if="errorMessage">{{ errorMessage }}</CAlert>
    </div>
  </div>

  <hr class="my-4" />

  <h5 class="mb-3">現在のインポートデータ（未処理）</h5>
  <CAlert color="info" v-if="rankupData.length === 0">
    現在、未処理のインポートデータはありません。
  </CAlert>

  <CTable striped bordered hover v-else>
    <thead>
      <tr>
        <th>#</th>
        <th>氏名（カナ）</th>
        <th>性別</th>
        <th>生年月日</th>
        <th>状態</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rankupData" :key="row.id">
        <td>{{ index + 1 }}</td>
        <td>{{ row.username_kana_s }} {{ row.username_kana_m }}</td>
        <td>{{ row.sex }}</td>
        <td>{{ row.birthday }}</td>
        <td>未処理</td>
      </tr>
    </tbody>
  </CTable>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import {
  CForm, CFormInput, CFormLabel,
  CRow, CCol, CButton, CAlert
} from '@coreui/vue'
import { onMounted } from 'vue'

const file = ref(null)
const successMessage = ref('')
const errorMessage = ref('')
const rankupData = ref([])

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const fetchRankupList = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/rankup/list', {
      withCredentials: true,
    })
    rankupData.value = response.data
  } catch (error) {
    console.error('一覧取得エラー', error)
    errorMessage.value = '現在のインポートデータを取得できませんでした。'
  }
}

onMounted(fetchRankupList)

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

const handleProcess = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await axios.post('http://localhost:8000/api/rankup/process', null, {
      responseType: 'blob', // CSVの可能性を考慮
      withCredentials: true,
    })

    const contentType = response.headers['content-type']
    if (contentType === 'text/csv') {
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'unmatched_rankup.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      successMessage.value = '一部のデータが不一致でした。不一致リストをダウンロードしました。'
    } else {
      const text = await response.data.text()
      const json = JSON.parse(text)
      successMessage.value = `年度更新完了：${json.updated} 件`
    }

  } catch (error) {
    errorMessage.value = '年度更新中にエラーが発生しました。'
  }
  await fetchRankupList()
}

</script>