<template>
    <div class="p-4">
      
  
      <CForm @submit.prevent="submitForm">
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>会場名</CFormLabel>
            <CFormInput v-model="form.venue_name" required />
          </CCol>
          <CCol md="6">
            <CFormLabel>郵便番号</CFormLabel>
            <CFormInput v-model="form.zip" type="text" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="12">
            <CFormLabel>住所</CFormLabel>
            <CFormInput v-model="form.address" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>電話番号</CFormLabel>
            <CFormInput v-model="form.tel" type="text" />
          </CCol>
          <CCol md="6">
            <CFormLabel>MAP URL</CFormLabel>
            <CFormInput v-model="form.mapurl" type="text" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>会場HP URL</CFormLabel>
            <CFormInput v-model="form.hpurl" type="text" />
          </CCol>
          <CCol md="6">
            <CFormLabel>駐車場有無</CFormLabel>
                <CFormSelect v-model="form.parking">
                    <option :value="0">無</option>  <!-- 数値型に！ -->
                    <option :value="1">有</option>  <!-- 数値型に！ -->
                </CFormSelect>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>駐車可能台数</CFormLabel>
            <CFormInput v-model="form.parking_number" type="text" />
          </CCol>
          <CCol md="6">
            <CFormLabel>特筆事項</CFormLabel>
            <CFormInput v-model="form.remarks" type="text" />
          </CCol>
        </CRow>
  
        <CButton color="primary" type="submit">登録</CButton>
        <CButton color="secondary" class="ms-2" @click="goBack">戻る</CButton>
      </CForm>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  
  const form = ref({
    venue_name: '',
    zip: '',
    address: '',
    tel: '',
    mapurl: '',
    hpurl: '',
    parking: '0',
    parking_number: '',
    remarks: ''
  });
  
  const submitForm = async () => {
    try {
      await axios.post('http://localhost:8000/api/venues', form.value, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      });
      alert('登録完了しました');
      router.push('/venues');
    } catch (error) {
        console.error('登録エラー:', error.response.data);  // ここを必ず追加
        alert('登録に失敗しました');
    }
  };
  
  const goBack = () => {
    router.back();
  };
  </script>
  
  <style scoped>
  .p-4 {
    max-width: 800px;
    margin: auto;
  }
  </style>
  