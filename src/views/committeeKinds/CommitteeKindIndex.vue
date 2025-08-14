<!-- src/views/committeeKinds/CommitteeKindIndex.vue -->
<template>
  <CContainer>
    <CTable hover bordered responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>委員会種別名称</CTableHeaderCell>
          <CTableHeaderCell>登録日</CTableHeaderCell>
          <CTableHeaderCell>更新日</CTableHeaderCell>
          <CTableHeaderCell class="text-center">操作</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="row in items" :key="row.committeekinds_id">
          <CTableDataCell>{{ row.committeekindsname }}</CTableDataCell>
          <CTableDataCell>{{ formatDatetime(row.registration_date) }}</CTableDataCell>
          <CTableDataCell>{{ formatDatetime(row.updated_at) }}</CTableDataCell>
          <CTableDataCell class="text-center">
            <CButton color="info" size="sm" class="me-2" @click="editItem(row.committeekinds_id)">
              編集
            </CButton>
            <CButton color="danger" size="sm" style="color: white;" @click="deleteItem(row.committeekinds_id)">
              削除
            </CButton>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const items = ref([])
const router = useRouter()

const fetchItems = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8000/api/committee-kinds', {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    items.value = res.data
  } catch (error) {
    console.error('委員会種別一覧の取得に失敗しました:', error)
  }
}

const formatDatetime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const editItem = (id) => {
  router.push(`/committee-kinds/edit/${id}`)
}

const deleteItem = async (id) => {
  if (!confirm('本当に削除しますか？')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8000/api/committee-kinds/${id}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    alert('削除しました')
    fetchItems()
  } catch (error) {
    if (error?.response?.status === 404) {
      alert('対象が見つかりません（既に削除済みの可能性があります）。')
    } else if (error?.response?.status === 401) {
      alert('認証が切れています。再ログインしてください。')
    } else {
      console.error('削除に失敗:', error)
      alert('削除に失敗しました')
    }
  }
}

onMounted(fetchItems)
</script>