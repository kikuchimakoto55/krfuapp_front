<template>
  <div class="members">
    <!--<h1>会員検索</h1>-->

    <!-- 🔽 検索条件表示ボタン -->
    <CButton @click="toggleSearchForm" color="primary" class="mb-3">
      {{ showSearchForm ? '検索条件を隠す' : '検索条件を表示する' }}
    </CButton>

    <!-- 🔽 検索フォーム -->
<CForm v-if="showSearchForm" @submit.prevent="fetchMembers(1)">
  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>学年カテゴリ</CFormLabel>
      <CFormSelect v-model="search.grade_category">
        <option value="">全て</option>
        <option v-for="(label, value) in gradeCategories" :key="value" :value="value">{{ label }}</option>
      </CFormSelect>
    </CCol>
    <CCol md="4">
      <CFormLabel>氏名 (姓)</CFormLabel>
      <CFormInput v-model="search.username_sei" maxlength="15" />
    </CCol>
    <CCol md="4">
      <CFormLabel>氏名 (名)</CFormLabel>
      <CFormInput v-model="search.username_mei" maxlength="15" />
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>氏名 (姓) カナ</CFormLabel>
      <CFormInput v-model="search.username_kana_s" maxlength="30" />
    </CCol>
    <CCol md="4">
      <CFormLabel>氏名 (名) カナ</CFormLabel>
      <CFormInput v-model="search.username_kana_m" maxlength="30" />
    </CCol>
    <CCol md="4">
      <CFormLabel>生年月日</CFormLabel>
      <CFormInput type="date" v-model="search.birthday" max="9999-12-31" />
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>都道府県</CFormLabel>
      <CFormInput v-model="search.address1" maxlength="10" />
    </CCol>
    <CCol md="4">
      <CFormLabel>市区町村</CFormLabel>
      <CFormInput v-model="search.address2" maxlength="10" />
    </CCol>
    <CCol md="4">
      <CFormLabel>保護者氏名</CFormLabel>
      <CFormInput v-model="search.guardian_name" maxlength="30" />
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>保護者メールアドレス</CFormLabel>
      <CFormInput v-model="search.guardian_email" maxlength="100" />
    </CCol>
    <CCol md="4">
      <CFormLabel>保護者電話番号</CFormLabel>
      <CFormInput v-model="search.guardian_tel" maxlength="11" type="number" />
    </CCol>
    <CCol md="4">
      <CFormLabel>緊急連絡先氏名</CFormLabel>
      <CFormInput v-model="search.emergency_name1" maxlength="30" />
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>緊急連絡先メールアドレス</CFormLabel>
      <CFormInput v-model="search.emergency_email1" maxlength="100" />
    </CCol>
    <CCol md="4">
      <CFormLabel>緊急連絡先電話番号</CFormLabel>
      <CFormInput v-model="search.emergency_tel1" maxlength="11" type="number" />
    </CCol>
    <CCol md="4">
      <CFormLabel>本人メールアドレス</CFormLabel>
      <CFormInput v-model="search.email" maxlength="100" />
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>本人電話番号</CFormLabel>
      <CFormInput v-model="search.tel" maxlength="11" type="number" />
    </CCol>
    <CCol md="4">
      <CFormLabel>登録日</CFormLabel>
      <CFormInput type="date" v-model="search.registration_date" max="9999-12-31" />
    </CCol>
    <CCol md="4">
      <CFormLabel>保険登録番号</CFormLabel>
      <CFormInput v-model="search.membershipfee_conf" maxlength="30" type="number" />
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>卒業年度</CFormLabel>
        <CFormInput v-model="search.graduation_year" maxlength="4" type="number" />
    </CCol>
    <CCol md="4">
      <CFormLabel>所属区分</CFormLabel>
      <CFormSelect v-model="search.classification">
        <option value="">全て</option>
        <option v-for="(label, value) in classificationOptions" :key="value" :value="value">{{ label }}</option>
      </CFormSelect>
    </CCol>
    <CCol md="4">
      <CFormLabel>在籍状況</CFormLabel>
      <CFormSelect v-model="search.status">
        <option value="">全て</option>
        <option v-for="(label, value) in statusOptions" :key="value" :value="value">{{ label }}</option>
      </CFormSelect>
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol md="4">
      <CFormLabel>指導員フラグ</CFormLabel>
      <CFormSelect v-model="search.coach_flg">
        <option value="">全て</option>
        <option value="0">生徒</option>
        <option value="1">指導員</option>
      </CFormSelect>
    </CCol>
  </CRow>

  <CButton type="submit" class="search-button">検索</CButton>
</CForm>

    <!-- 🔽 会員一覧 -->
    <CTable striped responsive class="mt-4">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>氏名</CTableHeaderCell>
          <CTableHeaderCell>メールアドレス</CTableHeaderCell>
          <CTableHeaderCell>学年カテゴリ</CTableHeaderCell>
          <CTableHeaderCell>在籍状況</CTableHeaderCell>
          <CTableHeaderCell>保険登録番号</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="member in members" :key="member.id">
          <CTableDataCell>{{ member.username_sei }} {{ member.username_mei }}</CTableDataCell>
          <CTableDataCell>{{ member.email }}</CTableDataCell>
          <CTableDataCell>{{ gradeCategories[member.grade_category] }}</CTableDataCell>
          <CTableDataCell>{{ statusOptions[member.status] }}</CTableDataCell>
          <CTableDataCell>{{ member.membershipfee_conf || 'なし' }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
    <!-- 🔹 ページネーションのUI -->
    <CRow class="mt-4">
      <CCol md="4">
        <CButton
          color="primary"
          @click="fetchMembers(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          « 前へ
        </CButton>
      </CCol>
      <CCol md="4" class="text-center">
        <span>ページ {{ currentPage }} / {{ pagination.last_page }}</span>
      </CCol>
      <CCol md="4" class="text-end">
        <CButton
          color="primary"
          @click="fetchMembers(currentPage + 1)"
          :disabled="currentPage === pagination.last_page"
        >
          次へ »
        </CButton>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 🔽 データ管理
const members = ref([]);
const pagination = ref({ last_page: 1 });
const search = ref({});
const currentPage = ref(1); // 🔹 現在のページ番号
const showSearchForm = ref(false);

// 🔽 プルダウンオプション
const gradeCategories = { 0: '年年少', 1: '年少', 2: '年中', 3: '年長', 4: '小1', 5: '小2', 6: '小3', 7: '小4', 8: '小5', 9: '小6', 10: '中1', 11: '中2', 12: '中3', 13: '高1', 14: '高2', 15: '高3', 16: '大1', 17: '大2', 18: '大3', 19: '大4', 20: '社会人' };
const classificationOptions = { 1: '代表者', 2: '監督', 3: 'コーチ', 4: 'プレイヤー', 5: 'マネージャー', 6: 'メディカルサポーター', 7: 'トレーナー', 8: 'チームドクター' };
const statusOptions = { 0: '在籍', 1: '転籍', 2: '離籍', 3: '卒業', 4: 'その他' };

// 🔽 検索条件を開閉
const toggleSearchForm = () => {
  showSearchForm.value = !showSearchForm.value;
};

// 🔽 データ取得関数
const fetchMembers = async (page = 1) => {
  try {
    currentPage.value = page; // 🔹 ページを更新

    const params = new URLSearchParams();
    Object.entries(search.value).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        params.append(key, value);
      }
    });

    params.append('page', currentPage.value);

    const response = await axios.get(`http://127.0.0.1:8000/api/members?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    console.log("取得データ:", response.data);
    members.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total
    };
  } catch (error) {
    console.error("データ取得エラー:", error);
  }
};

// 🔽 初回表示時にデータ取得
onMounted(() => fetchMembers());
</script>


<style scoped>
.search-button {
  background-color: #004ea2;
  color: white;
  border-radius: 8px;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
}
</style>