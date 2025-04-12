<template>
  <div class="p-3">
    <h4>下記フォームに会員番号を入力してください。</h4>

    <!-- 検索フォームブロック -->
    <div class="search-form mx-auto mb-3">
        <form @submit.prevent="searchFamilies">
          <CFormInput
            v-model="searchId"
            type="number"
            placeholder="会員IDを入力してください"
            min="1"
          />
        <div class="mt-3 text-center">
          <CButton type="submit" color="primary" class="custom-search-button">検索</CButton>
        </div>
        </form>
    </div>

    <CAlert color="danger" v-if="errorMessage">{{ errorMessage }}</CAlert>

    <CRow v-if="results.length > 0">
      <CCol>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>会員ID</CTableHeaderCell>
              <CTableHeaderCell>氏名</CTableHeaderCell>
              <CTableHeaderCell>続柄</CTableHeaderCell>
              <CTableHeaderCell>学年カテゴリ</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="member in results" :key="member.member_id">
              <CTableDataCell>{{ member.member_id }}</CTableDataCell>
              <CTableDataCell>{{ member.username_sei }} {{ member.username_mei }}</CTableDataCell>
              <CTableDataCell>{{ relationshipText(member.relationship) }}</CTableDataCell>
              <CTableDataCell>{{ gradeCategoryLabel(member.grade_category) }}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const searchId = ref('')
const results = ref([])
const errorMessage = ref('')

const searchFamilies = async () => {
  if (!searchId.value) {
    errorMessage.value = '会員IDを入力してください。'
    return
  }

  errorMessage.value = ''
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/families/search`, {
      params: { member_id: searchId.value },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })

    results.value = res.data
  } catch (err) {
    console.error('検索失敗', err)
    errorMessage.value = '検索に失敗しました。'
  }
}

const relationshipText = (val) => {
  return {
    1: '父', 2: '母', 3: '兄', 4: '姉',
    5: '弟', 6: '妹', 7: '子', 8: '親戚', 9: 'その他'
  }[val] || (val === null ? '' : val)
}

const gradeCategoryLabel = (val) => {
  return {
    1: '年年少', 2: '年少', 3: '年中', 4: '年長', 5: '小１',
    6: '小２', 7: '小３', 8: '小４', 9: '小５', 10: '小６',
    11: '中１', 12: '中２', 13: '中３', 14: '高１', 15: '高２',
    16: '高３', 17: '大１', 18: '大２', 19: '大３', 20: '大４',
    21: '社会人'
  }[val] || ''
}
</script>

<style scoped>
.search-form {
  width: 60%;
  max-width: 400px;
}

.custom-search-button {
  width: 200px;
  font-weight: bold;
}
</style>
