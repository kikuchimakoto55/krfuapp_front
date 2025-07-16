<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">氏名</span>
            <span class="info-value">{{ member.username_sei }} {{ member.username_mei }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">フリガナ</span>
            <span class="info-value">{{ member.username_kana_s }} {{ member.username_kana_m }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">性別</span>
            <span class="info-value">{{ genderText(member.sex) }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">生年月日</span>
            <span class="info-value">{{ member.birthday }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">学年カテゴリ</span>
            <span class="info-value">{{ gradeCategoryText(member.grade_category) }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">指導員区分</span>
            <span class="info-value">{{ coachFlgText(member.coach_flg) }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">メールアドレス</span>
            <span class="info-value">{{ member.email }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">電話番号</span>
            <span class="info-value">{{ member.tel }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">氏名 (英)</span>
            <span class="info-value">{{ member.username_en_s }} {{ member.username_en_m }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">身長</span>
            <span class="info-value">{{ member.height }} cm</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">体重</span>
            <span class="info-value">{{ member.weight }} kg</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">血液型</span>
            <span class="info-value">{{ bloodTypeText(member.blood_type) }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">郵便番号</span>
            <span class="info-value">{{ member.zip }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">住所</span>
            <span class="info-value">{{ member.address1 }} {{ member.address2 }} {{ member.address3 }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">在籍学校・園名</span>
            <span class="info-value">{{ member.enrolled_school }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">権限種別</span>
            <span class="info-value">{{ authorityKindText(member.authoritykinds_id) }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="4" class="info-col">
            <span class="info-label">保護者氏名</span>
            <span class="info-value">{{ member.guardian_name }}</span>
          </CCol>
          <CCol md="4" class="info-col">
            <span class="info-label">保護者メールアドレス</span>
            <span class="info-value">{{ member.guardian_email }}</span>
          </CCol>
          <CCol md="4" class="info-col">
            <span class="info-label">保護者電話番号</span>
            <span class="info-value">{{ member.guardian_tel }}</span>
          </CCol>
        </CRow>

        <CRow class="mt-3">
          <CCol md="4" class="info-col">
            <span class="info-label">緊急連絡先・氏名</span>
            <span class="info-value">{{ member.emergency_name1 }}</span>
          </CCol>
          <CCol md="4" class="info-col">
            <span class="info-label">緊急連絡先・メール</span>
            <span class="info-value">{{ member.emergency_email1 }}</span>
          </CCol>
          <CCol md="4" class="info-col">
            <span class="info-label">緊急連絡先・電話番号</span>
            <span class="info-value">{{ member.emergency_tel1 }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">続柄</span>
            <span class="info-value">{{ relationshipText(member.relationship) }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">所属区分</span>
            <span class="info-value">{{ classificationText(member.classification) }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="12" class="info-col">
            <span class="info-label">備考</span>
            <div class="info-value" style="white-space: pre-wrap;">{{ member.remarks }}</div>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">保険登録番号</span>
            <span class="info-value">{{ member.membershipfee_conf }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">協会登録番号</span>
            <span class="info-value">{{ member.association_id }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col">
            <span class="info-label">在籍状況</span>
            <span class="info-value">{{ statusText(member.status) }}</span>
          </CCol>
          <CCol md="6" class="info-col">
            <span class="info-label">卒業年度</span>
            <span class="info-value">{{ member.graduation_year }}</span>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="6" class="info-col" v-if="isAdmin">
            <span class="info-label">パスワード</span>
            <span class="info-value info-flex">
              セキュリティ上表示できません。
              <CButton size="sm" color="dark" variant="outline" class="ms-2 stylish-btn" @click="goToPasswordEdit">
                パスワード変更はこちら
              </CButton>
            </span>
          </CCol>
          <CCol md="6" class="info-col" v-if="families.length">
            <span class="info-label">家族情報</span>
            <ul class="info-value" style="margin-top: 0.5em;">
              <li v-for="f in families" :key="f.member_id">
                {{ f.username_sei }} {{ f.username_mei }}（{{ relationshipText(f.relationship) }}）
              </li>
            </ul>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="12" class="info-col">
            <span class="info-label">保有資格</span>
            <ul class="info-value">
              <li v-if="!credentials.some(c => Number(c.valid_flg) === 1)">
                保有資格は登録されていません
              </li>
              <template v-for="(cred, index) in credentials" :key="index">
                <li v-if="Number(cred.valid_flg) === 1">
                  資格名：{{ cred.license?.licensekindsname || '未設定' }} |
                  取得日：{{ cred.acquisition_date || '未設定' }} |
                  有効期限：{{ getValidityMessage(cred) }}
                </li>
              </template>
            </ul>
          </CCol>
        </CRow>

        <CRow class="mt-4">
          <CCol>
            <CButton color="primary" @click="goToEdit">編集する</CButton>
            <CButton color="secondary" class="ms-2" @click="router.back()">戻る</CButton>
            <RouterLink :to="`/members/${member.member_id}/credentials/edit`">
              <CButton color="dark" class="ms-2">保有資格を編集</CButton>
            </RouterLink>
                <!-- パスワード変更ボタン（管理者のみ表示） -->
            <RouterLink v-if="isAdmin" :to="`/admin/members/${member.member_id}/password-change`">
              <CButton color="warning" class="ms-2">管理者パスワード変更</CButton>
            </RouterLink>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol>
            <CButton size="sm" color="dark" variant="outline" class="ms-2 stylish-btn" @click="openFamilyModal">
              家族登録はこちら
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <FamilyRegisterModal
      :visible="showFamilyModal"
      :member-id="Number(id)"
      @close="closeFamilyModal"
      @success="handleFamilyRegistered"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import FamilyRegisterModal from '@/components/members/FamilyRegisterModal.vue'
import { CCard, CCardBody, CRow, CCol, CButton } from '@coreui/vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const member = ref({})
const families = ref([])
const credentials = ref([])
const isAdmin = ref(false)
const showFamilyModal = ref(false)

const fetchMember = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/members/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    member.value = res.data.member
    families.value = res.data.families || []
    credentials.value = res.data.h_credentials || []
    isAdmin.value = parseInt(localStorage.getItem('authoritykinds_id')) === 1
  } catch (err) {
    console.error('会員情報の取得に失敗しました', err)
  }
}

onMounted(fetchMember)

const openFamilyModal = () => (showFamilyModal.value = true)
const closeFamilyModal = () => (showFamilyModal.value = false)
const handleFamilyRegistered = () => {
  showFamilyModal.value = false
  fetchMember()
}

const getValidityMessage = (cred) => {
  if (!cred.acquisition_date) return '取得日を設定してください'
  if (!cred.license?.valid_period) return '有効期限不明'
  const acquired = new Date(cred.acquisition_date)
  const expires = new Date(acquired.getTime() + cred.license.valid_period * 86400000)
  const today = new Date()
  const diffDays = Math.floor((expires - today) / 86400000)
  return diffDays < 0 ? '有効期限は切れています' : `${diffDays}日後まで有効`
}

const goToEdit = () => {
  router.push(`/members/edit/${id}`)
}

const goToPasswordEdit = () => {
  router.push(`/members/edit-password/${id}`)
}

const genderText = val => val === 1 ? '男' : val === 2 ? '女' : ''
const coachFlgText = val => ({ 0: '選手', 1: '指導員', 2: 'その他' })[val] || ''
const bloodTypeText = val => ({ 1: 'A', 2: 'B', 3: 'AB', 4: 'O', 5: 'その他' })[val] || ''
const relationshipText = val => ({ 1: '父', 2: '母', 3: '祖父', 4: '祖母', 5: 'その他', 6: '本人' })[val] || ''
const classificationText = val => ({ 1: '代表者', 2: '監督', 3: 'コーチ', 4: 'プレイヤー', 5: 'マネージャー', 6: 'メディカルサポーター', 7: 'トレーナー', 8: 'チームドクター', 9: 'その他' })[val] || ''
const statusText = val => ({ 1: '在籍', 2: '転籍', 3: '休校', 4: '退校', 5: '卒業', 6: 'その他' })[val] || ''
const gradeCategoryText = val => ({ 1: '年年少', 2: '年少', 3: '年中', 4: '年長', 5: '小１', 6: '小２', 7: '小３', 8: '小４', 9: '小５', 10: '小６', 11: '中１', 12: '中２', 13: '中３', 14:'高１', 15:'高２', 16:'高３', 17:'大１', 18:'大２', 19:'大３', 20:'大４', 21:'社会人', 22:'卒業' })[val] || ''
const authorityKindText = val => ({ 1: '管理者', 2: '運営権限', 3: '一般権限', 4: '使用者権限' })[val] || ''
</script>

<style scoped>
/* 既存のスタイルはそのまま維持 */
.info-col {
  position: relative;
  border: 1px solid #0099cc;
  padding: 22px;
  margin-bottom: 1rem;
}
.info-label {
  position: absolute;
  top: -0.6em;
  left: 0.5em;
  background: #006699;
  color: #fff;
  font-weight: bold;
  padding: 5px 1.3em;
  line-height: 1;
  border-radius: 1.2rem;
  white-space: nowrap;
}
.info-value {
  display: block;
  margin-top: 0.5em;
  padding-left: 0.3em;
}
.info-value li {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0.3rem;
}
.stylish-btn {
  border-radius: 1.2rem;
  padding: 0.25rem 1rem;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}
.stylish-btn:hover {
  background-color: #006699;
  color: #fff;
  border-color: #006699;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
