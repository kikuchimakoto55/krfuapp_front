<template>
    <div>
      <h2>マイページ</h2>
  
      <CCard>
        <CCardBody>
          <CRow>
            <CCol md="6"><strong>氏名：</strong> {{ member.username_sei }} {{ member.username_mei }}</CCol>
            <CCol md="6"><strong>フリガナ：</strong> {{ member.username_kana_s }} {{ member.username_kana_m }}</CCol>
          </CRow>
          <CRow class="mt-2">
            <CCol md="6"><strong>性別：</strong> {{ genderText(member.sex) }}</CCol>
            <CCol md="6"><strong>生年月日：</strong> {{ member.birthday }}</CCol>
          </CRow>
          <CRow class="mt-2">
            <CCol md="6"><strong>学年カテゴリ：</strong> {{ member.grade_category }}</CCol>
            <CCol md="6"><strong>指導員区分：</strong> {{ coachFlgText(member.coach_flg) }}</CCol>
          </CRow>
          <CRow class="mt-2">
            <CCol md="6"><strong>メールアドレス：</strong> {{ member.email }}</CCol>
            <CCol md="6"><strong>電話番号：</strong> {{ member.tel }}</CCol>
          </CRow>
          <!-- 必要に応じて項目を追加 -->
          <CRow class="mt-4">
            <CCol>
              <CButton color="primary" @click="goToEdit">編集する</CButton>
              <CButton color="secondary" class="ms-2" @click="router.back()">戻る</CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import { CCard, CCardBody, CRow, CCol, CButton } from '@coreui/vue'
  
  const route = useRoute()
  const router = useRouter()
  const id = route.params.id
  
  const member = ref({})
  
  onMounted(async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/members/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      })
      member.value = res.data.member
    } catch (err) {
      console.error('会員情報の取得に失敗しました', err)
    }
  })
  
  const goToEdit = () => {
    router.push(`/members/edit/${id}`)
  }
  
  const genderText = (val) => {
    if (val == 1) return '男'
    if (val == 2) return '女'
    return ''
  }
  
  const coachFlgText = (val) => {
    if (val == 0) return '選手'
    if (val == 1) return '指導員'
    if (val == 2) return 'その他'
    return ''
  }
  </script>
  