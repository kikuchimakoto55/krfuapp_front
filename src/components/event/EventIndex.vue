<template>
  <CContainer>
    <CTable hover bordered responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>イベント名</CTableHeaderCell>
          <CTableHeaderCell>開催日時</CTableHeaderCell>
          <CTableHeaderCell>会場</CTableHeaderCell>
          <CTableHeaderCell>種別</CTableHeaderCell>
          <CTableHeaderCell>参加者リスト</CTableHeaderCell>
          <CTableHeaderCell class="text-center">操作</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="event in events" :key="event.event_id">
          <CTableDataCell>{{ event.event_name }}</CTableDataCell>
          <CTableDataCell>{{ formatDatetime(event.event_opentime) }}</CTableDataCell>
          <CTableDataCell>{{ event.venue_name }}</CTableDataCell>
          <CTableDataCell>{{ eventKindsOptions[event.event_kinds] || '-' }}</CTableDataCell>
          <CTableDataCell>
          <div v-if="event.event_files">
            <div
              v-for="(file, index) in event.event_files.split(',')"
              :key="index"
            >
              <a :href="`/storage/${file}`" target="_blank" download>
                {{ file.split('/').pop() }}
              </a>
            </div>
          </div>
          <div v-else>-</div>
        </CTableDataCell>
          <CTableDataCell class="text-center">
            <CButton color="info" size="sm" class="me-2" @click="editEvent(event.event_id)">
              編集
            </CButton>
            <CButton color="danger" size="sm" style="color: white;" @click="deleteEvent(event.event_id)">
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
import { eventKindsOptions } from '@/components/constants/labels'

const events = ref([])
const router = useRouter()

const fetchEvents = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/events', { withCredentials: true })
    events.value = res.data
  } catch (error) {
    console.error('イベント一覧の取得に失敗しました:', error)
  }
}

const formatDatetime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const editEvent = (id) => {
  router.push(`/events/edit/${id}`)
}

const deleteEvent = async (id) => {
  if (!confirm('本当に削除しますか？')) return

  try {
    await axios.delete(`http://localhost:8000/api/events/${id}`, { withCredentials: true })
    alert('削除しました')
    fetchEvents()
  } catch (error) {
    console.error('削除に失敗しました:', error)
    alert('削除に失敗しました')
  }
}

onMounted(fetchEvents)
</script>