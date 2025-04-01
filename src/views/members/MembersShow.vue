<template>
    <div>
      <h2>マイページ</h2>
    
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
                <span class="info-value"> {{ member.weight }} kg</span>
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

  const bloodTypeText = (val) => {
  return { 1: 'A', 2: 'B', 3: 'AB', 4: 'O', 5: 'その他' }[val] || ''
}

const relationshipText = (val) => {
  return { 1: '父', 2: '母', 3: '祖父', 4: '祖母', 5: 'その他', 6: '本人' }[val] || ''
}

const classificationText = (val) => {
  return {
    1: '代表者', 2: '監督', 3: 'コーチ', 4: 'プレイヤー',
    5: 'マネージャー', 6: 'メディカルサポーター',
    7: 'トレーナー', 8: 'チームドクター', 9: 'その他'
  }[val] || ''
}

const statusText = (val) => {
  return {
    1: '在籍', 2: '転籍', 3: '休校', 4: '退校',
    5: '卒業', 6: 'その他'
  }[val] || ''
}

const gradeCategoryText = (val) => {
  return {
    1: '年年少', 2: '年少', 3: '年中', 4: '年長', 5: '小１', 6: '小２', 7: '小３', 8: '小４', 9: '小５', 10: '小６', 11: '中１', 12: '中２', 13: '中３', 14:'高１', 15:'高２', 16:'高３', 17:'大１', 18:'大２', 19:'大３', 20:'大４', 21:'社会人',}[val] || ''
}

const authorityKindText = (val) => {
  return {
    1: '管理者',
    2: '運営権限',
    3: '一般権限',
    4: '使用者権限'
  }[val] || ''
}

  </script>

<style scoped>
/* 外枠ボックスのスタイル */
.info-col {
  position: relative;                 /* 子要素（ラベル）の絶対配置用 */
  border: 1px solid #0099cc ;          /* 枠線：幅1px・色#0099cc（Bootstrapの「warning」色） */
  padding: 22px;                        /* 枠内の余白をなしにしてコンテンツを左詰め */
  margin-bottom: 1rem;               /* 下方向の余白（行が折り返された場合の間隔調整） */
}

/* ラベル部分のスタイル */
.info-label {
  position: absolute;
  top: -0.6em;                       /* 枠線より少し上に配置（ラベル高さの約半分） */
  left: 0.5em;                       /* 枠の左端から少し内側にオフセット */
  background: #006699;               /* ラベルの背景色（枠線と同じ色で一体感を演出） */
  color: #fff;                       /* ラベル文字色（背景に対し見やすい白など） */
  font-weight: bold;
  padding: 5px 1.3em;                  /* ラベル文字の左右に適度な余白を追加 */
  line-height: 1;                    /* ラベルの行高を1にして余計な隙間を除去 */
  border-radius: 1.2rem;             /* （任意）角を少し丸くするとデザインが柔らかくなります */
}

/* 値部分のスタイル */
.info-value {
  display: block;
  margin-top: 0.5em;
  padding-left: 0.3em;
  /* デフォルトで左寄せ。paddingは無し。必要に応じて微調整可能 */
}

/*ラベルが長い場合の防止策*/
.info-label {
  white-space: nowrap;
}
</style>

  