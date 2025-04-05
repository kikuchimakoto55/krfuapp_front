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
          <CTableHeaderCell>所属区分</CTableHeaderCell>
          <CTableHeaderCell>権限種別</CTableHeaderCell>
          <CTableHeaderCell>指導員フラグ</CTableHeaderCell>
          <CTableHeaderCell>編集</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="member in members" :key="member.member_id">
          <CTableDataCell>{{ member.username_sei }} {{ member.username_mei }}</CTableDataCell>
          <CTableDataCell>{{ member.email }}</CTableDataCell>
          <CTableDataCell>{{ gradeCategories[member.grade_category] }}</CTableDataCell>
          <CTableDataCell>{{ statusOptions[member.status] }}</CTableDataCell>
          <CTableDataCell>{{ classificationOptions[member.classification] }}</CTableDataCell>
          <CTableDataCell>{{ authorityOptions[member.authoritykinds_id] }}</CTableDataCell>
          <CTableDataCell>{{ coachFlgOptions[member.coach_flg] }}</CTableDataCell>
          <CTableDataCell>
          <router-link :to="`/members/show/${member.member_id}`">
          <CButton color="info" size="sm" class="custom-detail-btn">詳細</CButton>
          </router-link>
          </CTableDataCell>
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
import axios from '@/utils/axios';;

// 🔽 データ管理
const members = ref([]);
const pagination = ref({ last_page: 1 });
const search = ref({});
const currentPage = ref(1); // 🔹 現在のページ番号
const showSearchForm = ref(false);

// 🔽 プルダウンオプション
const gradeCategories = { 1: '年年少', 2: '年少', 3: '年中', 4: '年長', 5: '小1', 6: '小2', 7: '小3', 8: '小4', 9: '小5', 10: '小6', 11: '中1', 12: '中2', 13: '中3', 14: '高1', 15: '高2', 16: '高3', 17: '大1', 18: '大2', 19: '大3', 20: '大4', 21: '社会人' };
const classificationOptions = { 1: '代表者', 2: '監督', 3: 'コーチ', 4: 'プレイヤー', 5: 'マネージャー', 6: 'メディカルサポーター', 7: 'トレーナー', 8: 'チームドクター' };
const statusOptions = { 0: '在籍', 1: '転籍', 2: '離籍', 3: '卒業', 4: 'その他' };
const authorityOptions = { 1: '管理者', 2: '運営権限', 3: '一般権限', 4: '使用者権限' };
const coachFlgOptions = { 0: '選手', 1: '指導員', 2: 'その他' };

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

    const response = await axios.get(`http://localhost:8000/api/members?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true, 
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

.custom-detail-btn {
  color: #fff !important;          /* 文字色 */
  background-color: #006699 !important; /* 背景色 */
  border-color: #6c757d !important;
}

.custom-detail-btn:hover {
  background-color: #008099 !important;
  border-color: #545b62 !important;
}

</style>