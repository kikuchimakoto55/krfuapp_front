<template>
  <div class="p-4">
    <!-- CSVアップロードエリア -->
    <CCard class="mb-4">
      <CCardBody>
        <h5 class="mb-3">CSVインポート</h5>
        <div class="mb-3">
          <CFormLabel for="csvFile">CSVファイルを選択（またはドラッグ＆ドロップ）</CFormLabel>
          <CFormInput
            type="file"
            id="csvFile"
            accept=".csv"
            @change="handleFileUpload"
          />
        </div>

        <CRow class="mt-3">
          <CCol>
            <div class="d-flex gap-2">
              <CButton color="primary" @click="handleImport" :disabled="!selectedFile || isImporting">
                インポートする
                <CSpinner class="ms-2" v-if="isImporting" />
              </CButton>
              <CButton color="secondary" variant="ghost" @click="downloadSample">サンプルCSVをダウンロード</CButton>
              <CButton color="success" style="color: white;" @click="downloadMembers">会員データCSVをダウンロード</CButton>
            </div>
          </CCol>
        </CRow>
      </CCardBody>

    </CCard>
    <!-- ContactForm7 インポートエリア -->
    <CCard class="mb-4">
      <CCardBody>
        <h5 class="mb-3">ContactForm7 インポート</h5>
        <div class="mb-3">
          <CFormLabel for="cf7File">CSVファイルを選択（またはドラッグ＆ドロップ）</CFormLabel>
          <CFormInput
            type="file"
            id="cf7File"
            accept=".csv"
            @change="handleCf7FileUpload"
          />
        </div>

        <CRow class="mt-3">
          <CCol>
            <div class="d-flex gap-2">
              <CButton color="primary" @click="handleCf7Import" :disabled="!cf7File || isCf7Importing">
                インポートする
                <CSpinner class="ms-2" v-if="isCf7Importing" />
              </CButton>
              <CButton color="secondary" variant="ghost" @click="downloadCf7Sample">サンプルCSVをダウンロード</CButton>
            </div>
          </CCol>
        </CRow>

        <div v-if="cf7File" class="mt-4">
          <p><strong>選択されたファイル:</strong> {{ cf7File.name }}</p>
        </div>

        <div v-if="cf7ImportErrors.length > 0" class="mt-3 text-danger">
          <h6>エラー行:</h6>
          <ul class="preview-list">
            <li v-for="(err, i) in cf7ImportErrors" :key="'cf7err-' + i">
              {{ err.row }}行目: {{ err.errors.join(' / ') }}
            </li>
          </ul>
        </div>
      </CCardBody>
    </CCard>
    


    <!-- アップロード済みファイル名 -->
    <div v-if="selectedFile" class="mt-4">
      <p><strong>選択されたファイル:</strong> {{ selectedFile.name }}</p>
    </div>
    <!-- 登録ボタン -->
    <CButton color="success" class="mt-3" style="color: white;" @click="handleRegister" v-if="previewResult && previewResult.length > 0">
      登録を実行する
    </CButton>

    <!-- プレビュー結果表示 -->
    <div v-if="previewResult">
      <h5 class="mt-4">プレビュー結果（{{ previewResult.length }}件）</h5>
      <ul class="preview-list">
        <li v-for="(item, idx) in previewResult" :key="idx">
          {{ item.username_sei }} {{ item.username_mei }}（{{ item.email }}）
        </li>
      </ul>
    </div>

    <!-- エラー表示 -->
    <div v-if="errorMessages.length > 0" class="mt-3 text-danger">
      <h6>エラー行:</h6>
      <ul class="preview-list">
        <li v-for="(err, i) in errorMessages" :key="i">
          {{ err.row }}行目: {{ err.messages.join(' / ') }}
        </li>
      </ul>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const selectedFile = ref(null)
const previewResult = ref(null)
const errorMessages = ref([])
const cf7File = ref(null)
const cf7ImportErrors = ref([])
const isImporting = ref(false)
const isCf7Importing = ref(false)

const handleFileUpload = (e) => {
  selectedFile.value = e.target.files[0]
}

const handleImport = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  isImporting.value = true
  try {
    const res = await axios.post('http://localhost:8000/api/members/import-preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })

    previewResult.value = res.data.data
    errorMessages.value = res.data.errors

    if (res.data.valid) {
      alert('インポートデータに問題ありません！このまま登録または更新可能です')
    } else {
      alert('バリデーションエラーがあります。内容を確認してください')
    }

  } catch (err) {
    console.error('インポートエラー', err)
    alert('インポートに失敗しました')
  } finally {
    isImporting.value = false
  }
}

const handleRegister = async () => {
  try {
    const res = await axios.post('http://localhost:8000/api/members/import', {
      data: previewResult.value,
    }, { withCredentials: true })

    alert('登録が完了しました！')
    // ✅ 状態リセット
    previewResult.value = null
    errorMessages.value = []
    selectedFile.value = null
    document.getElementById('csvFile').value = ''  // ← inputタグもリセット

  } catch (err) {
    console.error('登録エラー:', err)
    alert('登録に失敗しました')
  }
}
//インポートサンプル
const downloadSample = () => {
  window.open('http://localhost:8000/sample/member_import_sample.csv', '_blank')
}

//会員情報エクスポート
const downloadMembers = async () => {
  try {
    //  CSRF Cookie を事前に取得（失敗時はダウンロードもしない）
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    })

    //  CSV データを API から取得
    const res = await axios.get('http://localhost:8000/api/members/export', {
      responseType: 'blob',
      withCredentials: true
    })

    //  Blobとしてダウンロード処理
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'members_export.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('ダウンロード失敗:', err)
    alert('CSVのダウンロードに失敗しました')
  }
}

const handleCf7FileUpload = (e) => {
  cf7File.value = e.target.files[0]
}

const handleCf7Import = async () => {
  if (!cf7File.value) return

  const formData = new FormData()
  formData.append('file', cf7File.value)

  isCf7Importing.value = true
  try {
    const res = await axios.post('http://localhost:8000/api/members/import-from-contact', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true,
    })

    if (res.data.results?.length > 0) {
      cf7ImportErrors.value = res.data.results
      alert('一部のデータでバリデーションエラーがありました')
    } else {
      cf7ImportErrors.value = []
      alert('ContactForm7のインポートが完了しました！')
      cf7File.value = null
      document.getElementById('cf7File').value = ''
    }

  } catch (err) {
    console.error('CF7インポートエラー', err)
    alert('インポートに失敗しました')
  } finally {
    isCf7Importing.value = false
  }
}

const downloadCf7Sample = () => {
  window.open('http://localhost:8000/sample/member_cf7_sample.csv', '_blank')
}


</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0; /* ← 左余白も消す */
}

ul.preview-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e74343;         /* ← 外枠 */
  border-radius: 8px;             /* ← 任意：角丸 */
  overflow: hidden;              /* ← 最下行のborder-bottomが飛び出ないように */
}

ul.preview-list li {
  display: block;
  padding: 8px 12px;
  border-bottom: 1px solid #e74343;
}


</style>