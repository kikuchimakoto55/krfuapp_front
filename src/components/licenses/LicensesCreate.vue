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
                    <CFormLabel>資格保有期間 資格の有効日数（例：4年 → 1460）</CFormLabel>
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

      <CButton type="submit" color="primary">登録</CButton>
    </CForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { CForm, CFormInput, CFormLabel, CFormTextarea, CButton, CRow, CCol } from '@coreui/vue'

const router = useRouter()
const form = ref({
  licensekinds_id: '',
  licensekindsname: '',
  valid_period: '', // ← 修正
  participation_conditions: '',
  requirements: '',
  requirements_url: '',
  management_organization: '',
  del_flg: 0
});

const handleSubmit = async () => {
  try {
    await axios.post('http://localhost:8000/api/licenses', form.value, {
      withCredentials: true
    });
    alert('登録完了しました')
    router.push('/licenses')
  } catch (err) {
    console.error('登録失敗', err)
    alert('登録に失敗しました')
  }
}
</script>
