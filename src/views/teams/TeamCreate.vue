<template>
    <div class="p-4">
      
      <CForm @submit.prevent="handleSubmit">
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>年度</CFormLabel>
            <CFormInput v-model="form.year" type="number" required />
            <p class="text-danger" v-if="errors.year">{{ errors.year }}</p>
          </CCol>
          <CCol md="6">
            <CFormLabel>チーム登録番号</CFormLabel>
            <CFormInput v-model="form.team_id" required />
            <p class="text-danger" v-if="errors.team_id">{{ errors.team_id }}</p>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>チーム名</CFormLabel>
            <CFormInput v-model="form.team_name" required />
            <p class="text-danger" v-if="errors.team_name">{{ errors.team_name }}</p>
          </CCol>
          <CCol md="6">
            <CFormLabel>代表者名</CFormLabel>
            <CFormInput v-model="form.representative_name" required />
            <p class="text-danger" v-if="errors.representative_name">{{ errors.representative_name }}</p>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>代表者名（カナ）</CFormLabel>
            <CFormInput v-model="form.representative_kana" required />
            <p class="text-danger" v-if="errors.representative_kana">{{ errors.representative_kana }}</p>
          </CCol>
          <CCol md="6">
            <CFormLabel>代表者電話番号</CFormLabel>
            <CFormInput v-model="form.representative_tel" required />
            <p class="text-danger" v-if="errors.representative_tel">{{ errors.representative_tel }}</p>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>代表者メールアドレス</CFormLabel>
            <CFormInput v-model="form.representative_email" type="email" />
            <p class="text-danger" v-if="errors.representative_email">{{ errors.representative_email }}</p>
          </CCol>
          <CCol md="3">
            <CFormLabel>登録人数（男）</CFormLabel>
            <CFormInput v-model.number="form.male_members" type="number" />
          </CCol>
          <CCol md="3">
            <CFormLabel>登録人数（女）</CFormLabel>
            <CFormInput v-model.number="form.female_members" type="number" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>メディカルサポーター</CFormLabel>
            <CFormInput v-model="form.medical_supporter" />
          </CCol>
          <CCol md="4">
            <CFormLabel>JRFUコーチ</CFormLabel>
            <CFormInput v-model="form.jrfu_coach" />
          </CCol>
          <CCol md="4">
            <CFormLabel>安全推進講習会受講者</CFormLabel>
            <CFormInput v-model="form.safety_lecturer" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="3">
            <CFormLabel>カテゴリ</CFormLabel>
            <CFormSelect v-model="form.category" required>
              <option value="1">有料試合</option>
              <option value="2">社会人</option>
              <option value="3">クラブ</option>
              <option value="4">大学</option>
              <option value="5">高校</option>
              <option value="6">中学</option>
              <option value="7">ラグビースクール</option>
              <option value="8">タグラグビー</option>
              <option value="9">女子</option>
            </CFormSelect>
            <p class="text-danger" v-if="errors.category">{{ errors.category }}</p>
          </CCol>
          <CCol md="3">
            <CFormLabel>状態</CFormLabel>
            <CFormSelect v-model.number="form.status">
              <option value="1">有効</option>
              <option value="0">無効</option>
            </CFormSelect>
          </CCol>
          <CCol md="3">
            <CFormLabel>年会費納入</CFormLabel>
            <CFormSelect v-model.number="form.annual_fee_flg">
              <option value="1">完了</option>
              <option value="0">未完了</option>
            </CFormSelect>
          </CCol>
          <CCol md="3">
            <CFormLabel>個人登録</CFormLabel>
            <CFormSelect v-model.number="form.individual_entry_flg">
              <option value="1">完了</option>
              <option value="0">未完了</option>
            </CFormSelect>
          </CCol>
        </CRow>
  
        <CRow>
          <CCol class="text-center">
            <CButton type="submit" color="primary">登録</CButton>
          </CCol>
        </CRow>
      </CForm>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const errors = ref({})

  const validateForm = () => {
  errors.value = {}

  if (!form.value.year) errors.value.year = '年度を入力してください'
  if (!form.value.team_id) errors.value.team_id = 'チーム登録番号を入力してください'
  if (!form.value.team_name) errors.value.team_name = 'チーム名を入力してください'
  if (!form.value.representative_name) errors.value.representative_name = '代表者名を入力してください'
  if (!form.value.representative_kana) errors.value.representative_kana = '代表者名（カナ）を入力してください'
  if (!form.value.representative_tel) errors.value.representative_tel = '代表者電話番号を入力してください'
  if (!form.value.representative_email) {
    errors.value.representative_email = 'メールアドレスを入力してください'
  } else if (!/\S+@\S+\.\S+/.test(form.value.representative_email)) {
    errors.value.representative_email = '正しいメールアドレス形式で入力してください'
  }
  if (!form.value.category) errors.value.category = 'カテゴリを選択してください'

  if (!/^[ァ-ヶー\s]+$/.test(form.value.representative_kana)) {
  errors.value.representative_kana = '全角カタカナで入力してください'
  }

  if (!/^0\d{9,10}$/.test(form.value.representative_tel)) {
  errors.value.representative_tel = '正しい電話番号を入力してください（ハイフンなし）'
  }

  return Object.keys(errors.value).length === 0
}
  
  const form = ref({
    year: '',
    team_id: '',
    team_name: '',
    representative_name: '',
    representative_kana: '',
    representative_tel: '',
    representative_email: '',
    male_members: 0,
    female_members: 0,
    medical_supporter: '',
    jrfu_coach: '',
    safety_lecturer: '',
    category: '',
    status: 1,
    annual_fee_flg: 0,
    individual_entry_flg: 0,
  })
  
  const handleSubmit = async () => {
    if (!validateForm()) {
    return
    }
  try {
    // 🔐 CSRFトークン取得（Sanctum用）
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true, });

    // 📦 チームデータを送信
    await axios.post('http://127.0.0.1:8000/api/teams', form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    });

    alert('登録しました');
    router.push('/teams/complete');
  } catch (error) {
    console.error('登録エラー:', error);
    alert('登録に失敗しました');
  }

};
  </script>
  