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
          <CButton
            type="submit"
            color="primary"
            :disabled="!file || isImporting"
          >
            <template v-if="isImporting">
              <CSpinner component="span" size="sm" class="me-2" />
              インポート中...
            </template>
            <template v-else>
              インポート実行
            </template>
          </CButton>
        </CCol>
      </CRow>
    </CForm>
     <hr class="my-4" />

    <div class="d-flex gap-3">
      <CButton
        color="success"
        style="color: white;"
        @click="handleProcess"
        :disabled="isProcessing"
      >
        <template v-if="isProcessing">
          <CSpinner component="span" size="sm" class="me-2" />
          処理中...
        </template>
        <template v-else>
          年度更新を実行
        </template>
      </CButton>
      <CButton color="danger" style="color: white;" @click="handleDeleteAll('unprocessed')">未処理データを全件削除</CButton>
      <CButton color="danger" style="color: white;" @click="handleDeleteAll('all')">全削除</CButton>
      <CButton color="warning" style="color: white;" @click="downloadUnmatchedMembers">未手続リストを出力</CButton>
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
const isImporting = ref(false)
const isProcessing = ref(false)

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

  isImporting.value = true

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
  } finally {
    isImporting.value = false
  }
  await fetchRankupList()
}

const handleProcess = async () => {
  console.log('[開始] handleProcess')
  isProcessing.value = true
  console.log('isLoading:', isLoading.value)
  successMessage.value = ''
  errorMessage.value = ''
  unmatchedData.value = []

  try {
    const response = await axios.post('http://localhost:8000/api/rankup/process', null, {
      responseType: 'blob',
      withCredentials: true,
    })

    const contentType = response.headers['content-type']
    // ① CSV ファイル（不一致あり）
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
      window.URL.revokeObjectURL(url)

      successMessage.value = '一部のデータが不一致でした。不一致リストをダウンロードしました。'

      // CSV処理（② unmatchedData にパース表示）
      const text = await blob.text()
      const lines = text.trim().split('\n')
      const header = lines[0].split(',')// ヘッダーを分解し、各項目のインデックスを取得

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
    } 
    // ② JSON 応答（全件一致したなど）
    else if (contentType.includes('application/json')) {
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
  } finally {
    isProcessing.value = false
    console.log('[完了] isLoading false')
  }

  await fetchRankupList()
}

const handleDeleteAll = async (mode = 'unprocessed') => {
  const confirmText =
    mode === 'all'
      ? '本当にすべての取込データを削除しますか？（処理済みも含みます）'
      : '本当に未処理の取込データをすべて削除しますか？';

  if (!confirm(confirmText)) return;

  try {
    await axios.delete('http://localhost:8000/api/rankup/delete-all', {
      data: { mode }, // DELETE にも `data` を指定可能（axios対応済み）
      withCredentials: true,
    });

    await fetchRankupList();

    successMessage.value =
      mode === 'all'
        ? 'すべてのインポートデータを削除しました。'
        : '未処理の取込データを削除しました。';
  } catch (error) {
    errorMessage.value = '削除中にエラーが発生しました。';
  }
};

const downloadUnmatchedMembers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/rankup/unmatched-members', {
      responseType: 'blob',
      withCredentials: true
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unmatched_members.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('未手続リストのダウンロードに失敗しました', error);
  }
};





</script>