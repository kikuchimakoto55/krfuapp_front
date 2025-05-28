<template>
  <div class="p-4">


    <div v-if="isLoading">読み込み中...</div>

    <div v-else>
      <div
        v-for="(cred, index) in credentials"
        :key="cred.h_credentials_id || index"
        class="p-3 mb-3 border rounded"
      >
        <CRow class="mb-2">
          <CCol md="6">
            <CFormLabel>保有資格選択</CFormLabel>
            <CFormSelect v-model="cred.license_id">
              <option value="">選択してください</option>
              <option
                v-for="license in licenses"
                :key="license.license_id"
                :value="license.license_id"
              >
                {{ license.licensekindsname }}
              </option>
            </CFormSelect>
          </CCol>
          <CCol md="6">
            <CFormLabel>資格名</CFormLabel>
            <p class="mt-1 text-muted">{{ licenses.find(l => l.license_id === Number(cred.license_id))?.licensekindsname || '' }}</p>
          </CCol>
        </CRow>

        <CRow class="mb-2">
          <CCol md="6">
            <CFormLabel>取得日</CFormLabel>
            <CFormInput type="date" v-model="cred.acquisition_date" />
          </CCol>
          <CCol md="6">
            <CFormLabel>有効期限</CFormLabel>
            <CFormInput type="date" v-model="cred.expiration_date" />

            <!-- 👇 補足表示 -->
            <div class="mt-1 small text-muted">
                <template v-if="cred.acquisition_date && getValidPeriod(cred.license_id)">
                自動計算: {{ getExpirationDate(cred.acquisition_date, cred.license_id) }}
                （
                <template v-if="getRemainingDays(getExpirationDate(cred.acquisition_date, cred.license_id)) > 0">
                    あと {{ getRemainingDays(getExpirationDate(cred.acquisition_date, cred.license_id)) }}日有効
                </template>
                <template v-else>
                    有効期限切れ
                </template>
                ）
                </template>
                <template v-else>
                ※取得日と資格名を設定すると有効期限を自動計算できます
                </template>
            </div>
          </CCol>
        </CRow>

        <CRow class="mb-2">
          <CCol md="6">
            <CFormLabel>有効フラグ</CFormLabel>
            <CFormSelect v-model="cred.valid_flg">
              <option value="1">有効</option>
              <option value="0">無効</option>
            </CFormSelect>
          </CCol>
          <CCol md="6" class="d-flex align-items-end">
            <CButton color="danger" size="sm" style="color: white;" @click="removeCredential(index)">削除</CButton>
          </CCol>
        </CRow>
      </div>
      
      <CButton color="secondary" class="mb-4" @click="addCredential">+ 資格追加</CButton>
      <div>
        <CButton color="primary" @click="submit">更新する</CButton>
        <CButton color="secondary" class="ms-2" @click="goBack">戻る</CButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const memberId = route.params.id

const credentials = ref([])
const licenses = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res1 = await axios.get(`http://localhost:8000/api/members/${memberId}/credentials`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    credentials.value = res1.data.map(cred => ({
      ...cred,
      valid_flg: String(cred.valid_flg)
    }))

    const res2 = await axios.get('http://localhost:8000/api/licenses', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    licenses.value = res2.data
  } catch (err) {
    console.error('読み込み失敗:', err)
    alert('読み込みに失敗しました')
  } finally {
    isLoading.value = false
  }
})

const addCredential = () => {
  credentials.value.push({
    license_id: '',
    acquisition_date: '',
    expiration_date: '',
    valid_flg: '1',
    del_flg: 0,
  })
}

const removeCredential = (index) => {
  credentials.value.splice(index, 1)
}

const submit = async () => {
  try {
    const preparedCredentials = credentials.value.map(cred => ({
      ...cred,
      h_credentials_id: cred.h_credentials_id || null,
      license_id: Number(cred.license_id),
      valid_flg: String(cred.valid_flg),
      acquisition_date: cred.acquisition_date || null,
      expiration_date: cred.expiration_date || null,

    }))

    await axios.put(
      `http://localhost:8000/api/members/${memberId}/credentials`,
      { credentials: preparedCredentials },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      }
    )

    alert('保有資格を更新しました')
    router.push(`/members/show/${memberId}`)
  } catch (err) {
    console.error('保存失敗:', err)
    alert('保有資格の保存に失敗しました')
  }
}

// 資格IDから保有期間（日数）を取得
const getValidPeriod = (license_id) => {
  const license = licenses.value.find(l => l.license_id === Number(license_id))
  return license ? Number(license.valid_period) : null
}

// 取得日と資格IDから有効期限を計算（YYYY-MM-DD）
const getExpirationDate = (acquisition_date, license_id) => {
  const period = getValidPeriod(license_id)
  if (!acquisition_date || !period) return null
  const date = new Date(acquisition_date)
  date.setDate(date.getDate() + period)
  return date.toISOString().split('T')[0]
}

// 今日と有効期限の差（日数）
const getRemainingDays = (expiration_date) => {
  if (!expiration_date) return null
  const today = new Date()
  const expire = new Date(expiration_date)
  const diff = Math.floor((expire - today) / (1000 * 60 * 60 * 24))
  return diff
}


//acquisition_date 入力時に expiration_date & valid_flg を自動計算
watch(
  credentials,
  () => {
    const today = new Date()

    credentials.value.forEach((cred) => {
      const license = licenses.value.find(
        (l) => Number(l.license_id) === Number(cred.license_id)
      )

      // 有効期限の自動計算
      if (cred.acquisition_date && license?.valid_period) {
        const base = new Date(cred.acquisition_date)
        base.setDate(base.getDate() + Number(license.valid_period))
        cred.expiration_date = base.toISOString().split('T')[0]
      }

      // valid_flg が未設定（新規）のときのみ、自動判定
      if (
        cred.expiration_date &&
        (cred.valid_flg === '' || cred.valid_flg === null || cred.valid_flg === undefined)
      ) {
        const expireDate = new Date(cred.expiration_date)
        const remainingDays = Math.floor((expireDate - today) / (1000 * 60 * 60 * 24))
        cred.valid_flg = remainingDays >= 0 ? '1' : '0'  // ← 文字列で設定
      }
    })
  },
  { deep: true }
)

const goBack = () => {
  router.back()
}
</script>
