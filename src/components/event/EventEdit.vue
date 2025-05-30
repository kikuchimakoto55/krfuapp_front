<template>
  <CContainer>
    <CForm @submit.prevent="submitForm">
      <CRow>
        <CCol md="12">
          <CFormLabel>イベント名</CFormLabel>
          <CFormInput v-model="form.event_name" />
          <small v-if="errors.event_name" class="text-danger">{{ errors.event_name[0] }}</small>
        </CCol>
      </CRow>

      <CRow class="mt-3">
        <CCol md="6">
          <CFormLabel>開催日時</CFormLabel>
          <CFormInput type="datetime-local" v-model="form.event_opentime" />
          <small v-if="errors.event_opentime" class="text-danger">{{ errors.event_opentime[0] }}</small>
        </CCol>
        <CCol md="6">
          <CFormLabel>会場</CFormLabel>
          <CFormInput v-model="form.venue_name" placeholder="会場名を入力" />
          <small v-if="errors.venue_name" class="text-danger">{{ errors.venue_name[0] }}</small>
        </CCol>
      </CRow>

      <CRow class="mt-3">
        <CCol md="4">
          <CFormLabel>天気</CFormLabel>
          <CFormSelect v-model="form.weather">
            <option value="">選択なし</option>
            <option value="1">晴れ</option>
            <option value="2">くもり</option>
            <option value="3">雨</option>
            <option value="4">雪</option>
          </CFormSelect>
          <small v-if="errors.weather" class="text-danger">{{ errors.weather[0] }}</small>
        </CCol>
        <CCol md="4">
          <CFormLabel>気温</CFormLabel>
          <CFormInput type="number" v-model="form.temperature" />
          <small v-if="errors.temperature" class="text-danger">{{ errors.temperature[0] }}</small>
        </CCol>
        <CCol md="4">
          <CFormLabel>種別</CFormLabel>
          <CFormSelect v-model="form.event_kinds">
            <option value="">選択なし</option>
            <option v-for="kind in eventKindList" :key="kind.value" :value="kind.value">
              {{ kind.label }}
            </option>
          </CFormSelect>
          <small v-if="errors.event_kinds" class="text-danger">{{ errors.event_kinds[0] }}</small>
        </CCol>
      </CRow>

      <CRow class="mt-3">
        <CCol md="6">
          <CFormLabel>概要</CFormLabel>
          <CFormTextarea v-model="form.event_overview" rows="3" />
          <small v-if="errors.event_overview" class="text-danger">{{ errors.event_overview[0] }}</small>
        </CCol>
        <CCol md="6">
            <CFormLabel>参加者リスト（ファイル添付）</CFormLabel>
            <CFormInput type="file" multiple @change="handleEventFiles" />
            <CFormText v-if="form.event_files_name">
            現在のファイル:<br />
            <span v-for="(file, index) in form.event_files_name.split(',')" :key="index">
                <a :href="`/storage/${file}`" target="_blank" rel="noopener noreferrer">{{ file }}</a><br />
            </span>
            </CFormText>
        </CCol>
      </CRow>

      <CRow class="mt-4">
        <CCol>
          <CButton type="submit" color="primary">更新</CButton>
        </CCol>
      </CRow>
    </CForm>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { eventKindsOptions } from '@/components/constants/labels'

const router = useRouter()
const route = useRoute()
const errors = ref({})
const form = ref({
  event_name: '',
  event_opentime: '',
  weather: '',
  temperature: '',
  venue_name: '',
  event_kinds: '',
  event_overview: '',
})

const eventKindList = Object.entries(eventKindsOptions).map(([value, label]) => ({
  value: Number(value),
  label,
}))

onMounted(async () => {
    console.log('submitForm 呼び出し'); // ←追加
  const res = await axios.get(`http://localhost:8000/api/events/${route.params.id}`, {
    withCredentials: true,
  })
  const data = res.data

  form.value = {
  ...data,
  weather: data.weather !== null ? String(data.weather) : '',
  event_kinds: data.event_kinds !== null ? String(data.event_kinds) : '',
  event_files_name: data.event_files || '',
}
})

const submitForm = async () => {
  errors.value = {}
  try {
    const formData = new FormData()

    // 通常のデータを追加
    formData.append('event_name', form.value.event_name)
    formData.append('event_opentime', form.value.event_opentime)
    formData.append('weather', form.value.weather)
    formData.append('temperature', form.value.temperature)
    formData.append('venue_name', form.value.venue_name)
    formData.append('event_kinds', form.value.event_kinds)
    formData.append('event_overview', form.value.event_overview)

    // ファイルがある場合は追加
    if (form.value.event_files && form.value.event_files.length > 0) {
      form.value.event_files.forEach(file => {
        formData.append('event_files[]', file)
      })
    }

    await axios.post(
      `http://localhost:8000/api/events/${route.params.id}?_method=PUT`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    alert('イベントを更新しました')
    router.push('/events')
  } catch (err) {
    if (err.response && err.response.status === 422) {
      console.error('バリデーションエラー:', err.response.data.errors)
      errors.value = err.response.data.errors
    } else {
      console.error('その他のエラー:', err)
    }
  }
}

// 新規定義：添付ファイルの保存
form.value.event_files = null
form.value.event_files_name = ''

// ファイル選択時の処理
const handleEventFiles = (event) => {
  form.value.event_files = Array.from(event.target.files)
}
</script>
