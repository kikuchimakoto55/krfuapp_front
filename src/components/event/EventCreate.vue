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
          <CFormLabel>開催日・時間</CFormLabel>
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
            <option v-for="option in weatherSelectOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
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

        <CCol md="12">
          <CFormLabel>概要</CFormLabel>
          <CFormTextarea v-model="form.event_overview" rows="3" />
          <small v-if="errors.event_overview" class="text-danger">{{ errors.event_overview[0] }}</small>
        </CCol>
      </CRow>

      <CRow class="mt-4">
        <CCol>
          <CButton type="submit" color="primary">登録</CButton>
        </CCol>
      </CRow>
    </CForm>
  </CContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { weatherOptions, eventKindsOptions } from '@/components/constants/labels.js';


const router = useRouter()
const errors = ref({})
const weatherSelectOptions = computed(() =>
  Object.entries(weatherOptions).map(([value, label]) => ({ value: Number(value), label }))
);

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

const submitForm = async () => {
  errors.value = {} // 前回のエラーをリセット
  try {
    const response = await axios.post('http://localhost:8000/api/events', form.value, {
      withCredentials: true,
    })
    alert('イベントを登録しました')
    router.push('/events')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors
    } else {
      alert('登録に失敗しました')
      console.error(error)
    }
  }
}
</script>
