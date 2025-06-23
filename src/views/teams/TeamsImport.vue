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

        <CButton color="primary" @click="handleImport" :disabled="!selectedFile || isImporting">
          ファイルを取りこむ
          <CSpinner class="ms-2" v-if="isImporting" />
        </CButton>
      </CCardBody>
    </CCard>

    <!-- サンプルCSVダウンロード -->
    <div class="text-end">
      <CButton color="secondary" variant="ghost" @click="downloadSample">サンプルCSVをダウンロード</CButton>
    </div>
    <div class="text-end">
      <CButton color="success" style="color: white;" class="mt-3" @click="downloadTeams">チーム情報CSVをダウンロード</CButton>
    </div>

    <!-- アップロード済みファイル名 -->
    <div v-if="selectedFile" class="mt-4">
      <p><strong>選択されたファイル:</strong> {{ selectedFile.name }}</p>
    </div>

    <!-- 登録ボタン -->
    <CButton color="success" class="mt-3" style="color: white;" @click="handleRegister"
      :disabled="isRegistering || !previewResult || previewResult.length === 0">
      登録
      <CSpinner class="ms-2" v-if="isRegistering" />
    </CButton>

    <!-- プレビュー結果表示 -->
    <div v-if="previewResult && previewResult.length > 0">
      <h5 class="mt-4">プレビュー結果（{{ previewResult.length }}件）</h5>
      <ul class="preview-list">
        <li v-for="(item, idx) in previewResult" :key="idx">
          {{ item.team_name }}（{{ item.representative_email }}）
          <span v-if="item.__update__" class="text-warning">※更新予定</span>
        </li>
      </ul>
    </div>

    <!-- エラー表示 -->
    <div v-if="errorMessages && errorMessages.length > 0" class="mt-3 text-danger">
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
const isImporting = ref(false)
const isRegistering = ref(false)

const handleFileUpload = (e) => {
  selectedFile.value = e.target.files[0]
}

// 🔹 フィールド名マップ（共通化）
const fieldNameMap = {
  team_id: 'チームID',
  year: '年度',
  team_name: 'チーム名',
  representative_name: '代表者氏名',
  representative_kana: '代表者カナ',
  representative_tel: '代表者電話番号',
  representative_email: '代表者メール',
  male_members: '男子人数',
  female_members: '女子人数',
  medical_supporter: 'メディカルサポーター',
  jrfu_coach: 'JRFUコーチ',
  safety_lecturer: 'セーフティ講習会修了者',
  category: 'カテゴリ',
  status: 'ステータス',
  annual_fee_flg: '年会費フラグ',
  individual_entry_flg: '個人申込フラグ',
  team_entry_flg: 'チーム申込フラグ'
}

// 🔹 共通バリデーションメッセージ整形関数
const formatValidationMessages = (errors) => {
  return Object.values(errors).flat().join('\n')
}

const handleImport = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  isImporting.value = true
  try {
    const res = await axios.post('http://localhost:8000/api/teams/import-preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })

    previewResult.value = res.data.data
    errorMessages.value = res.data.errors

    if (res.data.valid) {
      alert('インポート内容を確認して登録ボタンを押下してください')
    } else {
      alert('バリデーションエラーがあります。内容を確認してください')
    }

  } catch (err) {
    console.error('インポートエラー:', err)
    if (err.response?.status === 422 && err.response?.data?.errors) {
      const msg = formatValidationMessages(err.response.data.errors)
      alert('インポートに失敗しました:\n' + msg)
    } else {
      alert('インポートに失敗しました')
    } 
  } finally {
    isImporting.value = false
  }
}

const handleRegister = async () => {
  isRegistering.value = true
  try {
    const res = await axios.post('http://localhost:8000/api/teams/import', {
      data: previewResult.value,
    }, { withCredentials: true })

    alert('登録が完了しました！')
    previewResult.value = null
    errorMessages.value = []
    selectedFile.value = null
    document.getElementById('csvFile').value = ''
  } catch (err) {
    console.error('登録エラー:', err)
    if (err.response?.status === 422 && err.response?.data?.errors) {
      const msg = formatValidationMessages(err.response.data.errors)
      alert('登録に失敗しました:\n' + msg)
    } else {
      alert('登録に失敗しました')
    }
  } finally {
    isRegistering.value = false
  }
}

// チーム用サンプルCSV
const downloadSample = () => {
  window.open('http://localhost:8000/sample/teams_import_sample.csv', '_blank')
}

// チーム情報エクスポート
const downloadTeams = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    })

    const res = await axios.get('http://localhost:8000/api/teams/export', {
      responseType: 'blob',
      withCredentials: true
    })

    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'teams_export.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('ダウンロード失敗:', err)
    alert('CSVのダウンロードに失敗しました')
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0;
}

ul.preview-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e74343;
  border-radius: 8px;
  overflow: hidden;
}

ul.preview-list li {
  display: block;
  padding: 8px 12px;
  border-bottom: 1px solid #e74343;
}
</style>
