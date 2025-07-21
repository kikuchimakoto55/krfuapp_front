<template>
  <div class="p-4">

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
  <hr class="my-4" />

    <h5 class="mb-3">不一致データ一覧</h5>
    <CAlert color="info" v-if="unmatchedData.length === 0">
      現在、不一致データはありません。
    </CAlert>

    <CTable striped bordered hover v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>対象者</th>
          <th>不一致項目</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in unmatchedData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.kana }}</td>
          <td>{{ item.reason }}</td>
        </tr>
      </tbody>
    </CTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  CForm, CFormInput, CFormLabel,
  CRow, CCol, CButton, CAlert
} from '@coreui/vue'


const file = ref(null)
const successMessage = ref('')
const errorMessage = ref('')
const rankupData = ref([])
const unmatchedData = ref([]) // 不一致データの格納用
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
  await fetchRankupList()
}

const handleProcess = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  unmatchedData.value = []

  try {
    const response = await axios.post('http://localhost:8000/api/rankup/process', null, {
      responseType: 'blob',
      withCredentials: true,
    })

    const contentType = response.headers['content-type']
    if (contentType.includes('text/csv')) {
      // CSV処理（①ダウンロード）
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'unmatched_rankup.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      successMessage.value = '一部のデータが不一致でした。不一致リストをダウンロードしました。'

      // CSV処理（② unmatchedData にパース表示）
      const text = await blob.text()
      const lines = text.trim().split('\n')

      // ヘッダーを分解し、各項目のインデックスを取得
      const header = lines[0].split(',')

      const idxKanaSurname = header.indexOf('Text 99')      // キクチ
      const idxKanaName    = header.indexOf('Text 120')     // マコト
      const idxSex         = header.indexOf('Select 531')   // 男 or 女
      const idxYear        = header.indexOf('Select 258')   // 2012
      const idxMonth       = header.indexOf('Select 757')   // 8
      const idxDay         = header.indexOf('Select 567')   // 6
      const idxReason      = header.length - 1              // 最後の列が理由だと仮定（※必要に応じて調整）

      unmatchedData.value = lines.slice(1).map((line, i) => {
      const cols = line.split(',')
      const kana_s = cols[0] || ''
      const kana_m = cols[1] || ''
      const sex = cols[2] || ''
      const year = cols[3] || ''
      const month = cols[4] || ''
      const day = cols[5] || ''
      const reason = cols[6] || '不一致'

      return {
        kana: kana_s && kana_m ? `${kana_s} ${kana_m}` : '不一致',
        sex: sex === '男' || sex === '女' ? sex : '不一致',
        birthday: year && month && day
          ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          : '不一致',
        reason,
      }
    })
    } else if (contentType.includes('application/json')) {
        //  Blob をテキストに変換してから JSON にパースする
        const text = await response.data.text();
        const json = JSON.parse(text);

        successMessage.value = `年度更新完了：${json.updated} 件`;

        unmatchedData.value = (json.unmatched_records || []).map((row) => ({
          kana: `${row.username_kana_s} ${row.username_kana_m}`,
          sex: row.sex === '1' ? '男' : row.sex === '2' ? '女' : '不明',
          birthday: `${row.birthday1}-${String(row.birthday2).padStart(2, '0')}-${String(row.birthday3).padStart(2, '0')}`,
          reason: row['不一致カラム'] || '不一致',
        }));
      }

  } catch (error) {
    console.error('年度更新エラー:', error)
    errorMessage.value = '年度更新中にエラーが発生しました。'
  }

  await fetchRankupList()
}



</script>