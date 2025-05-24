<template>
  <div class="p-4">

    <!-- 検索フォーム -->
    <CForm @submit.prevent="fetchVenues">
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>会場名</CFormLabel>
          <CFormInput v-model="search.venue_name" placeholder="例: ○○グラウンド" />
        </CCol>
        <CCol md="4">
          <CFormLabel>住所</CFormLabel>
          <CFormInput v-model="search.address" placeholder="例: 東京都" />
        </CCol>
        <CCol md="4">
          <CFormLabel>駐車場</CFormLabel>
          <CFormSelect v-model="search.parking">
            <option value="">指定なし</option>
            <option value="1">有</option>
            <option value="0">無</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CRow class="mb-4">
        <CCol>
          <CButton type="submit" color="primary">検索</CButton>
        </CCol>
            <div class="mb-4 d-flex justify-content-between align-items-center">
      <CButton color="primary" @click="goToCreate">＋ 新規会場登録</CButton>
    </div>

      </CRow>
    </CForm>

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
                    <span v-if="venue.hpurl">
                      <a :href="venue.hpurl" target="_blank" rel="noopener noreferrer">[HP]</a>
                    </span>
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
        <p>該当する会場がありません。</p>
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
const isLoading = ref(false);

const search = ref({
  venue_name: '',
  address: '',
  parking: ''
});

const fetchVenues = async () => {
  isLoading.value = true;

  // 空文字を除いて送信する（重要！）
  const filteredParams = Object.fromEntries(
    Object.entries(search.value).filter(([_, val]) => val !== '')
  );

  try {
    const res = await axios.get('http://localhost:8000/api/venues', {
      params: filteredParams,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    });
    venues.value = res.data;
  } catch (err) {
    console.error('会場取得失敗:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchVenues);

const goToCreate = () => {
  router.push({ name: 'VenueCreate' });
};

const editVenue = (id) => {
  router.push({ name: 'VenueEdit', params: { id } });
};

const formatParking = (val) => (val == 1 ? '有' : '無');
</script>

<style scoped>
.p-4 {
  max-width: 1200px;
  margin: auto;
}
</style>
