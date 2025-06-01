<template>
    <div>
      <h2>会員情報編集</h2>
      <form @submit.prevent="updateMember">
        <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>指導員フラグ<span class="required">必須</span></CFormLabel>
            <CFormSelect v-model="form.coach_flg" required>
              <option value="">選択してください</option>
              <option value="0">選手</option>
              <option value="1">指導員</option>
              <option value="2">その他</option>
            </CFormSelect>
            <div v-if="validationErrors.coach_flg" class="text-danger">
              {{ validationErrors.coach_flg[0] }}
            </div>
          </CCol>
        </CRow>

      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>学年カテゴリ<span class="required">必須</span></CFormLabel>
          <CFormSelect v-model="form.grade_category" :options="gradeCategoryOptions" required />
          <div v-if="validationErrors.grade_category" class="text-danger">{{ validationErrors.grade_category[0] }}</div>
        </CCol>

        <CCol md="4">
          <CFormLabel>氏名 (姓)<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.username_sei" required maxlength="15" />
          <div v-if="validationErrors.username_sei" class="text-danger">{{ validationErrors.username_sei[0] }}</div>
        </CCol>

        <CCol md="4">
          <CFormLabel>氏名 (名)<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.username_mei" required maxlength="15" />
          <div v-if="validationErrors.username_mei" class="text-danger">{{ validationErrors.username_mei[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>氏名カナ (姓)<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.username_kana_s" required maxlength="30" pattern="^[ァ-ヶー]+$" title="全角カタカナで入力してください"/>
          <div v-if="validationErrors.username_kana_s" class="text-danger">{{ validationErrors.username_kana_s[0] }}</div>
        </CCol>
        <CCol md="4">
          <CFormLabel>氏名カナ (名)<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.username_kana_m" required maxlength="30" pattern="^[ァ-ヶー]+$" title="全角カタカナで入力してください"/>
          <div v-if="validationErrors.username_kana_m" class="text-danger">{{ validationErrors.username_kana_m[0] }}</div>
        </CCol>
        <CCol md="4">
          <CFormLabel>性別<span class="required">必須</span></CFormLabel>
          <CFormSelect v-model="form.sex" required>
            <option value="">選択してください</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </CFormSelect>
          <div v-if="validationErrors.sex" class="text-danger">{{ validationErrors.sex[0] }}</div>
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>氏名 (姓) 英<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.username_en_s" required />
          <div v-if="validationErrors.username_en_s" class="text-danger">{{ validationErrors.username_en_s[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>氏名 (名) 英<span class="required">必須</span></CFormLabel>
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
            <option value="1">A</option>
            <option value="2">B</option>
            <option value="3">AB</option>
            <option value="4">O</option>
            <option value="5">その他</option>
          </CFormSelect>
          <div v-if="validationErrors.blood_type" class="text-danger">{{ validationErrors.blood_type[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>郵便番号<span class="required">必須</span></CFormLabel>
            <CFormInput v-model="form.zip" required type="text" maxlength="7" pattern="^[0-9]{7}$" title="7桁の半角数字で入力してください" />
            <div v-if="validationErrors.zip" class="text-danger">{{ validationErrors.zip[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>都道府県<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.address1" required />
          <div v-if="validationErrors.address1" class="text-danger">{{ validationErrors.address1[0] }}</div>
        </CCol>
        <CCol md="4">
          <CFormLabel>市区町村<span class="required">必須</span></CFormLabel>
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
          <CFormLabel>保護者氏名<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.guardian_name" required />
          <div v-if="validationErrors.guardian_name" class="text-danger">{{ validationErrors.guardian_name[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>保護者メールアドレス<span class="required">必須</span></CFormLabel>
          <CFormInput type="email" v-model="form.guardian_email" required />
          <div v-if="validationErrors.guardian_email" class="text-danger">{{ validationErrors.guardian_email[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>保護者電話番号<span class="required">必須</span></CFormLabel>
            <CFormInput v-model="form.guardian_tel" required type="tel" maxlength="11" pattern="^[0-9]{10,11}$" title="10〜11桁の半角数字で入力してください" />
            <div v-if="validationErrors.guardian_tel" class="text-danger">{{ validationErrors.guardian_tel[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>続柄<span class="required">必須</span></CFormLabel>
          <CFormSelect v-model="form.relationship" required>
            <option value="">選択してください</option>
            <option value="1">父</option>
            <option value="2">母</option>
            <option value="3">祖父</option>
            <option value="4">祖母</option>
            <option value="5">その他</option>
            <option value="6">本人</option>
          </CFormSelect>
          <div v-if="validationErrors.relationship" class="text-danger">{{ validationErrors.relationship[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>緊急連絡先・氏名<span class="required">必須</span></CFormLabel>
          <CFormInput v-model="form.emergency_name1" required />
          <div v-if="validationErrors.emergency_name1" class="text-danger">{{ validationErrors.emergency_name1[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>緊急連絡先・メールアドレス<span class="required">必須</span></CFormLabel>
          <CFormInput type="email" v-model="form.emergency_email1" required />
          <div v-if="validationErrors.emergency_email1" class="text-danger">{{ validationErrors.emergency_email1[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>緊急連絡先・電話番号<span class="required">必須</span></CFormLabel>
          <CFormInput type="tel" v-model="form.emergency_tel1" required maxlength="11" />
          <div v-if="validationErrors.emergency_tel1" class="text-danger">{{ validationErrors.emergency_tel1[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>本人メールアドレス<span v-if="isEmailRequired" class="required">必須</span></CFormLabel>
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
          <CFormLabel>所属区分<span class="required">必須</span></CFormLabel>
          <CFormSelect v-model="form.classification" required>
            <option value="">選択してください</option>
            <option value="1">代表者</option>
            <option value="2">監督</option>
            <option value="3">コーチ</option>
            <option value="4">プレイヤー</option>
            <option value="5">マネージャー</option>
            <option value="6">メディカルサポーター</option>
            <option value="7">トレーナー</option>
            <option value="8">チームドクター</option>
            <option value="9">その他</option>
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
          <CFormLabel>在籍状況<span class="required">必須</span></CFormLabel>
          <CFormSelect v-model="form.status" required>
            <option value="">選択してください</option>
            <option value="1">在籍</option>
            <option value="2">転籍</option>
            <option value="3">休校</option>
            <option value="4">退校</option>
            <option value="5">卒業</option>
            <option value="6">その他</option>
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
          <CFormLabel>権限種別ID<span class="required">必須</span></CFormLabel>
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
          <CFormLabel>パスワード<span class="required">必須</span></CFormLabel>
          <CFormInput type="password" v-model="form.password" autocomplete="new-password" required />
          <div v-if="validationErrors.password" class="text-danger">{{ validationErrors.password[0] }}</div>
        </CCol>
        <CCol md="6">
          <CFormLabel>パスワード（確認）<span class="required">必須</span></CFormLabel>
          <CFormInput type="password" v-model="form.password_confirmation" autocomplete="new-password" required />
          <div v-if="validationErrors.password_confirmation" class="text-danger">{{ validationErrors.password_confirmation[0] }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="12">
          <CFormLabel>家族情報</CFormLabel>

          <!-- 家族情報がある場合 -->
          <ul v-if="families.length > 0" class="list-group">
            <li
            v-for="family in families"
            :key="family.member_id"
            class="list-group-item d-flex justify-content-between align-items-center"
            >
            {{ family.username_sei }} {{ family.username_mei }}（{{ relationshipText(family.relationship) }}）
            <div>
              <CButton size="sm" color="primary" class="me-2" @click="editFamily(family)">続柄編集</CButton>
              <CButton size="sm" color="danger" class="text-white" @click="removeFamily(family)">家族解除</CButton>
            </div>
            </li>
          </ul>

        <!-- 家族情報がない場合 -->
        <p v-else class="text-muted ps-2">家族情報は登録されていません。</p>
        </CCol>
      </CRow>
      <CRow class="mb-1">
        <CCol>
          <span v-if="passwordMismatchError" class="text-danger">{{ passwordMismatchError }}</span>
        </CCol>
      </CRow>
      <CButton type="submit" class="custom-submit-button">更新</CButton>
      <CButton type="button" class="btn btn-secondary ms-2" @click="router.back()">戻る</CButton>
      <CButton v-if="currentUserAuthority === 1 || currentUserAuthority === 2" class="custom-submit-deletebutton" @click="handleDelete(form.member_id)">削除</CButton>
      </form>
    </div>
    <CAlert v-if="showToast" class="toast-alert custom-toast">
    {{ toastMessage }}
    </CAlert>
    <FamilyEditModal
    :visible="showFamilyEditModal"
    :family="selectedFamily"
    @close="closeFamilyEditModal"
    @updated="handleFamilyUpdated"
    />
  </template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import FamilyEditModal from '@/components/members/FamilyEditModal.vue'


const route = useRoute()
const router = useRouter()
const id = route.params.id
const passwordMismatchError = ref('');
const showToast = ref(false)
const toastMessage = ref('')
const currentUserAuthority = Number(localStorage.getItem('authoritykinds_id'));
const families = ref([])



const form = ref({
  // 必要なフィールドを初期化（空でもOK）
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
  del_flg: 0,
  password: '',
  password_confirmation: ''
})

const gradeCategoryOptions = [
  { value: '', label: '選択してください' },
  { value: '1', label: '年年少' },
  { value: '2', label: '年少' },
  { value: '3', label: '年中' },
  { value: '4', label: '年長' },
  { value: '5', label: '小１' },
  { value: '6', label: '小２' },
  { value: '7', label: '小３' },
  { value: '8', label: '小４' },
  { value: '9', label: '小５' },
  { value: '10', label: '小６' },
  { value: '11', label: '中１' },
  { value: '12', label: '中２' },
  { value: '13', label: '中３' },
  { value: '14', label: '高１' },
  { value: '15', label: '高２' },
  { value: '16', label: '高３' },
  { value: '17', label: '大１' },
  { value: '18', label: '大２' },
  { value: '19', label: '大３' },
  { value: '20', label: '大４' },
  { value: '21', label: '社会人' },
];

const isEmailRequired = computed(() => {
  return form.value.coach_flg === '1'; // 1 のときだけ必須（指導員）
});

const validationErrors = ref({})

//家族情報
const relationshipText = (val) => {
  return { 1: '父', 2: '母', 3: '兄', 4: '姉', 5: '弟', 6: '妹', 7: '子', 8: '親戚', 9: 'その他'}[val] || ''
};

onMounted(async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/members/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    });

    const member = res.data.member;
    families.value = res.data.families || [];

    // 文字列変換（select 用）
    const fieldsToCastToString = [
      'coach_flg', 'grade_category', 'sex', 'relationship',
      'classification', 'blood_type', 'status', 'authoritykinds_id',
    ];
    fieldsToCastToString.forEach((key) => {
      if (member[key] !== null && member[key] !== undefined) {
        member[key] = String(member[key]);
      }
    });

    form.value = member;

    // ここが抜けていると reverse 解除で undefined が出る！
    form.value.member_id = member.member_id;

  } catch (err) {
    console.error('取得失敗', err);
  }
});

const updateMember = async () => {
  // パスワード一致チェック
  if (form.value.password !== form.value.password_confirmation) {
    passwordMismatchError.value = 'パスワードが一致しません';
    return;
  } else {
    passwordMismatchError.value = '';
  };

  // 文字列 → 数値に戻す（APIに適切な型で送る）
  const keysToNumber = [
    'coach_flg',
    'grade_category',
    'sex',
    'relationship',
    'classification',
    'blood_type',
    'status',
    'authoritykinds_id'
  ];
  keysToNumber.forEach((key) => {
    if (form.value[key] !== '') {
      form.value[key] = Number(form.value[key]);
    }
  });

  form.value.graduation_year = form.value.graduation_year
    ? Number(form.value.graduation_year)
    : null;

    try {
    await axios.put(`http://127.0.0.1:8000/api/members/${id}`, form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true
    });

    // トースト表示だけにする
    toastMessage.value = '更新が完了しました'
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
      toastMessage.value = ''
    }, 3000)

  } catch (err) {
    console.error('更新失敗', err);
    if (err.response && err.response.data.errors) {
      validationErrors.value = err.response.data.errors;
    }
  }

  };

  // 削除処理
  const handleDelete = async (memberId) => {
  if (!confirm('この会員を本当に削除しますか？')) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/members/${memberId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true
    });

    toastMessage.value = '✅ 削除が完了しました';
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
      toastMessage.value = '';
      router.push('/members/'); // 一覧ページに戻す
    }, 3000);

  } catch (err) {
    console.error('削除失敗', err);
    alert('削除中にエラーが発生しました');
  }
  };

const showFamilyEditModal = ref(false)
const selectedFamily = ref(null)

const editFamily = (family) => {
  console.log('family:', family) 
  selectedFamily.value = { ...family }
  showFamilyEditModal.value = true
};

const closeFamilyEditModal = () => {
  showFamilyEditModal.value = false
  selectedFamily.value = null
};

const handleFamilyUpdated = () => {
  showFamilyEditModal.value = false
  fetchMemberWithFamily() // ← 再取得用の関数（onMounted内のaxiosを関数化すると便利）
};

// 家族編集用モーダル表示
const fetchMemberWithFamily = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/members/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true
    });
    const member = res.data.member;
    families.value = res.data.families || [];

    const fieldsToCastToString = [ 'coach_flg', 'grade_category', 'sex', 'relationship', 'classification', 'blood_type', 'status', 'authoritykinds_id' ];
    fieldsToCastToString.forEach((key) => {
      if (member[key] !== null && member[key] !== undefined) {
        member[key] = String(member[key]);
      }
    });

    form.value = member;
  } catch (err) {
    console.error('取得失敗', err);
  }
};
// 家族解除処理
const removeFamily = async (family) => {
  console.log('reverse削除', family.member_id, form.value.member_id);

  if (!confirm(`${family.username_sei} ${family.username_mei} さんの家族情報を解除しますか？`)) return;

  try {
    // 自分 → 相手
    await axios.delete(`http://127.0.0.1:8000/api/families/${family.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    });

    // 相手 → 自分（URLクエリにパラメータを埋め込む）
    await axios.delete(
      `http://127.0.0.1:8000/api/families/reverse?member_id=${family.member_id}&family_id=${form.value.member_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    );

    toastMessage.value = '家族情報を解除しました';
    showToast.value = true;
    fetchMemberWithFamily();

    setTimeout(() => {
      showToast.value = false;
      toastMessage.value = '';
    }, 3000);
  } catch (err) {
    console.error('家族解除失敗', err);
    alert('家族情報の解除に失敗しました');
  }
};

</script>

<style scoped>
.toast-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  min-width: 250px;
  padding: 16px 24px;
  font-size: 1.1rem;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}
.custom-toast {
  background-color: #999999;
  color: #ffffff;
  border: none;
}

.custom-submit-button{
  background-color: #003366;
  color: #ffffff;
  border: none;
}

.custom-submit-deletebutton{
  background-color: #ffff00;
  color: #333333;
  border: none;
  margin-left: 332px;
}

</style>