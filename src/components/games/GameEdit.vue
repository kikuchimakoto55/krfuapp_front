<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">試合情報編集</h2>
  
      <CForm @submit.prevent="submit">
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>大会ID</CFormLabel>
            <CFormInput v-model="form.tournament_id" readonly />
          </CCol>
          <CCol md="6">
            <CFormLabel>ディビジョン名</CFormLabel>
            <CFormInput v-model="form.division_name" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>回戦</CFormLabel>
            <CFormInput v-model="form.round" />
          </CCol>
          <CCol md="6">
            <CFormLabel>試合日時</CFormLabel>
            <CFormInput type="datetime-local" v-model="form.game_datetime" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>会場名</CFormLabel>
            <CFormInput v-model="form.venue_name" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>チーム1</CFormLabel>
            <CFormInput v-model="form.team1_name" />
          </CCol>
          <CCol md="6">
            <CFormLabel>チーム2</CFormLabel>
            <CFormInput v-model="form.team2_name" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>レフリー</CFormLabel>
            <CFormInput v-model="form.referee" />
          </CCol>
          <CCol md="6">
            <CFormLabel>担当者</CFormLabel>
            <CFormInput v-model="form.staff" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>ドクター</CFormLabel>
            <CFormInput v-model="form.doctor" />
          </CCol>
        </CRow>
  
        <CButton type="submit" color="primary">更新する</CButton>
        <CButton color="secondary" class="ml-2" @click="goBack">キャンセル</CButton>
      </CForm>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const router = useRouter()
  const gameId = route.params.id
  const form = ref({})
  
  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/games/${gameId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      })
      form.value = response.data
    } catch (error) {
      console.error('試合情報の取得失敗:', error)
      alert('試合情報の取得に失敗しました')
    }
  })
  
  const submit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/games/${gameId}`, form.value, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      })
      alert('試合情報を更新しました')
      router.push('/games')
    } catch (error) {
      console.error('試合情報の更新失敗:', error)
      alert('試合情報の更新に失敗しました')
    }
  }
  
  const goBack = () => {
    router.push('/games')
  }
  </script>
  
  <style scoped>
  .p-4 {
    max-width: 800px;
    margin: auto;
  }
  </style>
  