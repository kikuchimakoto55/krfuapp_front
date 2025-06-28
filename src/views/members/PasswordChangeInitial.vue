<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm @submit.prevent="handleSubmit">
          <div class="mb-3">
            <CFormLabel>新しいパスワード</CFormLabel>
            <CFormInput
              type="password"
              v-model="newPassword"
              required
              minlength="8"
            />
          </div>

          <div class="mb-3">
            <CFormLabel>確認用パスワード</CFormLabel>
            <CFormInput
              type="password"
              v-model="confirmPassword"
              required
            />
            <div v-if="passwordMismatch" class="text-danger mt-1">
              パスワードが一致しません
            </div>
          </div>

          <CButton color="primary" type="submit">変更</CButton>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { CCard, CCardBody, CForm, CFormLabel, CFormInput, CButton, } from '@coreui/vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const memberId = route.params.id

const newPassword = ref('')
const confirmPassword = ref('')

const passwordMismatch = computed(() => {
  return newPassword.value !== confirmPassword.value
})

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  try {
    await axios.put(
    `http://127.0.0.1:8000/api/members/${memberId}/password-initial`,
    {
        password: newPassword.value,
        password_confirmation: confirmPassword.value,
    },
    {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
    }
    )

    alert('パスワードを変更しました')
    router.push(`/members/show/${memberId}`)
  } catch (error) {
    alert('変更に失敗しました：' + (error.response?.data?.message || 'エラー'))
  }
}
</script>