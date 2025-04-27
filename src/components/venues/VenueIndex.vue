<template>
    <div class="p-4">
      
  
      <div class="mb-4">
        <CButton color="primary" @click="goToCreate">＋ 新規会場登録</CButton>
      </div>
          <!-- 読み込み中はローディング表示 -->
    <div v-if="isLoading">
      読み込み中...
    </div>
    <div v-else>
      <CRow v-if="venues.length > 0">
        <CCol cols="12">
          <CTable bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>会場名</CTableHeaderCell>
                <CTableHeaderCell>郵便番号</CTableHeaderCell>
                <CTableHeaderCell>住所</CTableHeaderCell>
                <CTableHeaderCell>電話番号</CTableHeaderCell>
                <CTableHeaderCell>駐車場</CTableHeaderCell>
                <CTableHeaderCell>施設情報</CTableHeaderCell>
                <CTableHeaderCell>操作</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="venue in venues" :key="venue.venue_id">
                <CTableDataCell>{{ venue.venue_name }}</CTableDataCell>
                <CTableDataCell>{{ venue.zip }}</CTableDataCell>
                <CTableDataCell>{{ venue.address }}</CTableDataCell>
                <CTableDataCell>{{ venue.tel }}</CTableDataCell>
                <CTableDataCell>{{ formatParking(venue.parking) }}</CTableDataCell>
                <CTableDataCell>
                  <div>
                    <!-- 会場HP URL -->
                    <span v-if="venue.hpurl">
                      <a :href="venue.hpurl" target="_blank" rel="noopener noreferrer">[HP]</a>
                    </span>
                    <!-- MAP URL -->
                    <span v-if="venue.mapurl" class="ms-2">
                      <a :href="venue.mapurl" target="_blank" rel="noopener noreferrer">[MAP]</a>
                    </span>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="primary" size="sm" @click="editVenue(venue.venue_id)">編集</CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
  
      <div v-else>
        <p>登録された会場がありません。</p>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const venues = ref([]);
  const isLoading = ref(true);
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/venues', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      });
      venues.value = response.data;
    } catch (error) {
      console.error('会場一覧取得失敗:', error);
    }finally {
    isLoading.value = false; // ← 読み込み完了
    }
  });
  
  const goToCreate = () => {
    router.push({ name: 'VenueCreate' });
  };
  
  const editVenue = (id) => {
    router.push({ name: 'VenueEdit', params: { id } });
  };
  
  const formatParking = (parking) => {
    return parking === 1 ? '有' : '無';
  };
  </script>
  
  <style scoped>
  .p-4 {
    max-width: 1200px;
    margin: auto;
  }
  </style>
  