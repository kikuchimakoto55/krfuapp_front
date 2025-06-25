<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {
  CForm, CFormLabel, CFormInput, CButton, CRow, CCol, CAlert
} from '@coreui/vue'

const route = useRoute()
const router = useRouter()
const memberId = route.params.id

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'すべての項目を入力してください。'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'パスワードが一致しません。'
    return
  }

  try {
    const res = await axios.put(
      `http://localhost:8000/api/admin/members/${memberId}/password`,
      {
        password: newPassword.value,
        password_confirmation: confirmPassword.value
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )
    success.value = 'パスワードを更新しました。'
    setTimeout(() => {
      router.push(`/members/show/${memberId}`)
    }, 1500)
  } catch (err) {
    error.value = 'パスワード更新に失敗しました。'
  }
}
</script>

<template>
  <div class="p-4">

    <CForm @submit.prevent="handleSubmit" class="mt-3">

      <CRow class="mb-3">
        <CCol sm="12">
          <CFormLabel for="newPassword">新しいパスワード</CFormLabel>
          <CFormInput type="password" id="newPassword" v-model="newPassword" required />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol sm="12">
          <CFormLabel for="confirmPassword">確認用パスワード</CFormLabel>
          <CFormInput type="password" id="confirmPassword" v-model="confirmPassword" required />
        </CCol>
      </CRow>

      <CRow>
        <CCol sm="12">
          <CButton color="primary" type="submit">更新する</CButton>
        </CCol>
      </CRow>

      <CAlert color="danger" v-if="error" class="mt-3">{{ error }}</CAlert>
      <CAlert color="success" v-if="success" class="mt-3">{{ success }}</CAlert>

    </CForm>
  </div>
</template>
