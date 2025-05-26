<template>
  <div class="p-4">
    <CForm @submit.prevent="handleSubmit">
      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>資格名</CFormLabel>
          <CFormInput v-model="form.licensekindsname" required />
        </CCol>
        <CCol md="6">
          <CFormLabel>資格種別ID</CFormLabel>
          <CFormInput v-model="form.licensekinds_id" type="number" required />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>資格保有期間（日数）</CFormLabel>
          <CFormInput v-model.number="form.valid_period" type="number" min="1" required />
        </CCol>
        <CCol md="6">
          <CFormLabel>要項URL</CFormLabel>
          <CFormInput v-model="form.requirements_url" />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol>
          <CFormLabel>受講条件</CFormLabel>
          <CFormTextarea v-model="form.participation_conditions" rows="2" />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol>
          <CFormLabel>資格要項</CFormLabel>
          <CFormTextarea v-model="form.requirements" rows="2" />
        </CCol>
      </CRow>

      <CRow class="mb-4">
        <CCol>
          <CFormLabel>管理組織</CFormLabel>
          <CFormTextarea v-model="form.management_organization" rows="2" />
        </CCol>
      </CRow>

      <CButton type="submit" color="primary">更新</CButton>
    </CForm>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'

const route = useRoute()
const router = useRouter()

const form = ref({
  licensekinds_id: '',
  licensekindsname: '',
  valid_period: '',
  participation_conditions: '',
  requirements: '',
  requirements_url: '',
  management_organization: '',
  del_flg: 0,
})

const fetchLicense = async () => {
  try {
    const { data } = await axios.get(`http://localhost:8000/api/licenses/${route.params.id}`, {
      withCredentials: true
    })
    form.value = data
  } catch (err) {
    console.error('取得失敗', err)
    alert('資格情報の取得に失敗しました')
  }
}

const handleSubmit = async () => {
  try {
    await axios.put(`http://localhost:8000/api/licenses/${route.params.id}`, form.value, {
      withCredentials: true
    })
    alert('更新完了しました')
    router.push('/licenses')
  } catch (err) {
    console.error('更新失敗', err)
    alert('更新に失敗しました')
  }
}

onMounted(fetchLicense)
</script>
