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
              <option value="0">無</option>
              <option value="1">有</option>
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
        
        <CButton color="primary" type="submit">更新</CButton>
        <CButton color="secondary" class="ms-2" @click="goBack">戻る</CButton>
        <CButton color="danger" class="ms-2" style="color: white;" @click="handleDelete">削除</CButton>
      </CForm>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const route = useRoute();
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
      await axios.put(`http://localhost:8000/api/venues/${route.params.id}`, form.value, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      });
      alert('更新完了しました');
      router.push('/venues');// 更新成功後は一覧に戻る
    } catch (error) {
      console.error('更新エラー:', error);
      alert('更新に失敗しました');
    }
  };
  
  const goBack = () => {
    router.back();
  };
  
  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/venues/${route.params.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      });
      form.value = response.data;
    } catch (error) {
      console.error('データ取得エラー:', error);
      alert('データの取得に失敗しました');
    }
  });


  const handleDelete = async () => {
  if (!confirm('この会場を削除してもよろしいですか？')) return;

  try {
    await axios.delete(`http://localhost:8000/api/venues/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    });
    alert('削除が完了しました');
    router.push('/venues');
  } catch (error) {
    console.error('削除エラー:', error);
    alert('削除に失敗しました');
  }
};
  </script>
  
  <style scoped>
  .p-4 {
    max-width: 800px;
    margin: auto;
  }
  </style>
  