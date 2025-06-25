<template>
    <div>
      <CCard>
        <CCardBody>
          <CForm @submit.prevent="handleSubmit">
            <div class="mb-3">
              <CFormLabel>現在のパスワード</CFormLabel>
              <CFormInput type="password" v-model="currentPassword" required />
            </div>
  
            <div class="mb-3">
              <CFormLabel>新しいパスワード</CFormLabel>
              <CFormInput type="password" v-model="newPassword" required minlength="8" />
            </div>
  
            <div class="mb-3">
              <CFormLabel>新しいパスワード（確認）</CFormLabel>
              <CFormInput type="password" v-model="confirmPassword" required />
              <div v-if="passwordMismatch" class="text-danger mt-1">新しいパスワードが一致しません</div>
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
  import {
    CCard, CCardBody, CForm, CFormLabel, CFormInput, CButton
  } from '@coreui/vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  
  const passwordMismatch = computed(() => {
    return newPassword.value !== confirmPassword.value
  })
  
  const handleSubmit = async () => {
    console.log('current_password:', currentPassword.value)
    console.log('new_password:', newPassword.value)
    if (passwordMismatch.value) return
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/change-password', {
        current_password: currentPassword.value,
        new_password: newPassword.value
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      })
  
      alert('パスワードを変更しました')
      //  ローカルストレージから user_id を取得してから遷移
    const userId = parseInt(localStorage.getItem('user_id'))
    if (userId) {
      router.push(`/members/show/${userId}`)
    } else {
      alert('ユーザーIDが見つかりませんでした')
    }

  } catch (error) {
    alert('変更に失敗しました：' + (error.response?.data?.message || 'エラー'))
  }
  }


  </script>
  