<template>
  <div class="member-form">
    <h2 class="form-title">新規会員登録</h2>

    <CForm @submit.prevent="submitForm">
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>学年カテゴリ<span class="required">*</span></CFormLabel>
          <CFormSelect v-model="form.grade_category" :options="gradeCategoryOptions" required />
          <div v-if="validationErrors.grade_category" class="text-danger">{{ validationErrors.grade_category[0] }}</div>
        </CCol>

        <CCol md="4">
          <CFormLabel>氏名 (姓)<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.username_sei" required maxlength="15" />
          <div v-if="validationErrors.username_sei" class="text-danger">{{ validationErrors.username_sei[0] }}</div>
        </CCol>

        <CCol md="4">
          <CFormLabel>氏名 (名)<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.username_mei" required maxlength="15" />
          <div v-if="validationErrors.username_mei" class="text-danger">{{ validationErrors.username_mei[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>氏名カナ (姓)<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.username_kana_s" required maxlength="30" pattern="^[ァ-ヶー]+$" title="全角カタカナで入力してください"/>
          <div v-if="validationErrors.username_kana_s" class="text-danger">{{ validationErrors.username_kana_s[0] }}</div>
        </CCol>
        <CCol md="4">
          <CFormLabel>氏名カナ (名)<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.username_kana_m" required maxlength="30" pattern="^[ァ-ヶー]+$" title="全角カタカナで入力してください"/>
          <div v-if="validationErrors.username_kana_m" class="text-danger">{{ validationErrors.username_kana_m[0] }}</div>
        </CCol>
        <CCol md="4">
          <CFormLabel>性別<span class="required">*</span></CFormLabel>
          <CFormSelect v-model="form.sex" required>
            <option value="">選択してください</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </CFormSelect>
          <div v-if="validationErrors.sex" class="text-danger">{{ validationErrors.sex[0] }}</div>
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>氏名 (姓) 英<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.username_en_s" required />
          <div v-if="validationErrors.username_en_s" class="text-danger">{{ validationErrors.username_en_s[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>氏名 (名) 英<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.username_en_m" required />
          <div v-if="validationErrors.username_en_m" class="text-danger">{{ validationErrors.username_en_m[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>生年月日</CFormLabel>
          <CFormInput type="date" v-model="form.birthday" required />
          <div v-if="validationErrors.birthday" class="text-danger">{{ validationErrors.birthday[0] }}</div>
        </CCol>
        <CCol md="3">
          <CFormLabel>身長（cm）</CFormLabel>
          <CFormInput type="number" v-model="form.height" min="50" max="250" />
          <div v-if="validationErrors.height" class="text-danger">{{ validationErrors.height[0] }}</div>
        </CCol>
        <CCol md="3">
          <CFormLabel>体重（kg）</CFormLabel>
          <CFormInput type="number" v-model="form.weight" min="10" max="250" />
          <div v-if="validationErrors.weight" class="text-danger">{{ validationErrors.weight[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>血液型</CFormLabel>
          <CFormSelect v-model="form.blood_type">
            <option value="">選択してください</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
            <option value="その他">その他</option>
          </CFormSelect>
          <div v-if="validationErrors.blood_type" class="text-danger">{{ validationErrors.blood_type[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>郵便番号<span class="required">*</span></CFormLabel>
            <CFormInput v-model="form.zip" required type="text" maxlength="7" pattern="^[0-9]{7}$" title="7桁の半角数字で入力してください" />
            <div v-if="validationErrors.zip" class="text-danger">{{ validationErrors.zip[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>都道府県<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.address1" required />
          <div v-if="validationErrors.address1" class="text-danger">{{ validationErrors.address1[0] }}</div>
        </CCol>
        <CCol md="4">
          <CFormLabel>市区町村<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.address2" required />
          <div v-if="validationErrors.address2" class="text-danger">{{ validationErrors.address2[0] }}</div>
        </CCol>
        <CCol md="4">
          <CFormLabel>住所３</CFormLabel>
          <CFormInput v-model="form.address3" />
          <div v-if="validationErrors.address3" class="text-danger">{{ validationErrors.address3[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>在籍学校・園名</CFormLabel>
          <CFormInput v-model="form.enrolled_school" />
          <div v-if="validationErrors.enrolled_school" class="text-danger">{{ validationErrors.enrolled_school[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>保護者氏名<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.guardian_name" required />
          <div v-if="validationErrors.guardian_name" class="text-danger">{{ validationErrors.guardian_name[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>保護者メールアドレス<span class="required">*</span></CFormLabel>
          <CFormInput type="email" v-model="form.guardian_email" required />
          <div v-if="validationErrors.guardian_email" class="text-danger">{{ validationErrors.guardian_email[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>保護者電話番号<span class="required">*</span></CFormLabel>
            <CFormInput v-model="form.guardian_tel" required type="tel" maxlength="11" pattern="^[0-9]{10,11}$" title="10〜11桁の半角数字で入力してください" />
            <div v-if="validationErrors.guardian_tel" class="text-danger">{{ validationErrors.guardian_tel[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>続柄<span class="required">*</span></CFormLabel>
          <CFormSelect v-model="form.relationship" required>
            <option value="">選択してください</option>
            <option value="父">父</option>
            <option value="母">母</option>
            <option value="祖父">祖父</option>
            <option value="祖母">祖母</option>
            <option value="その他">その他</option>
          </CFormSelect>
          <div v-if="validationErrors.relationship" class="text-danger">{{ validationErrors.relationship[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>緊急連絡先・氏名<span class="required">*</span></CFormLabel>
          <CFormInput v-model="form.emergency_name1" required />
          <div v-if="validationErrors.emergency_name1" class="text-danger">{{ validationErrors.emergency_name1[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>緊急連絡先・メールアドレス<span class="required">*</span></CFormLabel>
          <CFormInput type="email" v-model="form.emergency_email1" required />
          <div v-if="validationErrors.emergency_email1" class="text-danger">{{ validationErrors.emergency_email1[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>緊急連絡先・電話番号<span class="required">*</span></CFormLabel>
          <CFormInput type="tel" v-model="form.emergency_tel1" required maxlength="11" />
          <div v-if="validationErrors.emergency_tel1" class="text-danger">{{ validationErrors.emergency_tel1[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>本人メールアドレス<span v-if="isEmailRequired" class="required">*</span></CFormLabel>
          <CFormInput type="email" v-model="form.email" :required="isEmailRequired" placeholder="メールアドレスを入力してください"/>
          <div v-if="validationErrors.email" class="text-danger">{{ validationErrors.email[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>本人電話番号</CFormLabel>
          <CFormInput type="tel" v-model="form.tel" maxlength="11" />
          <div v-if="validationErrors.tel" class="text-danger">{{ validationErrors.tel[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="12">
          <CFormLabel>備考</CFormLabel>
          <CFormTextarea v-model="form.remarks" rows="3" />
          <div v-if="validationErrors.remarks" class="text-danger">{{ validationErrors.remarks[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>所属区分<span class="required">*</span></CFormLabel>
          <CFormSelect v-model="form.classification" required>
            <option value="">選択してください</option>
            <option value="代表者">代表者</option>
            <option value="監督">監督</option>
            <option value="コーチ">コーチ</option>
            <option value="プレイヤー">プレイヤー</option>
            <option value="マネージャー">マネージャー</option>
            <option value="メディカルサポーター">メディカルサポーター</option>
            <option value="トレーナー">トレーナー</option>
            <option value="チームドクター">チームドクター</option>
          </CFormSelect>
          <div v-if="validationErrors.classification" class="text-danger">{{ validationErrors.classification[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>保険登録番号</CFormLabel>
          <CFormInput v-model="form.membershipfee_conf" />
          <div v-if="validationErrors.membershipfee_conf" class="text-danger">{{ validationErrors.membershipfee_conf[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>協会登録番号</CFormLabel>
          <CFormInput v-model="form.association_id" />
          <div v-if="validationErrors.association_id" class="text-danger">{{ validationErrors.association_id[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>在籍状況<span class="required">*</span></CFormLabel>
          <CFormSelect v-model="form.status" required>
            <option value="">選択してください</option>
            <option value="在籍">在籍</option>
            <option value="転籍">転籍</option>
            <option value="休校">休校</option>
            <option value="退校">退校</option>
            <option value="卒業">卒業</option>
            <option value="その他">その他</option>
          </CFormSelect>
          <div v-if="validationErrors.status" class="text-danger">{{ validationErrors.status[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>卒業年度</CFormLabel>
          <CFormInput type="number" v-model="form.graduation_year" />
          <div v-if="validationErrors.graduation_year" class="text-danger">{{ validationErrors.graduation_year[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>権限種別ID<span class="required">*</span></CFormLabel>
          <CFormSelect v-model="form.authoritykinds_id" required>
            <option value="">選択してください</option>
            <option value="1">管理者</option>
            <option value="2">運営権限</option>
            <option value="3">一般権限</option>
            <option value="4">使用者権限</option>
          </CFormSelect>
          <div v-if="validationErrors.authoritykinds_id" class="text-danger">{{ validationErrors.authoritykinds_id[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>指導員フラグ<span class="required">*</span></CFormLabel>
          <CFormSelect v-model="form.coach_flg" required>
            <option value="">選択してください</option>
            <option value="0">選手</option>
            <option value="1">指導員</option>
          </CFormSelect>
          <div v-if="validationErrors.coach_flg" class="text-danger">{{ validationErrors.coach_flg[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>パスワード<span class="required">*</span></CFormLabel>
          <CFormInput type="password" v-model="form.password" required />
          <div v-if="validationErrors.password" class="text-danger">{{ validationErrors.password[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>パスワード（確認）<span class="required">*</span></CFormLabel>
          <CFormInput type="password" v-model="form.password_confirmation" required />
          <div v-if="validationErrors.password_confirmation" class="text-danger">{{ validationErrors.password_confirmation[0] }}</div>
        </CCol>
      </CRow>
      <CRow class="mb-1">
        <CCol>
          <span v-if="passwordMismatchError" class="text-danger">{{ passwordMismatchError }}</span>
        </CCol>
      </CRow>


      <CButton type="submit" color="primary">登録</CButton>
    </CForm>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const validationErrors = ref({});

const form = ref({
  grade_category: '',
  username_sei: '',
  username_mei: '',
  username_kana_s: '',
  username_kana_m: '',
  sex: '',
  username_en_s: '',
  username_en_m: '',
  birthday: '',
  height: '',
  weight: '',
  blood_type: '',
  zip: '',
  address1: '',
  address2: '',
  address3: '',
  enrolled_school: '',
  guardian_name: '',
  guardian_email: '',
  guardian_tel: '',
  relationship: '',
  emergency_name1: '',
  emergency_email1: '',
  emergency_tel1: '',
  email: '',
  tel: '',
  remarks: '',
  classification: '',
  membershipfee_conf: '',
  association_id: '',
  status: '',
  graduation_year: '',
  authoritykinds_id: '',
  coach_flg: '',
  password: '',
  password_confirmation: ''
});



const gradeCategoryOptions = [
  { value: '', label: '選択してください' },
  { value: '年年少', label: '年年少' },
  { value: '年少', label: '年少' },
  { value: '年中', label: '年中' },
  { value: '年長', label: '年長' },
  { value: '小１', label: '小１' },
  { value: '小２', label: '小２' },
  { value: '小３', label: '小３' },
  { value: '小４', label: '小４' },
  { value: '小５', label: '小５' },
  { value: '小６', label: '小６' },
  { value: '中１', label: '中１' },
  { value: '中２', label: '中２' },
  { value: '中３', label: '中３' },
  { value: '高１', label: '高１' },
  { value: '高２', label: '高２' },
  { value: '高３', label: '高３' },
  { value: '大１', label: '大１' },
  { value: '大２', label: '大２' },
  { value: '大３', label: '大３' },
  { value: '大４', label: '大４' },
  { value: '社会人', label: '社会人' }
]

// email を必須にするか判定（coach_flg が '1' ＝ 指導員 の場合）
const isEmailRequired = computed(() => form.value.coach_flg === '1');

//パスワード一致チェックを追加
const passwordMismatchError = ref('');

const submitForm = async () => {
  passwordMismatchError.value = ''; // リセット

  if (form.value.password !== form.value.password_confirmation) {
    passwordMismatchError.value = 'パスワードと確認用パスワードが一致しません。';
    return;
  }

  // ネイティブバリデーションのエラーチェック
  const formElement = document.querySelector('form');
  if (!formElement.checkValidity()) {
    formElement.reportValidity(); // ブラウザにエラーを表示させる
    return;
  }

  // メール重複チェック
  if (isEmailRequired.value && form.value.email) {
    const isDuplicate = await checkEmailDuplicate();
    if (isDuplicate) {
      passwordMismatchError.value = 'このメールアドレスは既に登録されています。';
      return;
    }
  }


  try {
    const response = await axios.post('http://127.0.0.1:8000/api/members', form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    console.log('登録成功', response.data);
  } catch (error) {
    console.error('登録失敗', error);
    if (error.response && error.response.status === 422) {
    // Laravelのバリデーションエラー内容を取得して保存
    validationErrors.value = error.response.data.errors;
  } else {
    alert('予期しないエラーが発生しました');
  }
  }

  

};

//メール重複チェック用メソッドを追加
const checkEmailDuplicate = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/check-email`, {
      params: { email: form.value.email }
    });
    return res.data.exists; // trueなら重複あり
  } catch (err) {
    console.error('メール確認エラー:', err);
    return false;
  }
};

</script>

<style scoped>
.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.required {
  color: red;
  margin-left: 4px;
}

.member-form {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

/* 数値入力欄（type="number"）の見た目をテキスト入力と同じにする */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
  background-color: #fff; /* 明示的に背景白に */
}

/* ChromeなどWebKit系ブラウザのスピンボタンを非表示に */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
